<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Butir profil tidak hanya satu kolom teks: timeline sejarah butuh tahun,
 * judul, keterangan; kartu arti logo butuh judul + isi. Kolom tambahan ini
 * opsional sehingga butir visi/misi/narasi tidak terpengaruh.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profile_items', function (Blueprint $table) {
            $table->string('heading', 120)->nullable()->after('type');
            $table->string('subheading', 160)->nullable()->after('heading');
            $table->string('note', 200)->nullable()->after('subheading');
        });
    }

    public function down(): void
    {
        Schema::table('profile_items', function (Blueprint $table) {
            $table->dropColumn(['heading', 'subheading', 'note']);
        });
    }
};