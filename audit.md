# 🔍 Audit Report — Booking Villa (Umbu Houses)

> **Tanggal Audit:** 20 Juli 2026
> **Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · Prisma · NextAuth v5 · TypeScript
> **Auditor:** Automated Code Audit

---

## Ringkasan Eksekutif

| Kategori | Skor | Keterangan |
|---|:---:|---|
| Struktur Folder | ⭐⭐⭐ | Cukup baik, ada beberapa pelanggaran konvensi |
| Kualitas Kode | ⭐⭐ | Banyak dead code, import tidak terpakai, inkonsistensi |
| Database / Prisma | ⭐⭐⭐ | Schema cukup lengkap, tapi ada mismatch & naming issue |
| Konfigurasi | ⭐⭐ | Config kosong, dependency redundan, build gagal |
| Keamanan | ⭐⭐ | Auth dasar ada, tapi banyak celah proteksi |
| Kelengkapan Fitur | ⭐⭐ | Banyak halaman yang di-link tapi belum dibuat |
| UI/UX | ⭐⭐⭐⭐ | Desain cukup premium, animasi baik, color system rapi |

**Verdict: Project dalam tahap awal yang cukup menjanjikan, tapi ada banyak hal yang perlu diperbaiki sebelum production-ready.**

---

## 📁 1. Struktur Folder

### Tree Aktual

```
booking-villa/
├── app/
│   ├── SignIn/             ❌ PascalCase (harusnya lowercase)
│   │   └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── button.tsx       ✅ shadcn component
│   ├── AboutUs.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LoginButton.tsx
│   ├── Navbar.tsx
│   ├── RecommendedVillas.tsx
│   └── Reviews.tsx
├── lib/
│   ├── prisma.ts            ✅ Singleton pattern
│   └── utils.ts             ✅ Standard cn utility
├── prisma/
│   ├── migrations/
│   ├── dev.db               ⚠️ SQLite file tapi schema pakai PostgreSQL
│   └── schema.prisma
├── public/
│   ├── hero.jpg              ⚠️ Duplikat (72 KB)
│   └── images/
│       └── hero.jpg          ⚠️ Duplikat (1 MB)
├── types/
│   └── next-auth.d.ts       ✅ Type augmentation
├── auth.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── .prettierrc
├── .gitignore
├── AGENTS.md                 ℹ️ AI assistant config
├── CLAUDE.md                 ℹ️ AI assistant config
└── README.md                 ⚠️ Default create-next-app (belum dikustomisasi)
```

### Temuan Struktur

| # | Severity | Temuan | Detail |
|---|:---:|---|---|
| S1 | 🔴 | **Route `SignIn` pakai PascalCase** | Folder `app/SignIn/` harusnya `app/signin/`. Next.js App Router menggunakan folder name sebagai URL path. Ini akan menghasilkan URL `/SignIn` bukan `/signin` |
| S2 | 🔴 | **Case mismatch auth config vs route** | `auth.ts` mendefinisikan `pages: { signIn: "/signin" }` (lowercase) tapi route yang ada adalah `/SignIn` (PascalCase) — **redirect akan 404** |
| S3 | 🟡 | **Duplikat hero.jpg** | `public/hero.jpg` (72 KB) dan `public/images/hero.jpg` (1 MB) — file yang sama dengan ukuran berbeda |
| S4 | 🟡 | **README.md default** | Masih template bawaan create-next-app, belum ada dokumentasi project |
| S5 | ℹ️ | **Tidak ada folder `hooks/`** | `components.json` mendefinisikan alias `@/hooks` tapi folder belum dibuat |
| S6 | ℹ️ | **Tidak ada `middleware.ts`** | Proteksi route hanya lewat layout, bukan middleware |

---

## 🧩 2. Kualitas Kode

### 2.1 Build Status: ❌ GAGAL

```
Type error: Type 'Adapter' (from @auth/prisma-adapter) is not assignable to type 'Adapter' (from @auth/core)
→ Property 'role' is missing in type 'AdapterUser'
```

