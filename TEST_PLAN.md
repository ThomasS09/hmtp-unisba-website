# TEST PLAN & TEST CASES
## HMTP UNISBA Website — Full Stack

**Document Version**: 1.0  
**Date**: November 2, 2026  
**Status**: Work in Progress  

---

## EXECUTIVE SUMMARY

Comprehensive test coverage for HMTP UNISBA website encompassing public visitor flows, admin authentication, and CRUD operations across all modules (News, Aspirations, Cabinet, Members, Departments, Programs, Profile, Contact).

**Scope**: Frontend (React) + Backend (Laravel API)  
**Testing Levels**: Unit, Integration, E2E  
**Test Framework**: Vitest (Frontend), PHPUnit (Backend), Manual E2E  

---

## TEST SCOPE

### In Scope
- Public landing page (all sections: About, Hero, History, Logo Meaning, Vision/Mission, Programs, Structure, News, Footer, Aspiration form)
- Admin authentication (login, logout, password change, session management)
- Admin dashboard tabs (Overview, Account, Cabinet, Members, Departments, Programs, News, Profile, Contacts, Aspirations)
- All API endpoints (Auth, News, Aspirations, Cabinet, Members, Departments, Programs, Profile Items, Contact, Site)
- Data validation (input validation, business rule enforcement)
- Error handling & user messaging
- Accessibility basics (focus management, dialog closing, semantic HTML)
- Rate limiting (throttle responses)

### Out of Scope
- Performance load testing (scalability)
- Security penetration testing (detailed)
- Cross-browser testing (assume modern Chrome/Firefox/Safari)
- Mobile responsiveness (assume Tailwind defaults sufficient)
- Internationalization beyond Indonesian

---

## TEST STRATEGY

### Test Pyramid
```
              E2E (Browser + API)
           Integration (API + DB)
        Unit (Component, Function)
```

### Testing Approach
1. **Unit Tests**: Component rendering, utility functions, form validation
2. **Integration Tests**: API endpoints with database, auth flows
3. **E2E Tests**: Complete user journeys (visitor → news read → aspiration submit; admin login → create cabinet → manage members)

### Entry/Exit Criteria
**Entry**: All code committed, CI checks passing  
**Exit**: 80%+ test coverage (backend), all critical paths verified, no blocking bugs

---

## API TEST CASES

### Auth Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| AUTH-001 | /api/login | POST | Valid credentials | `{email: admin@hmtpunisba.or.id, password: test123}` | 200, access_token returned | ❌ Write |
| AUTH-002 | /api/login | POST | Invalid email | `{email: wrong@x.com, password: test123}` | 401, "Invalid credentials" | ❌ Write |
| AUTH-003 | /api/login | POST | Invalid password | `{email: admin@hmtpunisba.or.id, password: wrong}` | 401, "Invalid credentials" | ❌ Write |
| AUTH-004 | /api/login | POST | Rate limit exceeded (6+ attempts/min) | Multiple rapid requests | 429, throttled | ❌ Write |
| AUTH-005 | /api/me | GET | Authenticated user | Header: `Authorization: Bearer <token>` | 200, user object | ❌ Write |
| AUTH-006 | /api/me | GET | No token | No auth header | 401 | ❌ Write |
| AUTH-007 | /api/logout | POST | Valid token | Authenticated | 200, "Logged out" | ❌ Write |
| AUTH-008 | /api/password | POST | Change password | `{password: newpass123, password_confirmation: newpass123}` | 200, message | ❌ Write |
| AUTH-009 | /api/password | POST | Mismatch confirmation | `{password: abc, password_confirmation: xyz}` | 422, validation error | ❌ Write |

### News Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| NEWS-001 | /api/news | GET | Fetch all news (public) | No auth required | 200, paginated news array | ❌ Write |
| NEWS-002 | /api/news | GET | Pagination limit exceeded | `?per_page=150` | 422, max 100 | ❌ Write |
| NEWS-003 | /api/news | POST | Create news (admin) | `{title, category, excerpt, content, author, read_time, gradient}` | 201, news object | ❌ Write |
| NEWS-004 | /api/news | POST | Missing required fields | `{title: "Test"}` | 422, validation errors | ❌ Write |
| NEWS-005 | /api/news/{id} | GET | Fetch single news | Valid news ID | 200, full article | ❌ Write |
| NEWS-006 | /api/news/{id} | GET | News not found | ID = 99999 | 404 | ❌ Write |
| NEWS-007 | /api/news/{id} | PUT | Update news (admin) | Updated fields | 200, updated news | ❌ Write |
| NEWS-008 | /api/news/{id} | DELETE | Delete news (admin) | Valid ID | 200, deleted | ❌ Write |
| NEWS-009 | /api/news | POST | Unauthenticated | No token | 401 | ❌ Write |

