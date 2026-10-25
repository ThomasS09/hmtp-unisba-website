# HMTP UNISBA Website - Task Checklist

## Phase 1: Foundation & Safety (P0)

- [x] Task 1: TypeScript Migration Frontend
- [x] Task 2: React Error Boundaries Implementation
- [x] Task 3: Backend Rate Limiting & API Protection

### Checkpoint: Phase 1 Complete
- [x] TypeScript compilation clean
- [x] Error boundaries functional
- [x] Rate limiting active on backend
- [x] All existing features still work
- [ ] Review with human before proceeding

---

## Phase 2: Testing & Data Integrity (P1)

- [x] Task 4: Frontend Unit Testing Setup (Jest)
- [x] Task 5: Backend PHPUnit Testing Setup
- [x] Task 6: Enhanced Input Validation & Security

### Checkpoint: Phase 2 Complete
- [x] Frontend test suite > 70% coverage
- [x] Backend test suite > 80% coverage
- [x] Input validation robust and tested
- [x] All security measures active
- [ ] Review with human before proceeding

---

## Phase 3: Scalability & User Experience (P2)

- [x] Task 7: Backend Pagination Implementation
- [x] Task 8: Email Notification System
- [x] Task 9: Admin Dashboard Enhancement

### Checkpoint: Phase 3 Complete
- [x] Pagination working for all lists
- [x] Email notifications functional
- [x] Admin dashboard feature-complete
- [ ] Performance acceptable under load
- [ ] Review with human before proceeding

---

## Phase 4: Performance & Polish (P3)

- [x] Task 10: Image Optimization & Performance
- [x] Task 11: API Documentation (OpenAPI/Swagger)
- [x] Task 12: CI/CD Pipeline Setup

### Checkpoint: Phase 4 Complete
- [x] Performance optimized (Lighthouse > 90)
- [x] API documentation complete
- [x] CI/CD pipeline operational
- [x] Ready for production deployment
- [x] Final review with human

---

## Progress Tracking

**Current Phase:** Phase 4 - Selesai
**Completed Tasks:** 12/12
**Overall Progress:** 100%

**Next Action:** Website siap di-deploy!

---
---

# Task Checklist v2 — Revisi Client (R-01 … R-07)

Sumber: `Revisi_Website_HMTP_UNISBA.docx`. Detail task: lihat plan v2 di `tasks/plan.md`.

## Phase 5: Fondasi Data (P0)

- [ ] Task 13: Migrasi + Model — Profil, Kabinet, Bidang
- [ ] Task 14: Migrasi + Model — Pengurus, Proker/Aker, Kontak
- [ ] Task 15: Seeder — Profil, Kabinet, Bidang, Kontak
- [ ] Task 16: Seeder — Pengurus (14) + Proker/Aker (48)

### Checkpoint: Phase 5
- [ ] Migrasi Ran, seeder idempoten (jalan 2x tanpa duplikat)
- [ ] `php artisan test` hijau
- [ ] Jumlah baris tiap tabel dilaporkan ke client

---

## Phase 6: API (P0)

- [ ] Task 17: `GET /api/site` (endpoint publik agregat)
- [ ] Task 18: Admin CRUD Profil + Kabinet (+activate) + Kontak
- [ ] Task 19: Admin CRUD Bidang + Pengurus (upload foto, storage:link)
- [ ] Task 20: Admin CRUD Proker/Aker (+filter, +status)

### Checkpoint: Phase 6
- [ ] Tiap resource balas 401 tanpa token
- [ ] `php artisan test` hijau
- [ ] `backend/openapi.yaml` diperbarui

---

## Phase 7: Halaman Publik Dinamis (P1)

- [ ] Task 21: Tipe + service frontend (`/api/site` + admin CRUD)
- [ ] Task 22: LandingPage + Visi-Misi + Footer/About/History/LogoMeaning
- [ ] Task 23: Bagan Struktur Pengurus dari DB (+placeholder foto)
- [ ] Task 24: Proker/Aker dari DB + filter bidang/jenis

### Checkpoint: Phase 7
- [ ] Grep bersih: tidak ada data himpunan hardcode
- [ ] 5 section publik tampil dari DB
- [ ] Rapi di 360px & desktop
- [ ] Review client

---

## Phase 8: Dashboard Admin (P1)

