<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@hmtpunisba.or.id'],
            [
                'name' => 'Admin HMTP UNISBA',
                'email' => 'admin@hmtpunisba.or.id',
                'password' => Hash::make('Adhikara2026!'),
            ]
        );
    }
}
