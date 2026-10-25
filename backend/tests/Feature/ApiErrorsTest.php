<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * API harus selalu menjawab JSON, termasuk saat gagal.
 * Regresi: dulu tamu dapat 500 "Route [login] not defined" karena request tanpa
 * header Accept diarahkan ke halaman login web yang tidak ada.
 */
class ApiErrorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tamu_dapat_401_json_tanpa_header_accept(): void
    {
        $response = $this->get('/api/aspirations');

        $response->assertStatus(401)->assertHeader('Content-Type', 'application/json');
    }

    public function test_route_api_tidak_dikenal_menjawab_json(): void
    {
        $this->getJson('/api/route-yang-tidak-ada')
            ->assertStatus(404)
            ->assertJsonStructure(['message']);
    }

    public function test_per_page_raksasa_ditolak(): void
    {
        $this->getJson('/api/news?per_page=99999')
            ->assertStatus(422)
            ->assertJsonValidationErrors('per_page');

        // Rute yang lewat Traits\Pagination juga dibatasi (min(100, ...))
        $this->getJson('/api/news?per_page=100')->assertStatus(200);
    }

    /** Pesan validasi harus bahasa Indonesia, bukan bawaan Inggris Laravel. */
    public function test_pesan_validasi_memakai_bahasa_indonesia(): void
    {
        $response = $this->getJson('/api/news?per_page=99999');

        $pesan = $response->json('errors.per_page.0');
        $this->assertStringContainsString('maksimal', $pesan);
        $this->assertStringNotContainsString('must not be greater than', $pesan);
    }
}
