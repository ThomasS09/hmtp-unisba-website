# Implementation Plan: HMTP UNISBA Website Improvements

## Overview
Comprehensive improvement plan to transform HMTP UNISBA website into production-ready, secure, and maintainable application. Focus on fixing critical gaps (P0-P1) while implementing strategic improvements (P2).

## Architecture Decisions
1. **TypeScript Migration**: Convert frontend to `.tsx/.ts` for compile-time safety
2. **Layered Protection**: Add error boundaries, rate limiting, input validation
3. **Testing First**: Establish Jest (frontend) + PHPUnit (backend) test suites
4. **Vertical Slicing**: Each phase delivers complete, testable functionality
5. **Monorepo Structure**: Keep frontend/backend separate but coordinated

## Task List

### Phase 1: Foundation & Safety (P0)

#### Task 1: TypeScript Migration Frontend
**Description:** Convert React components and API service to TypeScript with proper type definitions.

**Acceptance criteria:**
- [ ] All `.jsx` files converted to `.tsx` with proper TypeScript configuration
- [ ] API service (`api.js`) has full TypeScript interfaces for request/response
- [ ] News component has `NewsArticle` interface definition
- [ ] Compilation passes with `tsc --noEmit`
- [ ] No `any` type usage in production code

**Verification:**
- [ ] Tests pass: `npm run build` (no TypeScript errors)
- [ ] Build succeeds: Vite builds successfully
- [ ] Manual check: IDE shows no TypeScript errors

**Dependencies:** None

**Files likely touched:**
- `frontend/vite.config.js` → `vite.config.ts`
- `frontend/tsconfig.json` (new)
- `frontend/src/**/*.jsx` → `*.tsx`
- `frontend/src/services/api.js` → `api.ts`

**Estimated scope:** Medium (5+ files)

#### Task 2: React Error Boundaries Implementation
**Description:** Add global error boundaries to prevent full-page crashes.

**Acceptance criteria:**
- [ ] Create `ErrorBoundary.tsx` component with fallback UI
- [ ] Wrap entire app in root error boundary
- [ ] Implement section-level error boundaries for critical sections (News, Aspirations)
- [ ] Add error logging to console or external service (Sentry-like)
- [ ] Provide user-friendly error messages with "Try Again" buttons

**Verification:**
- [ ] Tests pass: Error boundary catches thrown errors in test environment
- [ ] Build succeeds: All builds pass
- [ ] Manual check: Simulate component error → shows fallback UI, not blank screen

**Dependencies:** Task 1 (TypeScript support)