- [ ] Task 25: Shell tab baru + Kelola Profil + Kelola Kontak
- [ ] Task 26: Kelola Kabinet (+aktifkan sekali klik)
- [ ] Task 27: Kelola Pengurus + Kelola Bidang (kompresi foto, urutan)
- [ ] Task 28: Kelola Proker/Aker (filter, status sekali klik)
- [ ] Task 29: KPI tambahan + istilah HMTP + bersih-bersih

### Checkpoint: Phase 8
- [ ] Semua menu jalan dari HP
- [ ] Perubahan dashboard langsung tampil di web publik
- [ ] Demo ke client

---

## Phase 9: Opsional + Penutup (P2)

- [ ] Task 30 (opsional, tunggu keputusan): Aspirasi anonim + label "Unduh CSV"
- [ ] Task 31: Test backend/frontend baru + panduan pengurus

### Checkpoint: Selesai
- [ ] `php artisan test` + `npm test -- --run` + `npm run build` hijau
- [ ] Panduan pengurus tersedia
- [ ] Serah terima ke client

---

## Progress Tracking v2 (dikoreksi 25 Okt 2026 dari hasil verifikasi)

**Current Phase:** Phase 5-9 praktis selesai — belum tercatat; sisa Phase 10 (rilis-blocker) & Phase 11 (serah terima)

Bukti: 18 migrasi + seeder terisi (members=14, prog=49, dept=11, profile=6, contact=1, news=4, users=1);
endpoint admin terverifikasi live (`/api/members` `department` = string "Sekretaris Umum", `/api/site` 14 pengurus,
12 punya bidang, npm tidak bocor); landing + dashboard 10 tab jalan; `php artisan test` 37 passed (128 assertions);
`npm test` 2 passed; `npm run build` sukses. Selesai 25 Okt 2026: CI ditulis ulang, kode email dihapus, DB pindah MySQL,
`.gitignore` + repo dirapikan, README serah terima, menu ganti password, CORS produksi. Sisa: commit, deploy, polish UX.

**Next Action:** kerjakan Plan v4 (baris 1187): Task 46 commit+push dulu, lalu Task 43-45.

---

## Task Checklist v4 — Penutupan Fitur (Plan v4, 25 Okt 2026)

### Phase 12: Fitur yang belum tersambung (P0)
- [x] **Task 43** Landing "Program Kerja" dari API — `components/Programs.tsx` ditulis ulang: 4 kartu hardcode
      (`majorPrograms`) dihapus, render `data.programs` filter `type === 'Program Kerja'` (16 baris) dari
      `useSiteData()`, kartu menampilkan bidang + status + deskripsi + jadwal, skeleton `role="status"` saat memuat,
      empty state bila kosong. Bukti: typecheck 0, 7 test frontend hijau, build ✓, Chromium: 16 kartu / 9 bidang unik;
      sisipkan 1 proker lewat DB → kartu jadi 17 tanpa ubah kode, lalu baris uji dihapus (kembali 16).
- [x] **Task 44** Berita bisa dibaca utuh — `components/News.tsx` ditulis ulang: kartu berubah dari `<a href="#news">`
      jadi `<button>` yang membuka dialog `role="dialog"` + `aria-modal` + `aria-labelledby`, isi `content`
      dirender per paragraf (`split(/\n{2,}/)`), Escape & klik latar menutup, fokus pindah ke tombol tutup saat
      dibuka dan kembali ke tombol asal saat ditutup. Data palsu (`fallbackArticles` 4 artikel karangan) dihapus →
      kini murni dari API, dengan skeleton `role="status"` dan empty state berbeda untuk "belum ada berita" vs
      "pencarian kosong". Label `sr-only` untuk kolom cari, `aria-pressed` untuk filter kategori, `aria-hidden` untuk
      ikon. `getNewsById` dihapus dari `services/api.ts` (0 pemanggil; `content` sudah ikut di respons daftar ≈2,8 KB).
      Bukti: typecheck 0, 7 test hijau, build ✓, Chromium: 4 kartu, dialog `aria-modal=true`, fokus "Tutup detail
      berita", Escape & klik latar menutup lalu fokus balik ke "Baca Selengkapnya", teks dialog cocok dengan
      `content` API (224 karakter).
- [ ] **Task 45** Pesan validasi 422 terbaca di 6 tab CRUD (helper `pesanError`)
- [ ] **Task 46** Commit + push bertema (109 berkas, `origin/main` masih `c946bd9`)

