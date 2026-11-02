<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/** Admin account management: password change, profile view. */
class AdminAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['password' => Hash::make('oldpass123'), 'is_admin' => true]);
        Sanctum::actingAs($this->user);
    }

    public function test_admin_bisa_melihat_profil_sendiri(): void
    {
        $this->getJson('/api/me')
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.email', $this->user->email);
    }

    public function test_admin_bisa_logout(): void
    {
        $this->postJson('/api/logout')
            ->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_admin_bisa_mengganti_password(): void
    {
        $this->postJson('/api/password', [
            'current_password' => 'oldpass123',
            'password' => 'newpass456',
            'password_confirmation' => 'newpass456',
        ])->assertStatus(200)->assertJsonPath('success', true);
    }

    public function test_ganti_password_tolak_jika_password_lama_salah(): void
    {
        $this->postJson('/api/password', [
            'current_password' => 'salah123',
            'password' => 'newpass456',
            'password_confirmation' => 'newpass456',
        ])->assertStatus(422)->assertJsonValidationErrors('current_password');
    }

    public function test_ganti_password_tolak_jika_konfirmasi_tidak_sama(): void
    {
        $this->postJson('/api/password', [
            'current_password' => 'oldpass123',
            'password' => 'newpass456',
            'password_confirmation' => 'berbeda789',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_tamu_tidak_bisa_mengakses_account_routes(): void
    {
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/me')->assertStatus(401);
        $this->postJson('/api/logout')->assertStatus(401);
        $this->postJson('/api/password', ['current_password' => 'x'])->assertStatus(401);
    }
}