**Files likely touched:**
- `frontend/src/components/ErrorBoundary.tsx` (new)
- `frontend/src/App.tsx`
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/components/News.tsx`

**Estimated scope:** Small (2-3 files)

#### Task 3: Backend Rate Limiting & API Protection
**Description:** Implement Laravel rate limiting for public API endpoints.

**Acceptance criteria:**
- [ ] Aspiration submission endpoint limited to 5 requests/minute per IP
- [ ] Admin login endpoint limited to 10 attempts/hour per IP
- [ ] News API endpoints limited to 60 requests/minute per IP
- [ ] Return proper HTTP 429 responses with Retry-After headers
- [ ] Log rate limit violations for monitoring

**Verification:**
- [ ] Tests pass: PHPUnit tests verify rate limiting works
- [ ] Build succeeds: Laravel artisan commands work
- [ ] Manual check: Rapid API calls trigger rate limit responses

**Dependencies:** None

**Files likely touched:**
- `backend/routes/api.php`
- `backend/app/Http/Middleware/ThrottleRequests.php` (Laravel built-in)
- `backend/config/cache.php` (redis/memcached configuration for distributed rate limiting)

**Estimated scope:** Small (2-3 files)

### Checkpoint: Phase 1 Complete
- [ ] TypeScript compilation clean
- [ ] Error boundaries functional
- [ ] Rate limiting active on backend
- [ ] All existing features still work
- [ ] Review with human before proceeding

---

### Phase 2: Testing & Data Integrity (P1)

#### Task 4: Frontend Unit Testing Setup (Jest)
**Description:** Configure Jest testing framework with React Testing Library.

**Acceptance criteria:**
- [ ] Jest configuration in `frontend/jest.config.js`
- [ ] React Testing Library installed and configured
- [ ] MSW (Mock Service Worker) for API mocking
- [ ] Example test for News component
- [ ] Example test for AspirationContact form
- [ ] Test coverage > 70% for critical components

**Verification:**
- [ ] Tests pass: `npm test` runs all tests successfully
- [ ] Build succeeds: Tests don't break build process
- [ ] Manual check: All component tests pass

**Dependencies:** Task 1 (TypeScript)

**Files likely touched:**
- `frontend/jest.config.js` (new)
- `frontend/package.json` (add dev dependencies)
- `frontend/src/components/__tests__/News.test.tsx` (new)
- `frontend/src/components/__tests__/AspirationContact.test.tsx` (new)

**Estimated scope:** Medium (4-5 files)

#### Task 5: Backend PHPUnit Testing Setup
**Description:** Configure comprehensive PHPUnit testing for Laravel backend.

**Acceptance criteria:**
- [ ] PHPUnit configuration in `backend/phpunit.xml`
- [ ] Database testing with SQLite in-memory
- [ ] Feature tests for all API endpoints (News, Aspirations, Auth)
- [ ] Validation tests for input boundaries
- [ ] Rate limiting tests
- [ ] Test coverage > 80% for critical controllers

**Verification:**
- [ ] Tests pass: `./vendor/bin/phpunit` runs successfully
- [ ] Build succeeds: Tests integrate with CI/CD
- [ ] Manual check: All controller tests pass

**Dependencies:** Task 3 (Rate limiting)

**Files likely touched:**
- `backend/tests/Feature/AspirationControllerTest.php` (new)
- `backend/tests/Feature/NewsControllerTest.php` (new)
- `backend/tests/Feature/AuthControllerTest.php` (new)
- `backend/tests/TestCase.php`
- `backend/phpunit.xml` (update)

**Estimated scope:** Medium (4-5 files)

#### Task 6: Enhanced Input Validation & Security
**Description:** Strengthen validation rules to prevent XSS, injection, and abuse.

**Acceptance criteria:**
- [ ] NIM format validation (UNISBA-specific: 1007XXXXX)
- [ ] Message length limits (min: 10 chars, max: 5000)
- [ ] Name validation (letters and spaces only)
- [ ] HTML sanitization for user inputs
- [ ] SQL injection protection (Laravel Eloquent already does this, verify)
- [ ] CSRF protection for forms (backend already has, frontend needs token handling)

**Verification:**
- [ ] Tests pass: Validation tests reject invalid inputs
- [ ] Build succeeds: All validation logic compiles
- [ ] Manual check: Submit invalid forms → appropriate error messages

**Dependencies:** Task 4, 5 (Testing infrastructure)

**Files likely touched:**
- `backend/app/Http/Controllers/AspirationController.php`
- `backend/app/Http/Controllers/AuthController.php`
- `backend/app/Http/Controllers/NewsController.php`
- `backend/app/Models/Aspiration.php` (add casts/validation rules)
- `frontend/src/components/AspirationContact.tsx` (client-side validation)

**Estimated scope:** Medium (3-4 files)

### Checkpoint: Phase 2 Complete
- [ ] Frontend test suite > 70% coverage
- [ ] Backend test suite > 80% coverage
- [ ] Input validation robust and tested
- [ ] All security measures active
- [ ] Review with human before proceeding

---

### Phase 3: Scalability & User Experience (P2)

#### Task 7: Backend Pagination Implementation
**Description:** Add pagination to API endpoints for better scalability.

**Acceptance criteria:**
- [ ] News listing paginated (20 items per page)
- [ ] Aspirations admin listing paginated (25 items per page)
- [ ] API returns pagination metadata (total, per_page, current_page, etc.)
- [ ] Frontend components handle paginated responses
- [ ] Search/filter works with pagination

**Verification:**
- [ ] Tests pass: Pagination tests verify correct data slicing
- [ ] Build succeeds: Pagination doesn't break existing endpoints
- [ ] Manual check: API calls with `?page=2` return correct data

**Dependencies:** Task 5 (Backend testing)

**Files likely touched:**
- `backend/app/Http/Controllers/NewsController.php`
- `backend/app/Http/Controllers/AspirationController.php`
- `backend/routes/api.php` (optional query param updates)
- `frontend/src/services/api.ts` (add pagination params)
- `frontend/src/components/News.tsx` (handle paginated data)

**Estimated scope:** Medium (4-5 files)

#### Task 8: Email Notification System
**Description:** Configure Laravel Mail for aspiration notifications.

**Acceptance criteria:**
- [ ] Admin receives email when new aspiration submitted
- [ ] Student receives confirmation email
- [ ] Email templates with proper branding
- [ ] Queue system for async email sending
- [ ] Email throttling to prevent spam

**Verification:**
- [ ] Tests pass: Email sending tests pass
- [ ] Build succeeds: Mail configuration works
- [ ] Manual check: Test submission triggers emails (check inbox)

**Dependencies:** Task 6 (Enhanced validation)

**Files likely touched:**
- `backend/config/mail.php`
- `backend/app/Mail/AspirationSubmitted.php` (new)
- `backend/app/Mail/AspirationConfirmation.php` (new)
- `backend/app/Http/Controllers/AspirationController.php`
- `backend/resources/views/emails/aspiration-submitted.blade.php` (new)
- `backend/resources/views/emails/aspiration-confirmation.blade.php` (new)

**Estimated scope:** Medium (5-6 files)

#### Task 9: Admin Dashboard Enhancement
**Description:** Improve admin dashboard functionality and usability.

**Acceptance criteria:**
- [ ] Data visualization (aspirations by category, status charts)
- [ ] Advanced filtering (by date, category, status)
- [ ] Bulk operations (delete multiple, update status multiple)
- [ ] Export functionality (CSV, PDF)
- [ ] Search within admin dashboard

**Verification:**
- [ ] Tests pass: Dashboard features tested
- [ ] Build succeeds: Dashboard loads without errors
- [ ] Manual check: All dashboard features work end-to-end

**Dependencies:** Task 7 (Pagination)

**Files likely touched:**
- `frontend/src/pages/admin/AdminDashboard.tsx` (major rewrite)
- `frontend/src/components/admin/DashboardCharts.tsx` (new)
- `frontend/src/components/admin/FilterPanel.tsx` (new)
- `frontend/src/services/api.ts` (add bulk endpoints)
- `backend/app/Http/Controllers/AspirationController.php` (add bulk endpoints)

**Estimated scope:** Large (6-8 files)

### Checkpoint: Phase 3 Complete
- [ ] Pagination working for all lists
- [ ] Email notifications functional
- [ ] Admin dashboard feature-complete
- [ ] Performance acceptable under load
- [ ] Review with human before proceeding

---

### Phase 4: Performance & Polish (P3)

#### Task 10: Image Optimization & Performance
**Description:** Optimize images and implement lazy loading.

**Acceptance criteria:**
- [ ] Convert images to WebP format (with fallback)
- [ ] Implement lazy loading for below-fold images
- [ ] Add responsive image sizing (srcset)
- [ ] Compress existing images (logo.jpg, hero.png, etc.)
- [ ] Add loading="lazy" attribute to images

**Verification:**
- [ ] Tests pass: Lighthouse performance score > 90
- [ ] Build succeeds: Image optimization doesn't break build
- [ ] Manual check: Page loads faster, images load progressively

**Dependencies:** Task 2 (Error boundaries)

**Files likely touched:**
- `frontend/src/assets/` (optimize all images)
- `frontend/src/components/Hero.tsx`
- `frontend/src/components/Navbar.tsx`
- `frontend/index.html` (preload critical images)
- `frontend/vite.config.ts` (add image optimization plugin)

**Estimated scope:** Medium (3-4 files)

#### Task 11: API Documentation (OpenAPI/Swagger)
**Description:** Generate API documentation for developers.

**Acceptance criteria:**
- [ ] OpenAPI 3.0 specification file
- [ ] Swagger UI accessible at `/api/docs`
- [ ] All endpoints documented with request/response schemas
- [ ] Authentication flow documented
- [ ] Error responses documented

**Verification:**
- [ ] Tests pass: OpenAPI spec validates
- [ ] Build succeeds: Swagger UI loads
- [ ] Manual check: `/api/docs` shows complete API documentation

**Dependencies:** Task 3 (API endpoints stable)

**Files likely touched:**
- `backend/openapi.yaml` (new)
- `backend/routes/api.php` (add OpenAPI annotations)
- `backend/composer.json` (add swagger-php package)
- `backend/public/api-docs/` (Swagger UI assets)

**Estimated scope:** Medium (3-4 files)

#### Task 12: CI/CD Pipeline Setup
**Description:** Configure automated testing and deployment.

**Acceptance criteria:**
- [ ] GitHub Actions workflow for frontend
- [ ] GitHub Actions workflow for backend
- [ ] Automated tests on push to main/feature branches
- [ ] Build verification before deployment
- [ ] Deployment to staging environment

**Verification:**
- [ ] Tests pass: GitHub Actions runs successfully
- [ ] Build succeeds: CI/CD pipeline green
- [ ] Manual check: Push triggers automated workflow

**Dependencies:** Task 4, 5 (Testing suites)

**Files likely touched:**
- `.github/workflows/frontend-ci.yml` (new)
- `.github/workflows/backend-ci.yml` (new)
- `.github/workflows/deploy.yml` (new)
- `package.json` (add test scripts)
- `composer.json` (add test scripts)

**Estimated scope:** Medium (4-5 files)

### Checkpoint: Phase 4 Complete
- [ ] Performance optimized (Lighthouse > 90)
- [ ] API documentation complete
- [ ] CI/CD pipeline operational
- [ ] Ready for production deployment
- [ ] Final review with human

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| TypeScript migration breaks existing functionality | High | Thorough testing, incremental migration, keep `.jsx` backup |
| Rate limiting blocks legitimate users | Medium | Conservative limits, monitor logs, quick adjustment capability |
| Email service dependencies (SMTP) | Medium | Use Mailtrap for testing, queue system for reliability |
| Database performance with pagination | Low | Index optimization, query optimization, caching layer if needed |
| CI/CD pipeline complexity | Medium | Start simple, iterate, document each step |

## Open Questions
1. **Email Service Provider**: Should we use SendGrid, Mailgun, or Gmail SMTP?
2. **Monitoring**: Do we need Sentry/LogRocket for production error tracking?
3. **Analytics**: Google Analytics or self-hosted Plausible?
4. **Staging Environment**: Where to deploy staging version (Vercel + separate backend)?
5. **Backup Strategy**: Database backup frequency and retention policy?

---

## Implementation Order Summary

**Week 1**: Phase 1 (Safety Foundation)
- TypeScript migration
- Error boundaries  
- Rate limiting

**Week 2**: Phase 2 (Testing & Validation)
- Frontend/backend testing setup
- Enhanced input validation
- Security hardening

**Week 3**: Phase 3 (Scalability & UX)
- Pagination
- Email notifications
- Admin dashboard enhancements

**Week 4**: Phase 4 (Performance & Polish)
- Image optimization
- API documentation
- CI/CD pipeline

Each phase delivers **complete, testable value**. We'll review after each checkpoint.

---
---

# Implementation Plan v2: Revisi Client — Dashboard Admin Data Himpunan (R-01 … R-07)

Sumber: `C:\Users\MyBook Hype AMD\Downloads\Revisi_Website_HMTP_UNISBA.docx` (Amie, Wakil Ketua Himpunan, 24 Okt 2026).
Goal: pengurus bisa ubah sendiri profil, kabinet, pengurus, proker/aker, dan kontak lewat dashboard; halaman publik ambil data dari database; data Bagian 3 dimasukkan sebagai data awal.

## Status awal repo (terverifikasi)

- Laravel 11.55 / PHP 8.2.35, GD loaded, migrasi lama sudah Ran.
- Frontend React 19 + TS + Vite + Tailwind, service layer `frontend/src/services/api.ts`, tipe di `frontend/src/types/index.ts`.
- `AdminDashboard.tsx` 1224 baris — tab `overview | aspirations | news` (state, bukan sub-route).
- Data yang masih hardcode & harus jadi dinamis: `VisionMission.tsx` (visi/misi dummy), `Structure.tsx` (Ketua Umum/Wakil Ketua Umum + 10 bidang dummy), `Programs.tsx` (4 proker dummy), `Footer.tsx` (email + medsos hardcode), `About/History/LogoMeaning` (masih statis).
- Zat lama R-06 ("Mining Expo", "Seminar Nasional") sudah tidak ada di kode — tidak perlu dihapus, cukup diverifikasi ulang.
- `backend/public/storage` belum ada → butuh `php artisan storage:link`.
- Test existing: `backend/tests/Feature/{News,Aspiration,Auth}ControllerTest.php`, `frontend/src/components/__tests__/`, `frontend/src/test/`.

## Architecture Decisions

1. **Enam tabel baru, bukan settings key-value.** `profile_items`, `cabinets`, `departments` (bidang), `members` (pengurus), `programs` (proker+aker satu tabel beda kolom `type`), `contacts` (satu baris). Alasan: strukturnya tetap, validasi bentuk kolom, dan admin CRUD langsung memetakan 1:1 ke form. Setting key-value menambah lapisan parsing tanpa manfaat.
2. **Satu endpoint agregat publik `GET /api/site`.** Landing page adalah satu halaman (Navbar→Hero→About→History→Visi-Misi→Struktur→Proker→Berita→Kontak→Footer) — satu fetch untuk semua section jauh lebih murah daripada 5 endpoint terpisah, dan data kecil (~70 baris total).
3. **Admin tetap pakai `apiResource` + 3 route aksi khusus** (`activate` kabinet, `status` proker, `order` profil). Boring > pintar.
4. **Kompresi foto di browser (canvas), bukan dependency baru.** Spec minta foto dikompres otomatis; canvas resize max 1600px + JPEG q0.82 ditulis dalam ~15 baris, tanpa menambah `intervention/image`. GD tersedia sebagai cadangan kalau nanti butuh kompresi sisi server.
5. **Tab dashboard ditambah sebagai komponen terpisah**, bukan menumpuk 1200+ baris lagi di `AdminDashboard.tsx`. Shell tab tetap, tiap menu jadi file sendiri di `frontend/src/components/admin/`.
6. **Relasi kabinet → pengurus/proker** dengan FK. Aktifkan kabinet = update 1 baris + auto set yang lain non-aktif dalam satu DB transaction; bagan & proker otomatis ikut ganti.
7. **CSS/tailwind existing dipakai ulang**; istilah UI memakai istilah HMTP (Pengurus Inti, Ketua Himpunan, Wakil Ketua Himpunan, Sekretaris Umum, Bendahara Umum, Bidang, Ketua Bidang).

### Skema tabel (ringkas)

| Tabel | Kolom inti |
|---|---|
| `profile_items` | `type` ('visi'\|'misi'), `body`, `sort_order` |
| `cabinets` | `name`, `period`, `logo_path?`, `name_meaning?`, `is_active` bool |
| `departments` | `name`, `slug` unique, `sort_order` (termasuk Sekretaris Umum & Bendahara Umum) |
| `members` | `cabinet_id` FK, `department_id?` FK, `group` ('Pengurus Inti'\|'Ketua Bidang'), `position`, `name`, `npm?`, `photo_path?`, `sort_order` |
| `programs` | `cabinet_id` FK, `department_id` FK, `name`, `type` ('Program Kerja'\|'Aktivitas Kerja'), `description?`, `schedule?`, `image_path?`, `status` ('Rencana'\|'Berjalan'\|'Selesai') |
| `contacts` | `website?`, `email`, `instagram?`, `tiktok?`, `youtube?` (satu baris) |

## Task List

### Phase 5: Fondasi Data (P0)

#### Task 13: Migrasi + Model — Profil, Kabinet, Bidang
**Description:** Tiga tabel master pertama beserta model + relasi + validasi `$fillable`/cast.

**Acceptance criteria:**
- [ ] Migration `create_profile_items_table`, `create_cabinets_table`, `create_departments_table`
- [ ] Model `ProfileItem`, `Cabinet`, `Department` dengan relasi (`Cabinet hasMany Member/Program`)
- [ ] `Department::slug` auto dari `name`, unique
- [ ] `php artisan migrate` jalan tanpa error pada DB yang ada

**Verification:**
- [ ] `php artisan migrate` sukses, `php artisan migrate:status` menampilkan 3 migrasi baru Ran
- [ ] `php artisan tinker --execute="App\Models\Cabinet::count();"` mengembalikan angka (0)

**Dependencies:** None

**Files likely touched:**
- `backend/database/migrations/2026_10_25_000001_create_profile_items_table.php`
- `backend/database/migrations/2026_10_25_000002_create_cabinets_table.php`
- `backend/database/migrations/2026_10_25_000003_create_departments_table.php`
- `backend/app/Models/{ProfileItem,Cabinet,Department}.php`

**Estimated scope:** Medium (6 files)

#### Task 14: Migrasi + Model — Pengurus, Proker/Aker, Kontak
**Description:** Tiga tabel transaksional + relasi ke kabinet/bidang.

**Acceptance criteria:**
- [ ] Migration `members` (FK cabinet cascade, FK department nullOnDelete), `programs` (FK cabinet cascade, FK department cascade), `contacts`
- [ ] Index pada `members.cabinet_id`, `programs.cabinet_id`, `programs.status`
- [ ] Model `Member`, `Program`, `Contact` + relasi `belongsTo Cabinet/Department`
- [ ] Enum dijaga sebagai string + validasi (bukan DB enum) agar konsisten lintas DB

**Verification:**
- [ ] `php artisan migrate` sukses
- [ ] `php artisan test` masih hijau (regresi tidak ada)

**Dependencies:** Task 13

**Files likely touched:**
- `backend/database/migrations/2026_10_25_000004_create_members_table.php`
- `backend/database/migrations/2026_10_25_000005_create_programs_table.php`
- `backend/database/migrations/2026_10_25_000006_create_contacts_table.php`
- `backend/app/Models/{Member,Program,Contact}.php`

**Estimated scope:** Medium (6 files)

#### Task 15: Seeder — Profil, Kabinet, Bidang, Kontak
**Description:** Masukkan data Bagian 3.1, 3.2, 3.5, dan daftar bidang dari 3.4 ke DB sebagai data awal.

**Acceptance criteria:**
- [ ] 2 butir visi + 4 butir misi persis sesuai dokumen
- [ ] 1 kabinet "Adhikara Karsa" periode 2026/2027, `is_active = true`, makna nama terisi, logo null ("menyusul")
- [ ] 11 bidang: Kesekretariatan, Medkominfo, Kaderisasi, Intrakampus, Ekstrakampus, Kewirausahaan, Sosial dan Keagamaan, Seni dan Olahraga, Keilmuan dan Keprofesian, Sekretaris Umum, Bendahara Umum
- [ ] Kontak: HMTPUNISBA.com, hmtp.adhikarakarsa@gmail.com, @hmtpunisba, @hmtp.unisba, HMTP UNISBA
- [ ] Seeder idempoten (`updateOrCreate`/`firstOrCreate`), aman dijalankan ulang

**Verification:**
- [ ] `php artisan db:seed --class=...` sukses
- [ ] `php artisan db:seed` dua kali berturut tidak menghasilkan duplikat

**Dependencies:** Task 13

**Files likely touched:**
- `backend/database/seeders/{ProfileItemSeeder,CabinetSeeder,DepartmentSeeder,ContactSeeder}.php`
- `backend/database/seeders/DatabaseSeeder.php`

**Estimated scope:** Medium (5 files)

#### Task 16: Seeder — Pengurus (14 orang) + Proker/Aker (~48 kegiatan)
**Description:** Data Bagian 3.3 dan 3.4 lengkap.

**Acceptance criteria:**
- [ ] 5 Pengurus Inti (Ketua Himpunan … Bendahara Umum 2) + 9 Ketua Bidang, nama & NPM sesuai dokumen, `sort_order` sesuai urutan poster
- [ ] Semua kegiatan 3.4.1–3.4.11 masuk dengan `type` dan bidang yang benar; status awal semua `Rencana`
- [ ] Deskripsi hanya diisi untuk 5 kegiatan yang di dokumen sudah ada deskripsi (HMTP One Data, Mining Talk, FORTA, MASTA)
- [ ] `members.department_id` diisi untuk Ketua Bidang, null untuk Pengurus Inti

**Verification:**
- [ ] `php artisan db:seed` sukses
- [ ] Cek hitung: `Member::count() == 14` dan `Program::count()` sesuai jumlah baris 3.4 (48)

**Dependencies:** Task 14, Task 15 (bidang & kabinet harus ada dulu)

**Files likely touched:**
- `backend/database/seeders/MemberSeeder.php`
- `backend/database/seeders/ProgramSeeder.php`
- `backend/database/seeders/DatabaseSeeder.php`

**Estimated scope:** Medium (3 files)

### Checkpoint: Phase 5
- [ ] Semua migrasi Ran, seeder jalan dua kali tanpa duplikat
- [ ] `php artisan test` hijau
- [ ] Screenshot/hasil query jumlah baris tiap tabel ditunjukkan ke client

### Phase 6: API (P0)

#### Task 17: Endpoint publik agregat `GET /api/site`
**Description:** Satu endpoint read-only berisi profil, kabinet aktif (+ makna & logo), pengurus aktif terurut, proker/aker kabinet aktif, dan kontak.

**Acceptance criteria:**
- [ ] `GET /api/site` mengembalikan `{ profil: {visi[], misi[]}, kabinet: {nama, periode, logo_url, makna}, pengurus: [{grup, jabatan, nama, bidang, foto_url, urutan}], program: [{nama, jenis, bidang, deskripsi, jadwal, status}], kontak: {...} }`
- [ ] Hanya kabinet `is_active` yang tampil; kabinet lama tetap tersimpan tapi tidak ikut
- [ ] Foto null diganti `null` di API (placeholder ditangani frontend)
- [ ] Rate limit `throttle:60,1`
- [ ] Response di-cache 60 detik? → **tidak** (YAGNI, data kecil; ditandai `ponytail:` di kode kalau nanti perlu cache)

**Verification:**
- [ ] `php artisan test --filter=SiteControllerTest` hijau
- [ ] `curl http://localhost:8000/api/site` mengembalikan JSON sesuai kontrak di atas

