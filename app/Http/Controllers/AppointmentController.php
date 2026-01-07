<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\Patient;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;


class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cpf' => 'required|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            'appointment_date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
        ]);

        $patient = Patient::updateOrCreate(
            ['cpf' => preg_replace('/\D/', '', $request->cpf)],
            [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]
        );

        $date = $request->appointment_date;
        $time = $request->start_time;
        $userId = $request->user_id;
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        $slotExists = StandardAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', $time)
            ->where('active', true)
            ->exists();

        if (! $slotExists) {
            return response()->json(['message' => 'Este horário não faz parte da agenda do dentista.'], 422);
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
            return response()->json(['message' => 'O dentista bloqueou este horário para este dia.'], 422);
        }

        $hasConflict = Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->where('start_time', $time)
            ->where('status', 'scheduled')
            ->exists();

        if ($hasConflict) {
            return response()->json(['message' => 'Este horário já foi preenchido.'], 422);
        }

        $appointment = Appointment::create([
            'user_id' => $userId,
            'patient_id' => $patient->id,
            'appointment_date' => $date,
            'start_time' => $time,
            'status' => 'scheduled',
        ]);

        return response()->json([
            'message' => 'Agendado com sucesso!',
            'data' => $appointment,
        ], 201);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date_format:Y-m-d',
        ]);

        $userId = $request->user_id;
        $date = $request->date;
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        $allSlots = StandardAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('active', true)
            ->get(['start_time', 'end_time']);

        $bookedSlots = Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->where('status', 'scheduled')
            ->pluck('start_time')
            ->toArray();

        $blocks = Block::where('user_id', $userId)
            ->where('date', $date)
            ->get();

        $availableSlots = $allSlots->filter(function ($slot) use ($bookedSlots, $blocks) {
            $time = $slot->start_time;

            if (in_array($time, $bookedSlots)) {
                return false;
            }

            foreach ($blocks as $block) {
                if ($block->full_day) {
                    return false;
                }
                if ($time >= $block->start_time && $time < $block->end_time) {
                    return false;
                }
            }

            return true;
        })->values();

        return response()->json($availableSlots);
    }
}
