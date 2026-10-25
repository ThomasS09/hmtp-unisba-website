<?php

namespace Tests\Feature;

use App\Models\Cabinet;
use App\Models\Contact;
use App\Models\Department;
use App\Models\Member;
use App\Models\ProfileItem;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HmtpSiteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $cabinet = Cabinet::create([
            'name' => 'Adhikara Karsa',
            'period' => '2026/2027',
            'name_meaning' => 'Amanah dan tekad.',
            'is_active' => true,
        ]);

        $department = Department::create(['name' => 'Medkominfo', 'sort_order' => 1]);

        Member::create([
            'cabinet_id' => $cabinet->id,
            'department_id' => $department->id,
            'kelompok' => 'Ketua Bidang',
            'position' => 'Ketua Bidang Medkominfo',
            'name' => 'Bagas Ibrahim',
            'npm' => '10070123074',
            'sort_order' => 1,
        ]);

        Program::create([
            'cabinet_id' => $cabinet->id,
            'department_id' => $department->id,
            'name' => 'Booklet HMTP',
            'type' => 'Program Kerja',
            'status' => 'Rencana',
        ]);

        ProfileItem::create(['type' => 'visi', 'body' => 'Visi HMTP.', 'sort_order' => 1]);
        ProfileItem::create(['type' => 'misi', 'body' => 'Misi HMTP.', 'sort_order' => 1]);

        Contact::create(['email' => 'hmtp.adhikarakarsa@gmail.com']);
    }

    public function test_public_site_endpoint_returns_aggregated_data(): void
    {
        $response = $this->getJson('/api/site');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'profile' => ['visi', 'misi'],
                    'cabinet' => ['id', 'name', 'period', 'name_meaning'],
                    'cabinets',
                    'departments',
                    'members',
                    'programs',
                    'contact',
                ],
            ]);

        // Verifikasi NPM tidak bocor di publik
        $data = $response->json('data.members');
        $this->assertNotEmpty($data);
        foreach ($data as $member) {
            $this->assertArrayNotHasKey('npm', $member);
        }

        // Bidang pengurus diratakan jadi string, bukan objek
        $this->assertSame('Medkominfo', $data[0]['department']);
    }

    public function test_admin_member_list_flattens_department(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/members');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.department', 'Medkominfo')
            ->assertJsonPath('data.0.department_slug', 'medkominfo');
    }

    public function test_admin_program_list_flattens_department(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/programs');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.department', 'Medkominfo')
            ->assertJsonPath('data.0.department_slug', 'medkominfo');
    }

    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/profile-items')->assertStatus(401);
        $this->getJson('/api/cabinets')->assertStatus(401);
        $this->getJson('/api/departments')->assertStatus(401);
        $this->getJson('/api/members')->assertStatus(401);
        $this->getJson('/api/contact')->assertStatus(401);
        $this->postJson('/api/programs', [])->assertStatus(401);
    }

    public function test_anonymous_aspiration_submission(): void
    {
        $payload = [
            'is_anonymous' => true,
            'category' => 'Akademik',
            'message' => 'Ini aspirasi anonim dari mahasiswa teknik pertambangan.',
        ];

        $response = $this->postJson('/api/aspirations', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Anonim')
            ->assertJsonPath('data.nim', null)
            ->assertJsonPath('data.is_anonymous', true);

        $this->assertDatabaseHas('aspirations', [
            'name' => 'Anonim',
            'nim' => null,
            'is_anonymous' => 1,
        ]);
    }
}
