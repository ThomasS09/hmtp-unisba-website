<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;

class ContactController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(Contact::first(), 'Kontak berhasil diambil.');
    }

    /**
     * Simpan kontak resmi (satu baris, dibuat kalau belum ada).
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'website' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'instagram' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
        ], [
            'email.required' => 'Email resmi wajib diisi.',
            'email.email' => 'Format email tidak valid.',
        ]);

        $contact = Contact::first() ?? new Contact();
        $contact->fill($validated)->save();

        return $this->successResponse($contact, 'Kontak berhasil diperbarui.');
    }
}
