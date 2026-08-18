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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('date');
            $table->text('excerpt');
            $table->longText('content')->nullable();
            $table->string('author')->default('Humas HMTP');
            $table->string('read_time')->default('5 menit');
            $table->string('gradient')->default('from-amber-600/30 to-yellow-500/25');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
