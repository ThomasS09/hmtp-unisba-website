<?php

namespace Tests\Feature;

use App\Models\Cabinet;
use App\Models\Contact;
use App\Models\ProfileItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Profil (visi/misi) dan kontak resmi: Revisi R-01 dan R-05.
 */
class AdminProfileContactTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create(['is_admin' => true]));
    }

    public function test_butir_visi_bisa_ditambah_diurutkan_dan_dihapus(): void
    {
        $this->postJson('/api/profile-items', [
            'type' => 'visi',
            'body' => 'Terwujudnya intelektual pertambangan yang Pejuang, Pemikir, dan Pembaharu.',
            'sort_order' => 2,
        ])->assertStatus(201);

        $this->postJson('/api/profile-items', [
            'type' => 'visi',
            'body' => 'Kemandirian dan profesionalisme mahasiswa Teknik Pertambangan UNISBA.',
            'sort_order' => 1,
        ])->assertStatus(201);

        // Urutan tampil menentukan urutan di halaman publik
        $this->getJson('/api/profile-items?type=visi')
            ->assertStatus(200)
            ->assertJsonPath('data.0.sort_order', 1)
            ->assertJsonPath('data.1.sort_order', 2);

        $item = ProfileItem::where('sort_order', 1)->firstOrFail();
        $this->deleteJson("/api/profile-items/{$item->id}")->assertStatus(200);
        $this->assertDatabaseMissing('profile_items', ['id' => $item->id]);
    }

    public function test_jenis_butir_selain_visi_misi_ditolak(): void
    {
        $this->postJson('/api/profile-items', [
            'type' => 'slogan',
            'body' => 'Isi butir uji yang cukup panjang.',
        ])->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_butir_terlalu_pendek_ditolak(): void
    {
        $this->postJson('/api/profile-items', [
            'type' => 'misi',
            'body' => 'abc',
        ])->assertStatus(422)->assertJsonValidationErrors('body');
    }

    public function test_kontak_bisa_diperbarui_dan_langsung_tampil_di_situs(): void
    {
        Contact::create(['email' => 'lama@hmtpunisba.or.id']);

        $this->putJson('/api/contact', [
            'email' => 'hmtp.adhikarakarsa@gmail.com',
            'instagram' => '@hmtpunisba',
            'tiktok' => '@hmtp.unisba',
            'youtube' => 'HMTP UNISBA',
            'website' => 'HMTPUNISBA.com',
        ])->assertStatus(200);

        $this->getJson('/api/site')
            ->assertStatus(200)
            ->assertJsonPath('data.contact.email', 'hmtp.adhikarakarsa@gmail.com')
            ->assertJsonPath('data.contact.instagram', '@hmtpunisba');
    }

    public function test_kontak_tanpa_email_ditolak(): void
    {
        Contact::create(['email' => 'lama@hmtpunisba.or.id']);

        $this->putJson('/api/contact', ['instagram' => '@hmtpunisba'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_tamu_tidak_bisa_mengubah_profil_atau_kontak(): void
    {
        $this->app['auth']->forgetGuards();

        $this->postJson('/api/profile-items', ['type' => 'visi', 'body' => 'Isi butir uji.'])->assertStatus(401);
        $this->putJson('/api/contact', ['email' => 'x@y.z'])->assertStatus(401);
    }
}
