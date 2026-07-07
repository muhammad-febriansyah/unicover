# Unicover — Implementation Guide

> Petunjuk eksekusi untuk AI/developer. Berdasarkan codebase nyata `unicover` (Laravel React Starter Kit yang sudah dikustomisasi). Baca file ini + `PRD.md` + `ERD.md` + `FLOW.md` sebelum mulai.

## 1. Kondisi Codebase Saat Ini

- **Stack:** Laravel 13 + Inertia v3 + React 19 + Tailwind v4 + shadcn/ui (new-york) + Wayfinder + Fortify.
- **Auth:** Fortify fitur aktif hanya `resetPasswords()`. Tidak ada register publik, tidak ada 2FA. Setelah login → `/dashboard`.
- **Domain:** greenfield. Migrasi hanya `users`, `cache`, `jobs` (timestamp `0001_01_01_*`). Belum ada model domain.
- **DB terkonfigurasi:** MySQL (lihat `config/database.php` / `.env`), kosong. Konfirmasi dulu sebelum migrate.
- **Frontend:** `resources/js/app.tsx` switch layout berdasarkan prefix nama page Inertia. TS alias `@/*` → `resources/js/*`.
- **Generated/ignored (JANGAN edit manual):** `resources/js/{actions,routes,wayfinder}/**` (Wayfinder), `resources/js/components/ui/*` (shadcn).

## 2. Konvensi Query & Eloquent (WAJIB — N+1 dilarang)

- **Eager loading wajib** untuk setiap relasi yang diakses (di controller, resource, view, loop). N+1 = bug.
  - `::with([...])` / `->with([...])` di query. Greedy `$with` di model hanya untuk relasi yang BENAR-BENAR selalu dipakai.
  - Nested: `Product::with(['category', 'images' => fn($q) => $q->orderBy('sort_order')])`.
  - Pivot counts: `Article::withCount('tags')`.
  - Jika akses relasi di loop/resource tanpa eager load → refactor.
- **Strict mode + lazy-loading guard** aktif di non-production (di `App\Providers\AppServiceProvider::boot()`):
  ```php
  Model::shouldBeStrict(! app()->isProduction());
  Model::preventLazyLoading(! app()->isProduction());
  ```
  Strict mode melempar exception saat lazy load terjadi di local/test → tertangkap sebelum production. Di production relax agar tidak break runtime (dicegah via review + staging).
- **Cek N+1 sebelum finalize:** `php artisan test` (query log aktif saat strict) atau `DB::listen` saat ragu. Tidak ada lazy load yang lolos.
- **Pagination:** katalog publik `->paginate()` atau cursor, bukan `->get()` pada koleksi besar. Admin dashboard boleh `->get()` hanya untuk entitas kecil (kategori, tag).

## 3. Konvensi WAJIB (dari AGENTS.md / Boost guidelines)

- Buat file via `php artisan make:*` (model, controller, migration, dll). Pass `--no-interaction`.
- Model baru: buat factory + seeder (pakai `-mfsc`). Pakai factory untuk test, bukan buat model manual di tinker.
- Render halaman: `Inertia::render('page-name', $props)` — bukan Blade view.
- API payload: pakai Eloquent API Resource (`ProductResource`, dll).
- Route ke React: pakai **Wayfinder** (`@/actions/`, `@/routes/`) — jangan hardcode URL.
- Test: Pest. Buat/update test tiap perubahan. Jalankan `php artisan test --compact --filter=...`.
- Format PHP: `vendor/bin/pint --dirty --format agent` sebelum finalize (atau `composer lint`).
- PHPStan: level 7, cakup path `app/`, `bootstrap/app.php`, `config/`, `database/`, `routes/`. Cek `composer types:check`.
- **Dependencies baru butuh approval.** Flag ke user sebelum `composer require` / `npm install` paket baru.

## 3. Urutan Eksekusi (Fase)

### Fase 0 — Open items (blok)
- [ ] Konfirmasi DB (MySQL vs SQLite vs Cloud).
- [ ] Dapatkan referensi/brand color klien (blok desain tema).
- [ ] Approval paket rich text editor (mis. TipTap: `@tiptap/react @tiptap/starter-kit`).
- [ ] Kumpulkan seed content: nomor WA, nama brand, copy hero, kredensial admin.

### Fase 1 — Data layer
1. **Pasang strict mode + lazy-loading guard** di `App\Providers\AppServiceProvider::boot()` (sebelum model domain dibuat, agar N+1 tertangkap sejak awal):
   ```php
   Model::shouldBeStrict(! app()->isProduction());
   Model::preventLazyLoading(! app()->isProduction());
   ```
2. `php artisan make:migration add_is_admin_to_users_table --table=users` + jalankan.
3. Buat 7 model + migration + factory + seeder: `Category, Product, ProductImage, ArticleCategory, Article, Tag, SiteSetting` (lihat `ERD.md`).
4. Definisikan relasi Eloquent di tiap model (`hasMany`, `belongsTo`, `belongsToMany`).
5. `DatabaseSeeder` urut: User → Category → ArticleCategory → Tag → Product → ProductImage → Article → SiteSetting (id=1).
6. `php artisan migrate --seed`. Verifikasi dengan `database-schema` / `database-query` (Boost tools).

