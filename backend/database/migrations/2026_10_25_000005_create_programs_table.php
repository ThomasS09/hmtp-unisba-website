<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabinet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // 'Program Kerja' | 'Aktivitas Kerja'
            $table->text('description')->nullable();
            $table->string('schedule')->nullable();
            $table->string('image_path')->nullable();
            $table->string('status')->default('Rencana'); // 'Rencana' | 'Berjalan' | 'Selesai'
            $table->timestamps();

            $table->index(['cabinet_id', 'status']);
            $table->index(['department_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
