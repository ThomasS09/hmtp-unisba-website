<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    use ApiResponse;

    private const PHOTO_MAX_KB = 4096;

    public function index(Request $request)
    {
        $members = Member::with('department')
            ->when($request->cabinet_id, fn ($q, $id) => $q->where('cabinet_id', $id))
            ->when($request->kelompok, fn ($q, $k) => $q->where('kelompok', $k))
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Member $m) => $this->presentMember($m));

        return $this->successResponse($members, 'Pengurus berhasil diambil.');
    }

    /**
     * Bentuk JSON daftar admin: relasi bidang diratakan jadi string
     * supaya frontend bisa render langsung (bukan objek).
     */
    private function presentMember(Member $m): array
    {
        $m->photo_url = $m->photo_url;

        return array_merge($m->toArray(), [
            'department' => $m->department?->name,
            'department_slug' => $m->department?->slug,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateMember($request);

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('pengurus', 'public');
        }
        unset($validated['photo']);

        $member = Member::create($validated);

        return $this->successResponse($member, 'Pengurus berhasil ditambahkan.', 201);
    }

    public function update(Request $request, $id)
    {
        $member = Member::find($id);

        if (! $member) {
            return $this->notFoundResponse('Pengurus tidak ditemukan');
        }

        $validated = $this->validateMember($request, $member->id);

        if ($request->hasFile('photo')) {
            if ($member->photo_path) {
                Storage::disk('public')->delete($member->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('pengurus', 'public');
        }
        unset($validated['photo']);

        $member->update($validated);

        return $this->successResponse($member, 'Data pengurus berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $member = Member::find($id);

        if (! $member) {
            return $this->notFoundResponse('Pengurus tidak ditemukan');
        }

        if ($member->photo_path) {
            Storage::disk('public')->delete($member->photo_path);
        }

        $member->delete();

        return $this->successResponse(null, 'Pengurus berhasil dihapus.');
    }

    private function validateMember(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'cabinet_id' => 'required|integer|exists:cabinets,id',
            'department_id' => 'nullable|integer|exists:departments,id',
            'kelompok' => 'required|string|in:' . implode(',', Member::GROUPS),
            'position' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'npm' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer|min:0',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::PHOTO_MAX_KB,
        ], [
            'cabinet_id.required' => 'Kabinet wajib dipilih.',
            'cabinet_id.exists' => 'Kabinet tidak ditemukan.',
            'department_id.exists' => 'Bidang tidak ditemukan.',
            'kelompok.required' => 'Kelompok wajib dipilih.',
            'kelompok.in' => 'Kelompok tidak valid.',
            'position.required' => 'Jabatan wajib diisi.',
            'name.required' => 'Nama pengurus wajib diisi.',
            'photo.image' => 'Foto harus berupa gambar.',
            'photo.mimes' => 'Foto harus berformat jpg, jpeg, png, atau webp.',
            'photo.max' => 'Ukuran foto maksimal 4 MB.',
        ]);
    }
}
