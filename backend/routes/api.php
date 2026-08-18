<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\AspirationController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - HMTP UNISBA
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);

Route::post('/aspirations', [AspirationController::class, 'store']); // Public submission for students

// Protected Admin Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin Access to Aspirations Data
    Route::get('/aspirations', [AspirationController::class, 'index']);
});
