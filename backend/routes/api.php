<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\AspirationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CabinetController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProfileItemController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\SiteController;

/*
|--------------------------------------------------------------------------
| API Routes - HMTP UNISBA
|--------------------------------------------------------------------------
*/

// Login - Strict rate limit (5 attempts per minute)
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Public News Routes - Moderate rate limit (30 requests per minute)
Route::get('/news', [NewsController::class, 'index'])->middleware('throttle:30,1');
Route::get('/news/{id}', [NewsController::class, 'show'])->middleware('throttle:30,1');

// Public Site Aggregate (profil, kabinet aktif, pengurus, proker, kontak)
Route::get('/site', [SiteController::class, 'index'])->middleware('throttle:60,1');
Route::get('/programs', [ProgramController::class, 'index'])->middleware('throttle:60,1');

// Public Aspirations Submission - Moderate rate limit (20 requests per minute)
Route::post('/aspirations', [AspirationController::class, 'store'])->middleware('throttle:20,1');

// Protected Admin Routes (Sanctum) - Standard rate limit (60 requests per minute)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:60,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('throttle:60,1');
    Route::post('/password', [AuthController::class, 'updatePassword'])->middleware('throttle:10,1');

    // Admin Aspirations Management
    Route::get('/aspirations', [AspirationController::class, 'index'])->middleware('throttle:60,1');
    Route::patch('/aspirations/{id}/status', [AspirationController::class, 'updateStatus'])->middleware('throttle:60,1');
    Route::delete('/aspirations/{id}', [AspirationController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin News CRUD
    Route::post('/news', [NewsController::class, 'store'])->middleware('throttle:60,1');
    Route::put('/news/{id}', [NewsController::class, 'update'])->middleware('throttle:60,1');
    Route::delete('/news/{id}', [NewsController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Profile Items (Visi & Misi)
    Route::get('/profile-items', [ProfileItemController::class, 'index'])->middleware('throttle:60,1');
    Route::post('/profile-items', [ProfileItemController::class, 'store'])->middleware('throttle:60,1');
    Route::put('/profile-items/{id}', [ProfileItemController::class, 'update'])->middleware('throttle:60,1');
    Route::delete('/profile-items/{id}', [ProfileItemController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Cabinets
    Route::get('/cabinets', [CabinetController::class, 'index'])->middleware('throttle:60,1');
    Route::post('/cabinets', [CabinetController::class, 'store'])->middleware('throttle:60,1');
    Route::put('/cabinets/{id}', [CabinetController::class, 'update'])->middleware('throttle:60,1');
    Route::post('/cabinets/{id}/activate', [CabinetController::class, 'activate'])->middleware('throttle:60,1');
    Route::delete('/cabinets/{id}', [CabinetController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Departments (Bidang)
    Route::get('/departments', [DepartmentController::class, 'index'])->middleware('throttle:60,1');
    Route::post('/departments', [DepartmentController::class, 'store'])->middleware('throttle:60,1');
    Route::put('/departments/{id}', [DepartmentController::class, 'update'])->middleware('throttle:60,1');
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Members (Pengurus)
    Route::get('/members', [MemberController::class, 'index'])->middleware('throttle:60,1');
    Route::post('/members', [MemberController::class, 'store'])->middleware('throttle:60,1');
    Route::post('/members/{id}', [MemberController::class, 'update'])->middleware('throttle:60,1'); // POST untuk multipart form-data
    Route::delete('/members/{id}', [MemberController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Programs (Proker & Aker)
    Route::post('/programs', [ProgramController::class, 'store'])->middleware('throttle:60,1');
    Route::post('/programs/{id}', [ProgramController::class, 'update'])->middleware('throttle:60,1'); // POST untuk multipart form-data
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy'])->middleware('throttle:60,1');

    // Admin Contacts
    Route::get('/contact', [ContactController::class, 'index'])->middleware('throttle:60,1');
    Route::put('/contact', [ContactController::class, 'update'])->middleware('throttle:60,1');
});
