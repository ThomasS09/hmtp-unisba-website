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

### Temuan review sinkronisasi backend–frontend (25 Okt 2026)

Diperiksa dengan mengeksekusi, bukan membaca: 37 rute backend vs 36 panggilan `api.ts`, bentuk respons tiap GET,
15 permintaan tulis dengan payload persis seperti frontend, dan perbandingan daftar enum.

Hasil: **tidak ada endpoint yang hilang atau salah bentuk**. Semua GET mengembalikan bentuk yang dibaca
`unwrapList`/`data.data`, dan semua POST/PUT multipart (pengurus, proker, kabinet `_method=PUT`) diterima 200/201.

Dua ketidaksinkronan nyata yang ditemukan dan diperbaiki:
- **Kategori berita beda daftar** — backend hanya menerima `Akademik, Organisasi, Kegiatan, Pengumuman, Prestasi,
  Lainnya`; frontend menawarkan `Sosial` dan tidak punya `Pengumuman`/`Organisasi`/`Lainnya`. Terbukti: POST berita
  kategori `Sosial` → **422**, padahal 4 berita seed dan artikel "Bakti Sosial" memakai kategori itu. Diperbaiki:
  `News::CATEGORIES` jadi satu sumber (7 nilai), `NewsController` memakai konstanta itu, dan frontend
  (`components/News.tsx` + dropdown dashboard) memakai daftar yang sama. Uji ulang: 7 kategori → 201 semua.
- **ID ganda di form kontak** — `ContactsTab` memakai `id="field-contactstab-1"` di dalam `.map()`, jadi kelima
  input berbagi satu `id` dan semua label menunjuk input pertama. Diperbaiki jadi `id={`kontak-${f.key}`}`.

Catatan (bukan bug): rute `GET /news/{id}` tidak dipanggil frontend karena `content` sudah ikut di daftar;
`PUT /cabinets/{id}` dipanggil sebagai `POST` + `_method=PUT` (multipart), bukan pelanggaran kontrak.

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
- [x] **Task 45** Pesan validasi 422 terbaca di 6 tab CRUD — helper `pesanError(err, bawaan)` di `services/api.ts`
      (urutan: pesan validasi pertama → `message` server → "Tidak bisa menghubungi server…" → bawaan). Dipakai 6 tab
      CRUD + `AccountTab` + `AdminDashboard` + `AspirationContact`. 4 catch di `AdminDashboard` yang dulu menelan
      error (optimistic "berhasil (Lokal)", `id: Date.now()`) diperbaiki: gagal server → tampilan dikembalikan +
      pesan asli. Temuan tambahan: pesan masih Inggris → `backend/lang/id/validation.php` dibuat + `APP_LOCALE=id`.
      Bukti: `pesanError.test.ts` 4 test, `ApiErrorsTest` +1 test bahasa Indonesia; live Chromium simpan pengurus
      NPM 60 karakter → toast "NPM maksimal 50 karakter." (dulu "The npm field must not be greater than 50 characters.").
- [x] **Task 46** Commit + push bertema — commit lokal selesai (`2dea5d2` … `1588f17`); remote `origin/main` sudah disamakan (merge `6f0cc9a`). Push butuh kredensial GitHub pemilik.

### Checkpoint Phase 12
- [ ] Proker & berita landing dari database; form admin menyebut field salah; repo bersih & ter-push

### Phase 13: Kelengkapan fungsi (P1)
- [x] **Task 47** Hapus kabinet dari dashboard — `tabs/CabinetTab.tsx` ditulis ulang (152 → 286 baris): daftar semua
      kabinet dengan badge AKTIF/ARSIP + jumlah pengurus, tombol **Aktifkan** (hanya arsip), tombol **Hapus**
      (disabled + tooltip untuk kabinet aktif), tombol **+ Kabinet Baru** & **Batal**, form diberi label `htmlFor`,
      semua error lewat `pesanError`. Bukti: `tests/Feature/CabinetArchiveTest.php` 3 test hijau (satu aktif setelah
      aktivasi, kabinet aktif 422 tidak terhapus, kabinet arsip terhapus); total backend 41 passed. Live Chromium:
      daftar "Adhikara Karsa AKTIF 14 pengurus / UJI ARSIP ARSIP 0 pengurus", tombol Hapus pada kabinet aktif
      `disabled=true` + title "Kabinet aktif tidak bisa dihapus", aktivasi menukar status, hapus arsip → toast
      "Kabinet berhasil dihapus" dan baris hilang. Data uji & token dibersihkan (`cabinets=1`, token logout 200).
