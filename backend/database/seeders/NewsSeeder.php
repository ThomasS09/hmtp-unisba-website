<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Kunjungan Industri Tambang 2026: Memahami Operasi Lapangan Secara Langsung',
                'category' => 'Kegiatan',
                'date' => '15 Juli 2026',
                'excerpt' => 'Mahasiswa Teknik Pertambangan UNISBA melakukan kunjungan industri lapangan untuk mempelajari teknologi penambangan terbuka secara langsung dan berkelanjutan.',
                'content' => 'Mahasiswa Teknik Pertambangan UNISBA sukses menyelenggarakan Kunjungan Industri Tambang 2026. Kegiatan ini bertujuan untuk menyelaraskan pemahaman teori perkuliahan dengan realita dunia kerja di lokasi tambang terbuka.',
                'author' => 'Humas HMTP',
                'read_time' => '5 menit',
                'gradient' => 'from-amber-600/30 to-yellow-500/25',
            ],
            [
                'title' => 'Delegasi HMTP UNISBA Sabet Juara Umum di National Mining Competition VII',
                'category' => 'Prestasi',
                'date' => '28 Juni 2026',
                'excerpt' => 'HMTP UNISBA berhasil membawa pulang piala juara umum pada ajang kompetisi keprofesian tambang nasional mengalahkan puluhan universitas besar lainnya.',
                'content' => 'Prestasi membanggakan kembali diraih oleh mahasiswa Teknik Pertambangan UNISBA. Delegasi HMTP meraih Juara Umum di National Mining Competition VII setelah menjuarai cabang Blasting Competition, Panning, dan Mine Plan Design.',
                'author' => 'Departemen Seni & Olahraga',
                'read_time' => '4 menit',
                'gradient' => 'from-yellow-500/35 to-amber-700/20',
            ],
            [
                'title' => 'Seminar Keprofesian: Peran Insinyur Tambang dalam Era Transisi Energi Hijau',
                'category' => 'Akademik',
                'date' => '12 Mei 2026',
                'excerpt' => 'Mengupas tantangan dekarbonisasi dan implementasi teknologi ramah lingkungan di industri pertambangan demi kelestarian alam nusantara.',
                'content' => 'Seminar nasional keprofesian Teknik Pertambangan UNISBA menghadirkan pakar industri dan akademisi untuk mendiskusikan Good Mining Practice dan penambangan komoditas kritis pendukung transisi energi.',
                'author' => 'Bidang Keilmuan',
                'read_time' => '6 menit',
                'gradient' => 'from-zinc-700/40 to-neutral-800/40',
            ],
            [
                'title' => 'Bakti Sosial HMTP Peduli: Menyalurkan Bantuan untuk Warga Lingkar Tambang',
                'category' => 'Sosial',
                'date' => '20 April 2026',
                'excerpt' => 'Sebagai bentuk pengabdian kepada masyarakat, mahasiswa pertambangan membagikan sembako dan menyelenggarakan posko kesehatan gratis.',
                'content' => 'HMTP UNISBA menggelar program HMTP Peduli dengan membagikan paket sembako, pemeriksaan kesehatan gratis, serta edukasi lingkungan bagi warga setempat.',
                'author' => 'Departemen Sosial & Keagamaan',
                'read_time' => '3 menit',
                'gradient' => 'from-amber-700/30 to-yellow-600/20',
            ],
        ];

        foreach ($articles as $article) {
            News::create($article);
        }
    }
}