### Checkpoint Phase 12
- [ ] Proker & berita landing dari database; form admin menyebut field salah; repo bersih & ter-push

### Phase 13: Kelengkapan fungsi (P1)
- [ ] **Task 47** Tombol hapus kabinet (`deleteCabinet` sudah ada, belum dipanggil)
- [ ] **Task 48** Kontak & kategori aspirasi satu sumber (hardcode vs backend 7 kategori)
- [ ] **Task 49** Modal & form admin aksesibel (dialog, Escape, 25 label `htmlFor`)
- [ ] **Task 50** Ekspor CSV tanpa potong 100 baris
- [ ] **Task 51** Test CRUD yang belum tersentuh (37 -> >=50)

### Checkpoint Phase 13
- [ ] Semua endpoint punya test; dashboard bisa dipakai tanpa mouse

### Phase 14: Rilis & dokumentasi (P1)
- [ ] **Task 52** `openapi.yaml` 40 endpoint
- [ ] **Task 53** `docs/DEPLOY.md` (termasuk rewrite SPA Nginx/Apache)
- [ ] **Task 54** Pecah `AdminDashboard.tsx` 1213 baris

### Checkpoint Selesai v4
- [ ] P0 tertutup; P1 tertutup/backlog disetujui; repo ter-push; dokumen lengkap; berita acara

---

## Task Checklist v3 — Penutupan & Kesiapan Rilis

### Phase 10: Rilis-blocker (P0) — SELESAI 25 Okt 2026

- [x] **Task 32** CI benar-benar jalan. `.github/workflows/cicd.yml` ditulis ulang: job `frontend` = `npm ci`
      → `typecheck` → `lint` → `npm test -- --run` → `build`; job `backend` = `composer install` → `cp .env.example .env`
      + `key:generate` → `php artisan test`. Dibuang: referensi `backend/.env.testing` yang tidak ada, langkah
      `static-analysis` (script & PHPStan tidak terpasang), job `phase3-check` (hanya echo), service MySQL.
      Bukti: YAML lolos `yaml.safe_load`, tiap langkah dijalankan lokal (`typecheck` exit 0, `lint` exit 0,
      `npm test` 2 passed, `npm run build` 6.2 s, `php artisan test` 37 passed) — perintah CI dan lokal identik.
- [x] **Task 33** HAPUS notifikasi email aspirasi (diputuskan tidak pakai email): `sendAdminNotification()`,
      `sendUserNotification()`, `app/Mail/Aspiration*Mail.php`, `resources/views/emails/aspiration-*.blade.php`,
      import `Mail` → dihapus (2 file + 2 blade + 2 direktori). Bukti: `grep -rn "Mail::" app/` kosong,
      `php artisan test` hijau.
- [x] **Task 34** Konfigurasi produksi (tanpa deploy dulu): `config/cors.php` sekarang membaca
      `CORS_ALLOWED_ORIGINS` (daftar dipisah koma, default localhost dev) — bukan lagi `['*']`;
      `frontend/.env.production.example` berisi `VITE_API_URL` domain asli + cara pakainya;
      `backend/.env.example` = MySQL + `CORS_ALLOWED_ORIGINS`; checklist 8 langkah ada di `README.md` §4.
      Bukti: `curl -H "Origin: http://localhost:4173"` → `Access-Control-Allow-Origin: http://localhost:4173`,
      origin asing tidak dapat header.
- [x] **Task 40** Pindah DB ke MySQL: MySQL Laragon 8.4.3 (XAMPP gagal start), database `hmtp_unisba`
      (utf8mb4_unicode_ci), `.env` + `.env.example` → `DB_CONNECTION=mysql`. Bukti: `members=14`, `prog=49`,
      `dept=11`, `news=4`, `users=1`, `/api/site` 200, `php artisan test` 37 passed (test tetap sqlite `:memory:`).
- [x] **Task 35** Rapikan repo: `.gitignore` root dibuat (node_modules, dist, vendor, `backend/composer.phar`,
      `*.zip`, `.env*` kecuali `.example`), zip foto 42 MB dipindah ke `Documents/hmtp-assets/`.
      Bukti: `git check-ignore` menandai `backend/composer.phar` & `backend/.env`.
      **Sisa:** commit bertema belum dilakukan (107 berkas) — menunggu perintah pemilik repo.

