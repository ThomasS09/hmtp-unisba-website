<?php

/*
 * Pesan validasi bahasa Indonesia.
 *
 * Laravel hanya menyediakan berkas bahasa Inggris (`lang/en`). Tanpa terjemahan ini
 * pengurus melihat teks mentah seperti "The npm field must not be greater than 50
 * characters." di dashboard. Kunci di bawah adalah yang benar-benar dipakai
 * controller HMTP; tambahkan kunci baru di sini kalau ada aturan validasi baru.
 */

return [
    'required' => ':attribute wajib diisi.',
    'string' => ':attribute harus berupa teks.',
    'integer' => ':attribute harus berupa angka.',
    'numeric' => ':attribute harus berupa angka.',
    'boolean' => ':attribute harus bernilai ya atau tidak.',
    'array' => ':attribute harus berupa daftar.',
    'email' => 'Format :attribute tidak valid.',
    'url' => 'Format :attribute harus berupa tautan.',
    'date' => ':attribute bukan tanggal yang valid.',
    'confirmed' => 'Konfirmasi :attribute tidak sama.',
    'unique' => ':attribute sudah dipakai.',
    'exists' => ':attribute yang dipilih tidak ditemukan.',
    'in' => ':attribute yang dipilih tidak valid.',
    'image' => ':attribute harus berupa gambar.',
    'file' => ':attribute harus berupa berkas.',
    'mimes' => ':attribute harus berjenis :values.',
    'regex' => 'Format :attribute tidak sesuai.',

    'min' => [
        'numeric' => ':attribute minimal :min.',
        'file' => ':attribute minimal :min kilobyte.',
        'string' => ':attribute minimal :min karakter.',
        'array' => ':attribute minimal berisi :min item.',
    ],
    'max' => [
        'numeric' => ':attribute maksimal :min.',
        'file' => 'Ukuran :attribute maksimal :max kilobyte.',
        'string' => ':attribute maksimal :max karakter.',
        'array' => ':attribute maksimal berisi :max item.',
    ],
    'between' => [
        'numeric' => ':attribute harus antara :min sampai :max.',
        'file' => 'Ukuran :attribute harus antara :min sampai :max kilobyte.',
        'string' => ':attribute harus antara :min sampai :max karakter.',
        'array' => ':attribute harus berisi antara :min sampai :max item.',
    ],

    'attributes' => [
        'name' => 'nama',
        'position' => 'jabatan',
        'npm' => 'NPM',
        'kelompok' => 'kelompok',
        'department_id' => 'bidang',
        'cabinet_id' => 'kabinet',
        'sort_order' => 'urutan tampil',
        'photo' => 'foto',
        'image' => 'gambar',
        'type' => 'jenis',
        'status' => 'status',
        'description' => 'deskripsi',
        'schedule' => 'jadwal',
        'period' => 'periode',
        'name_meaning' => 'makna nama kabinet',
        'logo' => 'logo',
        'email' => 'email',
        'website' => 'website',
        'instagram' => 'Instagram',
        'tiktok' => 'TikTok',
        'youtube' => 'YouTube',
        'category' => 'kategori',
        'message' => 'pesan',
        'is_anonymous' => 'kirim sebagai anonim',
        'nim' => 'NIM',
        'current_password' => 'password lama',
        'password' => 'password baru',
        'password_confirmation' => 'konfirmasi password baru',
        'body' => 'isi',
        'title' => 'judul',
        'author' => 'penulis',
        'excerpt' => 'ringkasan',
        'content' => 'isi berita',
        'read_time' => 'waktu baca',
        'per_page' => 'jumlah per halaman',
    ],
];
