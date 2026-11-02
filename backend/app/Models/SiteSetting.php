<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Teks bawaan beranda. Kalau baris di database kosong/belum ada, nilai ini
     * yang dipakai — jadi halaman tidak pernah tampil kosong.
     */
    public const DEFAULTS = [
        'hero_badge' => 'Website Resmi HMTP UNISBA',
        'hero_title' => 'HMTP UNISBA',
        'hero_desc' => 'Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung. Media informasi resmi, publikasi kegiatan, dan wadah komunikasi organisasi tambang.',
        'hero_cta_primary' => 'Jelajahi Profil',
        'hero_cta_secondary' => 'Program Kerja',
    ];

    /** Key yang boleh diubah admin (juga dipakai validasi). */
    public static function keys(): array
    {
        return array_keys(self::DEFAULTS);
    }

    /** Gabungan default + nilai tersimpan, siap dipakai frontend. */
    public static function values(): array
    {
        $stored = self::whereIn('key', self::keys())->pluck('value', 'key')->all();
        $out = [];

        foreach (self::DEFAULTS as $key => $default) {
            $value = $stored[$key] ?? null;
            $out[$key] = ($value === null || trim($value) === '') ? $default : $value;
        }

        return $out;
    }
}