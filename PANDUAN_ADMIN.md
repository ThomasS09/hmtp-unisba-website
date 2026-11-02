# Panduan Mengurus Website HMTP UNISBA

Halaman depan terdiri dari 8 blok berurutan. Setiap blok punya SATU tempat
pengisian di admin. Kalau bingung mengubah sesuatu, cari bloknya di tabel ini,
jangan cari di kode.

## Peta blok halaman depan → tab admin

| No | Blok di halaman depan | Diisi dari tab admin | Yang diisi |
|----|----------------------|----------------------|------------|
| 1 | Beranda (atas, nama himpunan + tombol) | **Beranda** | Label, judul, deskripsi, nama 2 tombol |
| 2 | Sejarah | Profil & Narasi → **Sejarah** + **Timeline Sejarah** | Paragraf pembuka + kartu perjalanan sejarah (tahun, judul, tanggal/lokasi, deskripsi) |
| 3 | Arti Logo | Profil & Narasi → **Arti Logo** + **Elemen Logo** | Paragraf pembuka + kartu arti lambang (nama, emoji ikon, arti) |
| 4 | Visi & Misi | Profil & Narasi → **Visi** / **Misi** | Butir visi & misi |
| 5 | Kabinet & Struktur | Kabinet (nama + periode) + Profil & Narasi → **Sambutan** + Pengurus + Bidang | Nama kabinet, sambutan, foto & jabatan pengurus, daftar bidang |
| 6 | Program Kerja | Proker & Aker | Nama proker/aker, bidang, status |
| 7 | Berita & Artikel | Kelola Berita & Artikel | Judul, kategori, isi, gambar |
| 8 | Aspirasi & Kontak | Kontak & Medsos (+ Kotak Aspirasi untuk pesan masuk) | Alamat, email, telepon, Instagram, WhatsApp |

Catatan: isi yang **kosong** akan menampilkan teks bawaan program. Jadi kalau
salah, cukup kosongkan / isi ulang — halaman tidak akan rusak.

## Urutan kerja yang aman (sekali setup, 7 langkah)

1. **Kabinet** — isi nama kabinet + periode (contoh: "Adhikara Karsa", "2026/2027").
2. **Profil & Narasi → Sambutan** — 1 paragraf tentang kabinet yang menjabat.
3. **Profil & Narasi → Visi** lalu **Misi** — satu butir satu kalimat.
4. **Bidang** — daftar bidang kerja (Kesekretariatan, Medkominfo, dst).
5. **Pengurus** — foto, nama, jabatan, kelompok (Pengurus Inti / Ketua Bidang).
6. **Proker & Aker** — program kerja per bidang.
7. **Kontak & Medsos** — jalan terakhir, lalu cek halaman depan.

## Aturan supaya tidak kacau lagi

- Satu blok halaman = satu tab. Tidak ada teks yang diubah di dua tempat.
- Ubah satu hal, simpan, lalu lihat halaman depan. Jangan ubah 5 tab sekaligus.
- Tombol **Hapus** hanya untuk butir yang salah, bukan untuk merapikan.
- Setelah simpan, halaman depan memakai data terbaru tanpa perlu build ulang.
- Kalau halaman tampak "kosong" setelah perubahan: hard reload (Ctrl+Shift+R)
  — browser kadang masih menyimpan versi lama.
- Kalau admin bilang "Tidak bisa menghubungi server", berarti backend mati.
  Nyalakan `php artisan serve` di folder `backend`.

## Sudah semua bisa diubah dari admin

Seluruh teks 8 blok di atas kini ada tempatnya di admin.
Halaman Kebijakan Privasi otomatis memakai email dari tab Kontak & Medsos,
jadi tidak perlu diubah terpisah. Yang tetap di kode
hanya urutan blok dan desain tampilan — bukan isi.

Tombol "Hapus" pada Beranda/Timeline/Elemen Logo tidak ada; kosongkan kolomnya
maka halaman otomatis memakai teks bawaan.