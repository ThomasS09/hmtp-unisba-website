<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Aspiration;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AspirationControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_can_submit_aspiration_with_valid_data()
    {
        $aspirationData = [
            'name' => 'John Doe',
            'nim' => '1234567890',
            'category' => 'Akademik',
            'message' => 'This is a test aspiration message with sufficient length.',
        ];

        $response = $this->postJson('/api/aspirations', $aspirationData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Aspirasi Anda berhasil dikirimkan.',
            ]);

        $this->assertDatabaseHas('aspirations', [
            'name' => 'John Doe',
            'nim' => '1234567890',
            'category' => 'Akademik',
            'status' => 'Pending',
        ]);
    }

    /** @test */
    public function aspiration_submission_fails_with_invalid_category()
    {
        $response = $this->postJson('/api/aspirations', [
            'name' => 'John Doe',
            'category' => 'InvalidCategory',
            'message' => 'This is a test message.',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    /** @test */
    public function aspiration_submission_fails_with_short_message()
    {
        $response = $this->postJson('/api/aspirations', [
            'name' => 'John Doe',
            'category' => 'Akademik',
            'message' => 'Short',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function admin_can_view_all_aspirations()
    {
        $user = User::factory()->create();
        Aspiration::factory()->count(3)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/aspirations');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    /** @test */
    public function admin_can_update_aspiration_status()
    {
        $user = User::factory()->create();
        $aspiration = Aspiration::factory()->create(['status' => 'Pending']);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/aspirations/{$aspiration->id}/status", [
                'status' => 'Selesai',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('aspirations', [
            'id' => $aspiration->id,
            'status' => 'Selesai',
        ]);
    }

    /** @test */
    public function admin_can_delete_aspiration()
    {
        $user = User::factory()->create();
        $aspiration = Aspiration::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/aspirations/{$aspiration->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('aspirations', [
            'id' => $aspiration->id,
        ]);
    }

    /** @test */
    public function guest_cannot_access_admin_aspiration_routes()
    {
        $response = $this->getJson('/api/aspirations');
        $response->assertStatus(401);
    }
}
