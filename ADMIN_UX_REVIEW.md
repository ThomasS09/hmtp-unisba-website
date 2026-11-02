# Admin CRUD UX Review & Improvements

## Current Issues

### 1. **Inconsistent CRUD Patterns**
- **CabinetTab**: Inline form (scroll friction, context loss)
- **NewsTab, MembersTab**: Modal-based (better UX)
- **Problem**: Pelanggan confused switching between inline & modal workflows

### 2. **Ambiguous Form State**
- No clear distinction: editing existing vs creating new
- No visual indicator of which record is selected
- "Simpan" button exists when form is empty — user unsure what happens

### 3. **Poor Action Feedback**
- Button click → API call → response, but user may not see loading state
- Error messages disappear quickly
- Success confirmation not prominent enough
- User unsure: "Did it work?"

### 4. **Inconsistent Button Labels**
- "Simpan", "Update", "Ubah" used interchangeably
- No clear distinction between primary action (save) and secondary (delete)
- Icon + text sometimes present, sometimes not

### 5. **Scroll Friction on Inline Forms**
- CabinetTab form at bottom requires scroll after selection
- User: select cabinet → scroll → edit → scroll up to see result
- **Solution**: Keep form viewport-fixed or collapse after save

---

## Proposed UX Improvements

### Phase 1: Standardize CRUD to Modal (All Tabs)

**Why**: Modal patterns:
- Isolate editing context (no distraction from list)
- Clear entry/exit (open/close)
- Better on mobile (full screen possible)
- Familiar to users (common web pattern)

**Tabs to refactor**:
- ✓ NewsTab (already modal)
- ✓ MembersTab (already modal)
- 🔄 CabinetTab → convert inline form to modal
- 🔄 ProgramsTab → convert to modal
- 🔄 DepartmentsTab → convert to modal
- 🔄 ProfileTab → convert to modal
- 🔄 ContactsTab → convert to modal

**Modal Components Needed**:
```tsx
<FormModal
  isOpen={isOpen}
  title={editingId ? "Ubah Kabinet" : "Tambah Kabinet"}
  onClose={handleClose}
  onSubmit={handleSave}
  isLoading={submitting}
  error={error}
>
  {/* form fields */}
</FormModal>
```

---

### Phase 2: Clear Form State Indicators

**What user sees**:
1. **Modal title changes**: "Tambah Kabinet" vs "Ubah Kabinet #3"
2. **Visual cues**:
   - Border color: create (green), edit (blue)
   - Icon badge: "+" (create), "✏️" (edit)
3. **Form state**:
   - Fields locked while submitting
   - Spinner on button during API call
   - Inline validation feedback

**Example**:
```tsx
<FormModal
  mode={editingId ? 'edit' : 'create'}
  recordId={editingId}
  isLoading={submitting}
/>
// Output: "Ubah Kabinet (ID: 5)" or "Tambah Kabinet Baru"
```

---

### Phase 3: Prominent Action Feedback

**Toast notifications** (already exist, but needs consistency):

| Action | Toast | Duration |
|--------|-------|----------|
| Save success | "✓ Kabinet berhasil disimpan" | 3s |
| Save error | "✗ Gagal menyimpan: [error]" | 5s |
| Delete success | "✓ Kabinet berhasil dihapus" | 3s |
| Delete error | "✗ Gagal menghapus: [error]" | 5s |

**Button feedback**:
```tsx
<button disabled={submitting}>
  {submitting ? '⏳ Menyimpan...' : '💾 Simpan'}
</button>
```

---

### Phase 4: Standardized Button Labels & Behavior

**Standard button set for all CRUD tabs**:

| Button | Label | Icon | State | Action |
|--------|-------|------|-------|--------|
| Create | "+ Tambah [Entity]" | ➕ | Always enabled | Open empty form modal |
| Save | "💾 Simpan" | ✓ | Disabled if invalid/submitting | POST (create) or PUT (edit) |
| Delete | "🗑️ Hapus" | ❌ | Disabled while submitting | Show confirm dialog then DELETE |
| Close | "Tutup" | ✕ | Always enabled | Close modal, discard unsaved changes |

**Standardized delete confirmation**:
```tsx
<ConfirmDialog
  title="Hapus?"
  message="Tindakan ini tidak bisa dibatalkan."
  onConfirm={handleDelete}
  onCancel={handleCancel}
  isLoading={deleting}
/>
```

---

### Phase 5: Mobile-Friendly CRUD

**Existing problem**: Long forms hard to fill on small screens

**Solutions**:
1. Modal takes full screen on mobile (`modal-md` for desktop, `modal-full` for mobile)
2. Form fields stack vertically (already done)
3. Buttons always visible (sticky footer on modal)
4. File inputs have clear file preview

---

## Implementation Roadmap

### Week 1
- [ ] Create reusable `FormModal` component wrapper
- [ ] Create reusable `ConfirmDialog` component wrapper
- [ ] Add consistent button styling (`btn-primary`, `btn-danger`, `btn-ghost`)

### Week 2
- [ ] Refactor CabinetTab → modal
- [ ] Refactor DepartmentsTab → modal
- [ ] Test on mobile

