<?php

namespace Database\Factories;

use App\Models\Aspiration;
use Illuminate\Database\Eloquent\Factories\Factory;

class AspirationFactory extends Factory
{
    protected $model = Aspiration::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'nim' => fake()->numerify('##########'),
            'category' => fake()->randomElement(['Akademik', 'Fasilitas', 'Organisasi', 'Lainnya']),
            'message' => fake()->paragraph(2),
            'status' => fake()->randomElement(['Pending', 'Selesai', 'Arsip']),
        ];
    }
}