> **Penyebab:** Versi `@auth/prisma-adapter` dan `next-auth` tidak kompatibel. `AdapterUser` dari prisma-adapter tidak punya field `role` yang ditambahkan di type augmentation `next-auth.d.ts`.

### 2.2 ESLint: ❌ 3 Error, 2 Warning

| File | Severity | Rule | Detail |
|---|:---:|---|---|
| [page.tsx](file:///D:/Project/booking-villa/app/page.tsx) | ⚠️ Warning | `no-unused-vars` | `Image` di-import tapi tidak digunakan |
| [Hero.tsx](file:///D:/Project/booking-villa/components/Hero.tsx) | ⚠️ Warning | `no-img-element` | Menggunakan `<img>` bukan `<Image />` dari Next.js |
| [Hero.tsx](file:///D:/Project/booking-villa/components/Hero.tsx) | 🔴 Error | `no-unescaped-entities` | Karakter `'` harus di-escape di JSX |
| [Reviews.tsx](file:///D:/Project/booking-villa/components/Reviews.tsx) | 🔴 Error | `no-unescaped-entities` | Karakter `"` harus di-escape di JSX (2x) |

### 2.3 Temuan Per File

#### [app/page.tsx](file:///D:/Project/booking-villa/app/page.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C1 | 🟡 | `import Image from "next/image"` tidak digunakan — dead import |

#### [app/layout.tsx](file:///D:/Project/booking-villa/app/layout.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C2 | 🟡 | Load 2 font (Raleway + Geist) tapi mapping ke CSS variable tidak jelas. `--font-sans` di-set ke `var(--font-sans)` di globals.css — referensi circular |

#### [auth.ts](file:///D:/Project/booking-villa/auth.ts)
| # | Severity | Temuan |
|---|:---:|---|
| C3 | 🔴 | **Build error** karena type mismatch PrismaAdapter |
| C4 | 🟡 | JWT callback query DB **setiap request** (`prisma.user.findUnique`) — ini menghilangkan keuntungan performa JWT |
| C5 | 🟡 | Tidak ada error handling di JWT callback jika DB query gagal |

#### [components/Hero.tsx](file:///D:/Project/booking-villa/components/Hero.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C6 | 🟡 | Pakai `<img>` bukan `<Image />` dari Next.js — kehilangan optimasi (lazy loading, format conversion, resize) |
| C7 | 🔴 | Link ke `/villas` tapi route tersebut **belum ada** |
| C8 | 🟡 | Unescaped `'` dalam teks JSX |

#### [components/AboutUs.tsx](file:///D:/Project/booking-villa/components/AboutUs.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C9 | 🟡 | External Unsplash URL di-hardcode — bisa pecah sewaktu-waktu, tidak ada fallback |
| C10 | 🟡 | Pakai `<motion.img>` bukan `<Image />` dari Next.js |
| C11 | ℹ️ | Tidak ada `alt` text yang deskriptif per gambar (semua "Umbu Houses") |

#### [components/Navbar.tsx](file:///D:/Project/booking-villa/components/Navbar.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C12 | 🔴 | Link ke `/villas` dan `/reservations` — **kedua route belum ada** |
| C13 | 🔴 | Tombol "Sign In" **tidak berfungsi** — tidak ada `Link` ke `/SignIn` dan tidak ada `onClick` handler |
| C14 | 🟡 | Tombol Sign In di mobile menu juga tidak berfungsi (duplikasi masalah) |

#### [components/LoginButton.tsx](file:///D:/Project/booking-villa/components/LoginButton.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C15 | ℹ️ | Ada named export (`export function LoginButton`) DAN default export (`export default LoginButton`) — redundan, pilih salah satu |
| C16 | 🟡 | Menggunakan inline Tailwind classes yang panjang, bisa dipecah ke variant atau `cn()` |

#### [components/Footer.tsx](file:///D:/Project/booking-villa/components/Footer.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C17 | 🟡 | Custom SVG untuk Instagram & Facebook padahal `react-icons` dan `lucide-react` sudah terinstall |
| C18 | ℹ️ | Link sosial media pakai `href="#"` — placeholder |

#### [components/Reviews.tsx](file:///D:/Project/booking-villa/components/Reviews.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C19 | 🟡 | Inline SVG untuk bintang rating padahal `lucide-react` punya `Star` icon |
| C20 | 🔴 | Unescaped `"` dalam JSX string (ESLint error) |
| C21 | ℹ️ | Section tidak punya `id` — tidak bisa di-anchor link (berbeda dari section lain) |

#### [components/RecommendedVillas.tsx](file:///D:/Project/booking-villa/components/RecommendedVillas.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C22 | 🟡 | Data villa di-hardcode sebagai `dummyVillas` — tidak fetch dari database padahal Prisma schema `Villa` sudah ada |
| C23 | 🟡 | Text placeholder `"Image (To be provided)"` masih tampil — belum ada gambar villa |
| C24 | 🟡 | Tombol "View Details" tidak punya link/action |

#### [app/admin/layout.tsx](file:///D:/Project/booking-villa/app/admin/layout.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C25 | 🟡 | Pakai hardcoded color (`bg-gray-50`, `bg-slate-900`, `text-slate-800`) — inkonsisten dengan design token di `globals.css` |
| C26 | ℹ️ | Comment dalam bahasa Indonesia — mixing bahasa dengan kode Inggris |

#### [app/admin/page.tsx](file:///D:/Project/booking-villa/app/admin/page.tsx)
| # | Severity | Temuan |
|---|:---:|---|
| C27 | 🟡 | Halaman hanya "Hello World" — placeholder, belum ada fungsionalitas admin |
| C28 | 🟡 | Pakai hardcoded color (`text-slate-800`, `text-gray-600`) — bukan dari design system |

---

## 🗄️ 3. Database / Prisma

### 3.1 Schema Review

#### [schema.prisma](file:///D:/Project/booking-villa/prisma/schema.prisma)

| # | Severity | Temuan | Rekomendasi |
|---|:---:|---|---|
| D1 | 🔴 | **Datasource PostgreSQL tapi ada `dev.db` (SQLite)** | File `prisma/dev.db` berukuran 69 KB (SQLite). Schema mengarah ke PostgreSQL. Ini akan error saat `prisma migrate` tanpa PostgreSQL |
| D2 | 🟡 | **Model `Amenities` pakai nama plural** | Konvensi Prisma adalah singular: `Amenity`, bukan `Amenities` |
| D3 | 🟡 | **`VillaAmenities` tanpa unique constraint** | Tidak ada `@@unique([villaId, amenitiesId])` — memungkinkan duplikasi relasi |
| D4 | 🟡 | **`VillaAmenities` bisa pakai implicit many-to-many** | Prisma mendukung `Villa[] @relation` langsung, menghindari junction table manual |
| D5 | 🟡 | **`Villa.image` hanya String tunggal** | Satu villa hanya bisa punya 1 gambar. Mungkin perlu `String[]` atau model `VillaImage` terpisah |
| D6 | 🟡 | **`Villa.price` pakai `Int`** | Tidak mendukung desimal/koma. Untuk harga, lebih baik pakai `Float` atau simpan dalam satuan terkecil (sen) |
| D7 | 🟡 | **`Payment.status` dan `Payment.method` pakai String** | Lebih aman pakai `enum` Prisma agar nilainya terkontrol |
| D8 | 🟡 | **Relation field naming PascalCase** | `VillaAmenities`, `Reservation`, `Payment` — konvensi Prisma adalah camelCase (`villaAmenities`, `reservations`, `payment`) |
| D9 | ℹ️ | **Tidak ada index** pada `Reservation.userId` dan `Reservation.villaId` | Query berdasarkan user/villa akan lambat seiring data bertambah |
| D10 | ℹ️ | **Tidak ada validasi overlap tanggal** | Dua reservasi bisa overlap pada villa yang sama — perlu app-level logic atau DB constraint |

### 3.2 Migration

| # | Severity | Temuan |
|---|:---:|---|
| D11 | ℹ️ | Hanya ada 1 migration (`20260720040344_init`) — wajar untuk project baru |
| D12 | ⚠️ | `dev.db` ada di repo padahal `*.db` sudah di `.gitignore` — kemungkinan di-commit sebelum gitignore ditambahkan |

---

## ⚙️ 4. Konfigurasi

### 4.1 package.json

| # | Severity | Temuan | Rekomendasi |
|---|:---:|---|---|
| P1 | 🟡 | **`shadcn` di dependencies** | Harusnya di `devDependencies` — ini CLI tool, bukan runtime dependency |
| P2 | 🟡 | **Dua icon library terinstall** | `lucide-react` DAN `react-icons` — redundan, pilih satu |
| P3 | 🟡 | **`prettier` tidak di devDependencies** | `.prettierrc` ada tapi `prettier` sendiri tidak terinstall (hanya mengandalkan editor extension) |
| P4 | ℹ️ | **Tidak ada test framework** | Tidak ada `jest`, `vitest`, `@testing-library`, atau framework test lainnya |
| P5 | ℹ️ | **Tidak ada script format/prettier** | Tidak ada `"format": "prettier --write ."` di scripts |
| P6 | ℹ️ | **2 moderate vulnerabilities** | Terdeteksi saat `npm audit` |

### 4.2 next.config.ts

| # | Severity | Temuan |
|---|:---:|---|
| P7 | 🟡 | **Config sepenuhnya kosong** — tidak ada konfigurasi `images.remotePatterns` padahal `AboutUs.tsx` menggunakan URL external (Unsplash). Jika migrasi ke `<Image />`, akan error tanpa config ini |

### 4.3 .gitignore

| # | Severity | Temuan |
|---|:---:|---|
| P8 | ✅ | Coverage baik — `.env*`, `node_modules`, `.next`, `*.db` sudah tercakup |

---

## 🔒 5. Keamanan

| # | Severity | Temuan | Rekomendasi |
|---|:---:|---|---|
| SEC1 | 🟡 | **Tidak ada `middleware.ts`** | Proteksi admin hanya di layout (server-side). Best practice adalah gunakan Next.js middleware untuk route protection |
| SEC2 | 🟡 | **JWT callback selalu query DB** | Bisa jadi attack surface untuk DB flooding. Pertimbangkan caching/TTL |
| SEC3 | ℹ️ | **Tidak ada rate limiting** | Tidak ada proteksi terhadap brute force pada auth endpoint |
| SEC4 | ℹ️ | **Tidak ada CSP headers** | `next.config.ts` kosong, tidak ada security headers |

---

## 🔗 6. Dead Ends & Missing Routes

Berikut halaman yang **di-link dari UI tapi belum dibuat**:

| Link | Referensi Dari | Status |
|---|---|:---:|
| `/villas` | Navbar, Hero, RecommendedVillas | ❌ **404** |
| `/reservations` | Navbar ("My Reservations") | ❌ **404** |
| `/signin` (lowercase) | `auth.ts` pages config | ❌ **404** (yang ada `/SignIn`) |

---

## 🎨 7. UI/UX Review

### Positif ✅
- Color system dengan CSS variables yang rapi (light + dark theme)
- Animasi framer-motion yang smooth dan tidak berlebihan
- Responsive layout dengan mobile menu
- Typography hierarchy yang jelas (font-serif untuk heading)
- Design system shadcn terintegrasi

### Perlu Diperbaiki 🟡
- Tidak ada dark mode toggle meskipun dark theme sudah didefinisikan
- Placeholder gambar "Image (To be provided)" masih tampil di villa cards
- Tidak ada loading state / skeleton
- Tidak ada halaman error (`error.tsx`, `not-found.tsx`)
- Tidak ada `<meta>` description yang spesifik per halaman

---

## 🪓 8. Ponytail Audit (Over-Engineering Check)

| Tag | Apa yang bisa dipotong | Pengganti | File |
|---|---|---|---|
| `native` | Custom SVG Instagram & Facebook | Gunakan `react-icons` yang sudah terinstall: `FaInstagram`, `FaFacebook` | [Footer.tsx](file:///D:/Project/booking-villa/components/Footer.tsx) |
| `native` | Inline SVG star icon | Gunakan `Star` dari `lucide-react` yang sudah terinstall | [Reviews.tsx](file:///D:/Project/booking-villa/components/Reviews.tsx) |
| `delete` | `import Image from "next/image"` | Hapus import yang tidak digunakan | [page.tsx](file:///D:/Project/booking-villa/app/page.tsx) |
| `delete` | `export default LoginButton` | Sudah ada named export, hapus default export | [LoginButton.tsx](file:///D:/Project/booking-villa/components/LoginButton.tsx) |
| `delete` | `public/hero.jpg` (72 KB) | Duplikat dari `public/images/hero.jpg`, hapus salah satu | [public/](file:///D:/Project/booking-villa/public) |
| `shrink` | Dua icon library | Pilih satu: `lucide-react` atau `react-icons`, hapus yang lain | [package.json](file:///D:/Project/booking-villa/package.json) |

**Net removable:** ~60 baris kode, 1 dependency

---

## 📋 9. Checklist Prioritas Perbaikan

### 🔴 Harus Diperbaiki (Blocking)

- [ ] Fix type error `@auth/prisma-adapter` — update versi agar kompatibel dengan `next-auth@5`
- [ ] Rename folder `app/SignIn/` → `app/signin/` agar sesuai dengan `auth.ts` config
- [ ] Fix ESLint errors — escape karakter khusus di JSX
- [ ] Hapus unused import `Image` di `app/page.tsx`

### 🟡 Sebaiknya Diperbaiki (Important)

- [ ] Buat route `/villas` dan `/reservations` atau hapus link-nya
- [ ] Hubungkan tombol Sign In di Navbar ke halaman login
- [ ] Ganti `<img>` dengan `<Image />` dari Next.js
- [ ] Tambahkan `images.remotePatterns` di `next.config.ts` untuk Unsplash
- [ ] Konsistenkan penggunaan design token (hapus hardcoded `bg-gray-50`, `bg-slate-900` di admin)
- [ ] Pindahkan `shadcn` dari dependencies ke devDependencies
- [ ] Pilih satu icon library (lucide-react ATAU react-icons)
- [ ] Tambahkan `@@unique([villaId, amenitiesId])` di `VillaAmenities`
- [ ] Konsistenkan naming convention relation fields di Prisma ke camelCase
- [ ] Fix datasource mismatch (PostgreSQL di schema vs SQLite dev.db)

### ℹ️ Nice to Have

- [ ] Tambahkan `middleware.ts` untuk auth protection
- [ ] Buat `error.tsx` dan `not-found.tsx`
- [ ] Tambahkan loading states / skeleton
- [ ] Kustomisasi README.md
- [ ] Tambahkan dark mode toggle
- [ ] Tambahkan test framework
- [ ] Tambahkan prettier ke devDependencies + script
- [ ] Tambahkan index pada field yang sering di-query di Prisma
- [ ] Gunakan enum untuk `Payment.status` dan `Payment.method`
- [ ] Hapus duplikat `hero.jpg`

---

## 📊 Statistik Project

| Metrik | Nilai |
|---|---|
| Total file source code | 18 file |
| Total dependencies | 13 (runtime) + 7 (dev) |
| Total Prisma models | 6 |
| Total React components | 8 (7 custom + 1 shadcn) |
| Total routes | 4 (`/`, `/SignIn`, `/admin`, `/api/auth/[...nextauth]`) |
| Build status | ❌ Gagal (type error) |
| ESLint status | ❌ 3 errors, 2 warnings |
| Test coverage | 0% (tidak ada test) |

---

> **Catatan:** File `.env` tidak diaudit sesuai permintaan.
