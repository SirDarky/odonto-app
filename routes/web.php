<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- PÁGINA PÚBLICA ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- ÁREA RESTRITA (AUTENTICADA) ---
Route::middleware(['auth', 'verified'])->group(function () {

    // DASHBOARD PRINCIPAL (Timeline e Estatísticas)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/patients/search', [PatientController::class, 'searchByCpf'])->name('patients.search');

    // PERFIL DO USUÁRIO
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- CENTRAL DE AGENDAMENTO (DENTISTA) ---

    // Ações de Agendamento (Confirmar/Cancelar/Agendar)
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::post('/', [AppointmentController::class, 'store'])->name('store');
        Route::patch('/{id}/confirm', [AppointmentController::class, 'confirm'])->name('confirm');
        Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel'])->name('cancel');
    });

    // Configurações da Agenda (Grade e Bloqueios)
    Route::prefix('schedule')->name('schedule.')->group(function () {

        // Dashboard da Agenda (Visão de cards)
        Route::get('/', [AvailabilityController::class, 'index'])->name('index');

        // Configurações da Grade Semanal
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'settings'])->name('index');
            Route::post('/', [AvailabilityController::class, 'store'])->name('store');
            Route::delete('/{id}', [AvailabilityController::class, 'destroy'])->name('destroy');
        });

        // Gerenciamento de Bloqueios e Férias
        Route::prefix('blocks')->name('blocks.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'blocks'])->name('index');
            Route::post('/', [AvailabilityController::class, 'storeBlock'])->name('store');
            Route::delete('/bulk-destroy', [AvailabilityController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::delete('/{id}', [AvailabilityController::class, 'destroyBlock'])->name('destroy');
        });
    });
});

require __DIR__ . '/auth.php';