### Fase 2 — Backend CMS
1. Middleware `EnsureUserIsAdmin` → alias `admin` di `bootstrap/app.php`.
2. Controllers `Admin\{Category,Product,ProductImage,ArticleCategory,Article,Tag,SiteSetting}Controller` (resource kecuali SiteSetting singleton edit/update).
3. Form Request tiap store/update (validasi).
4. API Resource: `ProductResource`, `ArticleResource`, `CategoryResource`, dll.
5. Routes `routes/admin.php` (group `auth` + `admin`), daftarkan di `bootstrap/app.php`.
6. Upload gambar: simpan ke disk, path ke kolom. `php artisan storage:link`.
7. **Eager loading admin list** (tetap wajib kendati admin): index produk `Product::with('category', 'images')->paginate()`, index artikel `Article::with('author', 'articleCategory', 'tags')->paginate()`, dashboard counts `Category::count()`, `Product::count()`, `Article::count()`. Form edit produk: `Product::with('images')->findOrFail($id)`.

### Fase 3 — Backend publik
1. `CatalogController` (index katalog + show produk), `ArticleController` (index + show + byCategory + byTag).
2. Routes di `routes/web.php` (slug binding: `Route::get('/products/{product:slug}', ...)`).
3. Share `site_settings` global ke semua Inertia page via `HandleInertiaRequests::share()` (untuk logo, brand, WA, footer di layout publik).
4. **Eager loading wajib per query publik** (cegah N+1 di katalog/listing):
   - Katalog list: `Product::with(['category', 'images' => fn($q) => $q->where('is_primary', true)])->paginate(12)` (atau `images` lalu filter primary di resource — pilih satu, konsisten).
   - Detail produk: `Product::with(['category', 'images' => fn($q) => $q->orderBy('sort_order')])->whereSlug($slug)->firstOrFail()`.
   - Produk featured di home: `Product::with('category', 'images')->where('is_featured', true)->limit(8)->get()`.
   - Artikel list: `Article::with(['author', 'articleCategory', 'tags'])->where('is_published', true)->paginate(9)`.
   - Artikel detail: `Article::with(['author', 'articleCategory', 'tags'])->whereSlug($slug)->firstOrFail()`.
   - Artikel per kategori: `$category->articles()->with(['author', 'tags'])->paginate(9)`.
5. **API Resource baca relasi** → hanya akses yang sudah di-eager load. Jika Resource butuh relasi yang belum di-load, tambahkan ke `::with([...])` caller, bukan akses lazy di Resource.

### Fase 4 — Frontend publik
1. Layout `resources/js/layouts/public-layout.tsx` (header+footer, baca site_settings).
2. Update `resources/js/app.tsx` switch layout: `products/*` & `articles/*` & `home` → PublicLayout.
3. Pages: `home.tsx`, `products/index.tsx`, `products/show.tsx`, `articles/*`.
4. Komponen WhatsApp: `resources/js/lib/whatsapp.ts` (`waLink`) + form di detail produk.
5. Pakai Wayfinder untuk semua URL (`@/routes`).

### Fase 5 — Frontend admin
1. Pages `resources/js/pages/admin/*` (index + form per resource).
2. Reuse komponen shadcn (`@/components/ui/*`) — jangan edit manual; tambah baru via shadcn CLI bila perlu.
3. Rich text editor untuk deskripsi produk & body artikel (Fase 0 approval).
4. Upload gambar UI (dropzone/file input → endpoint admin).

### Fase 6 — Polish & SEO
1. Meta per halaman via Inertia `<Head>` (title + meta description).
2. (Opsional) sitemap: route `/sitemap.xml` yang iterate products/articles/categories.
3. Dark mode, responsif, transisi halus.
4. Verifikasi: `composer test`, `npm run lint`, `npm run types:check`, `npm run build`.

## 4. Cek Akhir (sebelum dianggap selesai)

```bash
composer test                 # config:clear → pint --test → phpstan → artisan test
npm run lint                  # eslint --fix
npm run format                # prettier --write resources/
npm run types:check           # tsc --noEmit
npm run build                 # vite build
vendor/bin/pint --dirty --format agent
```

## 5. Catatan Penting

- **Jangan edit dalam blok `<laravel-boost-guidelines>`** di `AGENTS.md`/`CLAUDE.md` — di-regenerate oleh `php artisan boost:update`. Repo-specific guidance ada di luar blok itu.
- **Jangan edit manual** direktori generated: `resources/js/{actions,routes,wayfinder}`, `resources/js/components/ui`.
- **Tanpa tabel order/cart** — checkout WA-only, tidak simpan data pelanggan.
- **Tanpa varian produk** — 1 produk 1 harga.
- **Guest-only** — jangan enable Fortify registration.
