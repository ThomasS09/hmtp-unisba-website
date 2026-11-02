<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    /**
     * Satu-satunya daftar kategori berita.
     * Dipakai validasi backend dan harus sama dengan daftar di frontend
     * (`components/News.tsx` + dropdown kategori di dashboard).
     */
    public const CATEGORIES = ['Kegiatan', 'Prestasi', 'Akademik', 'Sosial', 'Pengumuman', 'Organisasi', 'Lainnya'];

    protected $table = 'news';

    protected $fillable = [
        'title',
        'category',
        'date',
        'excerpt',
        'content',
        'author',
        'read_time',
        'gradient',
    ];
}
