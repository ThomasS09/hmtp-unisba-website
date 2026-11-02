<?php

namespace Tests\Feature;

use App\Models\Aspiration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/** Admin aspirations management. */
class AdminAspirationsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));
    }

    public function test_admin_bisa_melihat_semua_aspirasi(): void
    {
        $this->getJson('/api/aspirations')
            ->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_admin_bisa_mengubah_status_aspirasi(): void
    {
        $aspiration = Aspiration::factory()->create(['status' => 'Pending']);
        $response = $this->patchJson("/api/aspirations/{$aspiration->id}/status", ['status' => 'Selesai']);
        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertSame('Selesai', $aspiration->fresh()->status);
    }

    public function test_admin_bisa_menghapus_aspirasi(): void
    {
        $aspiration = Aspiration::factory()->create();
        $this->deleteJson("/api/aspirations/{$aspiration->id}")->assertStatus(200);
        $this->assertDatabaseMissing('aspirations', ['id' => $aspiration->id]);
    }

    public function test_tamu_tidak_bisa_mengakses_aspirasi_admin(): void
    {
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/aspirations')->assertStatus(401);
        $this->deleteJson('/api/aspirations/1')->assertStatus(401);
    }
}
