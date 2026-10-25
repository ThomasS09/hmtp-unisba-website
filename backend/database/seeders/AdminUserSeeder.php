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
        $user = User::where('email', 'admin@hmtpunisba.or.id')->first();

        if ($user) {
            // Password tidak pernah ditimpa saat seed ulang; kalau ditimpa,
            // password yang sudah diganti lewat menu Akun akan balik ke bawaan.
            return;
        }

        User::create([
            'name' => 'Admin HMTP UNISBA',
            'email' => 'admin@hmtpunisba.or.id',
            'password' => Hash::make(env('ADMIN_PASSWORD') ?: 'Adhikara2026!'),
        ]);

        if (! env('ADMIN_PASSWORD')) {
            $this->command?->warn('Password admin masih bawaan (Adhikara2026!). Ganti lewat menu Akun di dashboard.');
        }
    }
}
