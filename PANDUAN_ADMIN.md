# Panduan Mengurus Website HMTP UNISBA

Halaman depan terdiri dari 8 blok berurutan. Setiap blok punya SATU tempat
pengisian di admin. Kalau bingung mengubah sesuatu, cari bloknya di tabel ini,
jangan cari di kode.

## Peta blok halaman depan → tab admin

| No | Blok di halaman depan | Diisi dari tab admin | Yang diisi |
|----|----------------------|----------------------|------------|
| 1 | Beranda (atas, nama himpunan + tombol) | — (teks tetap) | Nama & tagline himpunan |
| 2 | Sejarah | Profil & Narasi → **Sejarah** | Paragraf pembuka sejarah |
| 3 | Arti Logo | Profil & Narasi → **Arti Logo** | Paragraf pembuka arti logo |
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

## Yang masih teks tetap (belum bisa diubah dari admin)

- Teks Beranda (nama himpunan, tombol "Kenali Kami").
- Timeline tahun pada blok Sejarah (1983 dst).
- 4 kartu elemen logo (Palu & Belincong, Kerang Putih, dst).

Bilang ke developer kalau salah satu dari ini juga perlu bisa diganti.