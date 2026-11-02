<?php

namespace Tests\Feature;

use App\Models\Cabinet;
use App\Models\Department;
use App\Models\Member;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * CRUD pengurus, proker, dan bidang: jalur yang dipakai pengurus tiap ganti
 * kepengurusan (Revisi R-03, R-04). Sebelumnya tidak ada test sama sekali.
 */
class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    private Cabinet $kabinet;
    private Department $bidang;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));
        $this->kabinet = Cabinet::create(['name' => 'Adhikara Karsa', 'period' => '2026/2027', 'is_active' => true]);
        $this->bidang = Department::create(['name' => 'Bidang Medkominfo', 'slug' => 'bidang-medkominfo']);
    }

    public function test_pengurus_baru_bisa_ditambahkan_dan_muncul_di_daftar(): void
    {
        $this->postJson('/api/members', [
            'cabinet_id' => $this->kabinet->id,
            'kelompok' => 'Pengurus Inti',
            'position' => 'Ketua Himpunan',
            'name' => 'Farrel Danandyaka Hidayat',
            'npm' => '10070123029',
            'sort_order' => 1,
        ])->assertStatus(201)->assertJsonPath('success', true);

        $this->getJson('/api/members')
            ->assertStatus(200)
            ->assertJsonPath('data.0.name', 'Farrel Danandyaka Hidayat');
    }

    public function test_pengurus_tanpa_nama_ditolak_dengan_pesan_indonesia(): void
    {
        $this->postJson('/api/members', [
            'cabinet_id' => $this->kabinet->id,
            'kelompok' => 'Pengurus Inti',
            'position' => 'Ketua Himpunan',
            'name' => '',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name')
            ->assertJsonPath('errors.name.0', 'Nama pengurus wajib diisi.');
    }

    public function test_kelompok_pengurus_di_luar_daftar_ditolak(): void
    {
        $this->postJson('/api/members', [
            'cabinet_id' => $this->kabinet->id,
            'kelompok' => 'Staf',
            'position' => 'Staf',
            'name' => 'Nama Uji',
        ])->assertStatus(422)->assertJsonValidationErrors('kelompok');
    }

    public function test_pengurus_bisa_diperbarui_dan_dihapus(): void
    {
        $member = Member::create([
            'cabinet_id' => $this->kabinet->id,
            'kelompok' => 'Ketua Bidang',
            'position' => 'Ketua Bidang Medkominfo',
            'name' => 'Nama Lama',
            'department_id' => $this->bidang->id,
        ]);

        $this->postJson("/api/members/{$member->id}", [
            'cabinet_id' => $this->kabinet->id,
            'kelompok' => 'Ketua Bidang',
            'position' => 'Ketua Bidang Medkominfo',
            'name' => 'Nama Baru',
            'department_id' => $this->bidang->id,
        ])->assertStatus(200);

        $this->assertSame('Nama Baru', $member->fresh()->name);

        $this->deleteJson("/api/members/{$member->id}")->assertStatus(200);
        $this->assertDatabaseMissing('members', ['id' => $member->id]);
    }

    public function test_proker_bisa_ditambahkan_dengan_jenis_dan_status(): void
    {
        $this->postJson('/api/programs', [
            'cabinet_id' => $this->kabinet->id,
            'department_id' => $this->bidang->id,
            'name' => 'Booklet HMTP',
            'type' => 'Program Kerja',
            'status' => 'Rencana',
        ])->assertStatus(201);

        $this->assertDatabaseHas('programs', ['name' => 'Booklet HMTP', 'type' => 'Program Kerja']);
    }

    public function test_proker_dengan_jenis_tidak_dikenal_ditolak(): void
    {
        $this->postJson('/api/programs', [
            'cabinet_id' => $this->kabinet->id,
            'department_id' => $this->bidang->id,
            'name' => 'Program Uji',
            'type' => 'Program Kerjaa',
        ])->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_status_proker_bisa_diubah_lewat_update(): void
    {
        $program = Program::create([
            'cabinet_id' => $this->kabinet->id,
            'department_id' => $this->bidang->id,
            'name' => 'Jakun Story Competition',
            'type' => 'Program Kerja',
            'status' => 'Rencana',
        ]);

        $this->postJson("/api/programs/{$program->id}", [
            'cabinet_id' => $this->kabinet->id,
            'department_id' => $this->bidang->id,
            'name' => 'Jakun Story Competition',
            'type' => 'Program Kerja',
            'status' => 'Berjalan',
        ])->assertStatus(200);

        $this->assertSame('Berjalan', $program->fresh()->status);
    }

    public function test_bidang_bisa_ditambah_diganti_nama_dan_dihapus(): void
    {
        $this->postJson('/api/departments', [
            'name' => 'Bidang Kaderisasi',
            'slug' => 'bidang-kaderisasi',
        ])->assertStatus(201);

        $bidang = Department::where('slug', 'bidang-kaderisasi')->firstOrFail();

        $this->putJson("/api/departments/{$bidang->id}", [
            'name' => 'Bidang Kaderisasi & Alumni',
            'slug' => 'bidang-kaderisasi',
        ])->assertStatus(200);

        $this->assertSame('Bidang Kaderisasi & Alumni', $bidang->fresh()->name);

        $this->deleteJson("/api/departments/{$bidang->id}")->assertStatus(200);
        $this->assertDatabaseMissing('departments', ['id' => $bidang->id]);
    }

    public function test_tamu_tidak_bisa_mengubah_pengurus_proker_atau_bidang(): void
    {
        $this->app['auth']->forgetGuards();

        $this->postJson('/api/members', ['name' => 'X'])->assertStatus(401);
        $this->postJson('/api/programs', ['name' => 'X'])->assertStatus(401);
        $this->postJson('/api/departments', ['name' => 'X'])->assertStatus(401);
    }
}