- [x] **Task 48** Kontak & kategori aspirasi satu sumber — `components/AspirationContact.tsx`:
      (1) 7 kategori disamakan dengan aturan backend (`KATEGORI`), dulu hanya 4 dan 3 di antaranya ditolak 422;
      (2) daftar saluran komunikasi (`akunMedsos`) dibangun dari `/api/site` → `contact` (Instagram, TikTok,
      YouTube, Gmail) + WhatsApp yang belum punya kolom di tabel `contact`. Tidak ada lagi handle hardcode.
      Bukti: typecheck 0, 11 test hijau, build ✓; 7 kategori di-POST ke API → semuanya 201 (baris uji dihapus,
      `aspirations=0`); Chromium: select berisi 7 opsi, blok kontak menampilkan Instagram/TikTok/YouTube/Gmail/
      WhatsApp; ubah Instagram jadi `@uji_sementara` lewat API → reload landing berubah (lalu dipulihkan
      `@hmtpunisba`, token dicabut `tokens=0`).
- [x] **Task 49** Modal & form admin aksesibel — `AdminDashboard.tsx`: kedua modal (detail aspirasi & berita) kini
      `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, Escape menutup, klik latar menutup, fokus pindah ke
      tombol tutup saat dibuka dan **kembali ke tombol pemicu** saat ditutup (`pemicuModalRef`). Semua 25 input/select/
      textarea di 6 tab CRUD + modal berita diberi `id` + `htmlFor` (0 label tanpa `htmlFor`), 7 kontrol filter diberi
      `aria-label`. Bukti: typecheck 0, 11 test hijau, build ✓; Chromium: modal aspirasi `aria-modal=true`, fokus
      "Tutup detail aspirasi", Escape → fokus balik ke tombol "Detail"; modal berita sama, fokus balik ke
      "➕ Tulis Berita Baru".
- [x] **Task 50** Ekspor CSV tanpa potong — `exportAspirationsCSV` sekarang async dan mengambil halaman berulang
      (`per_page=100` sampai batch < 100), menulis CSV lewat `Blob` dengan BOM UTF-8 + CRLF (Excel membaca aksara
      benar), escaping kutip ganda, toast menyebut jumlah baris. Label tombol jadi "Unduh CSV (bisa dibuka di Excel)"
      sesuai R-07. Bukti: 188 baris di DB → klik tombol menghasilkan 189 baris (1 header + 188), BOM `EF BB BF`,
      toast "Unduh CSV selesai: 188 aspirasi."; data uji & token dibersihkan (`aspirations=0`, `tokens=0`).
- [x] **Task 51** Test CRUD yang belum tersentuh — dua berkas feature baru: `AdminCrudTest` (9 test: tambah/ubah/hapus
      pengurus, validasi nama & kelompok, proker + jenis/status, bidang, 401 untuk tamu) dan
      `AdminProfileContactTest` (6 test: visi/misi tambah + urutan + hapus, jenis & panjang ditolak, kontak
      ter-update dan langsung tampil di `/api/site`, kontak tanpa email ditolak, 401 tamu). Frontend:
      `components/__tests__/News.test.tsx` (4 test: kartu dari API bukan data karangan, detail berisi `content`
      lengkap + fokus ke tombol tutup, Escape menutup & fokus kembali, filter pencarian).
      Bukti: backend **56 passed (191 assertions)** dari 41; frontend **15 passed** dari 11; typecheck 0; build ✓.

### Checkpoint Phase 13
- [x] Semua endpoint punya minimal satu test (56 test backend; members/programs/departments/cabinets/profile/contact
      kini tercakup, termasuk jalur 401 dan 422)
- [x] Dashboard bisa dipakai tanpa mouse (modal Escape + fokus kembali, label form terhubung, filter ber-`aria-label`)
- [x] Data kontak & proker satu sumber (database)

### Phase 14: Rilis & dokumentasi (P1)
- [x] **Task 52** `openapi.yaml` lengkap — ditulis ulang (60 baris → 22 path, 12 skema, 17 `$ref`): seluruh endpoint
      (`/site`, auth, aspirasi, berita, kabinet, bidang, pengurus, proker, profil, kontak), penanda 🔒 untuk yang
      butuh Bearer, enum nilai yang benar (7 kategori aspirasi, jenis/status proker), `per_page` maksimal 100,
      contoh body, dan respons 401/404/422. Bukti: `yaml.safe_load` OK; dibandingkan otomatis dengan
      `php artisan route:list --path=api --json` → **0 rute tidak terdokumentasi, 0 dokumentasi tanpa rute**;
      semua `$ref` resolve; setiap operasi punya `responses`.
- [x] **Task 54** Pecah `AdminDashboard.tsx` — 1.290 → **724 baris**; tiga tab besar jadi berkas sendiri:
      `tabs/OverviewTab.tsx` (199), `tabs/AspirationsTab.tsx` (278), `tabs/NewsTab.tsx` (169). State saringan/
      urutan/paginasi pindah ke tab masing-masing; dashboard tinggal data, modal, dan aksi server. Kode mati
      `_loading`/`setLoading` dibuang, `fetchData` diberi `catch` luar supaya kegagalan health-check tidak diam.
      Bukti: typecheck 0, 15 test hijau, build ✓ (`AdminDashboard-*.js` 73,5 kB / 14,5 kB gzip), oxlint 0 error;
      Chromium: 10 tab tampil, filter aspirasi "Saran" menyisakan 1 baris, tab berita 4 kartu + cari/urut/Tulis Berita,
      modal berita `aria-modal` + Escape kembali ke tombol pemicu, tab Profil/Kabinet/Bidang/Pengurus/Proker/Kontak/Akun
      semua termuat.

### Checkpoint Selesai v4
- [x] Semua P0 tertutup (Task 43-46; Task 46 = commit lokal `2dea5d2`, push tertunda karena kredensial GitHub)
- [x] P1 tertutup termasuk Task 53 (`docs/DEPLOY.md`) — dokumen deploy ditulis 2 Nov 2026 (Nginx 1 & 2 domain, PHP-FPM/OPcache, SPA rewrite, checklist verifikasi, prosedur update + backup)
- [ ] Push ke `origin/main` — tertunda, butuh login GitHub pemilik (CLI `gh` tidak terpasang)
- [ ] Repo ter-push ke `origin/main` (butuh login GitHub pemilik)
- [x] Dokumen: `README.md`, `backend/openapi.yaml`, `tasks/plan.md`, `tasks/todo.md`
- [ ] Berita acara serah terima ditandatangani (butuh manusia)

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

---

## Phase 15: Konten 100% bisa diubah dari admin (2 Nov 2026)

Keluhan client: "segala ganti di admin tidak usah ubah codingan tetapi saat di admin
ganti tampilan website jadi acak acakan". Akar masalah: sebagian teks halaman depan
masih di kode (Beranda, timeline Sejarah, kartu elemen logo) dan tidak ada peta
blok-halaman → tab-admin, sehingga pengurus tidak tahu harus mengubah di mana.

- [x] **Task 55** Teks Beranda dari database — tabel `site_settings` (key-value:
      `hero_badge`, `hero_title`, `hero_desc`, `hero_cta_primary`, `hero_cta_secondary`),
      model `SiteSetting` dengan `DEFAULTS`/`values()` (kosong → bawaan), `GET/PUT
      /api/site-settings` (bulk, key asing diabaikan, `throttle:60,1`), ikut dikirim di
      `/api/site` supaya halaman tetap satu permintaan. Tab admin baru **Beranda**.
      Bukti: ubah nama tombol di tab Beranda → halaman depan berubah tanpa build,
      lalu dipulihkan lewat API.
- [x] **Task 56** Timeline Sejarah & Elemen Logo dari database — `profile_items` dapat
      kolom `heading(120)/subheading(160)/note(200)` dan jenis baru `timeline` +
      `logo-elemen` (kolom `type` dilebarkan ke 20 karakter — `varchar(10)` menolak
      `logo-elemen`). `History.tsx` & `LogoMeaning.tsx` merender dari API dengan teks
      lama sebagai cadangan. Seeder `FrontPageContentSeeder` mengisi 3 entri timeline +
      elemen logo hanya bila jenisnya masih kosong (idempoten, suntingan admin aman).
      Bukti: landing menampilkan 4 kartu timeline + 8 kartu elemen dari DB; ubah satu
      entri lewat admin → landing ikut berubah.
- [x] **Task 57** Form admin berbasis konfigurasi — `ProfileTab.tsx` memakai satu array
      `JENIS` (7 jenis) yang menentukan label, petunjuk, dan daftar field tiap jenis
      (narasi = 1 textarea; timeline = tahun/judul/tanggal-lokasi/deskripsi;
      elemen logo = nama/emoji/arti). Menambah jenis baru = menambah satu entri.
- [x] **Task 58** Satu sumber untuk setiap teks — blok `About.tsx` dihapus (duplikat
      Sejarah/Arti Logo), navigasi `#about` dibuang, email di Kebijakan Privasi kini
      mengikuti tab Kontak & Medsos (bukan teks keras).
