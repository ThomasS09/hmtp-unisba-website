<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Kolom type awalnya varchar(10) — tidak cukup untuk 'logo-elemen' (11 huruf)
 * dan jenis baru lain. Lebarkan tanpa menyentuh data lama.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profile_items', function (Blueprint $table) {
            $table->string('type', 20)->change();
        });
    }

    public function down(): void
    {
        Schema::table('profile_items', function (Blueprint $table) {
            $table->string('type', 10)->change();
        });
    }
};