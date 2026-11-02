<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;

class SiteSettingController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(SiteSetting::values(), 'Pengaturan situs berhasil diambil.');
    }

    /**
     * Simpan sekaligus (bulk) — admin mengirim hanya key yang berubah.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array|min:1',
            'settings.*' => 'nullable|string|max:1000',
        ], [
            'settings.required' => 'Tidak ada pengaturan yang dikirim.',
            'settings.*.max' => 'Teks terlalu panjang (maksimal 1000 karakter).',
        ]);

        $allowed = SiteSetting::keys();

        foreach ($validated['settings'] as $key => $value) {
            if (! in_array($key, $allowed, true)) {
                continue; // key asing diabaikan, bukan error
            }

            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return $this->successResponse(SiteSetting::values(), 'Pengaturan situs berhasil disimpan.');
    }
}