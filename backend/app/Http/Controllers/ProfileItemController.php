<?php

namespace App\Http\Controllers;

use App\Models\ProfileItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;

class ProfileItemController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $items = ProfileItem::when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($items, 'Profil berhasil diambil.');
    }

    public function store(Request $request)
    {
        $validated = $this->validateItem($request);

        $item = ProfileItem::create($validated);

        return $this->successResponse($item, 'Butir profil berhasil ditambahkan.', 201);
    }

    public function update(Request $request, $id)
    {
        $item = ProfileItem::find($id);

        if (! $item) {
            return $this->notFoundResponse('Butir profil tidak ditemukan');
        }

        $item->update($this->validateItem($request));

        return $this->successResponse($item, 'Butir profil berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $item = ProfileItem::find($id);

        if (! $item) {
            return $this->notFoundResponse('Butir profil tidak ditemukan');
        }

        $item->delete();

        return $this->successResponse(null, 'Butir profil berhasil dihapus.');
    }

    private function validateItem(Request $request): array
    {
        return $request->validate([
            'type' => 'required|string|in:' . implode(',', ProfileItem::TYPES),
            'body' => 'required|string|min:5|max:2000',
            'sort_order' => 'nullable|integer|min:0',
        ], [
            'type.required' => 'Jenis butir wajib dipilih (visi/misi).',
            'type.in' => 'Jenis butir tidak valid.',
            'body.required' => 'Isi butir wajib diisi.',
            'body.min' => 'Isi butir minimal 5 karakter.',
            'body.max' => 'Isi butir maksimal 2000 karakter.',
        ]);
    }
}
