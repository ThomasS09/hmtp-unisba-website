<?php

namespace App\Http\Controllers;

use App\Models\Cabinet;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;

class CabinetController extends Controller
{
    use ApiResponse;

    /**
     * Batas ukuran logo (KB).
     */
    private const LOGO_MAX_KB = 2048;

    public function index()
    {
        return $this->successResponse(
            Cabinet::withCount('members')->orderByDesc('is_active')->orderByDesc('period')->get(),
            'Kabinet berhasil diambil.'
        );
    }

    public function store(Request $request)
    {
        $validated = $this->validateCabinet($request);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('logo', 'public');
        }
        unset($validated['logo']);

        $cabinet = Cabinet::create($validated);

        return $this->successResponse($cabinet, 'Kabinet berhasil ditambahkan.', 201);
    }

    public function update(Request $request, $id)
    {
        $cabinet = Cabinet::find($id);

        if (! $cabinet) {
            return $this->notFoundResponse('Kabinet tidak ditemukan');
        }

        $validated = $this->validateCabinet($request, $cabinet->id);

        if ($request->hasFile('logo')) {
            if ($cabinet->logo_path) {
                Storage::disk('public')->delete($cabinet->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('logo', 'public');
        }
        unset($validated['logo']);

        $cabinet->update($validated);

        return $this->successResponse($cabinet, 'Kabinet berhasil diperbarui.');
    }

    /**
     * Jadikan kabinet ini yang tampil di halaman publik.
     */
    public function activate($id)
    {
        $cabinet = Cabinet::find($id);

        if (! $cabinet) {
            return $this->notFoundResponse('Kabinet tidak ditemukan');
        }

        Cabinet::where('id', '!=', $cabinet->id)->update(['is_active' => false]);
        $cabinet->update(['is_active' => true]);

        return $this->successResponse($cabinet, 'Kabinet berhasil diaktifkan.');
    }

    public function destroy($id)
    {
        $cabinet = Cabinet::find($id);

        if (! $cabinet) {
            return $this->notFoundResponse('Kabinet tidak ditemukan');
        }

        if ($cabinet->is_active) {
            return $this->errorResponse(
                'Kabinet aktif tidak dapat dihapus. Aktifkan kabinet lain terlebih dahulu.',
                422
            );
        }

        if ($cabinet->logo_path) {
            Storage::disk('public')->delete($cabinet->logo_path);
        }

        $cabinet->delete();

        return $this->successResponse(null, 'Kabinet berhasil dihapus.');
    }

    private function validateCabinet(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'period' => 'required|string|max:20|regex:/^\d{4}\/\d{4}$/',
            'name_meaning' => 'nullable|string|max:5000',
            'is_active' => 'nullable|boolean',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::LOGO_MAX_KB,
        ], [
            'name.required' => 'Nama kabinet wajib diisi.',
            'period.required' => 'Periode wajib diisi.',
            'period.regex' => 'Format periode harus TAHUN/TAHUN, contoh 2026/2027.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.mimes' => 'Logo harus berformat jpg, jpeg, png, atau webp.',
            'logo.max' => 'Ukuran logo maksimal 2 MB.',
        ]);
    }
}
