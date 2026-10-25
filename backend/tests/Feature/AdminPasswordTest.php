<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Menu "Akun" di dashboard: ganti password admin.
 */
class AdminPasswordTest extends TestCase
{
    use RefreshDatabase;

    private const LAMA = 'password-lama';

    private function admin(): User
    {
        return User::factory()->create(['password' => Hash::make(self::LAMA)]);
    }

    private function payload(array $override = []): array
    {
        return array_merge([
            'current_password' => self::LAMA,
            'password' => 'password-baru-123',
            'password_confirmation' => 'password-baru-123',
        ], $override);
    }

    public function test_admin_bisa_ganti_password(): void
    {
        $user = $this->admin();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/password', $this->payload());

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertTrue(Hash::check('password-baru-123', $user->fresh()->password));
    }

    public function test_password_lama_salah_ditolak(): void
    {
        $user = $this->admin();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/password', $this->payload(['current_password' => 'salah-sekali']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('current_password');

        $this->assertTrue(Hash::check(self::LAMA, $user->fresh()->password));
    }

    public function test_konfirmasi_tidak_sama_ditolak(): void
    {
        $user = $this->admin();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/password', $this->payload(['password_confirmation' => 'beda-beda-123']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_password_baru_minimal_8_karakter(): void
    {
        $user = $this->admin();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/password', $this->payload([
                'password' => 'pendek',
                'password_confirmation' => 'pendek',
            ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_tamu_tidak_bisa_ganti_password(): void
    {
        $this->postJson('/api/password', $this->payload())->assertStatus(401);
    }
}
