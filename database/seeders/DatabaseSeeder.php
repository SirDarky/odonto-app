<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\StandardAvailability;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Dr. Marcus Vinicius',
            'email' => 'marcus@gmail.com',
            'password' => Hash::make('marcus'),
            'cro' => '12345',
            'cro_state' => 'SP',
            'phone' => '11999999999',
            'is_admin' => true,
        ]);

        $tz = 'America/Sao_Paulo';

        for ($day = 1; $day <= 5; $day++) {
            $startTimeLocal = Carbon::now($tz)->startOfWeek()->addDays($day - 1)->setTime(8, 0);

            while ($startTimeLocal->hour < 11) {
                $startUtc = $startTimeLocal->copy()->tz('UTC');
                $endUtc = $startTimeLocal->copy()->addMinutes(30)->tz('UTC');

                StandardAvailability::create([
                    'user_id' => $user->id,
                    'day_of_week' => $startUtc->dayOfWeek,
                    'start_time' => $startUtc->format('H:i:s'),
                    'end_time' => $endUtc->format('H:i:s'),
                    'active' => true,
                ]);

                $startTimeLocal->addMinutes(30);
            }
        }

        $patient = Patient::create([
            'name' => 'Paciente de Teste',
            'email' => 'paciente@gmail.com',
            'phone' => '11988888888',
            'cpf' => '12345678901',
        ]);

        $dateLocal = Carbon::now($tz)->toDateString();

        $app1 = Carbon::parse($dateLocal . ' 08:30', $tz)->tz('UTC');
        Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'appointment_date' => $app1->toDateString(),
            'start_time' => $app1->format('H:i:s'),
            'status' => 'pending',
        ]);

        $app2 = Carbon::parse($dateLocal . ' 09:30', $tz)->tz('UTC');
        Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'appointment_date' => $app2->toDateString(),
            'start_time' => $app2->format('H:i:s'),
            'status' => 'scheduled',
        ]);
    }
}
