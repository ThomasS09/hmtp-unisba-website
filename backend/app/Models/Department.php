<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        // Slug diturunkan dari nama biar admin cukup mengisi nama bidang.
        static::saving(function (Department $department) {
            $department->slug = Str::slug($department->name);
        });
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }
}
