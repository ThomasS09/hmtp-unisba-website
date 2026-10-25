<?php

namespace App\Http\Controllers;

use App\Models\Aspiration;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\Pagination;
use App\Http\Controllers\Traits\ApiResponse;

class AspirationController extends Controller
{
    use Pagination, ApiResponse;
    
    public function index()
    {
        $params = $this->getPaginationParams();
        
        $query = Aspiration::orderBy($params['sort_by'], $params['sort_order']);
        
        if (request('category')) {
            $query->where('category', request('category'));
        }
        
        if (request('status')) {
            $query->where('status', request('status'));
        }
        
        if (request('search')) {
            $search = strip_tags(request('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }
        
        $aspirations = $this->paginate($query, $params['per_page']);

        return $this->successResponse([
            'data' => $aspirations->items(),
            'meta' => [
                'current_page' => $aspirations->currentPage(),
                'per_page' => $aspirations->perPage(),
                'total' => $aspirations->total(),
                'last_page' => $aspirations->lastPage(),
                'from' => $aspirations->firstItem(),
                'to' => $aspirations->lastItem(),
            ]
        ], 'Aspirasi retrieved successfully.');
    }

    /**
     * Store a newly created aspiration in storage (Public student form).
     */
    public function store(Request $request)
    {
        $isAnonymous = $request->boolean('is_anonymous');

        $validated = $request->validate([
            'is_anonymous' => 'nullable|boolean',
            'name' => $isAnonymous ? 'nullable|string|max:255' : 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'nim' => 'nullable|string|max:50|regex:/^[a-zA-Z0-9\-]+$/',
            'category' => 'required|string|max:100|in:Saran,Kritik,Akademik,Kegiatan,Fasilitas,Organisasi,Lainnya',
            'message' => 'required|string|min:10|max:5000',
        ], [
            'name.required' => 'Nama wajib diisi jika tidak anonim.',
            'name.regex' => 'Nama hanya boleh berisi huruf, spasi, dan tanda hubung.',
            'nim.regex' => 'NIM hanya boleh berisi huruf, angka, dan tanda hubung.',
            'category.required' => 'Kategori wajib dipilih.',
            'category.in' => 'Kategori tidak valid.',
            'message.required' => 'Pesan wajib diisi.',
            'message.min' => 'Pesan minimal 10 karakter.',
            'message.max' => 'Pesan maksimal 5000 karakter.',
        ]);

        $name = $isAnonymous
            ? (!empty($validated['name']) ? strip_tags($validated['name']) : 'Anonim')
            : strip_tags($validated['name']);

        $aspiration = Aspiration::create([
            'name' => $name,
            'nim' => $isAnonymous ? null : ($validated['nim'] ?? null),
            'category' => strip_tags($validated['category']),
            'message' => strip_tags($validated['message']),
            'status' => 'Pending',
            'is_anonymous' => $isAnonymous,
        ]);

        return $this->successResponse($aspiration, 'Aspirasi Anda berhasil dikirimkan.', 201);
    }

    /**
     * Update the status of an aspiration (Admin).
     */
    public function updateStatus(Request $request, $id)
    {
        $aspiration = Aspiration::find($id);

        if (!$aspiration) {
            return $this->notFoundResponse('Aspirasi tidak ditemukan');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Selesai,Arsip',
        ]);

        $aspiration->update([
            'status' => $validated['status']
        ]);

        return $this->successResponse($aspiration, 'Status aspirasi berhasil diubah.');
    }

    /**
     * Remove the specified aspiration (Admin).
     */
    public function destroy($id)
    {
        $aspiration = Aspiration::find($id);

        if (!$aspiration) {
            return $this->notFoundResponse('Aspirasi tidak ditemukan');
        }

        $aspiration->delete();

        return $this->successResponse(null, 'Aspirasi berhasil dihapus.');
    }
}
