<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\StandardAvailability;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        for ($day = 1; $day <= 5; $day++) {
            $startTime = now()->setTime(8, 0);

            while ($startTime->hour < 11) {
                StandardAvailability::create([
                    'user_id' => $user->id,
                    'day_of_week' => $day,
                    'start_time' => $startTime->format('H:i'),
                    'end_time' => $startTime->copy()->addMinutes(30)->format('H:i'),
                    'active' => true,
                ]);
                $startTime->addMinutes(30);
            }
        }

        $patient = Patient::create([
            'name' => 'Paciente de Teste',
            'email' => 'paciente@gmail.com',
            'phone' => '11988888888',
            'cpf' => '12345678901',
        ]);

        Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'appointment_date' => now()->toDateString(),
            'start_time' => '08:30:00',
            'status' => 'pending',
        ]);

        Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'appointment_date' => now()->toDateString(),
            'start_time' => '09:30:00',
            'status' => 'scheduled',
        ]);
    }
}
