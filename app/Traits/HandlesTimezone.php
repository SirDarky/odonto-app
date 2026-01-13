<?php

namespace App\Traits;

use Carbon\Carbon;
use Stevebauman\Location\Facades\Location;
use Illuminate\Http\Request;

trait HandlesTimezone
{
    /**
     * Identifica o fuso horário local baseado no IP do Request.
     */
    public function getLocalTimezone(Request $request): string
    {
        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        return $position ? $position->timezone : 'America/Sao_Paulo';
    }

    public function convertToUtc(string $date, string $time, Request $request): array
    {
        $patientTz = $this->getLocalTimezone($request);

        $patientDateTime = Carbon::createFromFormat(
            'Y-m-d H:i',
            $date . ' ' . $time,
            $patientTz
        );

        $utcDateTime = $patientDateTime->copy()->tz('UTC');

        return [
            'date' => $utcDateTime->format('Y-m-d'),
            'time' => $utcDateTime->format('H:i:s'),
            'timezone' => $patientTz
        ];
    }
}