**Dependencies:** Task 16

**Files likely touched:**
- `backend/app/Http/Controllers/SiteController.php` (baru)
- `backend/routes/api.php`

**Estimated scope:** Small (2 files)

#### Task 18: Admin CRUD Profil, Kabinet, Kontak
**Description:** Kelola butir visi/misi (termasuk urutan), kabinet (termasuk aktifkan 1 klik), kontak.

**Acceptance criteria:**
- [ ] `apiResource` profil + kabinet, `PUT /api/contacts` (satu baris, `updateOrCreate`)
- [ ] `PATCH /api/kabinet/{id}/activate` → dalam 1 transaction set target aktif, lain non-aktif; balikan kabinet aktif
- [ ] Simpan urutan butir: `PATCH /api/profil/order` menerima array id terurut
- [ ] Hapus kabinet pakai validasi (kabinet aktif tidak boleh dihapus langsung → balikan 422 dengan pesan Indonesia)
- [ ] Semua route di dalam `auth:sanctum` + `throttle:60,1`
- [ ] Validasi: nama kabinet & periode & email kontak wajib, lainnya opsional

**Verification:**
- [ ] `php artisan test --filter=AdminContentTest` hijau (positif + negatif: tanpa token 401, hapus kabinet aktif 422)
- [ ] Manual: activate kabinet kedua → hanya satu `is_active` di DB

**Dependencies:** Task 13, Task 15

**Files likely touched:**
- `backend/app/Http/Controllers/{ProfileItemController,CabinetController,ContactController}.php`
- `backend/routes/api.php`

**Estimated scope:** Medium (4 files)

#### Task 19: Admin CRUD Bidang + Pengurus (upload foto + kompresi)
**Description:** Kelola pengurus termasuk foto, urutan, dan daftar bidang.

**Acceptance criteria:**
- [ ] `apiResource` bidang + pengurus; `POST/PUT` pengurus menerima `multipart/form-data`
- [ ] Simpan foto ke `storage/app/public/pengurus/`, `storage:link` terpasang, `photo_url` diakses publik
- [ ] Kompresi gambar di frontend sebelum upload (canvas, max 1600px, JPEG 0.82) — lihat Task 27; backend tetap validasi `mimes:jpg,jpeg,png|max:5120`
- [ ] Validasi: `bidang` wajib kalau `group = Ketua Bidang`, boleh null kalau `Pengurus Inti`
- [ ] Ganti/hapus pengurus menghapus file foto lama agar storage tidak menumpuk

**Verification:**
- [ ] `php artisan test --filter=MemberControllerTest` hijau (upload fake file, validasi bidang wajib)
- [ ] `ls backend/public/storage/pengurus` menampilkan file hasil upload

**Dependencies:** Task 14, Task 16

**Files likely touched:**
- `backend/app/Http/Controllers/{DepartmentController,MemberController}.php`
- `backend/routes/api.php`
- `backend/storage/app/public/pengurus/` (+ `php artisan storage:link`)

**Estimated scope:** Medium (4 files)

#### Task 20: Admin CRUD Proker/Aker
**Description:** Satu resource untuk proker + aker, dibedakan kolom `type`, dengan filter dan ubah status sekali klik.

