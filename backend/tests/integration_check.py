import json, urllib.request, time

API = "http://127.0.0.1:8000/api"

def req(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(API + path, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    r.add_header("Accept", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

# 1. Login
s, login = req("POST", "/login", {"email": "admin@hmtpunisba.or.id", "password": "Adhikara2026!"})
token = login["access_token"]
print(f"1. LOGIN: {s} -> token {token[:20]}...")

# 2. Count before
s, before = req("GET", "/news")
n_before = len(before["data"]["data"])
print(f"2. NEWS BEFORE: {n_before}")

# 3. Create (NO slug field in validation)
s, created = req("POST", "/news", {
    "title": "Integration Test Auto Invalidate",
    "excerpt": "Test auto-invalidation cache dari admin CRUD ke landing page public.",
    "content": "Konten lengkap minimal lima puluh karakter untuk validasi backend sukses tanpa error apapun.",
    "category": "Pengumuman",
}, token)
print(f"3. CREATE: {s}")
if s != 201:
    print(f"   ERROR: {created}")
    exit(1)
new_id = created.get("data", {}).get("id")
print(f"   ID: {new_id}")

# 4. Count after
s, after = req("GET", "/news")
n_after = len(after["data"]["data"])
print(f"4. NEWS AFTER: {n_after}  {'✓ +1' if n_after == n_before + 1 else 'FAIL'}")

# 5. Site endpoint (landing page source)
s, site = req("GET", "/site")
d = site["data"]
print(f"5. /site: {s} -> members={len(d.get('members',[]))} programs={len(d.get('programs',[]))} cabinets={len(d.get('cabinets',[]))} departments={len(d.get('departments',[]))}")

# 6. Update
s, upd = req("PUT", f"/news/{new_id}", {"title": "Integration Test UPDATED"}, token)
print(f"6. UPDATE: {s} -> {upd.get('data',{}).get('title') or upd.get('message')}")

# 7. Delete
s, dele = req("DELETE", f"/news/{new_id}", token=token)
print(f"7. DELETE: {s}")

# 8. Final count
s, final = req("GET", "/news")
print(f"8. FINAL: {len(final['data']['data'])} (expected {n_before})")

ok = n_after == n_before + 1 and len(final["data"]["data"]) == n_before
print("\n" + ("✓ ALL PASS" if ok else "✗ FAILED"))
