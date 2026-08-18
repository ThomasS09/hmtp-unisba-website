<?php

namespace App\Http\Controllers;

use App\Models\Aspiration;
use Illuminate\Http\Request;

class AspirationController extends Controller
{
    /**
     * Display a listing of aspirations.
     */
    public function index()
    {
        $aspirations = Aspiration::orderBy('created_at', 'desc')->get();
        return response()->json($aspirations, 200);
    }

    /**
     * Store a newly created aspiration in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:50',
            'category' => 'required|string|max:100',
            'message' => 'required|string',
        ]);

        $aspiration = Aspiration::create([
            'name' => $validated['name'],
            'nim' => $validated['nim'] ?? null,
            'category' => $validated['category'],
            'message' => $validated['message'],
            'status' => 'Pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aspirasi Anda berhasil dikirimkan.',
            'data' => $aspiration
        ], 201);
    }
}
