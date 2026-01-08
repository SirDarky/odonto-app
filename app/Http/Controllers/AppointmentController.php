<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\Patient;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Armazena um novo agendamento.
     * Suporta agendamento manual (Dashboard) e público.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'          => 'required|exists:users,id',
            'cpf'              => 'required|string',
            'name'             => 'required|string',
            'phone'            => 'required|string',
            'email'            => 'nullable|email',
            'appointment_date' => 'required|date_format:Y-m-d',
            'start_time'       => 'required|date_format:H:i',
        ]);

        $userId = $validated['user_id'];
        $date   = $validated['appointment_date'];
        $time   = $validated['start_time'];

        $patient = Patient::updateOrCreate(
            ['cpf' => preg_replace('/\D/', '', $validated['cpf'])],
            [
                'name'  => $validated['name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'],
            ]
        );

        $errorMessage = $this->checkAvailability($userId, $date, $time);
        if ($errorMessage) {
            return $this->handleError($errorMessage);
        }

        $status = Auth::check() ? 'scheduled' : 'pending';

        Appointment::create([
            'user_id'          => $userId,
            'patient_id'       => $patient->id,
            'appointment_date' => $date,
            'start_time'       => $time,
            'status'           => $status,
        ]);

        return back()->with('success', 'Agendamento realizado com sucesso!');
    }

    public function confirm($id)
    {
        $appointment = Appointment::where('user_id', Auth::id())->findOrFail($id);
        $appointment->update(['status' => 'scheduled']);

        return back()->with('success', 'Agendamento confirmado!');
    }

    public function cancel($id)
    {
        $appointment = Appointment::where('user_id', Auth::id())->findOrFail($id);
        $appointment->update(['status' => 'canceled']);

        return back()->with('success', 'Agendamento cancelado.');
    }

    private function checkAvailability($userId, $date, $time): ?string
    {
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        $inGrid = StandardAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', $time)
            ->where('active', true)
            ->exists();
        if (!$inGrid) return 'Este horário não faz parte da sua grade de atendimento.';

        $isBlocked = Block::where('user_id', $userId)
            ->where('date', $date)
            ->where(function ($q) use ($time) {
                $q->where('full_day', true)
                    ->orWhere(function ($sq) use ($time) {
                        $sq->where('start_time', '<=', $time)
                            ->where('end_time', '>', $time);
                    });
            })->exists();
        if ($isBlocked) return 'Você bloqueou este horário para este dia.';

        $hasConflict = Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->where('start_time', $time)
            ->whereIn('status', ['scheduled', 'pending'])
            ->exists();
        if ($hasConflict) return 'Já existe um paciente agendado para este horário.';

        return null;
    }

    private function handleError(string $message)
    {
        return back()->withErrors(['start_time' => $message]);
    }
}
