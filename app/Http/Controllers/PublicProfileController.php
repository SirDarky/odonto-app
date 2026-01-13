<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stevebauman\Location\Facades\Location;

class PublicProfileController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $doctor = User::where('slug', $slug)->firstOrFail();

        $ip = $request->ip();
        $position = ($ip === '127.0.0.1') ? Location::get('104.28.199.163') : Location::get($ip);
        $patientTz = $position ? $position->timezone : 'America/Sao_Paulo';

        $nowPatient = Carbon::now($patientTz);

        $availabilities = $doctor->availabilities()->where('active', true)->get();

        $availableDays = [];
        $checkDate = $nowPatient->copy();
        $maxIterations = 90;

        while (count($availableDays) < 15 && $maxIterations > 0) {
            $slotsForThisDay = $this->calculateSlotsForDate($doctor, $availabilities, $checkDate->toDateString(), $patientTz, $nowPatient);

            if (count($slotsForThisDay) > 0) {
                $availableDays[] = [
                    'full'    => $checkDate->toDateString(),
                    'day'     => $checkDate->format('d'),
                    'month'   => $checkDate->translatedFormat('M'),
                    'weekday' => $checkDate->translatedFormat('D'),
                ];
            }

            $checkDate->addDay();
            $maxIterations--;
        }

        $defaultDate = count($availableDays) > 0 ? $availableDays[0]['full'] : $nowPatient->toDateString();
        $selectedDate = $request->get('date', $defaultDate);

        $slots = $this->calculateSlotsForDate($doctor, $availabilities, $selectedDate, $patientTz, $nowPatient);

        return Inertia::render('Public/Profile', [
            'doctor'         => $doctor,
            'availableSlots' => $slots,
            'availableDays'  => $availableDays,
            'selectedDate'   => $selectedDate,
        ]);
    }


    private function calculateSlotsForDate($doctor, $availabilities, $dateString, $patientTz, $nowPatient)
    {
        $slots = [];

        foreach ($availabilities as $availability) {
            $startTimeStr = Carbon::parse($availability->start_time)->format('H:i:s');

            $utcSlot = Carbon::parse($dateString, 'UTC')
                ->startOfWeek()
                ->addDays($availability->day_of_week)
                ->setTimeFromTimeString($startTimeStr);

            $patientTime = $utcSlot->copy()->tz($patientTz);

            if ($patientTime->toDateString() !== $dateString) {
                continue;
            }

            if ($patientTime->getTimestamp() < $nowPatient->getTimestamp()) {
                continue;
            }

            $isBlocked = $doctor->blocks()
                ->where('date', $dateString)
                ->where(function ($q) use ($startTimeStr) {
                    $q->where('full_day', true)
                        ->orWhere(function ($sub) use ($startTimeStr) {
                            $sub->where('start_time', '<=', $startTimeStr)
                                ->where('end_time', '>', $startTimeStr);
                        });
                })->exists();

            if ($isBlocked) {
                continue;
            }

            $startTimeUtc = $patientTime->copy()->tz('UTC')->format('H:i:s');

            $isOccupied = $doctor->appointments()
                ->where('appointment_date', $dateString)
                ->where('start_time', $startTimeUtc)
                ->whereIn('status', ['confirmed', 'pending'])
                ->exists();

            if ($isOccupied) {
                continue;
            }

            $slots[] = [
                'id'   => $availability->id,
                'time' => $patientTime->format('H:i')
            ];
        }

        return collect($slots)->sortBy('time')->values()->all();
    }
}
