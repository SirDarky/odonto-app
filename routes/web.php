<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- CENTRAL DE AGENDAMENTO (DENTISTA) ---

    // Dashboard principal da Agenda
    Route::get('/schedule', [AvailabilityController::class, 'index'])->name('schedule.settings.index');

    // Configurações da Grade Semanal
    Route::prefix('schedule/settings')->group(function () {
        Route::get('/', [AvailabilityController::class, 'settings'])->name('schedule.settings.settings');
        Route::post('/', [AvailabilityController::class, 'store'])->name('schedule.settings.store');
        Route::delete('/{id}', [AvailabilityController::class, 'destroy'])->name('schedule.settings.destroy');
    });

    // Gerenciamento de Bloqueios e Férias
    Route::prefix('schedule/blocks')->group(function () {
        Route::get('/', [AvailabilityController::class, 'blocks'])->name('schedule.blocks.index');
        Route::post('/', [AvailabilityController::class, 'storeBlock'])->name('schedule.blocks.store');
        Route::delete('/bulk-destroy', [AvailabilityController::class, 'bulkDestroy'])->name('schedule.blocks.bulk-destroy');
        Route::delete('/{id}', [AvailabilityController::class, 'destroyBlock'])->name('schedule.blocks.destroy');
    });
});

require __DIR__ . '/auth.php';