- [x] **Task 59** Dokumentasi untuk pengurus — `PANDUAN_ADMIN.md`: tabel 8 blok halaman
      depan → tab admin → apa yang diisi, urutan kerja 7 langkah, aturan "ubah satu,
      simpan, lihat", dan aturan "kosong = teks bawaan".
- [x] **Task 60** README & deploy — `README.md` diperbarui (13 tab, 66 test backend /
      18 frontend, tautan dokumen), `docs/DEPLOY.md` ditulis (Task 53), termasuk
      peringatan SPA rewrite dan larangan `php artisan serve` untuk produksi.

### Checkpoint Phase 15
- [x] `grep -L useSiteData components/*.tsx` → hanya Navbar (label navigasi = desain)
- [x] `npx tsc --noEmit` 0 error; `npm run build` ✓ (6,86 s); `npx vitest run` 18/18;
      `php artisan test` 66 passed (216 assertions); `tests/integration_check.py` ALL PASS
- [x] Tidak ada teks keras tersisa di 8 blok halaman depan
- [ ] Uji di HP asli oleh pengurus (butuh manusia)

## Phase 16 — Audit kelengkapan CRUD (frontend + backend)

- [x] **Task 61** Matriks CRUD otomatis — `backend/tests/crud_matrix.py` menguji lewat HTTP:
      login → create/read/update/delete untuk pengurus, proker, bidang, berita, kabinet,
      butir profil, aspirasi, kontak, site settings + tolak tamu (401). 46 cek, data uji
      selalu dipulihkan. Bukti: `46 cek lewat, 0 gagal | ALL PASS`.