**Acceptance criteria:**
- [ ] `apiResource` program + `PATCH /api/proker/{id}/status` (validasi salah satu dari Rencana/Berjalan/Selesai)
- [ ] `GET /api/proker?bidang=slug&jenis=Program+Kerja&status=Rencana` memfilter; default terurut bidang lalu nama
- [ ] Proker kabinet lama tetap ada (arsip) — endpoint admin menampilkan semua, `/api/site` hanya kabinet aktif
- [ ] Validasi: nama, jenis, bidang, status, kabinet wajib

**Verification:**
- [ ] `php artisan test --filter=ProgramControllerTest` hijau
- [ ] `curl` filter kombinasi mengembalikan subset yang benar

**Dependencies:** Task 14, Task 16, Task 19 (bidang sudah ada)

**Files likely touched:**
- `backend/app/Http/Controllers/ProgramController.php`
- `backend/routes/api.php`
- `backend/tests/Feature/ProgramControllerTest.php`

**Estimated scope:** Small–Medium (3 files)

### Checkpoint: Phase 6
- [ ] Semua endpoint admin butuh token (uji 401 tanpa token untuk tiap resource)
- [ ] `php artisan test` hijau seluruhnya
- [ ] `backend/openapi.yaml` diperbarui dengan endpoint baru

### Phase 7: Halaman Publik Ambil dari Database (P1)

#### Task 21: Tipe & service frontend untuk konten himpunan
**Description:** Tambah interface + fungsi service agar komponen publik bisa konsumsi `/api/site` dan admin bisa CRUD.

**Acceptance criteria:**
- [ ] Tipe baru di `types/index.ts`: `ProfileItem`, `Cabinet`, `Department`, `Member`, `Program`, `Contact`, `SiteContent`
- [ ] Fungsi di `services/api.ts`: `getSiteContent()`, `getSiteContentSafe()` (fallback null kalau API mati) + fungsi admin CRUD per resource
- [ ] `uploadMember` memakai `FormData` (axios otomatis set boundary), bukan header JSON
- [ ] Tidak ada `any` baru

**Verification:**
- [ ] `npm run typecheck` bersih
- [ ] `npm test -- --run` hijau

**Dependencies:** Task 17, Task 20

**Files likely touched:**
- `frontend/src/types/index.ts`
- `frontend/src/services/api.ts`

**Estimated scope:** Small (2 files)

#### Task 22: Landing page + Visi-Misi + Footer/About/History/LogoMeaning dinamis
**Description:** Ambil sekali di `LandingPage`, turunkan lewat props; visi/misi dari DB dan kontak dari DB.

**Acceptance criteria:**
- [ ] `LandingPage` fetch `/api/site` sekali, state loading pakai `Skeleton` yang sudah ada
- [ ] `VisionMission.tsx` render butir visi & misi dari props sesuai `sort_order` (data dummy lama dihapus)
- [ ] `Footer.tsx` pakai kontak & nama kabinet aktif dari DB (email, IG, TikTok, YouTube, website)
- [ ] `About/History/LogoMeaning` menampilkan nama kabinet aktif + makna namanya dari DB (placeholder teks kalau kosong)
- [ ] Kalau API tidak tersedia, halaman tetap tampil tanpa crash (fallback teks default + `console.warn`)

**Verification:**
- [ ] `npm run build` sukses
- [ ] Manual: ubah email kontak di DB → footer langsung berubah setelah refresh

**Dependencies:** Task 21

