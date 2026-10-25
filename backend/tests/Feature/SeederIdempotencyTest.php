<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\News;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederIdempotencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_can_run_twice_without_duplicates(): void
    {
        $this->seed();
        $first = [
            'users' => User::count(),
            'news' => News::count(),
            'members' => Member::count(),
            'programs' => Program::count(),
        ];

        $this->seed();

        $this->assertSame($first['users'], User::count(), 'users bertambah setelah seeder dijalankan 2x');
        $this->assertSame($first['news'], News::count(), 'news terduplikasi setelah seeder dijalankan 2x');
        $this->assertSame($first['members'], Member::count(), 'members terduplikasi setelah seeder dijalankan 2x');
        $this->assertSame($first['programs'], Program::count(), 'programs terduplikasi setelah seeder dijalankan 2x');
    }
}