### Aspirations Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| ASP-001 | /api/aspirations | POST | Submit aspiration (public) | `{name, email, aspiration_text}` | 201, aspiration created | ❌ Write |
| ASP-002 | /api/aspirations | POST | Invalid email | `{name: X, email: not-email, aspiration_text: X}` | 422, email validation error | ❌ Write |
| ASP-003 | /api/aspirations | POST | Empty aspiration | `{name: X, email: x@x, aspiration_text: ""}` | 422, validation | ❌ Write |
| ASP-004 | /api/aspirations | GET | List aspirations (admin only) | Auth required | 200, paginated aspirations | ❌ Write |
| ASP-005 | /api/aspirations | GET | Unauthenticated | No token | 401 | ❌ Write |
| ASP-006 | /api/aspirations/{id}/status | PATCH | Change status (admin) | `{status: "read"}` | 200, status updated | ❌ Write |
| ASP-007 | /api/aspirations/{id} | DELETE | Delete aspiration (admin) | Valid ID | 200, deleted | ❌ Write |

### Cabinet Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| CAB-001 | /api/cabinets | POST | Create cabinet | `{name: "Adhikara Karsa", period: "2026/2027"}` | 201, cabinet created | ✅ Exists |
| CAB-002 | /api/cabinets | GET | List cabinets (admin) | Auth required | 200, all cabinets | ❌ Write |
| CAB-003 | /api/cabinets/{id}/activate | POST | Activate cabinet | Valid cabinet ID | 200, activated; old active set inactive | ✅ Exists |
| CAB-004 | /api/cabinets/{id} | DELETE | Delete inactive cabinet | Archive cabinet ID | 200, deleted | ✅ Exists |
| CAB-005 | /api/cabinets/{id} | DELETE | Try delete active cabinet | Active cabinet ID | 422, "Cannot delete active" | ✅ Exists |
| CAB-006 | /api/cabinets/{id} | PUT | Update cabinet | `{name: "New Name"}` | 200, updated | ❌ Write |

### Members Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| MEM-001 | /api/members | POST | Add member | `{cabinet_id, kelompok, position, name, npm, sort_order}` | 201, member created | ✅ Exists |
| MEM-002 | /api/members | POST | Invalid kelompok | `{..., kelompok: "Invalid"}` | 422, validation error | ✅ Exists |
| MEM-003 | /api/members | POST | Missing name | `{cabinet_id, kelompok, position}` | 422, "Name required" | ✅ Exists |
| MEM-004 | /api/members | GET | List members (admin) | Auth required | 200, members by cabinet | ❌ Write |
| MEM-005 | /api/members/{id} | POST | Update member | `{name: "New Name"}` | 200, updated | ✅ Exists |
| MEM-006 | /api/members/{id} | DELETE | Delete member | Valid ID | 200, deleted | ✅ Exists |

### Departments Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| DEPT-001 | /api/departments | POST | Create department | `{name: "Bidang Medkominfo", slug: "bidang-medkominfo"}` | 201, created | ✅ Exists |
| DEPT-002 | /api/departments | GET | List departments (admin) | Auth required | 200, departments | ❌ Write |
| DEPT-003 | /api/departments/{id} | PUT | Update name | `{name: "Updated"}` | 200, updated | ✅ Exists |
| DEPT-004 | /api/departments/{id} | DELETE | Delete department | Valid ID | 200, deleted | ✅ Exists |

### Programs Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| PROG-001 | /api/programs | POST | Create program | `{cabinet_id, department_id, name, type: "Program Kerja", status: "Rencana"}` | 201, created | ✅ Exists |
| PROG-002 | /api/programs | POST | Invalid type | `{..., type: "Invalid"}` | 422, validation error | ✅ Exists |
| PROG-003 | /api/programs | GET | List programs (public) | No auth | 200, programs | ❌ Write |
| PROG-004 | /api/programs/{id} | POST | Update status | `{status: "Berjalan"}` | 200, status changed | ✅ Exists |
| PROG-005 | /api/programs/{id} | DELETE | Delete program | Valid ID | 200, deleted | ✅ Exists |

