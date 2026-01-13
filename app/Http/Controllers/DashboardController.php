<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Block;
use App\Models\StandardAvailability;
use App\Traits\HandlesTimezone;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use HandlesTimezone;

    public function index(Request $request)
    {
        $user = Auth::user();
        $tz = $this->getLocalTimezone($request);

        $selectedDate = $request->get('date', Carbon::now($tz)->toDateString());

        $nowLocal = Carbon::now($tz);
        $sevenDaysAgo = $nowLocal->copy()->subDays(7)->toDateString();
        $todayStr = $nowLocal->toDateString();

        $appointmentsToday = $this->getAppointmentsByDate($user->id, $selectedDate);
        $blocks = $this->getBlocks($user->id, $selectedDate);
        $availabilities = $this->getGridAvailabilities($user->id);

        $timeline = $this->buildTimeline($availabilities, $appointmentsToday, $blocks, $tz, $selectedDate);

        $allPending = $this->getPendingAppointments($user->id, $tz);

        $statsRange = Appointment::where('user_id', $user->id)
            ->whereBetween('appointment_date', [$sevenDaysAgo, $todayStr])
            ->get();

        $workingDays = $availabilities->pluck('day_of_week')->unique()->values()->all();

        return Inertia::render('Dashboard', [
            'timeline' => $timeline,
            'selectedDate' => $selectedDate,
            'allPending' => $allPending,
            'stats' => [
                'pending_week' => $statsRange->where('status', 'pending')->count(),
                'confirmed_week' => $statsRange->where('status', 'scheduled')->count(),
                'cancelled_week' => $statsRange->where('status', 'canceled')->count(),
                'available_slots' => $timeline->where('appointment', null)->where('is_blocked', false)->count(),
            ],
            'workingDays' => $workingDays,
        ]);
    }

    private function getAppointmentsByDate($userId, $date)
    {
        return Appointment::where('user_id', $userId)
            ->where('appointment_date', $date)
            ->whereIn('status', ['pending', 'scheduled', 'confirmed'])
            ->with('patient')
            ->get();
    }

    private function getBlocks($userId, $date)
    {
        return Block::where('user_id', $userId)
            ->whereDate('date', $date)
            ->get();
    }

    private function getGridAvailabilities($userId)
    {
        return StandardAvailability::where('user_id', $userId)
            ->where('active', true)
            ->get();
    }

    private function buildTimeline($availabilities, $appointments, $blocks, $tz, $selectedDate)
    {
        return $availabilities->map(function ($slot) use ($appointments, $blocks, $tz, $selectedDate) {
            $startTimeStr = Carbon::parse($slot->start_time)->format('H:i:s');

            $utcSlot = Carbon::parse($selectedDate, 'UTC')->startOfWeek()
                ->addDays($slot->day_of_week)
                ->setTimeFromTimeString($startTimeStr);

            $localSlot = $utcSlot->copy()->tz($tz);
            if ($localSlot->toDateString() !== $selectedDate) return null;

            $isBlocked = $blocks->contains(function ($b) use ($startTimeStr) {
                if ($b->full_day) return true;
                $bStart = Carbon::parse($b->start_time)->format('H:i:s');
                $bEnd = Carbon::parse($b->end_time)->format('H:i:s');
                return ($startTimeStr >= $bStart && $startTimeStr < $bEnd);
            });

            $appointment = $appointments->first(function ($a) use ($startTimeStr) {
                return Carbon::parse($a->start_time)->format('H:i:s') === $startTimeStr;
            });

            return [
                'time' => $localSlot->format('H:i'),
                'is_blocked' => $isBlocked,
                'is_past' => $localSlot->isPast(),
                'appointment' => $appointment ? [
                    'id' => $appointment->id,
                    'patient_id' => $appointment->patient->id,
                    'patient_name' => $appointment->patient->name,
                    'status' => $appointment->status,
                    'procedure' => 'Consulta'
                ] : null,
            ];
        })->filter()->sortBy('time')->values();
    }

    private function getPendingAppointments($userId, $tz)
    {
        return Appointment::where('user_id', $userId)
            ->where('status', 'pending')
            ->with('patient')
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->get()
            ->map(function ($app) use ($tz) {
                $dtLocal = Carbon::parse($app->appointment_date . ' ' . $app->start_time, 'UTC')->tz($tz);
                return [
                    'id' => $app->id,
                    'patient_id' => $app->patient->id,
                    'patient_name' => $app->patient->name,
                    'date' => $dtLocal->format('Y-m-d'),
                    'time' => $dtLocal->format('H:i'),
                    'status' => $app->status,
                    'is_past' => $dtLocal->isPast(),
                ];
            });
    }
}
