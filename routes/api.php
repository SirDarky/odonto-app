<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/available-slots', [AppointmentController::class, 'availableSlots']);

Route::post('/appointments', [AppointmentController::class, 'store']);