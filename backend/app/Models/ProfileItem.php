<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileItem extends Model
{
    use HasFactory;

    public const TYPES = ['visi', 'misi', 'sejarah', 'logo', 'sambutan'];

    // Label yang dipakai admin, supaya tidak perlu menebak nama jenis.
    public const LABELS = [
        'visi' => 'Visi',
        'misi' => 'Misi',
        'sejarah' => 'Sejarah',
        'logo' => 'Arti Logo',
        'sambutan' => 'Sambutan Kabinet',
    ];

    protected $fillable = [
        'type',
        'body',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
