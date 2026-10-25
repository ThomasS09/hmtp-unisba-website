<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'category' => fake()->randomElement(['Akademik', 'Organisasi', 'Kegiatan', 'Pengumuman', 'Prestasi', 'Lainnya']),
            'date' => now()->translatedFormat('d F Y'),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(5, true),
            'author' => 'Humas HMTP',
            'read_time' => '3 menit',
            'gradient' => 'from-amber-600/30 to-yellow-500/25',
        ];
    }
}