### Week 3
- [ ] Refactor ProgramsTab, ProfileTab, ContactsTab → modal
- [ ] Standardize button labels across all tabs
- [ ] QA pass: consistency check

### Week 4
- [ ] Add form validation feedback UI
- [ ] Test edge cases (network error, timeout, validation)
- [ ] User acceptance test (with real admin/customer)

---

## Quick Wins (Can do now)

1. **Change CabinetTab button labels** → Use "Simpan", not "Update"
2. **Add "Ubah" vs "Tambah" to modal titles** → 5 min edit per tab
3. **Improve button disabled states** → Already coded, just visibility
4. **Add loading spinner to all save buttons** → 10 min refactor
5. **Standardize error message display** → Centralize in `showToast()`

---

## Estimated Effort

- **Phase 1-4**: ~8-12 hours dev time
- **Testing**: ~4 hours QA
- **Total**: 1-2 sprint points

---

## Success Metrics

- ✓ All CRUD tabs use modal (except overview/dashboard)
- ✓ User can distinguish create vs edit within 1 second
- ✓ Loading state visible on every API call
- ✓ Error messages don't disappear unread
- ✓ Button labels consistent across all tabs
- ✓ Mobile-friendly (no horizontal scroll on forms)
- ✓ Customer training reduced: UI explains itself

---

## Status Implementasi (quick wins — sudah jalan)

| Temuan | Perbaikan | Bukti |
|---|---|---|
| Label tombol campur (Simpan/Update/Ubah) | Satu komponen `frontend/src/components/admin/TombolSimpan.tsx`, dipakai 7 tab. Label `💾 Simpan` / `⏳ Menyimpan...` | `grep -rn "TombolSimpan" src/pages/admin` → 7 file |
| Tidak jelas mode tambah vs ubah | Judul form berikon di tiap tab: `✏️ Ubah ...` / `➕ Tambah ... Baru` | uji browser: Bidang menampilkan "➕ Tambah Bidang Baru" |
| Feedback aksi lemah / error tak terbedakan | Toast dibedakan: sukses 3 s (kuning), error 7 s **merah** | uji browser: submit nama duplikat → toast merah "⚠️ Nama bidang sudah terdaftar." |
| Pesan error salah arti | `pesanError`: hanya error **tanpa respons** yang dilaporkan "tidak bisa menghubungi server"; 4xx/5xx pakai pesan backend | `frontend/src/services/api.ts` |
| Tombol simpan bisa diklik berkali-kali | Guard `submitting` + `finally` reset di semua form | `AccountTab`, `AdminDashboard` modal berita |
| Admin tampak "Mode Demo" padahal server hidup | Timeout API 10 s → 30 s; hapus health-check terpisah (status diambil dari request data); aspirasi & berita dijalankan paralel | `api.ts`, `AdminDashboard.fetchData` |
| Ganti konten tidak terlihat di landing | `/api/site` menyertakan `news`; `News.tsx` memakai `useSiteData` + event `siteDataInvalidate` | `backend/.../SiteController.php`, `News.tsx` |

### Sisa (belum dikerjakan, opsional)
- Seragamkan CabinetTab ke modal seperti tab lain (sekarang masih form inline).
- Muat ulang data per tab hanya saat tab dibuka (sekarang semua tab fetch sendiri-sendiri saat mount).
- Di server produksi jalankan Laravel di belakang Nginx/Apache + PHP-FPM; `php artisan serve` hanya untuk lokal karena memproses satu request sekaligus (~1 s/request di Windows tanpa opcache).

## Struktur Landing (perbaikan menyusul)

| Temuan | Perbaikan | Bukti |
|---|---|---|
| Satu `<Suspense>` membungkus 9 section lazy — satu chunk lambat = seluruh halaman di bawah Hero jadi skeleton | `Suspense` + `ErrorBoundary` per section, fallback `<Skeleton />` per blok | `src/pages/LandingPage.tsx` |
| Blok "Tentang Kami" (About) menduplikasi Sejarah / Arti Logo / nama kabinet | Blok About dihapus; narasi pindah ke blok Sejarah, Arti Logo, dan Struktur (satu sumber) | `grep -rn About src` → tidak ada; `About.tsx` dihapus |
| Sejarah, Arti Logo, Semboyan masih teks mati di kode | Jenis butir profil diperluas: `sejarah`, `logo`, `sambutan` — diisi dari admin, teks kode jadi fallback | `ProfileItem::TYPES`, `SiteController`, tab Profil & Narasi |
| Dua link nav menuju `#structure` (Kabinet + Struktur Organisasi) | Digabung jadi satu entri "Kabinet & Struktur"; link `#about` di Hero/Footer diarahkan ke `#structure` | `Navbar.tsx`, `Hero.tsx`, `Footer.tsx`; audit `deadLinks: []` |
| Tab admin bernama "Profil & Visi Misi" padahal sudah memuat narasi | Jadi "Profil & Narasi", tiap jenis punya hint + contoh placeholder | `AdminDashboard.tsx`, `ProfileTab.tsx` |

Bukti uji: `tsc --noEmit` bersih, `npm run build` sukses, `vitest` 5 files / 18 tests passed, `tests/integration_check.py` ALL PASS, edit narasi dari admin → landing berubah tanpa reload kode (dikembalikan setelah uji).