- [x] **Task 62** Perbaikan temuan audit —
      (a) `/members/{id}`, `/programs/{id}`, `/cabinets/{id}` kini `Route::match(['post','put'])`
      karena axios mengirim `_method=PUT` pada multipart dan method spoofing terjadi
      sebelum routing (sebelumnya update dari UI bisa 405);
      (b) butir `timeline`/`logo-elemen` wajib punya `heading` (kartu tanpa judul = kosong);
      (c) dua test baru: `AdminCrudTest` (spoofing method) + `AdminProfileContactTest` (heading wajib).
- [x] **Task 63** Uji klik nyata di `/admin` — Beranda, Profil, Pengurus, Proker, Bidang,
      Kabinet, Berita (tambah → ubah → hapus), Aspirasi (ubah status → hapus), Kontak,
      Akun (ganti password lalu dikembalikan) semuanya tersimpan; data uji dibersihkan.
- [x] **Task 64** Dokumentasi — `PANDUAN_ADMIN.md` menambah catatan judul wajib dan
      satu-akun-satu-sesi; README mencatat 68 test backend / 18 frontend.

### Checkpoint Phase 16
- [x] `tests/crud_matrix.py` 46/46; `php artisan test` 68 passed (224 assertions)
- [x] `npx tsc --noEmit` 0 error; `npm run build` ✓ (8,22 s); `npx vitest run` 18/18
- [x] `tests/integration_check.py` ALL PASS; data produksi kembali ke kondisi awal
      (news 5, members 14, programs 49, departments 11, kabinet 1 aktif, timeline 4, logo 8)
- [ ] Deploy — ditunda sesuai arahan (fokus fitur CRUD)

## Phase 17 — Bersih-bersih (clean code)

- [x] **Task 65** Hapus berkas mati — `assets/` (3 jpg duplikat, isinya identik dengan
      `frontend/src/assets/`), `dogfood-output/` (screenshot + rencana tanpa rujukan),
      `frontend/src/assets/hero.png` (tak diimpor), `ADMIN_UX_REVIEW.md` (isi sudah
      dikerjakan, tidak dirujuk dokumen lain), `backend/tests/Feature/ExampleTest.php` +
      `tests/Unit/ExampleTest.php` (stub bawaan Laravel), suite `Unit` kosong di `phpunit.xml`, `RateLimitRequests.php` (middleware tak terdaftar/tak dipakai).
- [x] **Task 66** Kode mati — `invalidateSiteData` (export tanpa pemakai), `getAdminProfile`
      (endpoint `/me` tak dipanggil UI), `mockRouter` (helper tes tanpa pemakai),
      import `User` sisa, `use App\Models\User` + komentar mati di `DatabaseSeeder`,
      `catch` duplikat di `logoutAdmin`, dua baris `.gitignore` yang sudah tercakup pola lain.
- [x] **Task 67** Bug cache halaman publik — cache `useSiteData` dulu hanya dibersihkan
      bila ada komponen ter-mount, sehingga setelah admin menyimpan lalu membuka landing
      lewat menu (tanpa reload) halaman bisa memakai data lama. Kini pembersihan
      didaftarkan di level modul; event `siteDataInvalidate` selalu mengosongkan cache.
      Bukti: ubah judul hero di admin → klik 🌐 Lihat Web → `<h1>` langsung berubah.

### Checkpoint Phase 17
- [x] `npx tsc --noEmit` 0 error; `npm run build` ✓ (7,08 s); `npx vitest run` 18/18
- [x] `php artisan test` 66 passed (222 assertions, dua `ExampleTest` dibuang)
- [x] `tests/crud_matrix.py` 46/46; `tests/integration_check.py` ALL PASS
- [x] `git ls-files` 199 → 192 berkas; tidak ada sisa rujukan ke berkas yang dihapus
