<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->get('date', now()->toDateString());
        $userId = Auth::id();
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        $availabilities = StandardAvailability::where('user_id', $userId)
            ->where('day_of_week', $dayOfWeek)
            ->where('active', true)
            ->orderBy('start_time')
            ->get();

        $appointments = Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->with('patient')
            ->get();

        $blocks = Block::where('user_id', $userId)
            ->where('date', $date)
            ->get();

        $timeline = $availabilities->map(function ($slot) use ($appointments, $blocks) {
            $startTime = Carbon::parse($slot->start_time)->format('H:i');

            $block = $blocks->first(
                fn($b) =>
                $b->full_day || ($startTime >= $b->start_time && $startTime < $b->end_time)
            );

            $appointment = $appointments->first(
                fn($a) =>
                Carbon::parse($a->start_time)->format('H:i') === $startTime
            );

            return [
                'time' => $startTime,
                'is_blocked' => !!$block,
                'appointment' => $appointment ? [
                    'id' => $appointment->id,
                    'patient_name' => $appointment->patient->name,
                    'status' => $appointment->status,
                    'procedure' => 'Consulta'
                ] : null,
            ];
        });

        return Inertia::render('Dashboard', [
            'timeline' => $timeline,
            'selectedDate' => $date,
            'stats' => [
                'pending_today' => $appointments->where('status', 'pending')->count(),
                'confirmed_today' => $appointments->where('status', 'scheduled')->count(),
                'available_slots' => $timeline->where('appointment', null)->where('is_blocked', false)->count(),
            ]
        ]);
    }
}
