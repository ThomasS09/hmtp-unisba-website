<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    use ApiResponse;

    private const IMAGE_MAX_KB = 4096;

    public function index(Request $request)
    {
        $programs = Program::with('department')
            ->when($request->cabinet_id, fn ($q, $id) => $q->where('cabinet_id', $id))
            ->when($request->department_id, fn ($q, $id) => $q->where('department_id', $id))
            ->when($request->department, fn ($q, $slug) => $q->whereHas(
                'department',
                fn ($d) => $d->where('slug', $slug)
            ))
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', '%' . strip_tags($s) . '%'))
            ->orderBy('department_id')
            ->orderBy('id')
            ->get()
            ->map(fn (Program $p) => $this->presentProgram($p));

        return $this->successResponse($programs, 'Proker/aker berhasil diambil.');
    }

    /**
     * Bentuk JSON daftar admin: relasi bidang diratakan jadi string
     * supaya frontend bisa render langsung (bukan objek).
     */
    private function presentProgram(Program $p): array
    {
        return array_merge($p->toArray(), [
            'department' => $p->department?->name,
            'department_slug' => $p->department?->slug,
        ]);
    }

    public function show($id)
    {
        $program = Program::with('department')->find($id);

        if (! $program) {
            return $this->notFoundResponse('Program tidak ditemukan');
        }

        return $this->successResponse($this->presentProgram($program), 'Program berhasil diambil.');
    }

    public function store(Request $request)
    {
        $validated = $this->validateProgram($request);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('programs', 'public');
        }
        unset($validated['image']);

        $program = Program::create($validated);

        return $this->successResponse($program, 'Program berhasil ditambahkan.', 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::find($id);

        if (! $program) {
            return $this->notFoundResponse('Program tidak ditemukan');
        }

        $validated = $this->validateProgram($request, true);

        if ($request->hasFile('image')) {
            if ($program->image_path) {
                Storage::disk('public')->delete($program->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('programs', 'public');
        }
        unset($validated['image']);

        $program->update($validated);

        return $this->successResponse($program, 'Program berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $program = Program::find($id);

        if (! $program) {
            return $this->notFoundResponse('Program tidak ditemukan');
        }

        if ($program->image_path) {
            Storage::disk('public')->delete($program->image_path);
        }

        $program->delete();

        return $this->successResponse(null, 'Program berhasil dihapus.');
    }

    private function validateProgram(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes|required' : 'required';

        return $request->validate([
            'cabinet_id' => $required . '|integer|exists:cabinets,id',
            'department_id' => $required . '|integer|exists:departments,id',
            'name' => $required . '|string|max:255',
            'type' => $required . '|string|in:' . implode(',', Program::TYPES),
            'description' => 'nullable|string|max:5000',
            'schedule' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:' . implode(',', Program::STATUSES),
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::IMAGE_MAX_KB,
        ], [
            'cabinet_id.required' => 'Kabinet wajib dipilih.',
            'department_id.required' => 'Bidang wajib dipilih.',
            'department_id.exists' => 'Bidang tidak ditemukan.',
            'name.required' => 'Nama program wajib diisi.',
            'type.required' => 'Jenis program wajib dipilih.',
            'type.in' => 'Jenis program tidak valid.',
            'status.in' => 'Status tidak valid.',
            'image.image' => 'Lampiran harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 4 MB.',
        ]);
    }
}