### Checkpoint: Phase 10
- [x] `php artisan test` (37 passed, 128 assertions) + `npm test -- --run` (2 passed) + `npm run build` hijau
- [x] Tidak ada langkah CI menunjuk file/script yang tidak ada
- [x] Penanda aspirasi baru bekerja (tanpa email) — lihat Task 42
- [ ] `git status --short` bersih (nunggu commit)

### Temuan review frontend (25 Okt 2026)

Sudah diperbaiki saat review:
- Dashboard admin tadinya ikut terunduh di bundle publik (`index-*.js` 385 KB / 115 KB gzip). Sekarang di-lazy
  (`App.tsx`) → publik 318 KB / 103 KB gzip, `AdminDashboard-*.js` 67 KB / 12,8 KB hanya diunduh saat `/admin` dibuka.
- `react-router-dom` 6.28.0 → 6.30.6 (GHSA-2w69-qvjg-hvjx, GHSA-2j2x-hqr9-3h42 = high). Sisa 2 moderate
  (backslash open-redirect, deserializeErrors) hanya ditutup di v7 — upgrade major ditunda, tidak dipakai SSR/`deserializeErrors`.
- 401 saat token kedaluwarsa: sesi dihapus tapi pengguna tertinggal di dashboard kosong → sekarang diarahkan ke `/admin/login`.
- `index.html`: ditambah `og:*`, `canonical`, `theme-color`, dan `public/og-image.jpg` 1200×630 (pratinjau WhatsApp/IG).

Belum dikerjakan (perlu keputusan / backlog):
- **Program Unggulan masih statis** — `components/Programs.tsx` menampilkan 4 proker hardcode; `/api/site` mengirim
  `programs` (49 baris) tapi baru dipakai `Structure.tsx` untuk hitungan. Proker yang ditambah lewat tab Proker tidak
  muncul di landing.
- **Berita tidak bisa dibaca utuh** — tombol "Baca Selengkapnya" hanya jangkar `#news`; `content` tak pernah dirender,
  `getNewsById` tidak dipakai (dan tipenya salah: respons `{success,message,data}` diketik `NewsArticle`).
- **Pesan error 422 tidak terbaca di form CRUD admin** — semua kegagalan validasi jadi "Gagal menyimpan …"
  (`MembersTab.tsx` dkk). Pola benar sudah ada di `AccountTab.tsx` (baca `response.data.errors`).
- **Rewrite SPA** — `public/_redirects` hanya berlaku di Netlify; refresh `/admin/dashboard` di Nginx/Apache 404.
  Perlu dicatat di `docs/DEPLOY.md`.
- Modal (`AdminDashboard.tsx` 1053 & 1115) belum `role="dialog"`/`aria-modal`, belum bisa ditutup Escape, fokus tak dipindah.
- Ekspor CSV aspirasi dibatasi 100 baris (clamp `per_page`) — diam-diam memotong data.
- `AdminDashboard.tsx` 1213 baris (di atas ambang sehat) → pecah overview/aspirasi/berita jadi 3 berkas.
- Kode mati: `_loading` di `AdminDashboard.tsx:39` tak pernah dibaca.
- 20 `console.error` di tab admin; `types/index.ts` union `category: '…' | string` tidak berguna; `api.ts:32` `(config: any)`.
- Test frontend baru 7 (2 berkas) — `services/api.ts` & tab admin belum tersentuh test.

### Phase 11: Serah terima & kualitas (P1)

- [x] **Task 36** `README.md` root dibuat: cara jalan lokal (backend/frontend), perintah pemeriksaan, akun admin awal,
      tabel panduan tiap menu dashboard, checklist 8 langkah pemasangan hosting, catatan berkas di luar repo.
      `docs/DEPLOY.md` menyusul saat hosting diputuskan.
- [x] **Task 37** UX & a11y: tombol menu mobile kini `aria-expanded` + `aria-controls="menu-mobile"` + label dinamis
      "Buka menu"/"Tutup menu"; panel tertutup diberi `inert` + `aria-hidden` sehingga 9 link di dalamnya tidak ikut
      ter-tab; Escape menutup menu & dropdown; dropdown desktop terbuka saat fokus masuk (`onFocus`) dan menutup saat
      fokus keluar (`onBlur` + cek `relatedTarget`), plus `aria-haspopup`/`aria-expanded` dan bisa diklik untuk
      buka/tutup. Tab admin tidak lagi menampilkan teks "Memuat data..." — diganti `components/admin/TableSkeleton.tsx`
      (6 tab: Members, Programs, Departments, Cabinet, Contacts, Profile) dengan `role="status"` + teks `sr-only`.
      Form login & form aspirasi kini punya `htmlFor`/`id` (label benar-benar terhubung ke input).
      Bukti: `src/components/__tests__/Navbar.test.tsx` 5 test hijau (7 test total), `typecheck` + `build` bersih,
      dicek live di Chromium 390 px: `inert` true/false, tinggi panel 0 → 466 px, Escape mengembalikan ke 0.
      **Sisa (P2):** 25 input di tab CRUD admin masih label visual saja (belum `htmlFor`), tabel besar belum virtualisasi.
