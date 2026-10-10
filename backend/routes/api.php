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

    // Admin Aspirations Management
    Route::get('/aspirations', [AspirationController::class, 'index']);
    Route::patch('/aspirations/{id}/status', [AspirationController::class, 'updateStatus']);
    Route::delete('/aspirations/{id}', [AspirationController::class, 'destroy']);

    // Admin News CRUD
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);
});
