<?php

namespace Database\Seeders;

use App\Models\Cabinet;
use App\Models\Contact;
use App\Models\Department;
use App\Models\Member;
use App\Models\ProfileItem;
use App\Models\Program;
use Illuminate\Database\Seeder;

class HmtpInitialSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Profil (Visi & Misi HMTP)
        ProfileItem::truncate();

        $visi = [
            'Kemandirian dan profesionalisme mahasiswa Teknik Pertambangan UNISBA untuk menghasilkan masyarakat yang kompeten di dunia pertambangan.',
            'Terwujudnya intelektual pertambangan yang Pejuang, Pemikir, dan Pembaharu yang bernapaskan Islam.',
        ];
        foreach ($visi as $idx => $body) {
            ProfileItem::create([
                'type' => 'visi',
                'body' => $body,
                'sort_order' => $idx + 1,
            ]);
        }

        $misi = [
            'Memberikan pelayanan secara intelektual kepada seluruh keanggotaan HMTP UNISBA.',
            'Menindaklanjuti aspirasi yang timbul dari mahasiswa Teknik Pertambangan UNISBA dalam bentuk kebijakan dan kegiatan.',
            'Meningkatkan profesionalisme dan pengetahuan mahasiswa di bidang pertambangan.',
            'Mengembangkan potensi dan kreativitas mahasiswa Teknik Pertambangan.',
        ];
        foreach ($misi as $idx => $body) {
            ProfileItem::create([
                'type' => 'misi',
                'body' => $body,
                'sort_order' => $idx + 1,
            ]);
        }

        // 2. Kabinet Adhikara Karsa
        $cabinet = Cabinet::updateOrCreate(
            ['name' => 'Adhikara Karsa', 'period' => '2026/2027'],
            [
                'is_active' => true,
                'logo_path' => null,
                'name_meaning' => 'Adhikara Karsa merupakan semboyan yang mencerminkan amanah dan tekad dalam setiap langkah kepengurusan. Adhikara bermakna kepercayaan dan tanggung jawab, sedangkan Karsa melambangkan kehendak serta semangat untuk berkarya. Dengan menjunjung integritas, kolaborasi, dan komitmen bersama, kabinet ini berkomitmen untuk mewujudkan kemajuan himpunan yang berkelanjutan.',
            ]
        );

        // 3. Bidang / Departemen (termasuk Sekum & Bendum untuk relasi proker)
        $departments = [
            ['name' => 'Sekretaris Umum', 'sort_order' => 1],
            ['name' => 'Bendahara Umum', 'sort_order' => 2],
            ['name' => 'Bidang Kesekretariatan', 'sort_order' => 3],
            ['name' => 'Bidang Medkominfo', 'sort_order' => 4],
            ['name' => 'Bidang Kaderisasi', 'sort_order' => 5],
            ['name' => 'Bidang Intrakampus', 'sort_order' => 6],
            ['name' => 'Bidang Ekstrakampus', 'sort_order' => 7],
            ['name' => 'Bidang Kewirausahaan', 'sort_order' => 8],
            ['name' => 'Bidang Sosial dan Keagamaan', 'sort_order' => 9],
            ['name' => 'Bidang Seni dan Olahraga', 'sort_order' => 10],
            ['name' => 'Bidang Keilmuan dan Keprofesian', 'sort_order' => 11],
        ];

        $deptMap = [];
        foreach ($departments as $d) {
            $dept = Department::updateOrCreate(
                ['name' => $d['name']],
                ['sort_order' => $d['sort_order']]
            );
            $deptMap[$d['name']] = $dept->id;
        }

        // 4. Struktur Pengurus (14 orang)
        Member::where('cabinet_id', $cabinet->id)->delete();

        $members = [
            // Pengurus Inti (5 orang)
            [
                'kelompok' => 'Pengurus Inti',
                'position' => 'Ketua Himpunan',
                'name' => 'Farrel Danandyaka Hidayat',
                'npm' => '10070123029',
                'department_id' => null,
                'photo_path' => 'pengurus/farrel-danandyaka-hidayat.jpg',
                'sort_order' => 1,
            ],
            [
                'kelompok' => 'Pengurus Inti',
                'position' => 'Wakil Ketua Himpunan',
                'name' => 'Amie Gusti Heryono',
                'npm' => '10070123048',
                'department_id' => null,
                'photo_path' => 'pengurus/amie-gusti-heryono.jpg',
                'sort_order' => 2,
            ],
            [
                'kelompok' => 'Pengurus Inti',
                'position' => 'Sekretaris Umum',
                'name' => 'Inggit Ravanda Inezza',
                'npm' => '10070123071',
                'department_id' => $deptMap['Sekretaris Umum'],
                'photo_path' => 'pengurus/inggit-ravanda-inezza.jpg',
                'sort_order' => 3,
            ],
            [
                'kelompok' => 'Pengurus Inti',
                'position' => 'Bendahara Umum 1',
                'name' => 'Nasywa Aulia',
                'npm' => '10070123094',
                'department_id' => $deptMap['Bendahara Umum'],
                'photo_path' => 'pengurus/nasywa-aulia.jpg',
                'sort_order' => 4,
            ],
            [
                'kelompok' => 'Pengurus Inti',
                'position' => 'Bendahara Umum 2',
                'name' => 'Andara Fasha Cendikia',
                'npm' => '10070124063',
                'department_id' => $deptMap['Bendahara Umum'],
                'photo_path' => 'pengurus/andara-fasha-cendikia.jpg',
                'sort_order' => 5,
            ],
            // Ketua Bidang (9 orang)
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Kesekretariatan',
                'name' => 'Niken Sinondang',
                'npm' => '10070123075',
                'department_id' => $deptMap['Bidang Kesekretariatan'],
                'photo_path' => 'pengurus/niken-sinondang.jpg',
                'sort_order' => 6,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Medkominfo',
                'name' => 'Bagas Ibrahim',
                'npm' => '10070123074',
                'department_id' => $deptMap['Bidang Medkominfo'],
                'photo_path' => 'pengurus/bagas-ibrahim.jpg',
                'sort_order' => 7,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Kaderisasi',
                'name' => 'Muhammad Fadhil Gunawan',
                'npm' => '10070123028',
                'department_id' => $deptMap['Bidang Kaderisasi'],
                'photo_path' => 'pengurus/muhammad-fadhil-gunawan.jpg',
                'sort_order' => 8,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Intrakampus',
                'name' => 'Muhammad Rasyaad',
                'npm' => '10070123109',
                'department_id' => $deptMap['Bidang Intrakampus'],
                'photo_path' => 'pengurus/muhammad-rasyaad.jpg',
                'sort_order' => 9,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Ekstrakampus',
                'name' => 'Ihda Muhamad',
                'npm' => '10070123080',
                'department_id' => $deptMap['Bidang Ekstrakampus'],
                'photo_path' => 'pengurus/ihda-muhamad.jpg',
                'sort_order' => 10,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Kewirausahaan',
                'name' => 'M Rizqi Khairan',
                'npm' => '10070123107',
                'department_id' => $deptMap['Bidang Kewirausahaan'],
                'photo_path' => 'pengurus/m-rizqi-khairan.jpg',
                'sort_order' => 11,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Sosial dan Keagamaan',
                'name' => 'M. Eric Kantona W',
                'npm' => '10070123095',
                'department_id' => $deptMap['Bidang Sosial dan Keagamaan'],
                'photo_path' => 'pengurus/m-eric-kantona-w.jpg',
                'sort_order' => 12,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Seni dan Olahraga',
                'name' => 'S Guntur Ramadhan',
                'npm' => '10070123042',
                'department_id' => $deptMap['Bidang Seni dan Olahraga'],
                'photo_path' => 'pengurus/s-guntur-ramadhan.jpg',
                'sort_order' => 13,
            ],
            [
                'kelompok' => 'Ketua Bidang',
                'position' => 'Ketua Bidang Keilmuan dan Keprofesian',
                'name' => 'Daffatama Putra',
                'npm' => '10070123072',
                'department_id' => $deptMap['Bidang Keilmuan dan Keprofesian'],
                'photo_path' => 'pengurus/daffatama-putra.jpg',
                'sort_order' => 14,
            ],
        ];

        foreach ($members as $m) {
            Member::create(array_merge($m, ['cabinet_id' => $cabinet->id]));
        }

        // 5. Proker & Aker (48 kegiatan dari dokumen 3.4)
        Program::where('cabinet_id', $cabinet->id)->delete();

        $programs = [
            // 3.4.1 Sekretaris Umum
            ['Sekretaris Umum', 'Monthly Coordination Forum', 'Aktivitas Kerja', null],
            ['Sekretaris Umum', 'Administrative Governance', 'Aktivitas Kerja', null],

            // 3.4.2 Bendahara Umum
            ['Bendahara Umum', 'Budget & Treasury Coordination', 'Aktivitas Kerja', null],
            ['Bendahara Umum', 'Financial Accountability & Transparency', 'Aktivitas Kerja', null],

            // 3.4.3 Bidang Kesekretariatan
            ['Bidang Kesekretariatan', 'ASTRO (Agenda Sinkronisasi & Timeline Rencana Organisasi)', 'Program Kerja', null],
            ['Bidang Kesekretariatan', 'Revitalisasi Benteng', 'Program Kerja', null],
            ['Bidang Kesekretariatan', 'Pendataan Inventaris Himpunan', 'Aktivitas Kerja', null],
            ['Bidang Kesekretariatan', 'Mading Organisasi', 'Aktivitas Kerja', null],
            ['Bidang Kesekretariatan', 'Pendataan Surat-Menyurat, Proposal, serta LPJ', 'Aktivitas Kerja', null],
            ['Bidang Kesekretariatan', 'Staff of The Month', 'Aktivitas Kerja', null],

            // 3.4.4 Bidang Medkominfo
            ['Bidang Medkominfo', 'Booklet HMTP', 'Program Kerja', null],
            ['Bidang Medkominfo', 'Jakun Story Competition', 'Program Kerja', null],
            [
                'Bidang Medkominfo',
                'HMTP One Data (HMTP Digital)',
                'Program Kerja',
                'Program pengelolaan data organisasi HMTP dalam satu sistem terintegrasi yang mencakup database anggota, dokumentasi kegiatan, dan arsip administrasi agar lebih rapi, mudah diakses, dan efisien.',
            ],
            ['Bidang Medkominfo', 'Publikasi dan Dokumentasi', 'Aktivitas Kerja', null],

            // 3.4.5 Bidang Kaderisasi
            ['Bidang Kaderisasi', 'PPMB (Program Pembinaan Mahasiswa Baru)', 'Program Kerja', null],
            ['Bidang Kaderisasi', 'Jakun Day', 'Aktivitas Kerja', null],
            ['Bidang Kaderisasi', 'Magang Himpunan', 'Aktivitas Kerja', null],
            ['Bidang Kaderisasi', 'SINGKATAN', 'Aktivitas Kerja', null],
            ['Bidang Kaderisasi', 'Kaderisasi Calon Ketua Kepengurusan', 'Aktivitas Kerja', null],
            ['Bidang Kaderisasi', 'Mine Map', 'Aktivitas Kerja', null],

            // 3.4.6 Bidang Intrakampus
            ['Bidang Intrakampus', 'HMTP Anniversary', 'Program Kerja', null],
            ['Bidang Intrakampus', 'Mine Graduate', 'Program Kerja', null],
            ['Bidang Intrakampus', 'PIT (Performance & Integrity Tracking)', 'Aktivitas Kerja', null],
            ['Bidang Intrakampus', 'SEAM (Student Excellence, Administration, and Mastery)', 'Aktivitas Kerja', null],
            ['Bidang Intrakampus', 'TRACK (Tambang Relation & Collaboration Knowledge)', 'Aktivitas Kerja', null],
            ['Bidang Intrakampus', 'ORE (Objective Response & Empowerment)', 'Aktivitas Kerja', null],

            // 3.4.7 Bidang Ekstrakampus
            ['Bidang Ekstrakampus', 'Company Visit', 'Program Kerja', null],
            ['Bidang Ekstrakampus', 'Stuban', 'Aktivitas Kerja', null],
            ['Bidang Ekstrakampus', 'Cermat', 'Aktivitas Kerja', null],
            [
                'Bidang Ekstrakampus',
                'Mining Talk (Seminar Keprofesian)',
                'Aktivitas Kerja',
                'Forum diskusi dan berbagi pengalaman bersama praktisi, alumni, dan akademisi yang membahas perkembangan isu serta tantangan terkini di dunia pertambangan untuk meningkatkan wawasan keprofesian mahasiswa.',
            ],

            // 3.4.8 Bidang Kewirausahaan
            ['Bidang Kewirausahaan', 'Penyediaan Jaket Kuning', 'Program Kerja', null],
            ['Bidang Kewirausahaan', 'Penyediaan Jas Laboratorium', 'Program Kerja', null],
            ['Bidang Kewirausahaan', 'MINE (Merchandise Inovatif & Identitas Engineering)', 'Aktivitas Kerja', null],
            ['Bidang Kewirausahaan', 'HMTP Apparel', 'Aktivitas Kerja', null],
            ['Bidang Kewirausahaan', 'P3 (Perlengkapan Perkuliahan & Praktikum)', 'Aktivitas Kerja', null],

            // 3.4.9 Bidang Sosial dan Keagamaan
            ['Bidang Sosial dan Keagamaan', 'GRANIT (Gema Ramadhan Iman dan Taqwa)', 'Program Kerja', null],
            ['Bidang Sosial dan Keagamaan', 'HMTP Peduli', 'Program Kerja', null],
            ['Bidang Sosial dan Keagamaan', 'Artikel Islami', 'Aktivitas Kerja', null],
            ['Bidang Sosial dan Keagamaan', 'Sedekah Jumat', 'Aktivitas Kerja', null],
            ['Bidang Sosial dan Keagamaan', 'HMTP Berbagi', 'Aktivitas Kerja', null],

            // 3.4.10 Bidang Seni dan Olahraga
            ['Bidang Seni dan Olahraga', 'PORSETA (Pekan Olahraga Seni Tambang)', 'Program Kerja', null],
            ['Bidang Seni dan Olahraga', 'MFC (Mining Futsal Championship)', 'Program Kerja', null],
            ['Bidang Seni dan Olahraga', 'Sebat (Sehat Bareng Anak Tambang)', 'Aktivitas Kerja', null],
            ['Bidang Seni dan Olahraga', 'CINERGY (Cinema + Synergy)', 'Aktivitas Kerja', null],
            ['Bidang Seni dan Olahraga', 'AKAR (Aktualisasi, Kompetisi, Apresiasi, dan Rekreasi)', 'Aktivitas Kerja', null],

            // 3.4.11 Bidang Keilmuan dan Keprofesian
            ['Bidang Keilmuan dan Keprofesian', 'U MINE FEST', 'Program Kerja', null],
            ['Bidang Keilmuan dan Keprofesian', 'MCU (Mining Class Upgrading)', 'Aktivitas Kerja', null],
            [
                'Bidang Keilmuan dan Keprofesian',
                'FORTA (Forum Riset Tambang)',
                'Aktivitas Kerja',
                'Forum riset mahasiswa yang berfokus pada kajian isu pertambangan terkini melalui kolaborasi dengan dosen, mahasiswa, dan himpunan lain, dengan luaran berupa paper atau kajian ilmiah yang dapat dipublikasikan.',
            ],
            [
                'Bidang Keilmuan dan Keprofesian',
                'MASTA (Mining Software Training Academy)',
                'Aktivitas Kerja',
                'Program penguatan keterampilan perangkat lunak pertambangan untuk menunjang praktikum dan pengembangan kompetensi di luar perkuliahan, guna membentuk mahasiswa yang adaptif terhadap teknologi industri tambang.',
            ],
        ];

        foreach ($programs as $p) {
            [$deptName, $progName, $type, $desc] = $p;
            Program::create([
                'cabinet_id' => $cabinet->id,
                'department_id' => $deptMap[$deptName],
                'name' => $progName,
                'type' => $type,
                'description' => $desc,
                'schedule' => null,
                'image_path' => null,
                'status' => 'Rencana',
            ]);
        }

        // 6. Kontak (satu baris)
        Contact::truncate();
        Contact::create([
            'website' => 'HMTPUNISBA.com',
            'email' => 'hmtp.adhikarakarsa@gmail.com',
            'instagram' => '@hmtpunisba',
            'tiktok' => '@hmtp.unisba',
            'youtube' => '@hmtpunisba',
        ]);
    }
}