**Files likely touched:**
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/components/{VisionMission,Footer,About,History,LogoMeaning}.tsx`

**Estimated scope:** Medium (6 files)

#### Task 23: Bagan Struktur Pengurus dari database
**Description:** `Structure.tsx` render Pengurus Inti + Ketua Bidang per bidang dari DB, dengan foto & placeholder.

**Acceptance criteria:**
- [ ] Data dummy `pengurusInti`/`bidangData` dihapus, diganti props dari `/api/site`
- [ ] Urutan tampil mengikuti `sort_order`
- [ ] Foto null → gambar placeholder bawaan (`frontend/public/assets/`), bukan broken image
- [ ] Staf tidak ditampilkan (hanya Pengurus Inti + Ketua Bidang)
- [ ] Istilah di UI: Pengurus Inti, Ketua Himpunan, Wakil Ketua Himpunan, Sekretaris Umum, Bendahara Umum, Bidang, Ketua Bidang

**Verification:**
- [ ] `npm run build` sukses
- [ ] Manual: aktifkan kabinet lain (uji) → bagan ikut berubah; kembalikan seperti semula

**Dependencies:** Task 22

**Files likely touched:**
- `frontend/src/components/Structure.tsx`
- `frontend/public/assets/placeholder-pengurus.png` (baru)

**Estimated scope:** Small–Medium (2-3 files)

#### Task 24: Halaman Proker/Aker dari database + filter
**Description:** `Programs.tsx` menampilkan seluruh proker & aker bidang, bisa difilter bidang/jenis dan status.

**Acceptance criteria:**
- [ ] Proker & aker ditampilkan, dibedakan label jenis
- [ ] Filter bidang dan jenis (Program Kerja / Aktivitas Kerja) jalan di sisi klien
- [ ] Status tampil sebagai badge (Rencana/Berjalan/Selesai)
- [ ] Deskripsi kosong tidak memunculkan teks "-" atau kosong menggantung
- [ ] Kartu 4 proker hardcode lama dihapus

**Verification:**
- [ ] `npm run build` sukses
- [ ] Manual: 48 kegiatan muncul, filter bidang menyisakan subset yang benar

**Dependencies:** Task 21

**Files likely touched:**
- `frontend/src/components/Programs.tsx`

**Estimated scope:** Small (1 file)

### Checkpoint: Phase 7
- [ ] Tidak ada lagi data himpunan hardcode di `frontend/src/components/*` (grep bersih)
- [ ] Lima section publik tampil dari DB: Visi-Misi, Kabinet, Struktur, Proker, Kontak
- [ ] Tampil rapi di layar HP (360px) dan desktop
- [ ] Review dengan client sebelum lanjut ke dashboard

### Phase 8: Dashboard Admin (P1)

#### Task 25: Shell tab baru + Kelola Profil + Kelola Kontak
**Description:** Tambah tab/menu di dashboard dan dua halaman paling sederhana lebih dulu sebagai pola.

**Acceptance criteria:**
- [ ] Tab baru: Kelola Profil, Kelola Kabinet, Kelola Pengurus, Kelola Proker, Kelola Kontak (ikon + label Indonesia)
- [ ] `ProfilAdmin.tsx`: CRUD butir visi & misi, tombol naik/turun urutan, terpisah visi vs misi
- [ ] `KontakAdmin.tsx`: form 5 field kontak + tombol simpan dengan notifikasi sukses (pakai toast pattern existing)
- [ ] Kedua halaman pakai gaya existing (`glass-panel`, `font-poppins`, warna primary) dan responsif di HP
- [ ] Hanya bisa diakses lewat route terlindungi (`ProtectedRoute`) — tanpa perubahan tambahan

**Verification:**
- [ ] `npm run build` + `npm test -- --run` hijau
- [ ] Manual: tambah butir misi di dashboard → muncul di halaman publik

**Dependencies:** Task 21

**Files likely touched:**
- `frontend/src/components/admin/{ProfilAdmin,KontakAdmin}.tsx` (baru)
- `frontend/src/pages/admin/AdminDashboard.tsx`

**Estimated scope:** Medium (3 files)

#### Task 26: Kelola Kabinet (tambah/edit/hapus + aktifkan)
**Description:** CRUD kabinet dengan konfirmasi hapus dan aktivasi sekali klik.

**Acceptance criteria:**
- [ ] Form: nama, periode, logo (upload JPG/PNG, opsional), makna nama, status aktif
- [ ] Baris aktif ditandai jelas; klik "Aktifkan" memanggil endpoint activate dan me-refresh daftar (kabinet lain otomatis non-aktif)
- [ ] Hapus pakai konfirmasi (`window.confirm` pattern existing), kabinet aktif gagal dihapus dengan pesan jelas
- [ ] Daftar kabinet lama tetap tampil sebagai arsip berlabel periode
- [ ] Tidak ada kolom visi/misi di form kabinet

**Verification:**
- [ ] `npm run build` hijau
- [ ] Manual: aktifkan kabinet arsip → web publik ganti bagan, lalu kembalikan ke Adhikara Karsa

**Dependencies:** Task 25

**Files likely touched:**
- `frontend/src/components/admin/KabinetAdmin.tsx` (baru)
- `frontend/src/pages/admin/AdminDashboard.tsx`

**Estimated scope:** Medium (3 files)

#### Task 27: Kelola Pengurus + Kelola Bidang (foto, kompresi, urutan)
**Description:** Halaman pengurus dengan upload foto terkompresi, pengaturan urutan, dan pengelolaan daftar bidang.

**Acceptance criteria:**
- [ ] Form: nama lengkap, NPM (opsional), kelompok (Pengurus Inti/Ketua Bidang), jabatan, bidang (wajib hanya untuk Ketua Bidang — input bidang otomatis muncul/nonaktif sesuai kelompok), foto, urutan, kabinet
- [ ] Foto dikompres di browser sebelum dikirim (canvas max 1600px, JPEG 0.82) — kode ditandai `ponytail:` menyebut alasan & cara pindah ke kompresi server
- [ ] Preview foto sebelum simpan + tombol ganti foto; tanpa foto tampil placeholder
- [ ] Rombak urutan bagan lewat input "urutan tampil" (angka) — tanpa drag-and-drop (YAGNI)
- [ ] CRUD bidang (tambah, ganti nama, hapus); hapus bidang yang masih dipakai menampilkan pesan jelas
- [ ] Daftar pengurus bisa difilter per bidang/kelompok

**Verification:**
- [ ] `npm run build` hijau
- [ ] Manual: upload foto 3 MB → tersimpan < 500 KB, tampil di bagan publik

**Dependencies:** Task 26

**Files likely touched:**
- `frontend/src/components/admin/PengurusAdmin.tsx` (baru)
- `frontend/src/components/admin/BidangAdmin.tsx` (baru)
- `frontend/src/pages/admin/AdminDashboard.tsx`

**Estimated scope:** Medium (3-4 files)

#### Task 28: Kelola Proker/Aker (filter, ubah status sekali klik)
**Description:** Halaman satu menu untuk proker + aker, dibedakan kolom Jenis.

**Acceptance criteria:**
- [ ] Form: nama kegiatan, jenis, bidang (termasuk Sekretaris Umum & Bendahara Umum), deskripsi, jadwal, gambar, status, kabinet
- [ ] Filter bidang + jenis + status; pencarian nama
- [ ] Klik badge status mengganti status (Rencana → Berjalan → Selesai) dan tersimpan ke API
- [ ] Hapus dengan konfirmasi; kegiatan kabinet lama tetap tampil sebagai arsip
- [ ] Import data awal terlihat: 48 kegiatan dari seeder muncul tanpa perlu input ulang

**Verification:**
- [ ] `npm run build` hijau
- [ ] Manual: ubah status 1 kegiatan → badge di halaman publik ikut berubah

**Dependencies:** Task 25

**Files likely touched:**
- `frontend/src/components/admin/ProkerAdmin.tsx` (baru)
- `frontend/src/pages/admin/AdminDashboard.tsx`

**Estimated scope:** Medium (3 files)

#### Task 29: KPI tambahan di overview + istilah & bersih-bersih
**Description:** Tambah angka KPI yang diminta dan rapikan istilah.

**Acceptance criteria:**
- [ ] KPI baru: jumlah pengurus aktif, jumlah proker/aker per status (Rencana/Berjalan/Selesai), jumlah bidang
- [ ] Istilah konsisten: Pengurus Inti, Ketua Himpunan, Wakil Ketua Himpunan, Sekretaris Umum, Bendahara Umum, Bidang, Ketua Bidang (tidak campur "Ketua Umum" pada halaman yang jadi dinamis)
- [ ] Widget "Mode Demo / Mock Data" lama pada aspirasi & berita ditinjau ulang: fallback mock tidak dipakai untuk data himpunan baru
- [ ] `openapi.yaml` + smoke test manual alur pengurus: login → ubah 1 data tiap menu → cek web publik

**Verification:**
- [ ] `npm run build` + `npm test -- --run` + `php artisan test` hijau
- [ ] Manual lengkap di HP (lebar 360px): semua form dashboard bisa dipakai

**Dependencies:** Task 25, Task 26, Task 27, Task 28

**Files likely touched:**
- `frontend/src/pages/admin/AdminDashboard.tsx`
- `backend/openapi.yaml`

**Estimated scope:** Small–Medium (2-3 files)

### Checkpoint: Phase 8
- [ ] Semua menu revisi bisa dipakai tanpa error dari HP
- [ ] Data dari dashboard langsung terlihat di halaman publik
- [ ] Demo ke client (Amie) sebelum mengerjakan R-07

### Phase 9: Opsional R-07 + Penutup (P2)

#### Task 30 (opsional, tunggu keputusan client): Aspirasi anonim + label ekspor
**Description:** Opsi kirim anonim atau keterangan bahwa identitas hanya dilihat pengurus, dan perjelas tombol ekspor.

**Acceptance criteria:**
- [ ] Kolom `is_anonymous` di `aspirations` + checkbox di form publik; dashboard menampilkan "Anonim" untuk pengirim anonim (nama & NIM tetap tersimpan untuk admin bila diisi)
- [ ] Keterangan di form: identitas hanya bisa dilihat pengurus
- [ ] Tombol "Ekspor CSV" diganti "Unduh CSV (bisa dibuka di Excel)"
- [ ] Ekspor `.xlsx` **tidak** dikerjakan kecuali client minta (butuh dependency baru)

**Verification:**
- [ ] `php artisan test` + `npm test -- --run` hijau
- [ ] Manual: kirim aspirasi anonim → tercatat, tampil sebagai Anonim di dashboard

**Dependencies:** Task 29

**Files likely touched:**
- `backend/database/migrations/..._add_is_anonymous_to_aspirations_table.php`
- `backend/app/Http/Controllers/AspirationController.php`
- `frontend/src/components/AspirationContact.tsx`
- `frontend/src/pages/admin/AdminDashboard.tsx`

**Estimated scope:** Medium (4-5 files)

#### Task 31: Test & dokumentasi penutup
**Description:** Tutup dengan test yang mengunci perilaku baru dan dokumen singkat untuk pengurus.

**Acceptance criteria:**
- [ ] Test backend untuk 6 resource baru (profil, kabinet+activate, bidang, pengurus+upload, proker+filter, kontak)
- [ ] Test frontend untuk minimal: VisionMission render dari props, filter Programs, kompresi foto terpanggil
- [ ] `README`/panduan singkat (bahasa Indonesia) untuk pengurus: cara login, ganti kepengurusan, aktifkan kabinet
- [ ] `tasks/todo.md` ditandai selesai

**Verification:**
- [ ] `php artisan test` hijau, `npm test -- --run` hijau, `npm run build` sukses
- [ ] Panduan diuji ikut alur oleh orang lain (atau role-play cepat)

**Dependencies:** Task 30 (atau Task 29 kalau R-07 ditunda)

**Files likely touched:**
- `backend/tests/Feature/*Test.php`
- `frontend/src/components/__tests__/`
- `README.md` / `docs/panduan-pengurus.md`

**Estimated scope:** Medium (5+ files — boleh dipecah saat eksekusi)

## Urutan kerja (jawaban "mulai dari mana")

1. **Task 13 → 14 → 15 → 16** (DB + seeder). Ini akar semua: halaman publik dan dashboard sama-sama bergantung ke skema ini. Seeder juga jadi bahan demo cepat.
2. **Task 17 → 20** (API). Kontrak API dikunci sebelum UI, supaya frontend tidak menebak bentuk data.
3. **Task 21 → 24** (halaman publik). Ini yang paling kelihatan oleh client — bisa didemokan cepat.
4. **Task 25 → 29** (dashboard).
5. **Task 30 → 31** (opsional + penutup).

Titik demo ke client: setelah Phase 5 (data masuk), setelah Phase 7 (web publik dinamis), setelah Phase 8 (dashboard selesai).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| File foto potongan pengurus belum diterima (zip terpisah, "menyusul") | Medium | Placeholder dipakai dulu; upload menyusul dari dashboard tanpa ubah kode |
| Logo kabinet belum ada ("menyusul") | Low | `logo_path` nullable, tampilkan logo default |
| Sekitar 48 baris proker diketik lewat dashboard = error ketik | Medium | Seeder diisi sekali dari dokumen; pengurus cukup mengedit, bukan input ulang |
| Nama pengurus diambil dari poster, bisa salah ejaan | Medium | Konfirmasi daftar nama ke client di checkpoint Phase 5 |
| Upload foto tanpa kompresi menghabiskan storage/kuota | Medium | Kompresi canvas di klien + validasi ukuran di server |
| `AdminDashboard.tsx` makin panjang & sulit dirawat | Medium | Tiap menu jadi komponen sendiri; shell hanya tab + navigasi |
| Halaman publik rusak saat API mati | High | `getSiteContentSafe()` + fallback teks; belum pakai mock data himpunan |
| Kabinet lama/salah diaktifkan menimpa data tampil | Medium | Transaction + penanda baris aktif + konfirmasi visual |
| Perubahan skema mengganggu fitur lama (berita/aspirasi) | Low | Tabel baru semua; `php artisan test` dijalankan tiap task |

## Open Questions

1. Zip file foto potongan pengurus ada di mana (path/link) — dan boleh langsung pakai hasil potongan poster atau tunggu file asli dari Medkominfo?
2. Logo kabinet Adhikara Karsa: kirim kapan, atau sementara pakai logo HMTP sebagai default?
3. NPM pengurus: sembunyikan total dari web publik (rekomendasi: sembunyikan, hanya di dashboard) — setuju?
4. R-07 dikerjakan sekarang atau setelah Phase 8 didemokan?
5. Ekspor `.xlsx` diperlukan, atau cukup CSV dengan label "bisa dibuka di Excel"?
6. Di halaman publik, proker/aker ditampilkan per bidang (accordion/tab) atau satu daftar panjang dengan filter?
7. Kontak WhatsApp perlu ditambah? (di dokumen tidak ada, tapi footer biasanya butuh)

---

# Implementation Plan v3: Penutupan & Kesiapan Rilis (hasil review 25 Okt 2026)

## Ringkasan

Review menyeluruh atas repo + aplikasi yang berjalan (bukan hanya baca kode): 29 test backend hijau,
landing page tampil dari DB, dashboard 9 tab, foto pengurus 14/14, mobile 360px tanpa overflow.
Yang menghalangi "beres": CI tidak bisa jalan (menunjuk file/script yang tidak ada), notifikasi email
aspirasi adalah kode mati, repo belum di-commit, tidak ada konfigurasi produksi dan panduan serah terima.

## Status terverifikasi (bukti, bukan klaim)

| Aspek | Hasil | Cara diverifikasi |
|---|---|---|
| Test backend | 29 passed (105 assertions) | `php artisan test` |
| Test frontend | 2 passed (hanya ErrorBoundary) | `npm test -- --run` |
| Build produksi | sukses 6.35s | `npm run build` |
| Data dev | users=1, news=4, members=14, dept=11, prog=49, profile=6, contact=1 | tinker setelah `migrate:fresh --seed` |
| Seeder idempoten | ya (news tetap 4 setelah seed 2x) | `db:seed` 2x + test baru |
| Foto pengurus | 14/14 ada file, URL 200 | `curl /storage/pengurus/...` |
| Landing (360px) | 20 gambar, 0 rusak, 0 tanpa alt, tidak ada overflow | Chrome DevTools di 4173 |
| Dashboard admin | 9 tab, Pengurus 14 baris, Berita 4 kartu, KPI terisi | browser + token Sanctum |
| Alur aspirasi publik | POST → 201 + baris masuk DB | `curl /api/aspirations` (data uji dihapus) |
| Endpoint admin tanpa token | 401 semua | `HmtpSiteTest` |

## Temuan yang harus dibereskan

**P0 — menghalangi rilis**

1. CI mustahil hijau: `cp .env.testing .env` tapi `backend/.env.testing` tidak ada; `composer run-script
   static-analysis` tidak ada di `composer.json` dan PHPStan tidak terpasang; job `phase3-check` hanya
   `echo` centang, bukan verifikasi; `npm test` tidak dijalankan di CI.
2. Notifikasi email aspirasi tidak pernah terkirim: `sendAdminNotification()` tidak dipanggil dari mana pun,
   `config('mail.admin_email')` tidak ada (fallback hardcode `humashmtp@unisba.ac.id`),
   `MAIL_MAILER=log`, dan notifikasi status user bisa jatuh ke `recipient@example.com`.
   Klaim todo "Task 8: Email Notification System" belum benar-benar jalan.
3. Repo belum di-commit: 31 modified + 68 untracked (termasuk seluruh controller/model/migrasi baru),
   `backend/composer.phar` ikut nyangkut, tidak ada `.gitignore` di root.
4. Tidak ada konfigurasi produksi: `frontend/.env` tidak ada → build produksi memanggil `localhost:8000`;
   `.env` dev `APP_DEBUG=true`, `APP_ENV=local`, CORS `allowed_origins: ['*']`.
5. Tidak ada dokumen serah terima: `docs/` tidak ada; pengurus tidak punya panduan pakai dashboard.

**P1 — kualitas & pengalaman**

6. Tab admin (Pengurus/Proker/Bidang) butuh >3 detik di mesin ini dengan teks "Memuat data..." — tidak ada
   skeleton, padahal `Skeleton.tsx` sudah ada.
7. A11y tombol menu mobile: tidak ada `aria-label`/`aria-expanded` (hanya `<span class="sr-only">`).
8. Password admin default `Adhikara2026!` tertulis di seeder & repo — wajib diganti saat deploy, belum ada
   mekanisme ganti password di dashboard.
9. Cakupan test frontend sangat tipis (1 file) sementara `unwrapList` (parser bentuk respons API) tidak
   punya test — kelas bug yang kemarin muncul (data list jadi kosong) tidak terjaga.
10. `openapi.yaml` hanya memuat 6 path, sedangkan `routes/api.php` punya ~40 endpoint.

**P2 — kerapian**

11. Dependensi mati di frontend: `jest`, `jest-environment-jsdom`, `@types/jest` (test runner sebenarnya
    `vitest`).
12. Artefak di repo: `backend/composer.phar`, `assets/Foto_Pengurus_HMTP_2026-2027 (1).zip`, gambar
    berserakan di `assets/` dan `frontend/src/assets/`.

## Task List

### Phase 10: Rilis-blocker (P0)

**Task 32: CI yang benar-benar jalan**

Description: Buat prasyarat CI ada, buang langkah palsu, tambahkan gate test frontend.

Acceptance criteria:
- [ ] `backend/.env.testing` ada (sqlite `:memory:` + `APP_KEY` di-generate saat CI)
- [ ] Tidak ada langkah CI yang menunjuk file/script yang tidak ada (`static-analysis` dihapus atau
      PHPStan + script-nya benar-benar ditambahkan)
- [ ] Job `phase3-check` yang hanya `echo` dihapus
- [ ] CI menjalankan `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build`,
      dan `php artisan test`
- [ ] Service MySQL di job backend dihapus (test memakai sqlite `:memory:`)

Verification:
- [ ] `php artisan test` hijau dengan `DB_CONNECTION=sqlite DB_DATABASE=:memory:`
- [ ] `npm run typecheck && npm run lint && npm test -- --run && npm run build` hijau
- [ ] `yamllint`/`python -c "import yaml,sys;yaml.safe_load(open('.github/workflows/cicd.yml'))"` sukses

Dependencies: None. Files: `.github/workflows/cicd.yml`, `backend/.env.testing`, `backend/composer.json`. Scope: S.

**Task 33: Notifikasi email aspirasi benar-benar berfungsi**

Description: Panggil notifikasi yang sudah ada, buang alamat placeholder, buat pengaturannya nyata.

Acceptance criteria:
- [ ] `store()` memanggil `sendAdminNotification()`; `updateStatus()` tidak pernah mengirim ke
      `recipient@example.com` (lewati kalau email kosong)
- [ ] `config/mail.php` punya `admin_email` dari env `MAIL_ADMIN_EMAIL`, ada di `.env.example`
- [ ] Ada test: aspirasi baru → 1 email ke admin (`Mail::fake`), perubahan status tanpa email → 0 email
- [ ] `MAIL_FROM_ADDRESS` bukan `hello@example.com`

Verification:
- [ ] `php artisan test --filter=Aspiration` hijau
- [ ] Manual: kirim aspirasi di `MAIL_MAILER=log` → `storage/logs/laravel.log` memuat Subject email admin

Dependencies: None. Files: `app/Http/Controllers/AspirationController.php`, `config/mail.php`,
`backend/.env.example`, `tests/Feature/AspirationControllerTest.php`. Scope: M.

**Task 34: Konfigurasi produksi + dokumentasi deploy**

Description: Semua yang harus diubah agar aplikasi jalan di domain asli, bukan localhost.

Acceptance criteria:
- [ ] `frontend/.env.production` (atau panduan env) berisi `VITE_API_URL` domain API asli
- [ ] Daftar env backend wajib: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `MAIL_*`,
      `MAIL_ADMIN_EMAIL`, `SESSION_DRIVER`, `QUEUE_CONNECTION`
- [ ] `config/cors.php` `allowed_origins` diisi domain website (bukan `*`)
- [ ] `docs/DEPLOY.md` memuat urutan: `composer install --no-dev`, `migrate --force --seed`,
      `storage:link`, `config:cache`, `route:cache`, build frontend, arahkan web root
- [ ] Backup `database/database.sqlite` dijadwalkan (atau pindah ke MySQL) dan dicatat di dokumen

Verification:
- [ ] `npm run build` dengan `VITE_API_URL` produksi → `grep -r localhost frontend/dist` kosong
- [ ] `php artisan config:cache && php artisan route:cache` sukses tanpa error

Dependencies: None. Files: `frontend/.env.example`, `backend/.env.example`, `backend/config/cors.php`,
`docs/DEPLOY.md`. Scope: M.

**Task 35: Rapikan repo dan commit**

Description: Sisakan repo bersih supaya hasil kerja tidak hilang dan bisa di-review/di-deploy.

Acceptance criteria:
- [ ] `.gitignore` root menutup `node_modules/`, `dist/`, `.probe/`, `composer.phar`, file zip besar
- [ ] `backend/composer.phar` dihapus dari folder; zip foto dipindah keluar repo (atau di-ignore)
- [ ] Seluruh sumber baru (migrasi, model, controller, test, halaman React) ter-commit, dipisah per blok:
      fondasi data, API, halaman publik, dashboard, perbaikan review
- [ ] `git status --short` bersih; tidak ada file > 10 MB di index

Verification:
- [ ] `git status --short` tanpa baris; `git log --oneline | head` menunjukkan commit bertema
- [ ] `git ls-files | wc -l` jauh di atas 106

Dependencies: Task 32 (CI harus lolos sebelum commit besar). Files: `.gitignore`, `backend/.gitignore`. Scope: S.

### Checkpoint: Phase 10 (Rilis-blocker)
- [ ] `php artisan test` hijau; `npm test -- --run` + `npm run build` hijau
- [ ] Tidak ada langkah CI yang menunjuk file yang tidak ada
- [ ] Notifikasi aspirasi terbukti terpanggil (test Mail::fake)
- [ ] `git status` bersih
- [ ] Review dengan pemilik proyek sebelum lanjut

### Phase 11: Serah terima & kualitas (P1)

**Task 36: Panduan pengurus + README**

Acceptance criteria:
- [ ] `docs/PANDUAN_PENGURUS.md`: cara login, kelola profil/kabinet/bidang/pengurus/proker/kontak,
      unggah + urutkan foto, aktifkan kabinet sekali klik, kotak aspirasi + ekspor CSV, ganti password
- [ ] `README.md` root: cara menjalankan lokal (backend + frontend), build, deploy, akun admin awal +
      peringatan wajib ganti password
- [ ] Bahasa Indonesia, ada tangkapan layar atau daftar langkah bernomor

Verification: [ ] Pengurus (atau pemilik proyek) mengikuti panduan tanpa dibantu dan berhasil mengubah 1 data.

Dependencies: Task 25-29 (fitur dashboard). Files: `docs/PANDUAN_PENGURUS.md`, `README.md`. Scope: S.

**Task 37: Perbaikan UX & aksesibilitas**

Acceptance criteria:
- [ ] Tombol menu mobile punya `aria-label`, `aria-expanded`, `aria-controls`
- [ ] Tab admin yang memuat lama memakai `Skeleton` (bukan teks "Memuat data...")
- [ ] Tombol ikon (Edit/Hapus/Refresh) punya `aria-label`; gambar tetap punya `alt`
- [ ] Menu bisa dibuka/ditutup pakai keyboard saja

Verification:
- [ ] Lighthouse aksesibilitas halaman utama ≥ 95
- [ ] Cek browser 360px: menu buka/tutup, tidak ada overflow horizontal

Dependencies: None. Files: `frontend/src/components/Navbar.tsx`, `frontend/src/pages/admin/tabs/*.tsx`. Scope: S.

**Task 38: Kredensial & keamanan rilis**

Acceptance criteria:
- [ ] Fitur ganti password admin (atau prosedur `php artisan tinker` yang didokumentasikan)
- [ ] Password default di seeder diganti/tidak dipakai di produksi; token demo dicabut
- [ ] `APP_DEBUG=false` di produksi; rate limit login (5/menit) dan aspirasi (20/menit) tetap aktif
- [ ] Tidak ada `.env` yang ter-commit

Verification: [ ] `git ls-files | grep -c "\.env$"` = 0; login 6x gagal → 429.

Dependencies: Task 34. Files: `app/Http/Controllers/AuthController.php`, `database/seeders/AdminUserSeeder.php`. Scope: S.

**Task 39: Verifikasi akhir & serah terima**

Acceptance criteria:
- [ ] Semua gate hijau: `php artisan test`, `npm test -- --run`, `npm run build`, CI
- [ ] Uji di HP asli: menu, form aspirasi, unggah foto dari kamera
- [ ] Tabel bukti R-01...R-07 vs hasil (ada/tidak) disiapkan
- [ ] Berita acara serah terima + daftar sisa pekerjaan (backlog) ditandatangani

Verification: [ ] Satu sesi demo telusur dari HP dengan data asli himpunan.

Dependencies: Task 32-38. Files: `docs/SERAH_TERIMA.md`. Scope: S.

### Checkpoint: Selesai
- [ ] Semua temuan P0 & P1 tertutup atau tercatat sebagai backlog yang disetujui
- [ ] Repo bersih, ter-commit, CI hijau
- [ ] Dokumen serah terima lengkap

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Kredensial SMTP dari client belum ada | Medium | Sementara `MAIL_MAILER=log` + beri tahu client bahwa notifikasi menyala setelah SMTP diisi |
| SQLite tidak cocok untuk trafik publik | Medium | Catat opsi pindah MySQL di `docs/DEPLOY.md`; skema sudah kompatibel |
| Perubahan hanya di lokal, bukan di server | High | Task 35 (commit) + Task 34 (deploy) sebelum serah terima |
| Password default bocor dari repo lama | Medium | Task 38: ganti password + `git filter-repo` bila nilai pernah ter-commit |
| Uji HP asli tertunda | Low | Uji browser 360px sebagai ganti sementara, catat sebagai backlog |

## Open Questions (terjawab pemilik proyek 25 Okt 2026)

1. Hosting tujuan → **deploy ditunda** sampai website benar-benar beres. Task 34 turun jadi "siapkan konfigurasi
   MySQL + contoh `.env` produksi"; `docs/DEPLOY.md` ditulis saat mau naik ke hosting.
2. SMTP/email → **tidak dipakai**. Tidak ada balasan email otomatis, semua manual.
3. Notifikasi aspirasi → **tidak lewat email**. Pengirim dapat formulir Google Form/website, notifikasi cukup
   **masuk ke dashboard admin**. Seluruh kode email aspirasi dihapus (net deletion, bukan ditambal).
4. Ganti password → **dibuatkan menu di dashboard admin** (Task 41).
5. Database → **pindah ke MySQL** untuk dev & produksi; test tetap sqlite `:memory:` (Task 40).
6. Zip foto pengurus → **disimpan di luar repo** (`Documents/hmtp-assets/`), bukan dihapus (Task 35).

## Revisi Task List (hasil jawaban di atas)

- **Task 33 (DIREVISI → penghapusan)** Buang kode notifikasi email aspirasi: `sendAdminNotification()`/
  `sendUserNotification()` di `AspirationController`, `app/Mail/Aspiration*Mail.php`,
  `resources/views/emails/aspiration-*.blade.php`, import `Mail`, kunci `mail.admin_email`.
  Kriteria: `grep -rn "Mail::" app/` kosong; POST aspirasi tetap 201 dan muncul di dashboard;
  `php artisan test` hijau (test `Mail::fake` dibatalkan karena fitur email memang tidak dipakai).
- **Task 34 (DIREVISI)** Konfigurasi produksi tanpa deploy: contoh `.env.production`, `VITE_API_URL`,
  `APP_DEBUG=false`, CORS domain asli, `storage:link`, catatan backup `mysqldump`.
- **Task 40 (BARU, P0)** Pindah DB ke MySQL: buat database `hmtp_unisba`, arahkan `.env` ke
  `DB_CONNECTION=mysql`, `php artisan migrate:fresh --seed`, buktikan semua migrasi lolos di MySQL
  (bukan hanya sqlite). Verifikasi: `migrate` tanpa error, `members=14`, `/api/site` 200, `php artisan test` hijau.
- **Task 41 (BARU, P1)** Menu ganti password di dashboard: `POST /api/auth/password` (verifikasi password lama,
  `min:8`, konfirmasi) + tab "Akun" di dashboard + test.
- **Task 42 (BARU, P1)** Penanda aspirasi baru di dashboard (jumlah "Pending" menonjol) sebagai pengganti
  notifikasi email.
- **Task 38 (DIKECILKAN)** Token demo dicabut, `.env` tidak ter-commit, rate limit login/aspirasi tetap aktif
  (ganti password pindah ke Task 41).

---

# Plan v4 — Penutupan Fitur & Fungsi (review eksekusi 25 Okt 2026)

## Ringkasan

Website sudah bisa jalan: 40 endpoint API hidup, 10 tab dashboard, landing 9 section, MySQL ter-seed,
37 test backend + 7 test frontend hijau. Yang tersisa bukan "belum ada kode", tapi **kode yang ada belum
tersambung** dan **kerja 25 Okt belum masuk repo**. Plan v4 menutup itu, bukan menambah fitur baru.

## Temuan terverifikasi (triage)

| # | Aspek | Hasil observasi | Cara verifikasi |
|---|-------|-----------------|-----------------|
| P0-1 | Landing "Program Unggulan" statis | `components/Programs.tsx` memuat 4 kartu hardcode; DB punya 49 proker (16 Program Kerja, 33 Aktivitas Kerja). Edit di tab Proker tidak mengubah landing | `grep` + `curl /api/site` -> `programs=49` |
| P0-2 | Berita tidak bisa dibaca utuh | `content` ada di API (id=1: 218 karakter) tapi `News.tsx` hanya render `excerpt`; "Baca Selengkapnya" = `href="#news"`; `getNewsById` nol pemanggil | `grep getNewsById` -> hanya definisi; `curl /api/news/1` |
| P0-3 | Error validasi 422 tidak terbaca | 6 tab CRUD menangkap error jadi toast generik ("Gagal menyimpan pengurus"). Hanya `AccountTab` membaca `response.data.errors` | `grep "data?.errors"` -> 1 berkas |
| P0-4 | Kerja 25 Okt belum di repo | 109 berkas berubah/belum dilacak, `origin/main` masih `c946bd9` | `git status --short` = 109, `git rev-parse @{u}` |
| P1-1 | Hapus kabinet tanpa jalan masuk | `DELETE /api/cabinets/{id}` + `deleteCabinet()` ada; `CabinetTab` tidak memanggilnya, tak ada tombol Hapus | `grep deleteCabinet` -> hanya `api.ts` |
| P1-2 | Sejarah/About/Makna Logo statis | 0 referensi API di `History.tsx`, `About.tsx`, `LogoMeaning.tsx`, `Hero.tsx`; hanya `VisionMission` ambil dari DB | `grep useSiteData` |
| P1-3 | Blok kontak ganda | `Footer.tsx` pakai `/api/site`; `AspirationContact.tsx` hardcode IG/TikTok/Gmail | `grep instagram` di kedua berkas |
| P1-4 | Kategori aspirasi beda | Frontend 4 opsi, backend `in:Saran,Kritik,Akademik,Kegiatan,Fasilitas,Organisasi,Lainnya` (3 tak bisa dipilih) | `grep "option value"` vs `AspirationController:63` |
| P1-5 | Modal & form a11y | Modal tanpa `role="dialog"`/`aria-modal`/Escape; 25 input CRUD tanpa `htmlFor`; CSV <=100 baris | `grep role="dialog"` -> 0 |
| P1-6 | Test tipis | 37 backend / 7 frontend; tak ada test CRUD members/programs/departments/cabinets/profile/contact, tak ada test baca berita | `ls tests/Feature` + hitung `@test` |
| P1-7 | `openapi.yaml` 6 dari 40 endpoint | Dokumentasi API tidak mencerminkan kenyataan | `route:list` (40) vs openapi |
| P1-8 | Jalan pasang belum terdokumentasi | `README` §4 checklist 8 langkah; `docs/DEPLOY.md` belum ada; rewrite SPA hanya `_redirects` (Netlify) | `ls docs`, `cat public/_redirects` |
| P2 | Kerapian | `AdminDashboard.tsx` 1213 baris; `_loading` mati; `getAdminProfile` nol pemanggil; 89 kelas arbitrer; 6 komponen >200 baris; 20 `console.error`; `api.ts:32` `any` | scan skrip |

## Task List

### Phase 12: Fitur yang belum tersambung (P0)

**Task 43: Landing "Program Kerja" ambil dari API** (S)

Description: `components/Programs.tsx` berhenti memakai 4 kartu hardcode; render `type='Program Kerja'` dari
`useSiteData()` (16 baris) beserta bidang dan status, dengan skeleton saat memuat dan empty state bila kosong.

Acceptance:
- [ ] Tidak ada lagi array `majorPrograms` hardcode di `Programs.tsx`
- [ ] Menambah proker `type='Program Kerja'` lewat dashboard -> muncul di landing setelah reload
- [ ] `type='Aktivitas Kerja'` tidak ikut tampil di section unggulan

Verification: `npm run typecheck && npm run build`; browser: jumlah kartu = jumlah proker `Program Kerja` di API.
Dependencies: None. Files: `components/Programs.tsx`, `hooks/useSiteData.ts`. Scope: S.

**Task 44: Berita bisa dibaca utuh** (S)

Description: tambah tampilan detail artikel (modal) yang memakai `getNewsById`, render `content` sebagai paragraf
(bukan HTML mentah), tombol "Baca Selengkapnya" membuka detail; perbaiki tipe `getNewsById`
(`{success,message,data}` bukan `NewsArticle`).

Acceptance:
- [ ] Klik "Baca Selengkapnya" menampilkan judul + tanggal + author + isi lengkap
- [ ] Escape/klik luar menutup detail; fokus kembali ke tombol asal
- [ ] `getNewsById` punya pemanggil dan tipe respons benar

Verification: `npm run typecheck`, `npm test -- --run`, cek manual di browser 390px & 1440px.
Dependencies: None. Files: `components/News.tsx`, `services/api.ts`, `types/index.ts`. Scope: S.

**Task 45: Pesan validasi 422 terbaca di semua tab admin** (S)

Description: satu helper `pesanError(err)` yang mengubah `response.data.errors` jadi kalimat Indonesia
(field pertama + pesannya); dipakai 6 tab CRUD + modal berita, menggantikan toast generik.

Acceptance:
- [ ] Simpan pengurus tanpa nama -> pesan menyebut "Nama Lengkap wajib diisi", bukan "Gagal menyimpan"
- [ ] Berlaku sama untuk Proker, Bidang, Kabinet, Profil, Kontak, Berita
- [ ] Error jaringan (tanpa `response`) tetap jadi pesan umum yang jelas

Verification: uji manual tiap form dengan payload tidak valid; `npm run typecheck`.
Dependencies: None. Files: `services/api.ts` (helper), 6 tab + `AdminDashboard.tsx`. Scope: S.

**Task 46: Commit + push bertema** (S)

Description: 109 berkas dipecah jadi beberapa commit bertema (backend API & keamanan, frontend UI & a11y,
dokumentasi & CI, aset) lalu push ke `origin/main`.

Acceptance:
- [ ] `git status --short` bersih, `git log` memuat >=4 commit deskriptif
- [ ] `.env` tidak ikut ter-commit (`git ls-files | grep -v example` kosong untuk berkas env)
- [ ] `origin/main` memuat commit terbaru

Verification: `git status`, `git log --oneline -6`, `git ls-remote origin main`.
Dependencies: None (boleh jalan paralel dengan 43-45). Files: repo. Scope: S.

### Checkpoint: Phase 12
- [ ] Program kerja & berita di landing berasal dari database
- [ ] Form admin memberi tahu field yang salah
- [ ] Repo bersih & ter-push; gate hijau (`php artisan test`, `npm test`, `npm run build`)

### Phase 13: Kelengkapan fungsi (P1)

**Task 47: Hapus kabinet dari dashboard** (XS)

Description: tombol Hapus di `CabinetTab` memakai `deleteCabinet()` yang sudah ada, dengan konfirmasi;
kabinet aktif tidak boleh dihapus (aktifkan kabinet lain dulu).

Acceptance:
- [ ] Kabinet non-aktif bisa dihapus dan hilang dari daftar
- [ ] Tombol hapus untuk kabinet aktif ditolak dengan pesan jelas

Verification: uji manual + `php artisan test` (endpoint-nya sudah punya test backend).
Dependencies: Task 45. Files: `tabs/CabinetTab.tsx`. Scope: XS.

**Task 48: Blok kontak & kategori aspirasi konsisten** (S)

Description: `AspirationContact.tsx` mengambil IG/TikTok/email dari `/api/site` (bukan hardcode), dan daftar
kategori aspirasi disamakan dengan aturan backend (7 opsi) atau backend dipersempit ke 4 — pilih satu arah.

Acceptance:
- [ ] Mengubah kontak di dashboard mengubah blok "Layanan & Kontak"
- [ ] Setiap kategori yang bisa dipilih pengunjung diterima backend (tidak ada 422)

Verification: ubah kontak via dashboard -> reload landing; POST aspirasi untuk tiap kategori.
Dependencies: None. Files: `components/AspirationContact.tsx`, `AspirationController.php`. Scope: S.

**Task 49: Modal & form admin aksesibel** (M)

Description: modal aspirasi & berita diberi `role="dialog"`, `aria-modal`, fokus awal ke tombol tutup,
Escape menutup, fokus dikembalikan; 25 input CRUD diberi `id`+`htmlFor` (mengikuti pola `AccountTab`).

Acceptance:
- [ ] Tab tidak bisa keluar dari modal saat terbuka; Escape menutup
- [ ] Setiap input punya label terhubung (grep `<label` tanpa `htmlFor` = 0 di tab admin)

Verification: uji keyboard manual + test Navbar tetap hijau + `npm run typecheck`.
Dependencies: Task 45. Files: `AdminDashboard.tsx`, 6 tab. Scope: M.

**Task 50: Ekspor CSV tidak memotong data** (XS)

Description: ekspor mengambil seluruh halaman (`per_page=100` berulang sampai `last_page`) sebelum menulis CSV,
dan memberi tahu jumlah baris yang diekspor.

Acceptance:
- [ ] Dengan >100 aspirasi, CSV memuat semua baris
- [ ] Toast menyebut jumlah baris

Verification: tanam 150 baris di DB lokal, ekspor, hitung baris CSV.
Dependencies: None. Files: `AdminDashboard.tsx`, `services/api.ts`. Scope: XS.

**Task 51: Test untuk CRUD yang belum tersentuh** (M)

Description: test feature untuk members, programs, departments, cabinets, profile-items, contact (create/update/
delete + 422 + 401), plus test frontend untuk detail berita dan helper `pesanError`.

Acceptance:
- [ ] `php artisan test` naik dari 37 ke >=50 dan tetap hijau
- [ ] `npm test -- --run` mencakup detail berita + pesan error

Verification: `php artisan test`, `npm test -- --run`.
Dependencies: Task 43-45. Files: `backend/tests/Feature/*`, `frontend/src/**/__tests__/*`. Scope: M.

### Checkpoint: Phase 13
- [ ] Semua endpoint punya minimal satu test
- [ ] Dashboard bisa dipakai tanpa mouse
- [ ] Data kontak & proker satu sumber (database)

### Phase 14: Rilis & dokumentasi (P1)

**Task 52: `openapi.yaml` lengkap** (S)

Description: dokumentasikan 40 endpoint yang benar-benar ada (method, path, auth, body, respons), dibangkitkan
manual dari `route:list`.

Acceptance: [ ] Jumlah path = jumlah route `api/*`; [ ] Contoh request untuk tiap POST/PUT.
Verification: bandingkan `php artisan route:list --path=api --json` dengan berkas.

**Task 53: `docs/DEPLOY.md`** (S)

Description: langkah pasang di hosting: `composer install --no-dev`, `.env` produksi (`APP_DEBUG=false`,
`APP_ENV=production`, CORS domain asli), `migrate --force`, `storage:link`, rewrite SPA untuk Nginx/Apache,
backup `mysqldump`, ganti password admin.

Acceptance:
- [ ] Satu halaman, urutan perintah bisa diikuti tanpa bertanya
- [ ] Rewrite SPA tercantum untuk Nginx dan Apache
- [ ] `APP_DEBUG=false` eksplisit

Verification: ikuti dokumen di lingkungan lokal (tanpa deploy) sampai `/api/site` 200.

**Task 54: Pecah `AdminDashboard.tsx`** (M)

Description: 1213 baris -> `OverviewTab`, `AspirationsTab`, `NewsTab` (modal ikut), dashboard tinggal shell +
tab router. Buang `_loading` dan `getAdminProfile` yang tak terpakai.

Acceptance:
- [ ] Tidak ada berkas >400 baris di `pages/admin`
- [ ] Perilaku & tampilan identik
- [ ] build hijau

Verification: `npm run typecheck`, `npm test -- --run`, `npm run build`, telusur 10 tab di browser.

### Checkpoint: Selesai (v4)
- [ ] Semua P0 tertutup; P1 tertutup atau disetujui sebagai backlog
- [ ] Repo bersih, ter-push, CI hijau
- [ ] `docs/DEPLOY.md` + `openapi.yaml` ada
- [ ] Pemilik proyek menandatangani berita acara (Task 39)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Task 46 (push) tertunda lalu laptop bermasalah | High | Kerjakan lebih dulu, sebelum refactor apa pun |
| Section publik lain (sejarah, makna logo) tetap statis | Medium | Ditanyakan dulu; kalau pengurus tidak perlu mengubahnya, biarkan dan catat di backlog |
| Pecah `AdminDashboard.tsx` menimbulkan regresi | Medium | Kerjakan paling akhir, setelah test frontend bertambah (Task 51) |
| Data proker belum punya jadwal/gambar (0 dari 49) | Medium | Isi lewat dashboard setelah Task 43; bukan pekerjaan kode |
| Uji HP asli belum bisa dilakukan agent | Low | Ganti dengan Chromium 390px; catat sebagai sisa untuk manusia |

## Open Questions (dijawab pemilik proyek 25 Okt 2026, dari `Revisi_Website_HMTP_UNISBA.docx`)

1. "Program Unggulan" di landing → **diganti**: tampilkan `type='Program Kerja'` dari database (16 kartu), bukan
   4 kartu hardcode. Nama section jadi "Program Kerja Kabinet". (Task 43, selesai)
2. Pengurus **tidak perlu** mengedit Sejarah / Tentang Kami / Makna Logo dari dashboard → tetap statis, tidak
   dibuat tabel/tab baru. `VisionMission` (visi & misi) tetap dari database sesuai R-01.
3. Kabinet lama → **diarsipkan**, bukan dihapus bebas. Yang aktif hanya satu; tombol hapus hanya untuk kabinet
   yang tidak aktif. (Task 47 disesuaikan)
4. Hosting → **nanti saja**; `docs/DEPLOY.md` tetap ditulis (Task 53) tapi deploy ditunda.

Catatan tambahan dari dokumen revisi (untuk Task 44-54):
- R-03: bagan hanya Pengurus Inti + Ketua Bidang (staf tidak ditampilkan) — sudah sesuai.
- R-04: status proker bisa diganti sekali klik di dashboard — belum ada, masuk backlog Task 47/51.
- R-06: KPI tambahan "jumlah pengurus aktif" + "proker per status" — sebagian ada (aspirasi/berita), perlu ditambah.
- R-07: tombol ekspor diperjelas jadi "Unduh CSV (bisa dibuka di Excel)" — belum, masuk Task 50.
