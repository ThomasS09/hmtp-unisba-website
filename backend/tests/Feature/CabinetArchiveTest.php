<?php

namespace Tests\Feature;

use App\Models\Cabinet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Kabinet lama disimpan sebagai arsip (Revisi R-02):
 * hanya satu yang aktif, dan kabinet aktif tidak boleh dihapus.
 */
class CabinetArchiveTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create(['is_admin' => true]);
        Sanctum::actingAs($user);

        return $user;
    }

    public function test_hanya_satu_kabinet_aktif_setelah_aktivasi(): void
    {
        $this->admin();
        $lama = Cabinet::create(['name' => 'Kabinet Lama', 'period' => '2024/2025', 'is_active' => true]);
        $baru = Cabinet::create(['name' => 'Kabinet Baru', 'period' => '2025/2026', 'is_active' => false]);

        $this->postJson("/api/cabinets/{$baru->id}/activate")->assertStatus(200);

        $this->assertTrue($baru->fresh()->is_active);
        $this->assertFalse($lama->fresh()->is_active);
        $this->assertSame(1, Cabinet::where('is_active', true)->count());
    }

    public function test_kabinet_aktif_tidak_bisa_dihapus(): void
    {
        $this->admin();
        $aktif = Cabinet::create(['name' => 'Adhikara Karsa', 'period' => '2026/2027', 'is_active' => true]);

        $this->deleteJson("/api/cabinets/{$aktif->id}")
            ->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('cabinets', ['id' => $aktif->id]);
    }

    public function test_kabinet_arsip_bisa_dihapus(): void
    {
        $this->admin();
        Cabinet::create(['name' => 'Aktif', 'period' => '2026/2027', 'is_active' => true]);
        $arsip = Cabinet::create(['name' => 'Arsip', 'period' => '2025/2026', 'is_active' => false]);

        $this->deleteJson("/api/cabinets/{$arsip->id}")->assertStatus(200);

        $this->assertDatabaseMissing('cabinets', ['id' => $arsip->id]);
    }
}
