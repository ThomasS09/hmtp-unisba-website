<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Traits\ApiResponse;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(
            Department::withCount('programs')->orderBy('sort_order')->get(),
            'Bidang berhasil diambil.'
        );
    }

    public function store(Request $request)
    {
        $department = Department::create($this->validateDepartment($request));

        return $this->successResponse($department, 'Bidang berhasil ditambahkan.', 201);
    }

    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        if (! $department) {
            return $this->notFoundResponse('Bidang tidak ditemukan');
        }

        $department->update($this->validateDepartment($request, $department->id));

        return $this->successResponse($department, 'Bidang berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $department = Department::find($id);

        if (! $department) {
            return $this->notFoundResponse('Bidang tidak ditemukan');
        }

        if ($department->programs()->exists()) {
            return $this->errorResponse(
                'Bidang masih memiliki proker/aker. Pindahkan atau hapus programnya terlebih dahulu.',
                422
            );
        }

        $department->delete();

        return $this->successResponse(null, 'Bidang berhasil dihapus.');
    }

    private function validateDepartment(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments', 'name')->ignore($ignoreId),
            ],
            'sort_order' => 'nullable|integer|min:0',
        ], [
            'name.required' => 'Nama bidang wajib diisi.',
            'name.unique' => 'Nama bidang sudah terdaftar.',
        ]);
    }
}