### Profile & Contact Module

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| PROF-001 | /api/profile-items | POST | Add vision point | `{type: "visi", body: "...", sort_order: 1}` | 201, created | ✅ Exists |
| PROF-002 | /api/profile-items | POST | Invalid type | `{type: "other"}` | 422, validation error | ✅ Exists |
| PROF-003 | /api/profile-items | POST | Too short body | `{type: "visi", body: "ab"}` | 422, min length error | ✅ Exists |
| PROF-004 | /api/profile-items | GET | List by type | `?type=visi` | 200, filtered items | ❌ Write |
| PROF-005 | /api/profile-items/{id} | DELETE | Remove vision point | Valid ID | 200, deleted | ❌ Write |
| CONT-001 | /api/contact | PUT | Update contact info | `{email: new@email, instagram: @handle}` | 200, updated | ✅ Exists |
| CONT-002 | /api/contact | PUT | Missing email | `{instagram: @x}` | 422, "Email required" | ✅ Exists |
| CONT-003 | /api/contact | PUT | Invalid email | `{email: not-email}` | 422, email validation | ❌ Write |

### Public Site Endpoint

| ID | Endpoint | Method | Scenario | Input | Expected | Status |
|----|----------|--------|----------|-------|----------|--------|
| SITE-001 | /api/site | GET | Fetch bundled public data | No auth | 200, {profile, cabinet, members, programs, contact} | ❌ Write |

---

## FRONTEND COMPONENT TEST CASES

### News Component

| ID | Component | Scenario | Input | Expected | Status |
|----|-----------|----------|-------|----------|--------|
| FE-NEWS-001 | News | Render card from API data | Mock getNews() | Card title visible, no hardcoded data | ✅ Exists |
| FE-NEWS-002 | News | Open detail modal | Click "Baca Selengkapnya" | Dialog shown, full content displayed, focus on close button | ✅ Exists |
| FE-NEWS-003 | News | Close modal with Escape | Press Escape | Modal hidden, focus returned to trigger button | ✅ Exists |
| FE-NEWS-004 | News | Search/filter articles | Type in search field | Cards filtered by keyword, "No match" shown if none | ✅ Exists |
| FE-NEWS-005 | News | Empty state | No news data | Display empty message | ❌ Write |

### Public Landing Page Components

| ID | Component | Scenario | Input | Expected | Status |
|----|-----------|----------|-------|----------|--------|
| FE-LANDING-001 | Hero | Display hero section | Page load | Banner, title, CTA visible | ❌ Write |
| FE-LANDING-002 | About | Render About section | Page load | About content from API | ❌ Write |
| FE-LANDING-003 | History | Show timeline | Page load | History items visible | ❌ Write |
| FE-LANDING-004 | VisionMission | Display visi/misi from API | getProfileItems() | Vision & mission points rendered | ❌ Write |
| FE-LANDING-005 | Programs | List programs (public) | getPrograms() | Programs displayed with details | ❌ Write |
| FE-LANDING-006 | Structure | Show org structure | Page load | Cabinet, members, departments visible | ❌ Write |
| FE-LANDING-007 | AspirationContact | Submit aspiration form | Fill form + submit | POST /api/aspirations, success message | ❌ Write |
| FE-LANDING-008 | AspirationContact | Form validation | Submit empty | Errors shown for required fields | ❌ Write |
| FE-LANDING-009 | Footer | Display footer | Page load | Links, contact info visible | ❌ Write |

### Navbar Component

| ID | Component | Scenario | Input | Expected | Status |
|----|-----------|----------|-------|----------|--------|
| FE-NAV-001 | Navbar | Render links (public) | Not logged in | Home, About, News, Contacts visible; no Admin link | ✅ Exists |
| FE-NAV-002 | Navbar | Show Admin link | After login (token in localStorage) | Admin link appears; logout button visible | ❌ Write |
| FE-NAV-003 | Navbar | Mobile menu toggle | Click hamburger | Menu expands/collapses | ❌ Write |

### Admin Pages

