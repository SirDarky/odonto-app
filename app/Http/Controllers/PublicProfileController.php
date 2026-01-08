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
        $selectedDate = $request->get('date', $nowPatient->toDateString());

        $availableDays = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $nowPatient->copy()->addDays($i);
            $availableDays[] = [
                'full'    => $date->toDateString(),
                'day'     => $date->format('d'),
                'month'   => $date->translatedFormat('M'),
                'weekday' => $date->translatedFormat('D'),
            ];
        }

        // 3. Busca de Disponibilidade
        $availabilities = $doctor->availabilities()->where('active', true)->get();

        $slots = [];
        foreach ($availabilities as $availability) {
            // RESOLVE "Trailing data": Carbon::parse lida com H:i:s ou H:i automaticamente
            $startTimeStr = Carbon::parse($availability->start_time)->format('H:i:s');

            /** * ESTRATÉGIA: Criamos o ponto no tempo (UTC) usando a data que o paciente 
             * está visualizando no calendário como base.
             */
            $dateContext = Carbon::parse($selectedDate);

            // Recriamos o momento em que o slot ocorreria naquela data específica em UTC
            // Usamos a data selecionada e voltamos para a "Semana UTC" correspondente
            $utcSlot = Carbon::parse($selectedDate, 'UTC')
                ->startOfWeek()
                ->addDays($availability->day_of_week)
                ->setTimeFromTimeString($startTimeStr);

            // Convertemos para o fuso do paciente
            $patientTime = $utcSlot->copy()->tz($patientTz);

            // FILTRO 1: O horário convertido pertence ao dia que o paciente selecionou?
            // (Isso resolve o problema de slots sumirem ou aparecerem no dia errado)
            if ($patientTime->toDateString() !== $selectedDate) {
                continue;
            }

            // FILTRO 2: Bloquear horários que já passaram no relógio do paciente
            if ($patientTime->getTimestamp() < $nowPatient->getTimestamp()) {
                continue;
            }

            $slots[] = [
                'id'   => $availability->id,
                'time' => $patientTime->format('H:i')
            ];
        }

        // Ordenação final
        $slots = collect($slots)->sortBy('time')->values()->all();

        return Inertia::render('Public/Profile', [
            'doctor'         => $doctor,
            'availableSlots' => $slots,
            'availableDays'  => $availableDays,
            'selectedDate'   => $selectedDate,
        ]);
    }
}
