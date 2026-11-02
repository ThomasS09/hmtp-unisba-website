# Website HMTP UNISBA

Situs resmi Himpunan Mahasiswa Teknik Pertambangan UNISBA + dashboard admin
untuk mengelola seluruh isi website.

- `backend/` — Laravel 12 (REST API, Sanctum)
- `frontend/` — React + TypeScript + Vite + Tailwind

---

## 1. Menjalankan di komputer lokal

Prasyarat: PHP 8.2+, Composer, Node.js 20+, MySQL.

### Backend

```bash
cd backend
cp .env.example .env          # lalu isi DB_* dan APP_KEY
php artisan key:generate
php artisan migrate --seed     # bikin tabel + isi data awal
php artisan storage:link       # foto yang diunggah bisa dibuka publik
php artisan serve --port=8000
```

Catatan: di mesin pengembangan ini Composer global rusak, jadi dipakai
`php backend/composer.phar` (file tersebut tidak di-commit, sudah masuk `.gitignore`).

### Frontend

```bash
cd frontend
cp .env.example .env           # VITE_API_URL=http://localhost:8000/api
npm install
npm run dev                    # http://localhost:3000
```

### Perintah pemeriksaan

```bash
cd backend && php artisan test        # 68 test
cd frontend && npx vitest run         # 18 test
cd frontend && npm run typecheck && npm run lint && npm run build
```

Semua perintah di atas dijalankan otomatis oleh GitHub Actions
(`.github/workflows/cicd.yml`) setiap push ke `main`/`develop`.

---

## 2. Akun admin

- URL dashboard: `/admin/dashboard` (login di `/admin/login`)
- Email: `admin@hmtpunisba.or.id`
- Password awal dari seeder: `Adhikara2026!`

**Ganti password ini** lewat menu **Akun** di dashboard. Seed ulang tidak akan
menimpa password yang sudah diganti. Untuk memasang password sendiri sejak awal,
set `ADMIN_PASSWORD=...` di `.env` sebelum `php artisan db:seed`.

---

## 3. Panduan pengurus (isi dashboard)

| Menu | Isi yang dikelola |
| --- | --- |
| Ringkasan | Statistik singkat + aktivitas terbaru |
| Beranda | Teks paling atas halaman depan: label, judul, deskripsi, nama dua tombol (kosong = teks bawaan) |
| Kotak Aspirasi | Aspirasi masuk dari website/Google Form, ubah status, hapus. Angka di tab = jumlah yang belum dijawab |
| Kelola Berita & Artikel | Tulis/ubah/hapus berita |
| Profil & Narasi | 7 jenis isi: Sejarah, Arti Logo, Sambutan, Visi, Misi, Timeline Sejarah, Elemen Logo |
| Kabinet | Nama kabinet + logo |
| Bidang | Daftar bidang/departemen |
| Pengurus | Data pengurus + foto |
| Program Kerja | Daftar proker per bidang |
| Kontak & Medsos | Alamat, email, Instagram, dsb. |
| Akun | Ganti password admin |

Semua perubahan langsung tampil di website publik tanpa build ulang; kolom yang
dikosongkan otomatis kembali ke teks bawaan, jadi halaman tidak bisa jadi kosong.
Peta blok halaman depan → tab admin ada di `PANDUAN_ADMIN.md` (dokumen untuk
pengurus, bukan developer).

Tidak ada email otomatis: aspirasi baru hanya muncul di Kotak Aspirasi (jumlah
belum dijawab terlihat di tab menu), jadi tidak ada SMTP yang perlu diatur.

---

## 4. Checklist sebelum dipasang di hosting

1. Backend: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` = domain asli.
2. `DB_CONNECTION=mysql` + kredensial database produksi (bukan `root` kosong).
3. `CORS_ALLOWED_ORIGINS=https://hmtpunisba.or.id,https://www.hmtpunisba.or.id`
   (jangan `*`).
4. `php artisan config:cache route:cache` lalu `php artisan migrate --force`.
5. `php artisan storage:link` di server; folder `storage/app/public` harus bisa ditulis.
6. Frontend: salin `frontend/.env.production.example` → `.env.production`, isi
   `VITE_API_URL=https://api.hmtpunisba.or.id/api`, lalu `npm run build`.
   Hasil build ada di `frontend/dist/`.
7. Ganti password admin bawaan.
8. Jangan commit `.env` (sudah di-`.gitignore`).
9. **Nginx/Apache**: rute React (`/admin/dashboard`, `/kebijakan-privasi`) harus
   diarahkan ke `index.html` (`try_files $uri $uri/ /index.html;`). Tanpa itu,
   refresh di rute tersebut menghasilkan 404.
10. Jalankan lewat PHP-FPM, bukan `php artisan serve` (server bawaan melayani
    satu permintaan sekaligus → dashboard terasa lambat).

Langkah lengkap + contoh konfigurasi Nginx: `docs/DEPLOY.md`.

---

## 5. Berkas di luar repo

- Arsip foto asli pengurus (`Foto_Pengurus_HMTP_2026-2027.zip`, 42 MB) disimpan di
  `Documents/hmtp-assets/`. Yang sudah diunggah ke website ada di
  `backend/storage/app/public/pengurus/`.
- `backend/composer.phar` hanya alat lokal, tidak di-commit.

---

## 6. Dokumen lain

| Berkas | Untuk siapa | Isi |
| --- | --- | --- |
| `PANDUAN_ADMIN.md` | Pengurus (non-teknis) | Peta 8 blok halaman depan → tab admin, urutan kerja, aturan anti-kacau |
| `docs/DEPLOY.md` | Developer/hosting | Konfigurasi Nginx, PHP-FPM, OPcache, checklist verifikasi setelah deploy |
| `backend/openapi.yaml` | Developer | Kontrak 22 endpoint API |
| `tasks/todo.md` | Developer | Riwayat pekerjaan + bukti uji per task |
| `TEST_PLAN.md` | Developer | Rencana pengujian manual |
