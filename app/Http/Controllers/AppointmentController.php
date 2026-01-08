<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\Patient;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Stevebauman\Location\Facades\Location;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        if ($request->filled('website_url')) {
            return back()->with('success', 'Agendamento processado.');
        }

        $validated = $request->validate([
            'user_id'          => 'required|exists:users,id',
            'cpf'              => 'required|string|min:11|max:14',
            'name'             => 'required|string|min:3|max:100',
            'phone'            => 'required|string|min:10',
            'email'            => 'nullable|email',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time'       => 'required|date_format:H:i',
        ]);

        $ip = $request->ip();
        $position = Location::get($ip);
        $utc = 'UTC';
        $patientTz = $position ? $position->timezone : $utc;

        $patientDateTime = Carbon::createFromFormat(
            'Y-m-d H:i',
            $validated['appointment_date'] . ' ' . $validated['start_time'],
            $patientTz
        );

        $utcDateTime = $patientDateTime->copy()->tz('UTC');

        $dateUtc = $utcDateTime->format('Y-m-d');
        $timeUtc = $utcDateTime->format('H:i:s');

        $key = 'booking-attempt:' . $ip;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'start_time' => 'Muitas tentativas. Aguarde um momento.',
            ]);
        }
        RateLimiter::hit($key, 60);

        $cleanCpf = preg_replace('/\D/', '', $validated['cpf']);
        $patient = Patient::updateOrCreate(
            ['cpf' => $cleanCpf],
            [
                'name'  => strip_tags($validated['name']),
                'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL) ?: null,
                'phone' => preg_replace('/\D/', '', $validated['phone']),
            ]
        );

        $errorMessage = $this->checkAvailability($validated['user_id'], $dateUtc, $timeUtc);
        if ($errorMessage) {
            return back()->withErrors(['start_time' => $errorMessage]);
        }

        $status = Auth::check() ? 'scheduled' : 'pending';

        Appointment::create([
            'user_id'          => $validated['user_id'],
            'patient_id'       => $patient->id,
            'appointment_date' => $dateUtc,
            'start_time'       => $timeUtc,
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

    public function reschedule(Request $request, $id)
    {
        $validated = $request->validate([
            'appointment_date' => 'required|date_format:Y-m-d',
            'start_time'       => 'required|date_format:H:i',
        ]);

        $appointment = Appointment::where('user_id', Auth::id())->findOrFail($id);

        $errorMessage = $this->checkAvailability(
            $appointment->user_id,
            $validated['appointment_date'],
            $validated['start_time']
        );

        if ($errorMessage) {
            return back()->withErrors(['start_time' => $errorMessage]);
        }

        $appointment->update([
            'appointment_date' => $validated['appointment_date'],
            'start_time'       => $validated['start_time'],
            'status'           => 'scheduled'
        ]);

        return back()->with('success', 'Consulta adiada com sucesso!');
    }

    private function checkAvailability($userId, $date, $time): ?string
    {
        $requestedSlot = Carbon::createFromFormat('Y-m-d H:i:s', $date . ' ' . $time, 'UTC');

        if ($requestedSlot->isPast()) {
            return 'Não é possível agendar em um horário que já passou.';
        }

        $dayOfWeek = $requestedSlot->dayOfWeek;

        $inGrid = StandardAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', $time)
            ->where('active', true)
            ->exists();

        if (!$inGrid) {
            return 'Este horário não está disponível para agendamento.';
        }

        $isBlocked = Block::where('user_id', $userId)
            ->where('date', $date)
            ->where(function ($q) use ($time) {
                $q->where('full_day', true)
                    ->orWhere(function ($sq) use ($time) {
                        $sq->where('start_time', '<=', $time)
                            ->where('end_time', '>', $time);
                    });
            })->exists();

        if ($isBlocked) {
            return 'O profissional não estará atendendo neste horário.';
        }

        $hasConflict = Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->where('start_time', $time)
            ->whereIn('status', ['scheduled', 'pending'])
            ->exists();

        if ($hasConflict) {
            return 'Este horário acabou de ser reservado. Por favor, escolha outro.';
        }

        return null;
    }
}
