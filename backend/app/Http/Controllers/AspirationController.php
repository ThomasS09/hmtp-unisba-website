<?php

namespace App\Http\Controllers;

use App\Models\Aspiration;
use Illuminate\Http\Request;

class AspirationController extends Controller
{
    /**
     * Display a listing of aspirations (Admin).
     */
    public function index()
    {
        $aspirations = Aspiration::orderBy('created_at', 'desc')->get();
        return response()->json($aspirations, 200);
    }

    /**
     * Store a newly created aspiration in storage (Public student form).
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

    /**
     * Update the status of an aspiration (Admin).
     */
    public function updateStatus(Request $request, $id)
    {
        $aspiration = Aspiration::find($id);

        if (!$aspiration) {
            return response()->json(['message' => 'Aspirasi tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Selesai,Arsip',
        ]);

        $aspiration->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status aspirasi berhasil diubah.',
            'data' => $aspiration
        ], 200);
    }

    /**
     * Remove the specified aspiration (Admin).
     */
    public function destroy($id)
    {
        $aspiration = Aspiration::find($id);

        if (!$aspiration) {
            return response()->json(['message' => 'Aspirasi tidak ditemukan'], 404);
        }

        $aspiration->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aspirasi berhasil dihapus.'
        ], 200);
    }
}
