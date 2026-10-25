<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileItem extends Model
{
    use HasFactory;

    public const TYPES = ['visi', 'misi'];

    protected $fillable = [
        'type',
        'body',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
