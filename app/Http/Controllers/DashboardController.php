<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Stevebauman\Location\Facades\Location;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        $dateInput = $request->get('date', Carbon::now($tz)->toDateString());
        $localDateObj = Carbon::parse($dateInput);
        $localDate = $localDateObj->toDateString();

        $startUtc = Carbon::parse($localDate, $tz)->startOfDay()->tz('UTC');
        $endUtc = Carbon::parse($localDate, $tz)->endOfDay()->tz('UTC');

        $appointments = Appointment::where('user_id', $user->id)
            ->whereBetween('appointment_date', [$startUtc->toDateString(), $endUtc->toDateString()])
            ->with('patient')
            ->get();

        $blocks = Block::where('user_id', $user->id)
            ->whereBetween('date', [$startUtc->toDateString(), $endUtc->toDateString()])
            ->get();
        $availabilities = StandardAvailability::where('user_id', $user->id)
            ->where('active', true)
            ->get();

        $timeline = $availabilities->map(function ($slot) use ($appointments, $blocks, $tz, $localDate) {
            $startTimeStr = Carbon::parse($slot->start_time)->format('H:i:s');

            $utcSlot = Carbon::now('UTC')->startOfWeek()
                ->addDays($slot->day_of_week)
                ->setTimeFromTimeString($startTimeStr);

            $localSlot = $utcSlot->copy()->tz($tz);

            if ($localSlot->toDateString() !== $localDate) {
                return null;
            }

            $localTimeStr = $localSlot->format('H:i');

            $isBlocked = $blocks->contains(function ($b) use ($startTimeStr, $slot) {
                if ($b->full_day) return true;
                $bStart = Carbon::parse($b->start_time)->format('H:i:s');
                $bEnd = Carbon::parse($b->end_time)->format('H:i:s');
                return ($startTimeStr >= $bStart && $startTimeStr < $bEnd);
            });

            $appointment = $appointments->first(function ($a) use ($startTimeStr) {
                return Carbon::parse($a->start_time)->format('H:i:s') === $startTimeStr;
            });

            return [
                'time' => $localTimeStr,
                'is_blocked' => $isBlocked,
                'appointment' => $appointment ? [
                    'id' => $appointment->id,
                    'patient_name' => $appointment->patient->name,
                    'status' => $appointment->status,
                    'procedure' => 'Consulta'
                ] : null,
            ];
        })->filter()->sortBy('time')->values();

        $allPending = Appointment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->with('patient')
            ->orderBy('appointment_date')
            ->get()
            ->map(function ($app) use ($tz) {
                $dt = Carbon::parse($app->appointment_date . ' ' . $app->start_time, 'UTC')->tz($tz);
                return [
                    'id' => $app->id,
                    'patient_name' => $app->patient->name,
                    'date' => $dt->format('Y-m-d'),
                    'time' => $dt->format('H:i'),
                    'status' => $app->status
                ];
            });

        return Inertia::render('Dashboard', [
            'timeline' => $timeline,
            'selectedDate' => $localDate,
            'allPending' => $allPending,
            'stats' => [
                'pending_today' => $appointments->where('status', 'pending')->count(),
                'confirmed_today' => $appointments->where('status', 'scheduled')->count(),
                'available_slots' => $timeline->where('appointment', null)->where('is_blocked', false)->count(),
            ]
        ]);
    }
}