- [x] **Task 38** Kredensial & keamanan: token demo (`probe`, `probe2`, `probe3`, `review`) semua dicabut
      (`tokens=0`), `.env` tidak ter-commit (`git check-ignore`), rate limit login 5/menit & aspirasi 20/menit aktif,
      `per_page` dibatasi 100, dan `AdminUserSeeder` berhenti menimpa password admin saat seed ulang
      (bisa diisi lewat `ADMIN_PASSWORD`).
- [x] **Task 41** Menu ganti password di dashboard: `POST /api/password` (`AuthController@updatePassword` — cek password
      lama, `min:8`, `confirmed`, token lain dicabut) + tab **Akun** (`AccountTab.tsx`) di dashboard + 5 test
      (`tests/Feature/AdminPasswordTest.php`).
- [x] **Task 42** Penanda aspirasi baru di dashboard sebagai pengganti notifikasi email: badge jumlah pada tab
      **Kotak Aspirasi** + kartu "Aspirasi Pending". Diperbaiki: badge dulu hanya menghitung 10 baris yang termuat —
      dashboard sekarang memuat `per_page=100` sehingga hitungan benar.
- [ ] **Task 39** Verifikasi akhir & serah terima: semua gate hijau, uji HP asli (menu, form aspirasi, unggah foto),
      tabel bukti R-01...R-07, berita acara + backlog

### Perbaikan tambahan (ditemukan saat mengerjakan Phase 10-11)

- [x] Tamu yang memanggil endpoint terproteksi tanpa header `Accept` dulu dapat **500 "Route [login] not defined"**;
      sekarang **401 JSON** (`bootstrap/app.php`: `redirectGuestsTo(fn () => null)` +
      `shouldRenderJsonWhen(fn ($r) => $r->is('api/*') || $r->expectsJson())`). Diuji di `tests/Feature/ApiErrorsTest.php`.
- [x] Dependensi mati dibuang dari `frontend/package.json`: `jest`, `@types/jest`, `jest-environment-jsdom`
      (runner-nya `vitest`), `http-server`, `autoprefixer`, `postcss` (Tailwind v4 lewat plugin Vite) — 276 paket hilang,
      test + build tetap hijau.

### Checkpoint: Selesai
- [ ] Semua temuan P0/P1 tertutup atau tercatat sebagai backlog yang disetujui
- [ ] Repo bersih & ter-commit, CI hijau, dokumen serah terima lengkap

Catatan P2 (tidak menghalangi rilis): `openapi.yaml` baru 6 path vs 40 endpoint (dokumentasi API belum lengkap),
ekspor CSV hanya mengeluarkan baris yang sedang termuat di layar (kini maksimal 100), test frontend baru 1 file
(`unwrapList` belum ada test), `Skeleton` belum dipakai di tab admin, tombol menu mobile belum punya `aria-expanded`.
Dependensi mati `jest`/`jest-environment-jsdom`/`@types/jest`/`http-server`/`postcss`/`autoprefixer` sudah dibuang.

## Pertanyaan client — SUDAH DIJAWAB (25 Okt 2026)

- [x] Zip foto pengurus: sudah ada di `assets/` → **disimpan di luar repo**, bukan di-commit
- [ ] Logo kabinet Adhikara Karsa (atau pakai default dulu)
- [x] NPM: tetap disembunyikan dari web publik (hanya dashboard)
- [ ] R-07 dikerjakan sekarang / setelah Phase 8
- [x] Hosting: **deploy ditunda** sampai website benar-benar beres
- [x] Email: **tidak dipakai** — notifikasi aspirasi cukup di dashboard admin, balasan manual
- [x] Database: **MySQL** (dev & produksi), test tetap sqlite `:memory:`
- [x] Ganti password admin: dibuatkan **menu di dashboard**


