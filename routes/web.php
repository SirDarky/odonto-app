<?php

use App\Http\Controllers\AnamnesisQuestionController;
use App\Http\Controllers\AnamnesisResponseController;
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
    Route::get('/patients/{id}', [PatientController::class, 'show'])->name('patients.show');
    Route::get('/patients/{id}/anamnesis', [AnamnesisResponseController::class, 'showPatientHistory'])->name('patients.anamnesis');
    Route::get('/files/view/{patientFile}', [AnamnesisResponseController::class, 'viewFile'])
        ->name('files.view');

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
        Route::get('/cancelled', [AppointmentController::class, 'getCancelledHistory'])->name('cancelled');
    });

    // CONFIGURAÇÕES DE AGENDA
    Route::prefix('schedule')->name('schedule.')->group(function () {
        Route::get('/', [AvailabilityController::class, 'index'])->name('index');

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'settings'])->name('index');
            Route::post('/', [AvailabilityController::class, 'store'])->name('store');
            // Adicione esta linha:
            Route::post('/bulk', [AvailabilityController::class, 'storeBulk'])->name('store-bulk');
            Route::delete('/bulk', [AvailabilityController::class, 'bulkDestroySettings'])->name('bulk-destroy');
            Route::delete('/{id}', [AvailabilityController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('blocks')->name('blocks.')->group(function () {
            Route::get('/', [AvailabilityController::class, 'blocks'])->name('index');
            Route::post('/', [AvailabilityController::class, 'storeBlock'])->name('store');
            Route::delete('/bulk-destroy', [AvailabilityController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::delete('/{id}', [AvailabilityController::class, 'destroyBlock'])->name('destroy');
        });
    });

    Route::prefix('settings/anamnesis')->name('settings.anamnesis.')->group(function () {
        Route::get('/', [AnamnesisQuestionController::class, 'index'])->name('index');
        Route::post('/', [AnamnesisQuestionController::class, 'store'])->name('store');
        Route::put('/{question}', [AnamnesisQuestionController::class, 'update'])->name('update');
        Route::delete('/{question}', [AnamnesisQuestionController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [AnamnesisQuestionController::class, 'reorder'])->name('reorder');
        Route::post('/replace-template', [AnamnesisQuestionController::class, 'replaceTemplate'])->name('replace-template');
        Route::post('/bulk-destroy', [AnamnesisQuestionController::class, 'bulkDestroy'])->name('bulk-destroy');
    });
});


require __DIR__ . '/auth.php';

// 4. PÁGINA PÚBLICA DO DENTISTA (Sempre por ÚLTIMO)
Route::middleware(['throttle:10,1'])->group(function () {
    Route::get('/{slug}', [PublicProfileController::class, 'show'])
        ->name('public.profile');

    Route::post('/{slug}/book', [AppointmentController::class, 'store'])
        ->name('public.book');

    Route::get('/public/patient/search', [PatientController::class, 'searchByCpfPublic'])->name('patients.searchPublic');

    // Anamnese
    Route::get('/{slug}/anamnese', [AnamnesisResponseController::class, 'create'])->name('public.anamnesis.create');
    Route::post('/{slug}/anamnese', [AnamnesisResponseController::class, 'store'])->name('public.anamnesis.store');
});
