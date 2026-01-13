<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\Patient;
use App\Models\StandardAvailability;
use App\Traits\HandlesTimezone;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    use HandlesTimezone;

    public function store(Request $request)
    {
        if ($request->filled('website_url')) {
            return back()->with('success', 'Agendamento processado.');
        }

        $cleanCpf = preg_replace('/\D/', '', $request->cpf);
        $existingPatient = Patient::where('cpf', $cleanCpf)->first();

        $rules = [
            'user_id'          => 'required|exists:users,id',
            'cpf'              => 'required|string|min:11',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time'       => 'required|date_format:H:i',
        ];

        if (!$existingPatient) {
            $rules['name'] = 'required|string|min:3|max:100';
            $rules['phone'] = 'required|string|min:10';
            $rules['email'] = 'required|email';
        }

        $validated = $request->validate($rules);

        if ($existingPatient) {
            $patient = $existingPatient;
        } else {
            $patient = Patient::create([
                'cpf'   => $cleanCpf,
                'name'  => strip_tags($validated['name']),
                'phone' => preg_replace('/\D/', '', $validated['phone']),
                'email' => $validated['email'] ?? null,
            ]);
        }

        $utcData = $this->convertToUtc($validated['appointment_date'], $validated['start_time'], $request);

        $errorMessage = $this->checkAvailability($validated['user_id'], $utcData['date'], $utcData['time']);
        if ($errorMessage) {
            return back()->withErrors(['start_time' => $errorMessage]);
        }

        Appointment::create([
            'user_id'          => $validated['user_id'],
            'patient_id'       => $patient->id,
            'appointment_date' => $utcData['date'],
            'start_time'       => $utcData['time'],
            'status'           => Auth::check() ? 'scheduled' : 'pending',
        ]);

        return back()->with('success', 'Agendamento realizado com sucesso!');
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

        $utcData = $this->convertToUtc(
            $validated['appointment_date'],
            $validated['start_time'],
            $request
        );

        $errorMessage = $this->checkAvailability(
            $appointment->user_id,
            $utcData['date'],
            $utcData['time']
        );

        if ($errorMessage) {
            return back()->withErrors(['start_time' => $errorMessage]);
        }

        $appointment->update([
            'appointment_date' => $utcData['date'],
            'start_time'       => $utcData['time'],
            'status'           => 'scheduled'
        ]);

        return back()->with('success', 'Consulta adiada com sucesso!');
    }

    public function getCancelledHistory(Request $request)
    {
        $user = Auth::user();
        $tz = $this->getLocalTimezone($request);

        $cancelled = Appointment::where('user_id', $user->id)
            ->where('status', 'canceled')
            ->with('patient')
            ->orderBy('updated_at', 'desc')
            ->paginate(10);
        $cancelled->getCollection()->transform(function ($app) use ($tz) {
            $dtLocal = Carbon::parse($app->appointment_date . ' ' . $app->start_time, 'UTC')->tz($tz);
            return [
                'id' => $app->id,
                'patient_id' => $app->patient_id,
                'patient_name' => $app->patient->name,
                'date' => $dtLocal->format('Y-m-d'),
                'formatted_date' => $dtLocal->translatedFormat('d \d\e M'),
                'time' => $dtLocal->format('H:i'),
                'cancelled_at' => $app->updated_at->tz($tz)->diffForHumans(),
            ];
        });

        return response()->json($cancelled);
    }

    public function confirm($id)
    {
        $appointment = Appointment::where('user_id', Auth::id())->findOrFail($id);

        $appointment->update([
            'status' => 'scheduled'
        ]);

        return back()->with('success', 'Consulta confirmada com sucesso!');
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
            ->whereTime('start_time', '=', $time)
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
            ->whereIn('status', ['scheduled', 'pending', 'confirmed'])
            ->exists();

        if ($hasConflict) {
            return 'Este horário acabou de ser reservado. Por favor, escolha outro.';
        }

        return null;
    }
}