| ID | Page/Tab | Scenario | Input | Expected | Status |
|----|----------|----------|-------|----------|--------|
| FE-ADMIN-LOGIN-001 | AdminLogin | Valid credentials | Email + password | POST /login, token stored, redirect to /admin | ❌ Write |
| FE-ADMIN-LOGIN-002 | AdminLogin | Invalid credentials | Wrong password | 401 error message shown | ❌ Write |
| FE-ADMIN-LOGIN-003 | AdminLogin | Throttled | 6+ attempts/min | 429 message, form disabled | ❌ Write |
| FE-ADMIN-DASH-001 | AdminDashboard | Load dashboard | Authenticated | All tabs accessible | ❌ Write |
| FE-ADMIN-OVERVIEW-001 | OverviewTab | Display stats | Render tab | Cabinet count, members count, news count shown | ❌ Write |
| FE-ADMIN-CABINET-001 | CabinetTab | List cabinets | GET /api/cabinets | Cabinets shown with active indicator | ❌ Write |
| FE-ADMIN-CABINET-002 | CabinetTab | Activate cabinet | Click activate button | POST /activate, old active deactivated | ❌ Write |
| FE-ADMIN-CABINET-003 | CabinetTab | Delete archived cabinet | Click delete on inactive | DELETE succeeds, removed from list | ❌ Write |
| FE-ADMIN-CABINET-004 | CabinetTab | Cannot delete active | Try delete on active cabinet | Error message "Cannot delete active" | ❌ Write |
| FE-ADMIN-MEMBERS-001 | MembersTab | Add member form | Fill form + submit | POST /api/members, added to table | ❌ Write |
| FE-ADMIN-MEMBERS-002 | MembersTab | Validation error | Submit with blank name | Form error shown | ❌ Write |
| FE-ADMIN-MEMBERS-003 | MembersTab | Delete member | Click delete icon | DELETE /api/members/{id}, row removed | ❌ Write |
| FE-ADMIN-MEMBERS-004 | MembersTab | Edit member | Click edit, change name, save | POST /api/members/{id}, updated in table | ❌ Write |
| FE-ADMIN-DEPTS-001 | DepartmentsTab | Add department | Fill form + submit | POST /api/departments, added to list | ❌ Write |
| FE-ADMIN-DEPTS-002 | DepartmentsTab | Update department | Click edit, change name | PUT /api/departments/{id}, updated | ❌ Write |
| FE-ADMIN-DEPTS-003 | DepartmentsTab | Delete department | Click delete | DELETE /api/departments/{id}, removed | ❌ Write |
| FE-ADMIN-PROGRAMS-001 | ProgramsTab | Add program | Fill form + submit | POST /api/programs, added to table | ❌ Write |
| FE-ADMIN-PROGRAMS-002 | ProgramsTab | Change program status | Dropdown: Rencana → Berjalan | POST /api/programs/{id}, status updated | ❌ Write |
| FE-ADMIN-PROGRAMS-003 | ProgramsTab | Delete program | Click delete | DELETE /api/programs/{id}, removed | ❌ Write |
| FE-ADMIN-NEWS-001 | NewsTab | List news | GET /api/news | Articles shown in table | ❌ Write |
| FE-ADMIN-NEWS-002 | NewsTab | Create news | Fill editor form, submit | POST /api/news, article added | ❌ Write |
| FE-ADMIN-NEWS-003 | NewsTab | Edit news | Click edit, change title, save | PUT /api/news/{id}, updated | ❌ Write |
| FE-ADMIN-NEWS-004 | NewsTab | Delete news | Click delete | DELETE /api/news/{id}, removed | ❌ Write |
| FE-ADMIN-PROFILE-001 | ProfileTab | Add vision point | Input text, click Add | POST /api/profile-items, added to list | ❌ Write |
| FE-ADMIN-PROFILE-002 | ProfileTab | Sort vision points | Drag/reorder items | sort_order updated via API | ❌ Write |
| FE-ADMIN-PROFILE-003 | ProfileTab | Delete vision point | Click delete on item | DELETE /api/profile-items/{id}, removed | ❌ Write |
| FE-ADMIN-CONTACTS-001 | ContactsTab | Update contact info | Edit email, Instagram, etc. | PUT /api/contact, saved | ❌ Write |
| FE-ADMIN-CONTACTS-002 | ContactsTab | Validation | Submit with blank email | Error shown, not saved | ❌ Write |
| FE-ADMIN-ASPIRATIONS-001 | AspirationsTab | List aspirations | GET /api/aspirations | All submissions shown in table | ❌ Write |
| FE-ADMIN-ASPIRATIONS-002 | AspirationsTab | Mark as read | Click status button | PATCH /api/aspirations/{id}/status, updated | ❌ Write |
| FE-ADMIN-ASPIRATIONS-003 | AspirationsTab | Delete aspiration | Click delete | DELETE /api/aspirations/{id}, removed | ❌ Write |
| FE-ADMIN-ACCOUNT-001 | AccountTab | Change password | Input old + new password | POST /api/password, success message | ❌ Write |
| FE-ADMIN-ACCOUNT-002 | AccountTab | Password mismatch | Enter non-matching confirmation | Error shown | ❌ Write |
| FE-ADMIN-ACCOUNT-003 | AdminDashboard | Logout | Click logout button | Token cleared, redirected to /admin/login | ❌ Write |

