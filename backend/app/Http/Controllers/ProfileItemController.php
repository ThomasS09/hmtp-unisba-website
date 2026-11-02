<?php

namespace App\Http\Controllers;

use App\Models\ProfileItem;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Traits\ApiResponse;

class ProfileItemController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $items = ProfileItem::when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->orderBy('type')
            ->orderBy('sort_order')
            ->orderBy('id') // penentu urutan terakhir: sort_order kosong tidak bikin acak
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
        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', ProfileItem::TYPES),
            'body' => 'required|string|min:5|max:2000',
            // Dipakai butir berstruktur (timeline & elemen logo); butir teks biasa boleh kosong.
            'heading' => 'nullable|string|max:120',
            'subheading' => 'nullable|string|max:160',
            'note' => 'nullable|string|max:200',
            'sort_order' => 'nullable|integer|min:0',
        ], [
            'type.required' => 'Jenis butir wajib dipilih.',
            'type.in' => 'Jenis butir tidak valid.',
            'body.required' => 'Isi butir wajib diisi.',
            'body.min' => 'Isi butir minimal 5 karakter.',
            'body.max' => 'Isi butir maksimal 2000 karakter.',
        ]);

        // Butir berstruktur tampil sebagai kartu; tanpa judul kartunya kosong.
        if (in_array($validated['type'], ['timeline', 'logo-elemen'], true) && blank($validated['heading'] ?? null)) {
            throw ValidationException::withMessages(['heading' => 'Judul wajib diisi untuk jenis butir ini.']);
        }

        return $validated;
    }
}
