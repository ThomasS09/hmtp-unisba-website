# Panduan Deploy — Website HMTP UNISBA

Ditulis supaya pemasangan tidak bergantung pada orang yang membangun repo.
Dua bagian: hosting **satu domain** (paling murah) dan **dua domain** (frontend
statis + API terpisah). Pilih salah satu.

---

## 0. Yang harus ada di server

| Kebutuhan | Versi minimal | Catatan |
| --- | --- | --- |
| PHP | 8.2 | ekstensi `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `gd`, `zip` |
| MySQL/MariaDB | 8.0 / 10.4 | charset `utf8mb4`, collation `utf8mb4_unicode_ci` |
| Nginx | 1.18 | atau Apache 2.4 + `mod_rewrite` |
| PHP-FPM | sama dengan PHP | **wajib** — lihat bagian 6 |
| Node.js | 20 | hanya untuk build frontend, tidak perlu di server produksi |

> Jangan pakai `php artisan serve` di produksi. Server bawaan Laravel melayani
> satu permintaan sekaligus (±1 detik/permintaan di mesin lokal), sehingga
> dashboard yang memuat beberapa data sekaligus akan tampak "lambat/mati".
> Selalu PHP-FPM di belakang Nginx/Apache.

---

## 1. Susunan berkas di server (satu domain)

```
/var/www/hmtp/
├── backend/                  # isi repo backend/ (Laravel)
│   ├── public/               # document root API
│   └── storage/app/public/   # foto pengurus (hasil storage:link)
└── frontend-dist/            # hasil `npm run build` (isi frontend/dist)
```

Nginx melayani `frontend-dist/` sebagai situs statis dan meneruskan `/api/*`
serta `/storage/*` ke `backend/public/index.php`.

---

## 2. Langkah backend

```bash
cd /var/www/hmtp/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

Isi `.env` produksi:

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hmtpunisba.or.id
APP_LOCALE=id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=hmtp_unisba
DB_USERNAME=hmtp_user
DB_PASSWORD=...            # bukan root, bukan kosong

CORS_ALLOWED_ORIGINS=https://hmtpunisba.or.id,https://www.hmtpunisba.or.id
SESSION_DRIVER=database
CACHE_STORE=file
QUEUE_CONNECTION=database
```

Lalu:

```bash
php artisan migrate --force
php artisan db:seed --force          # data awal; seed ulang aman (idempoten)
php artisan storage:link
php artisan config:cache route:cache view:cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

Ganti password admin bawaan sesudah login pertama (menu **Akun**).

---

## 3. Langkah frontend

```bash
cd frontend
cp .env.production.example .env.production
# isi: VITE_API_URL=https://hmtpunisba.or.id/api
npm ci
npm run build          # hasil: frontend/dist/
```

Salin isi `frontend/dist/` ke `/var/www/hmtp/frontend-dist/`.
Build ulang setiap kali frontend diubah — perubahan data dari admin **tidak**
perlu build ulang.

---

## 4. Nginx (satu domain)

```nginx
server {
    listen 80;
    server_name hmtpunisba.or.id www.hmtpunisba.or.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hmtpunisba.or.id www.hmtpunisba.or.id;

    ssl_certificate     /etc/letsencrypt/live/hmtpunisba.or.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hmtpunisba.or.id/privkey.pem;

    # --- Frontend (SPA) ---
    root /var/www/hmtp/frontend-dist;
    index index.html;

    # Wajib: rute React (/admin/dashboard, /kebijakan-privasi) tidak punya
    # berkas fisik. Tanpa baris ini, refresh di rute tersebut menghasilkan 404.
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Berkas hasil build punya hash di nama: aman di-cache lama.
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # --- Backend (API Laravel) ---
    # Request /api/* dijalankan oleh public/index.php milik Laravel, bukan oleh
    # berkas statis React. Ditangani lewat named location supaya document root
    # frontend tidak ikut dipakai untuk PHP.
    location ~ ^/api(/|$) {
        alias /var/www/hmtp/backend/public;
        try_files $uri @laravel;
    }

    location @laravel {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME /var/www/hmtp/backend/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
        fastcgi_param DOCUMENT_ROOT /var/www/hmtp/backend/public;
    }

    # Foto pengurus hasil storage:link
    location /storage/ {
        alias /var/www/hmtp/backend/storage/app/public/;
        expires 30d;
    }

    # Berkas PHP lain di luar /api tidak boleh dieksekusi.
    location ~ \.php$ { return 404; }

    location ~ /\.(?!well-known).* { deny all; }
}
```

Setelah mengubah Nginx: `sudo nginx -t && sudo systemctl reload nginx`.

Konfigurasi satu domain di atas lebih mudah salah (dua document root dalam satu
server). Kalau bisa memilih, pakai **dua domain** (bagian 5) — di sana
`location /` hanya melayani berkas statis dan tidak ada trik PHP.

---

## 5. Nginx (dua domain — disarankan)

Frontend di `hmtpunisba.or.id`, API di `api.hmtpunisba.or.id`.

```nginx
# api.hmtpunisba.or.id
server {
    listen 443 ssl http2;
    server_name api.hmtpunisba.or.id;
    root /var/www/hmtp/backend/public;   # document root = public Laravel
    index index.php;

    location / { try_files $uri $uri/ /index.php?$query_string; }
    location /storage/ { alias /var/www/hmtp/backend/storage/app/public/; expires 30d; }
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }
    location ~ /\.(?!well-known).* { deny all; }
}
```

Lalu `CORS_ALLOWED_ORIGINS=https://hmtpunisba.or.id` di backend dan
`VITE_API_URL=https://api.hmtpunisba.or.id/api` sebelum `npm run build`.

---

## 6. PHP-FPM & OPcache

Di `/etc/php/8.2/fpm/php.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0    # matikan saat produksi; restart php-fpm setelah deploy
memory_limit=256M
upload_max_filesize=8M
post_max_size=10M
```

Jumlah worker: `pm = dynamic`, `pm.max_children` 10–20 untuk trafik organisasi.

Laravel memakai `config:cache`, jadi **setiap kali `.env` diubah** jalankan
`php artisan config:cache` (kalau lupa, nilai lama tetap dipakai).

---

## 7. Setelah deploy — periksa ini

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://hmtpunisba.or.id/            # 200
curl -s -o /dev/null -w '%{http_code}\n' https://hmtpunisba.or.id/kebijakan-privasi  # 200 (bukan 404)
curl -s https://api.hmtpunisba.or.id/api/site | head -c 120                   # JSON success:true
curl -s -X POST https://api.hmtpunisba.or.id/api/login \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"email":"admin@hmtpunisba.or.id","password":"SALAH"}'                  # 422, bukan 500
```

Di browser:

1. Buka `/admin/login`, masuk, cek status **API Online**.
2. Tab **Beranda** → ubah satu kata → simpan → kembali ke halaman depan → teks berubah.
3. Unggah foto pengurus (uji izin tulis `storage/app/public`).
4. Kirim aspirasi dari halaman depan → muncul di **Kotak Aspirasi**.

Kalau langkah 2 berubah tapi foto tidak muncul, `storage:link` atau izin folder
belum benar.

---

## 8. Memperbarui versi

```bash
cd /var/www/hmtp/backend && git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache route:cache view:cache
sudo systemctl reload php8.2-fpm

cd /var/www/hmtp/frontend && git pull && npm ci && npm run build
rsync -a --delete dist/ /var/www/hmtp/frontend-dist/
```

Data yang diisi pengurus lewat dashboard tidak tersentuh oleh proses ini.
Tetap **backup database** sebelum `migrate --force`:

```bash
mysqldump -u hmtp_user -p hmtp_unisba | gzip > /var/backups/hmtp-$(date +%F).sql.gz
```