### Error Handling & Accessibility

| ID | Feature | Scenario | Input | Expected | Status |
|----|---------|----------|-------|----------|--------|
| FE-ERROR-001 | ErrorBoundary | Component crashes | Throw error in child | Fallback UI shown, error logged | ✅ Exists (partial) |
| FE-ERROR-002 | Network error | API request fails | Network error | User-friendly message displayed | ❌ Write |
| FE-ERROR-003 | 404 Page | Route not found | Navigate to /nonexistent | Redirected to home or 404 page | ❌ Write |
| FE-A11Y-001 | Focus management | Dialog closes | Escape key or close button | Focus returns to trigger element | ✅ Exists (News) |
| FE-A11Y-002 | Semantic HTML | Landing page | Render | Proper heading hierarchy, landmarks used | ❌ Write |
| FE-A11Y-003 | Form labels | Admin forms | Render | All inputs have associated labels | ❌ Write |

---

## USER JOURNEY TEST CASES

### Journey 1: Visitor Reading News
```
Preconditions: User not logged in
1. Open landing page → News section visible
2. Click article card → Detail modal opens with full content
3. Read article → No errors
4. Close modal (Escape or close button) → Focus returns to card
5. Search articles → Filtered correctly
Expected: All news operations work, no console errors
Status: ✅ Partially verified (News component tests exist)
```

### Journey 2: Visitor Submitting Aspiration
```
Preconditions: User not logged in
1. Scroll to AspirationContact section → Form visible
2. Fill form (name, email, aspiration) → Validation passes
3. Submit → POST /api/aspirations
4. Success message shown
Expected: Aspiration created in DB, visible to admin
Status: ❌ Write E2E test
```

### Journey 3: Admin Login & Create Cabinet
```
Preconditions: Admin user exists in DB
1. Navigate to /admin/login → Login form shown
2. Enter valid credentials → POST /api/login succeeds
3. Token stored, redirect to /admin/dashboard → All tabs visible
4. Click Cabinet tab → List of cabinets shown
5. Click Create Cabinet → Form appears
6. Fill form, submit → POST /api/cabinets, new cabinet in list
Expected: Cabinet created, can be activated
Status: ✅ Partially verified (CabinetArchiveTest exists)
```

### Journey 4: Admin Managing Team (Members)
```
Preconditions: Admin logged in, active cabinet exists
1. Go to Members tab → Members table shown
2. Add member (name, position, NPM) → POST /api/members
3. Member appears in table
4. Edit member → POST /api/members/{id}, changes persist
5. Delete member → DELETE /api/members/{id}, row removed
Expected: All CRUD operations work
Status: ✅ Exists (AdminCrudTest)
```

### Journey 5: Admin Managing Programs & Departments
```
Preconditions: Admin logged in, cabinet & departments exist
1. Go to Departments tab → Departments listed
2. Create/update/delete department
3. Go to Programs tab → Programs listed
4. Create program (select department, type, status)
5. Change program status (Rencana → Berjalan → Selesai)
6. Delete program
Expected: All CRUD operations, status transitions, deletions work
Status: ✅ Partially (AdminCrudTest covers create/delete)
```

### Journey 6: Admin Updating Site Profile & Contact
```
Preconditions: Admin logged in
1. Go to Profile tab → Vision/Mission points listed
2. Add vision point → POST /api/profile-items
3. Reorder points (if sortable) → sort_order updated
4. Go to Contacts tab → Contact form shown
5. Update email, Instagram, YouTube → PUT /api/contact
6. Verify public /api/site returns updated data
Expected: Public site reflects changes immediately
Status: ✅ Exists (AdminProfileContactTest)
```

### Journey 7: Admin Managing News
```
Preconditions: Admin logged in
1. Go to News tab → Existing news listed
2. Create article (title, category, content) → POST /api/news
3. Edit article (change title) → PUT /api/news/{id}
4. Visit public landing page → New article visible in News section
5. Read article as visitor
6. Go back to admin, delete article → DELETE /api/news/{id}
7. Verify article no longer visible to public
Expected: News creation, editing, deletion, public visibility all work
Status: ✅ Partially (backend exists, frontend E2E missing)
```

