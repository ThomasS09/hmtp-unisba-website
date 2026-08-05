# Website Resmi HMPT UNISBA

> Website resmi **Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung (UNISBA)** sebagai media informasi, publikasi kegiatan, dan komunikasi organisasi.

![Status](https://img.shields.io/badge/Status-Development-yellow)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Laravel-FF2D20)
![Database](https://img.shields.io/badge/Database-MySQL-4479A1)

---

## 📖 Tentang Project

Website HMPT UNISBA dikembangkan untuk memberikan informasi yang mudah diakses oleh mahasiswa maupun masyarakat umum mengenai kegiatan, organisasi, dan berbagai informasi resmi HMPT.

Project ini menggunakan arsitektur **Frontend** dan **Backend** yang terpisah sehingga memudahkan pengembangan secara kolaboratif menggunakan GitHub.

---

# 🎯 Tujuan

- Menyediakan media informasi resmi HMPT UNISBA.
- Menampilkan berita dan kegiatan terbaru.
- Memperkenalkan profil organisasi.
- Menjadi media komunikasi antara HMPT dan mahasiswa.
- Mempermudah pengelolaan konten melalui dashboard admin.

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Backend

- Laravel
- Laravel REST API

## Database

- MySQL

## Version Control

- Git
- GitHub

---

# 🎨 Design System

Website mengadopsi identitas visual HMPT UNISBA berdasarkan warna logo organisasi.

| Warna | Hex | Penggunaan |
|--------|-----|------------|
| Primary Yellow | `#FFD400` | Button, Highlight, Icon |
| Black | `#111111` | Navbar, Footer, Heading |
| White | `#FFFFFF` | Background |
| Light Gray | `#F5F5F5` | Section Background |
| Dark Gold | `#E6B800` | Hover Effect |

### Font

- Poppins
- Inter

### Konsep UI

- Modern
- Clean
- Responsive
- Minimalis
- Professional

---

# 📂 Struktur Project

```
hmpt-unisba-website/
│
├── frontend/          # React + Vite
├── backend/           # Laravel REST API
├── docs/              # Dokumentasi Project
├── assets/            # Logo & Asset
└── README.md
```

---

# 🚀 Roadmap

## Phase 1

### Home Page

- [ ] Responsive Navbar
- [ ] Hero Section
- [ ] Tentang HMPT
- [ ] Visi & Misi
- [ ] Sambutan Ketua Himpunan
- [ ] Divisi HMPT
- [ ] Berita Terbaru
- [ ] Event Terbaru
- [ ] Galeri Kegiatan
- [ ] Footer

---

## Phase 2

- [ ] Profil HMPT
- [ ] Struktur Organisasi
- [ ] Berita
- [ ] Detail Berita
- [ ] Event
- [ ] Detail Event
- [ ] Galeri
- [ ] Prestasi
- [ ] Kontak

---

## Phase 3

Dashboard Admin

- [ ] Login
- [ ] Dashboard
- [ ] Kelola Berita
- [ ] Kelola Event
- [ ] Kelola Galeri
- [ ] Kelola Pengurus
- [ ] Kelola Banner

---

# 👥 Pembagian Tim

| Bagian | Teknologi |
|---------|-----------|
| Frontend | React.js |
| Backend | Laravel |
| Database | MySQL |
| UI/UX | Figma |

---

# ⚙️ Instalasi

## Clone Repository

```bash
git clone https://github.com/USERNAME/hmpt-unisba-website.git
```

---

## Frontend

Masuk ke folder frontend

```bash
cd frontend
```

Install dependency

```bash
npm install
```

Menjalankan project

```bash
npm run dev
```

---

## Backend

Masuk ke folder backend

```bash
cd backend
```

Install dependency

```bash
composer install
```

Salin file environment

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Konfigurasi database pada file `.env`, kemudian jalankan migrasi

```bash
php artisan migrate
```

Menjalankan server Laravel

```bash
php artisan serve
```

---

# 🌐 Struktur Halaman

```
Home
│
├── Navbar
├── Hero Banner
├── Tentang HMPT
├── Visi & Misi
├── Sambutan Ketua
├── Divisi HMPT
├── Berita Terbaru
├── Event Terbaru
├── Galeri
└── Footer
```

---

# 📌 Status Project

Saat ini project masih berada pada tahap **pengembangan awal (MVP)** dengan fokus pada implementasi **halaman Home** sebagai fondasi utama website.

---

# 📄 License

Project ini dikembangkan sebagai Website Resmi Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung (HMPT UNISBA).

© 2026 HMPT UNISBA. All Rights Reserved.