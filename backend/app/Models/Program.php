<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Program extends Model
{
    use HasFactory;

    public const TYPES = ['Program Kerja', 'Aktivitas Kerja'];

    public const STATUSES = ['Rencana', 'Berjalan', 'Selesai'];

    protected $fillable = [
        'cabinet_id',
        'department_id',
        'name',
        'type',
        'description',
        'schedule',
        'image_path',
        'status',
    ];

    public function cabinet(): BelongsTo
    {
        return $this->belongsTo(Cabinet::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
