<?php

namespace Database\Seeders;

use App\Models\ProfileItem;
use Illuminate\Database\Seeder;

/**
 * Isi awal timeline sejarah & elemen logo. Hanya menambah kalau jenisnya masih
 * kosong, jadi aman dijalankan berulang dan tidak menimpa suntingan admin.
 */
class FrontPageContentSeeder extends Seeder
{
    public function run(): void
    {
        $timeline = [
            ['1983', 'Pembentukan & Fondasi Awal', '19 September 1983 · Kampus UNISBA, Jl. Tamansari No. 1, Bandung', 'Himpunan Mahasiswa Teknik Pertambangan (HMTP) Universitas Islam Bandung resmi didirikan. Lahir dari panggilan jiwa mahasiswa yang membutuhkan wadah pergerakan solid untuk menghimpun, membina, serta mengabdi kepada almamater, bangsa, dan negara.'],
            ['Identitas', 'Perumusan Lambang Himpunan', 'Jejak Historis Abadi · Fakultas Teknik', 'Setiap lekukan dan lambang dirumuskan secara mendalam. Tujuh lekukan kerang pada lambang secara khusus menyimbolkan bahwa HMTP merupakan bagian dari Fakultas Teknik pada tahap pendirian ke-7 di UNISBA. Semangat perjuangan ini terukir abadi.'],
            ['Evolusi', 'Perjalanan & Estafet Perjuangan', 'Era Kabinet KATARA · Roda Kepemimpinan', 'Perjuangan HMTP terus diteruskan dari generasi ke generasi. Berbagai kabinet menjaga api semangat perjuangan tahun 1983 tetap menyala, beradaptasi dengan tantangan zaman demi kemajuan dunia pertambangan.'],
            ['2026+', 'Kabinet Adhikara Karsa', 'Periode Kepengurusan Baru · Masa Kini & Masa Depan', 'Melanjutkan tongkat estafet perjuangan demi mewujudkan insan pertambangan yang kompeten, religius, dan berkarakter. Menjadikan HMTP sebagai wadah pengembangan mahasiswa yang berintegritas, adaptif, progresif, dan berkelanjutan.'],
        ];

        $logo = [
            ['Palu dan Belincong', '⚒️', 'Memiliki arti disiplin ilmu pertambangan yang menjadi dasar keahlian seluruh anggota himpunan.'],
            ['Kerang Putih', '🐚', 'Melambangkan bahan galian yaitu batu gamping (limestone), dengan warna putih yang bermakna niat tulus dan luhur dalam membangun pertambangan Indonesia.'],
            ["Ka'bah / Huruf 'i'", '🕋', 'Mengartikan agama Islam sebagai asas utama dan nilai dasar yang senantiasa dipegang teguh oleh HMTP.'],
            ['Lima Garis di Atas Kerang', '☰', 'Menggambarkan rukun Islam yang menjadi pilar iman dan senantiasa mengilhami setiap langkah perjuangan HMTP.'],
            ['Tujuh Lekukan Kerang', '❼', 'Menandakan bahwa HMTP merupakan bagian dari Fakultas Teknik, yang lahir pada tahap pendirian ke-7 di Universitas Islam Bandung.'],
            ['Kotak Hitam di Belakang', '⬛', 'Memiliki arti sebagai tangga terakhir dalam pencapaian perjuangan dan dedikasi menuju puncak kemenangan.'],
            ['Warna Kuning Kebanggaan', '🟡', 'Merupakan warna kebanggaan sekaligus warna pemersatu bagi seluruh mahasiswa Teknik Pertambangan UNISBA.'],
            ['Lingkaran Hitam', '⭕', 'Menjadi lambang persatuan, kesatuan, dan persaudaraan yang erat di antara mahasiswa Teknik Pertambangan.'],
        ];

        if (! ProfileItem::where('type', 'timeline')->exists()) {
            foreach ($timeline as $i => [$heading, $subheading, $note, $body]) {
                ProfileItem::create([
                    'type' => 'timeline',
                    'heading' => $heading,
                    'subheading' => $subheading,
                    'note' => $note,
                    'body' => $body,
                    'sort_order' => $i,
                ]);
            }
        }

        if (! ProfileItem::where('type', 'logo-elemen')->exists()) {
            foreach ($logo as $i => [$heading, $icon, $body]) {
                ProfileItem::create([
                    'type' => 'logo-elemen',
                    'heading' => $heading,
                    'note' => $icon,
                    'body' => $body,
                    'sort_order' => $i,
                ]);
            }
        }
    }
}