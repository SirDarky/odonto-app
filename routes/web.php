<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. HOME (Landing Page)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

// 2. ÁREA RESTRITA (Sempre vem ANTES das rotas dinâmicas de slug)
Route::middleware(['auth', 'verified'])->group(function () {

    // DASHBOARD PRINCIPAL
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/patients/search', [PatientController::class, 'searchByCpf'])->name('patients.search');

    // PERFIL DO USUÁRIO
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // CENTRAL DE AGENDAMENTO
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::post('/', [AppointmentController::class, 'store'])->name('store');
        Route::patch('/{id}/confirm', [AppointmentController::class, 'confirm'])->name('confirm');
        Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel'])->name('cancel');
        Route::patch('/{id}/reschedule', [AppointmentController::class, 'reschedule'])->name('reschedule');
    });

    // CONFIGURAÇÕES DE AGENDA
    Route::prefix('schedule')->name('schedule.')->group(function () {
        Route::get('/', [AvailabilityController::class, 'index'])->name('index');

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'settings'])->name('index');
            Route::post('/', [AvailabilityController::class, 'store'])->name('store');
            Route::delete('/{id}', [AvailabilityController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('blocks')->name('blocks.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'blocks'])->name('index');
            Route::post('/', [AvailabilityController::class, 'storeBlock'])->name('store');
            Route::delete('/bulk-destroy', [AvailabilityController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::delete('/{id}', [AvailabilityController::class, 'destroyBlock'])->name('destroy');
        });
    });
});

require __DIR__ . '/auth.php';

// 4. PÁGINA PÚBLICA DO DENTISTA (Sempre por ÚLTIMO)
Route::middleware(['throttle:10,1'])->group(function () {
    Route::get('/{slug}', [PublicProfileController::class, 'show'])
        ->name('public.profile');

    Route::post('/{slug}/book', [AppointmentController::class, 'store'])
        ->name('public.book');
});
