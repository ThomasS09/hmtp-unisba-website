# HMTP Unisba Website — Test Plan & Test Cases

## Test Coverage Status
- Backend Unit Tests: 56/56 ✓
- Frontend Unit Tests: 15/15 ✓
- Manual E2E (This Session): In Progress

---

## USER FEATURES TEST CASES

### TC-U1: Homepage Load & Navigation
- [ ] Homepage loads without errors
- [ ] Header navbar renders with logo + menu items
- [ ] Footer displays with copyright year (2026)
- [ ] No console errors

### TC-U2: View News (Public)
- [ ] GET /api/news returns 200 with news list
- [ ] News list displays title, category, date
- [ ] Click on news opens detail view
- [ ] Search/filter functionality works
- [ ] Pagination loads more news

### TC-U3: View Site Profile (Public)
- [ ] GET /api/site returns aggregated data
- [ ] Profil HMTP displays (visi, misi)
- [ ] Daftar Pengurus (Members) displays per department
- [ ] Programs/Proker list shows jenis & status
- [ ] Kontak displays email + phone

### TC-U4: Submit Aspiration (Public)
- [ ] Form loads on aspirasi page
- [ ] Submit with valid data (name, email, category, message)
- [ ] POST /api/aspirations returns 201
- [ ] Success toast/message displays
- [ ] POST /api/aspirations validation:
  - [ ] Reject missing fields
  - [ ] Reject invalid category
  - [ ] Reject message < 10 chars
  - [ ] Reject invalid email format

### TC-U5: View Kontak
- [ ] Kontak page loads
- [ ] Email & phone display correctly
- [ ] Contact form can be filled (if present)

---

## ADMIN FEATURES TEST CASES

### TC-A1: Admin Login
- [ ] Login page loads (http://localhost:5173/admin/login)
- [ ] POST /api/login with valid credentials (email + password)
- [ ] Returns 200 with token
- [ ] Token stored in localStorage
- [ ] Redirect to /admin/dashboard
- [ ] Failed login rejects with 401/validation error
- [ ] Missing fields rejected

### TC-A2: Admin Dashboard
- [ ] Dashboard loads after login
- [ ] Sidebar renders with all admin sections
- [ ] No console errors on load
- [ ] User info displays in header

### TC-A3: Admin — Kelola Berita (News CRUD)
- [ ] Tab "Berita" loads list of news
- [ ] Add button opens form
- [ ] Create news: POST /api/news with title, category, content
- [ ] Edit news: PUT /api/news/{id}
- [ ] Delete news: DELETE /api/news/{id}
- [ ] List refreshes after CRUD operations
- [ ] Validation: reject category not in enum, content < 10 chars

### TC-A4: Admin — Kelola Pengurus (Members CRUD)
- [ ] Tab "Pengurus" loads members per department
- [ ] Add button opens form with department selection
- [ ] Create member: POST /api/members with name, department, position, photo (multipart)
- [ ] Edit member: POST /api/members/{id} (multipart)
- [ ] Delete member: DELETE /api/members/{id}
- [ ] Photo upload works (image file)
- [ ] Validation: reject missing name, invalid department

### TC-A5: Admin — Kelola Bidang (Departments CRUD)
- [ ] Tab "Bidang" loads department list
- [ ] Add button opens form
- [ ] Create dept: POST /api/departments with nama
- [ ] Edit dept: PUT /api/departments/{id}
- [ ] Delete dept: DELETE /api/departments/{id} (if no members assigned)
- [ ] List refreshes after CRUD

### TC-A6: Admin — Kelola Proker (Programs CRUD)
- [ ] Tab "Proker" loads programs list with jenis filter (Proker/Aker)
- [ ] Add button opens form with jenis dropdown
- [ ] Create program: POST /api/programs with nama, jenis, status, photo (multipart)
- [ ] Edit program: POST /api/programs/{id}
- [ ] Delete program: DELETE /api/programs/{id}
- [ ] Filter by jenis works
- [ ] Validation: reject invalid jenis, missing nama

### TC-A7: Admin — Kelola Profil & Visi/Misi
- [ ] Tab "Profil" loads visi/misi items
- [ ] Add button for new visi/misi point
- [ ] Create item: POST /api/profile-items with type (visi/misi), content
- [ ] Edit item: PUT /api/profile-items/{id}
- [ ] Delete item: DELETE /api/profile-items/{id}
- [ ] Reorder items (if drag-n-drop)
- [ ] Validation: type must be visi or misi, content >= 5 chars

### TC-A8: Admin — Kelola Kontak
- [ ] Tab "Kontak" loads contact form
- [ ] Edit email & phone
- [ ] PUT /api/contact with email, phone
- [ ] Save button sends update
- [ ] Changes immediately visible on public /api/site
- [ ] Validation: email format, phone format

### TC-A9: Admin — Kelola Kabinet
- [ ] Tab "Kabinet" loads cabinet list
- [ ] Add button opens form with year input
- [ ] Create cabinet: POST /api/cabinets with tahun
- [ ] Activate cabinet: POST /api/cabinets/{id}/activate
- [ ] Only one cabinet active at a time
- [ ] Active cabinet cannot be deleted
- [ ] Archive cabinet can be deleted: DELETE /api/cabinets/{id}
- [ ] List refreshes

### TC-A10: Admin — View Aspirations
- [ ] Tab "Aspirasi" loads submitted aspirations
- [ ] GET /api/aspirations returns all submissions
- [ ] Each aspiration shows: nama, email, category, message, status
- [ ] Update status: PATCH /api/aspirations/{id}/status
- [ ] Delete aspiration: DELETE /api/aspirations/{id}
- [ ] Status updates visible immediately

### TC-A11: Admin — Ganti Password
- [ ] Password change form accessible (possibly in settings)
- [ ] POST /api/password with old_password, new_password, password_confirmation
- [ ] New password >= 8 chars
- [ ] Confirmation must match
- [ ] Old password must be correct (rejects wrong)
- [ ] Success: can login with new password

### TC-A12: Admin Logout
- [ ] Logout button in header/menu
- [ ] POST /api/logout removes token
- [ ] Token cleared from localStorage
- [ ] Redirects to /admin/login
- [ ] Cannot access /admin/dashboard after logout

### TC-A13: Admin — Auth Guards
- [ ] Unauthenticated user cannot GET /api/me
- [ ] Unauthenticated user cannot access any /api routes marked auth:sanctum
- [ ] Invalid token rejected with 401
- [ ] Rate limiting enforced (10 attempts password change, 60 gen requests)

---

## ERROR & EDGE CASES

### TC-E1: API Error Responses
- [ ] 401 Unauthorized: unauthenticated requests to protected routes
- [ ] 403 Forbidden: insufficient permissions
- [ ] 404 Not Found: invalid resource ID
- [ ] 422 Unprocessable Entity: validation errors in Indonesian
- [ ] 429 Too Many Requests: rate limit exceeded
- [ ] Response format always JSON

### TC-E2: Network & Performance
- [ ] Page load time < 3s
- [ ] API response time < 500ms (normal conditions)
- [ ] Handle offline gracefully (no crash)
- [ ] Retry logic for failed requests (if implemented)

### TC-E3: Data Integrity
- [ ] Cannot delete active cabinet
- [ ] Cannot delete department if members exist
- [ ] Update does not corrupt existing data
- [ ] Seeder idempotency: can seed twice without duplicates

---

## DEFECT TRACKING

| ID  | Feature | Issue | Severity | Status |
|-----|---------|-------|----------|--------|
|     |         |       |          |        |

