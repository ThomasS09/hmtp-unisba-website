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
cd backend && php artisan test        # 37 test
cd frontend && npm test -- --run      # 2 test
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
| Kotak Aspirasi | Aspirasi masuk dari website/Google Form, ubah status, hapus. Angka di tab = jumlah yang belum dijawab |
| Kelola Berita & Artikel | Tulis/ubah/hapus berita |
| Profil & Visi Misi | Profil himpunan, visi, misi |
| Kabinet | Nama kabinet + logo |
| Bidang | Daftar bidang/departemen |
| Pengurus | Data pengurus + foto |
| Program Kerja | Daftar proker per bidang |
| Kontak & Medsos | Alamat, email, Instagram, dsb. |
| Akun | Ganti password admin |

Semua perubahan langsung tampil di website publik. Tidak ada email otomatis:
aspirasi baru hanya muncul di Kotak Aspirasi (jumlah belum dijawab terlihat di
tab menu), jadi tidak ada SMTP yang perlu diatur.

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

Urutan pemasangan terperinci akan ditulis di `docs/DEPLOY.md` saat hosting diputuskan.

---

## 5. Berkas di luar repo

- Arsip foto asli pengurus (`Foto_Pengurus_HMTP_2026-2027.zip`, 42 MB) disimpan di
  `Documents/hmtp-assets/`. Yang sudah diunggah ke website ada di
  `backend/storage/app/public/pengurus/`.
- `backend/composer.phar` hanya alat lokal, tidak di-commit.
