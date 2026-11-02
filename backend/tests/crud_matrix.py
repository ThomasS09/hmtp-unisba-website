"""
Uji CRUD menyeluruh: setiap resource yang dipakai dashboard admin diuji
create -> read -> update -> delete lewat HTTP, memakai data asli backend.

Jalankan (backend harus hidup di 127.0.0.1:8000):
    py -3.13 tests/crud_matrix.py

Semua baris uji dihapus di akhir; nilai yang diubah pada data yang sudah ada
(kontak, pengaturan beranda, kabinet aktif) dikembalikan seperti semula.
"""

import os
import sys
import requests

BASE = os.environ.get("BASE", "http://127.0.0.1:8000/api")
EMAIL = os.environ.get("ADMIN_EMAIL", "admin@hmtpunisba.or.id")
PASSWORD = os.environ.get("ADMIN_PASSWORD", "Adhikara2026!")

gagal = []
lewat = 0


def cek(nama, kondisi, ket=""):
    global lewat
    if kondisi:
        lewat += 1
        print(f"  ok   {nama}")
    else:
        gagal.append(nama)
        print(f"  FAIL {nama} {ket}")


def main():
    s = requests.Session()
    s.headers["Accept"] = "application/json"

    print("1. AUTH")
    r = s.post(f"{BASE}/login", json={"email": EMAIL, "password": PASSWORD}, timeout=60)
    cek("login 200", r.status_code == 200, r.text[:120])
    token = r.json().get("access_token")
    cek("token ada", bool(token))
    s.headers["Authorization"] = f"Bearer {token}"
    cek("/me 200", s.get(f"{BASE}/me", timeout=60).status_code == 200)

    print("2. BIDANG (departments)")
    r = s.post(f"{BASE}/departments", json={"name": "BIDANG UJI CRUD", "sort_order": 99}, timeout=60)
    cek("tambah bidang 201", r.status_code == 201, r.text[:120])
    dept_id = r.json()["data"]["id"]
    r = s.put(f"{BASE}/departments/{dept_id}", json={"name": "BIDANG UJI CRUD 2"}, timeout=60)
    cek("ubah bidang 200", r.status_code == 200 and r.json()["data"]["name"].endswith("2"), r.text[:120])
    r = s.post(f"{BASE}/departments", json={"name": "BIDANG UJI CRUD 2"}, timeout=60)
    cek("nama bidang ganda ditolak 422", r.status_code == 422, r.text[:120])

    print("3. KABINET (cabinets)")
    asli = s.get(f"{BASE}/cabinets", timeout=60).json()["data"]
    aktif_asli = next((c for c in asli if c.get("is_active")), None)
    r = s.post(f"{BASE}/cabinets", json={"name": "KABINET UJI", "period": "2099/2100"}, timeout=60)
    cek("tambah kabinet 201", r.status_code == 201, r.text[:120])
    kab_id = r.json()["data"]["id"]
    r = s.put(f"{BASE}/cabinets/{kab_id}", json={"name": "KABINET UJI 2", "period": "2099/2100"}, timeout=60)
    cek("ubah kabinet 200", r.status_code == 200 and r.json()["data"]["name"].endswith("2"), r.text[:120])
    s.post(f"{BASE}/cabinets/{kab_id}/activate", timeout=60)
    kabinet = s.get(f"{BASE}/cabinets", timeout=60).json()["data"]
    aktif = [c for c in kabinet if c.get("is_active")]
    cek("hanya satu kabinet aktif", len(aktif) == 1 and aktif[0]["id"] == kab_id)
    r = s.delete(f"{BASE}/cabinets/{kab_id}", timeout=60)
    cek("kabinet aktif tidak bisa dihapus (422)", r.status_code == 422, r.text[:120])
    if aktif_asli:
        s.post(f"{BASE}/cabinets/{aktif_asli['id']}/activate", timeout=60)

    print("4. PENGURUS (members, multipart)")
    kab_aktif = next(c for c in s.get(f"{BASE}/cabinets", timeout=60).json()["data"] if c.get("is_active"))["id"]
    r = s.post(f"{BASE}/members", data={
        "cabinet_id": kab_aktif, "department_id": dept_id, "kelompok": "Pengurus Inti",
        "position": "Jabatan Uji", "name": "Pengurus Uji Crud", "npm": "1020499999", "sort_order": 99,
    }, timeout=60)
    cek("tambah pengurus 201", r.status_code == 201, r.text[:160])
    mbr_id = r.json()["data"]["id"]
    r = s.post(f"{BASE}/members/{mbr_id}", data={
        "_method": "PUT", "cabinet_id": kab_aktif, "department_id": dept_id, "kelompok": "Ketua Bidang",
        "position": "Jabatan Uji 2", "name": "Pengurus Uji Crud 2",
    }, timeout=60)
    cek("ubah pengurus via POST+_method=PUT 200",
        r.status_code == 200 and r.json()["data"]["name"].endswith("2"), r.text[:160])
    r = s.post(f"{BASE}/members/{mbr_id}", data={
        "cabinet_id": kab_aktif, "department_id": dept_id, "kelompok": "Ketua Bidang",
        "position": "Jabatan Uji 3", "name": "Pengurus Uji Crud 3",
    }, timeout=60)
    cek("ubah pengurus via POST biasa 200",
        r.status_code == 200 and r.json()["data"]["name"].endswith("3"), r.text[:160])

    print("5. PROKER (programs, multipart)")
    r = s.post(f"{BASE}/programs", data={
        "cabinet_id": kab_aktif, "department_id": dept_id, "name": "Proker Uji",
        "type": "Program Kerja", "description": "Dibuat oleh skrip uji CRUD.", "status": "Rencana",
    }, timeout=60)
    cek("tambah proker 201", r.status_code == 201, r.text[:160])
    prg_id = r.json()["data"]["id"]
    r = s.post(f"{BASE}/programs/{prg_id}", data={"_method": "PUT", "status": "Selesai"}, timeout=60)
    cek("ubah status proker 200", r.status_code == 200 and r.json()["data"]["status"] == "Selesai", r.text[:160])

    print("6. BERITA (news)")
    isi = "Isi berita uji CRUD. " * 5
    r = s.post(f"{BASE}/news", json={
        "title": "Berita Uji CRUD", "category": "Kegiatan", "excerpt": "Ringkasan berita uji CRUD.",
        "content": isi,
    }, timeout=60)
    cek("tambah berita 201", r.status_code == 201, r.text[:160])
    news_id = r.json()["data"]["id"]
    r = s.put(f"{BASE}/news/{news_id}", json={"title": "Berita Uji CRUD 2"}, timeout=60)
    cek("ubah berita 200", r.status_code == 200 and r.json()["data"]["title"].endswith("2"), r.text[:160])
    cek("baca berita 200", s.get(f"{BASE}/news/{news_id}", timeout=60).status_code == 200)
    cek("kategori salah ditolak 422",
        s.post(f"{BASE}/news", json={"title": "X Uji", "category": "Sosialx", "excerpt": "sepuluh huruf",
                                     "content": isi}, timeout=60).status_code == 422)

    print("7. PROFIL & NARASI (profile-items)")
    r = s.post(f"{BASE}/profile-items", json={
        "type": "timeline", "heading": "2099", "subheading": "Entri Uji",
        "note": "1 Januari 2099 · Bandung", "body": "Deskripsi entri uji CRUD.",
    }, timeout=60)
    cek("tambah timeline 201", r.status_code == 201, r.text[:160])
    prof_id = r.json()["data"]["id"]
    r = s.put(f"{BASE}/profile-items/{prof_id}", json={
        "type": "timeline", "heading": "2099", "subheading": "Entri Uji 2", "body": "Deskripsi entri uji CRUD.",
    }, timeout=60)
    cek("ubah timeline 200", r.status_code == 200 and r.json()["data"]["subheading"].endswith("2"), r.text[:160])
    r = s.post(f"{BASE}/profile-items", json={"type": "timeline", "body": "tanpa judul"}, timeout=60)
    cek("timeline tanpa judul ditolak 422", r.status_code == 422, r.text[:160])

    print("8. KONTAK (contact)")
    kontak = s.get(f"{BASE}/contact", timeout=60).json()["data"]
    # Kontak = satu baris (bukan daftar), email wajib: frontend selalu kirim semua field.
    ubah = dict(kontak, website="UJI-CRUD")
    r = s.put(f"{BASE}/contact", json=ubah, timeout=60)
    cek("ubah kontak 200", r.status_code == 200 and r.json()["data"]["website"] == "UJI-CRUD", r.text[:160])
    cek("email kosong ditolak 422",
        s.put(f"{BASE}/contact", json=dict(kontak, email=""), timeout=60).status_code == 422)
    s.put(f"{BASE}/contact", json=kontak, timeout=60)
    cek("kontak dipulihkan", s.get(f"{BASE}/contact", timeout=60).json()["data"]["website"] == kontak["website"])

    print("9. BERANDA (site-settings)")
    setelan = s.get(f"{BASE}/site-settings", timeout=60).json()["data"]
    r = s.put(f"{BASE}/site-settings", json={"settings": {"hero_badge": "UJI CRUD"}}, timeout=60)
    cek("ubah teks beranda 200", r.status_code == 200 and r.json()["data"]["hero_badge"] == "UJI CRUD", r.text[:160])
    r = s.put(f"{BASE}/site-settings", json={"settings": {"hero_badge": "", "key_ngawur": "x"}}, timeout=60)
    cek("kosong -> kembali ke bawaan", r.status_code == 200 and
        r.json()["data"]["hero_badge"] == "Website Resmi HMTP UNISBA" and
        "key_ngawur" not in r.json()["data"], r.text[:200])
    s.put(f"{BASE}/site-settings", json={"settings": {"hero_badge": setelan["hero_badge"]}}, timeout=60)

    print("10. ASPIRASI (publik kirim -> admin ubah status -> hapus)")
    s.headers.pop("Authorization", None)
    r = s.post(f"{BASE}/aspirations", json={
        "is_anonymous": False, "name": "Penguji Crud", "category": "Saran",
        "message": "Pesan uji CRUD otomatis, boleh dihapus.",
    }, timeout=60)
    cek("kirim aspirasi 201", r.status_code == 201, r.text[:160])
    asp_id = r.json()["data"]["id"]
    s.headers["Authorization"] = f"Bearer {token}"
    daftar = s.get(f"{BASE}/aspirations", params={"per_page": 100}, timeout=60).json()["data"]
    baris = daftar["data"] if isinstance(daftar, dict) else daftar
    cek("aspirasi muncul di admin", any(a["id"] == asp_id for a in baris))
    r = s.patch(f"{BASE}/aspirations/{asp_id}/status", json={"status": "Selesai"}, timeout=60)
    cek("ubah status aspirasi 200", r.status_code == 200, r.text[:160])
    r = s.patch(f"{BASE}/aspirations/{asp_id}/status", json={"status": "Ngawur"}, timeout=60)
    cek("status ngawur ditolak 422", r.status_code == 422, r.text[:160])

    print("11. HAPUS SEMUA BARIS UJI")
    for label, url in [
        ("aspirasi", f"{BASE}/aspirations/{asp_id}"),
        ("profil", f"{BASE}/profile-items/{prof_id}"),
        ("berita", f"{BASE}/news/{news_id}"),
        ("program", f"{BASE}/programs/{prg_id}"),
        ("pengurus", f"{BASE}/members/{mbr_id}"),
        ("kabinet", f"{BASE}/cabinets/{kab_id}"),
        ("bidang", f"{BASE}/departments/{dept_id}"),
    ]:
        r = s.delete(url, timeout=60)
        cek(f"hapus {label} 200", r.status_code == 200, r.text[:120])

    print("12. GUARD: TANPA TOKEN = 401")
    tamu = requests.Session()
    tamu.headers["Accept"] = "application/json"
    # /programs GET memang publik (dipakai halaman depan); tulisnya tetap dijaga.
    for path in ["/departments", "/members", "/cabinets", "/profile-items", "/site-settings"]:
        cek(f"401 {path}", tamu.get(f"{BASE}{path}", timeout=60).status_code == 401)
    cek("GET /programs publik 200", tamu.get(f"{BASE}/programs", timeout=60).status_code == 200)
    cek("POST /programs tanpa token 401", tamu.post(f"{BASE}/programs", json={"name": "X"}, timeout=60).status_code == 401)

    print("13. /site MASIH UTUH")
    site = requests.get(f"{BASE}/site", timeout=60).json()["data"]
    cek("/site 200 + data lengkap", all(k in site for k in
        ("profile", "settings", "cabinets", "departments", "members", "programs", "news", "contact")))
    print(f"     members={len(site['members'])} programs={len(site['programs'])} "
          f"departments={len(site['departments'])} news={len(site['news'])} "
          f"timeline={len(site['profile'].get('timeline', []))}")

    s.post(f"{BASE}/logout", timeout=60)
    print(f"\n{lewat} cek lewat, {len(gagal)} gagal")
    if gagal:
        print("GAGAL: " + ", ".join(gagal))
        return 1
    print("ALL PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())