### Journey 8: Admin Handling Aspirations
```
Preconditions: Visitor submitted aspiration, admin logged in
1. Go to Aspirations tab → List of submissions shown
2. Mark aspiration as "read" → PATCH /api/aspirations/{id}/status
3. Delete unwanted aspiration → DELETE /api/aspirations/{id}
4. Verify deleted aspiration no longer in list
Expected: Admin can triage and manage submissions
Status: ❌ Write (test exists but E2E missing)
```

### Journey 9: Cabinet Archive & Activation
```
Preconditions: Multiple cabinets exist, one active
1. Go to Cabinet tab → Active cabinet marked
2. Create new cabinet (next period)
3. Click Activate on new cabinet → POST /api/cabinets/{id}/activate
4. Verify old cabinet now inactive
5. Try delete old cabinet (inactive) → DELETE succeeds
6. Try delete new cabinet (now active) → DELETE fails (422)
Expected: Only one active cabinet, active cannot be deleted
Status: ✅ Exists (CabinetArchiveTest)
```

---

## EXECUTION PLAN

### Phase 1: Backend Unit + Integration Tests (Weeks 1-2)
- [ ] Write missing Auth tests (LOGIN-002 through LOGIN-009)
- [ ] Write News module tests (NEWS-001 through NEWS-009)
- [ ] Write Aspirations module tests (ASP-001 through ASP-007)
- [ ] Write missing Cabinet tests (CAB-002, CAB-006)
- [ ] Write missing Member tests (MEM-004)
- [ ] Run `php artisan test` — target 90%+ coverage

### Phase 2: Frontend Unit Tests (Weeks 2-3)
- [ ] Expand News.test.tsx edge cases (empty state, loading)
- [ ] Write Navbar tests (nav links, admin link conditional)
- [ ] Write AspirationContact form tests (validation, submit)
- [ ] Write VisionMission component tests
- [ ] Write Programs component tests
- [ ] Run `npm run test` — target 80%+ coverage

### Phase 3: E2E Tests (Weeks 3-4)
- [ ] Visitor news read journey
- [ ] Visitor aspiration submission
- [ ] Admin login → cabinet management
- [ ] Admin member/department CRUD
- [ ] Admin news lifecycle (create, edit, delete, verify public)
- [ ] Admin cabinet archive & activation

### Phase 4: Manual Testing & Sign-Off (Week 4)
- [ ] Test all 9 user journeys manually in browser
- [ ] Verify error messages are clear (Indonesian)
- [ ] Check accessibility (tab order, dialog focus, labels)
- [ ] Rate limit throttling works (multiple login attempts)
- [ ] No console errors or warnings
- [ ] Sign off checklist

---

## DEFECTS & KNOWN ISSUES

| ID | Issue | Component | Severity | Status |
|----|-------|-----------|----------|--------|
| BUG-001 | News component test mocks `getNews` but actual integration with API untested | Frontend/API | Medium | ❌ Open |
| BUG-002 | No E2E browser tests (all tests are unit/integration) | All | High | ❌ Open |
| BUG-003 | AdminDashboard tabs not individually tested for CRUD operations | Frontend | High | ❌ Open |
| BUG-004 | Error handling in frontend not comprehensive (no network error tests) | Frontend | Medium | ❌ Open |
| BUG-005 | Rate limiting not tested (throttle middleware exists but no test) | Backend | Low | ❌ Open |

---

## TEST COVERAGE GOALS

| Layer | Target | Current | Gap |
|-------|--------|---------|-----|
| Backend API | 90% | ~40% (4 feature tests out of ~40 endpoints) | 50% |
| Frontend Components | 80% | ~20% (News + basics) | 60% |
| E2E User Journeys | 100% (9 journeys) | 0% | 100% |

---

## NOTES

- All test IDs follow pattern: `[MODULE]-[SEQUENCE]` (e.g., AUTH-001, FE-NEWS-001)
- "Status" column indicates: ✅ Exists (test already written), ❌ Write (test needs to be created), 🔄 In Progress
- Backend tests use RefreshDatabase (isolate each test) + Sanctum for auth
- Frontend tests use Vitest + React Testing Library (user-centric queries, no implementation details)
- Rate limiting: Laravel throttle middleware enforces per-IP-per-minute limits (5 for login, 60 for most endpoints)
- All error messages should be in Indonesian for consistency
- Validation rules enforced: required fields, email format, max length per API OpenAPI spec
