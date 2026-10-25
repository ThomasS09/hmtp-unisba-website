<?php

namespace App\Http\Controllers;

use App\Models\Cabinet;
use App\Models\Contact;
use App\Models\Department;
use App\Models\Member;
use App\Models\Program;
use App\Models\ProfileItem;
use App\Http\Controllers\Traits\ApiResponse;

class SiteController extends Controller
{
    use ApiResponse;

    /**
     * Data agregat untuk seluruh halaman publik.
     */
    public function index()
    {
        $cabinet = Cabinet::with(['members.department'])
            ->active()
            ->first() ?? Cabinet::latest()->first();

        $programs = Program::with('department')
            ->when($cabinet, fn ($q) => $q->where('cabinet_id', $cabinet->id))
            ->orderBy('department_id')
            ->orderBy('id')
            ->get();

        return $this->successResponse([
            'profile' => [
                'visi' => ProfileItem::where('type', 'visi')->orderBy('sort_order')->pluck('body'),
                'misi' => ProfileItem::where('type', 'misi')->orderBy('sort_order')->pluck('body'),
            ],
            'cabinet' => $cabinet ? [
                'id' => $cabinet->id,
                'name' => $cabinet->name,
                'period' => $cabinet->period,
                'name_meaning' => $cabinet->name_meaning,
                'logo_url' => $cabinet->logo_path ? asset('storage/' . $cabinet->logo_path) : null,
                'is_active' => $cabinet->is_active,
            ] : null,
            'cabinets' => Cabinet::orderByDesc('is_active')->orderByDesc('period')->get([
                'id', 'name', 'period', 'name_meaning', 'logo_path', 'is_active',
            ])->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'period' => $c->period,
                'name_meaning' => $c->name_meaning,
                'logo_url' => $c->logo_path ? asset('storage/' . $c->logo_path) : null,
                'is_active' => $c->is_active,
            ]),
            'departments' => Department::orderBy('sort_order')->get(['id', 'name', 'slug']),
            'members' => $cabinet ? $cabinet->members->map(fn (Member $m) => [
                'id' => $m->id,
                'kelompok' => $m->kelompok,
                'position' => $m->position,
                'name' => $m->name,
                'department' => $m->department?->name,
                'department_slug' => $m->department?->slug,
                'photo_url' => $m->photo_url,
            ]) : [],
            'programs' => $programs->map(fn (Program $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'type' => $p->type,
                'description' => $p->description,
                'schedule' => $p->schedule,
                'status' => $p->status,
                'image_url' => $p->image_path ? asset('storage/' . $p->image_path) : null,
                'department' => $p->department?->name,
                'department_slug' => $p->department?->slug,
            ]),
            'contact' => Contact::first(),
        ], 'Data situs berhasil diambil.');
    }
}
