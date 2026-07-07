# Unicover — System Flow

## 1. User Journey — Guest (pengunjung)

```
Home (/)
  │
  ├── Lihat hero + produk featured + artikel terbaru
  │
  ▼
Katalog (/products)
  │  filter kategori: covermobil | coverban mobil | ...
  │  search nama produk
  │  sort: termurah / termahal / terbaru
  │  pagination
  │
  ▼
Detail Produk (/products/{slug})
  │  galeri gambar
  │  nama, harga (diskon), status stok
  │  deskripsi rich
  │
  ▼
Klik "Pesan via WhatsApp"
  │  form ringkas: nama, no. WA, catatan, qty
  │  compose pesan:
  │    "Halo {brand}, saya mau pesan:
  │     Produk: {name}
  │     Harga: {price}
  │     Qty: {qty}
  │     Nama: {customer_name}
  │     WA: {customer_wa}
  │     Catatan: {note}"
  │
  ▼
window.open("https://wa.me/{wa_number}?text={urlencode}")
  │  WhatsApp client terbuka dengan pesan terisi
  │  → TIDAK ada data disimpan ke DB
```

> Komposisi pesan WA bisa di front-end murni (tidak butuh endpoint backend) — cukup baca `site_settings.wa_number` + data produk dari props Inertia.

## 2. User Journey — Admin

```
Login (/login)  ← Fortify
  │  email + password
  ▼
Redirect → /dashboard
  │  ringkasan: jumlah produk, kategori, artikel
  │
  ├── /admin/products       CRUD produk + upload gambar
  ├── /admin/categories     CRUD kategori produk
  ├── /admin/articles       CRUD artikel + kategori + tag
  ├── /admin/settings       edit site_settings (logo, brand, WA, hero, sosial)
  └── (logout)
```

## 3. Peta Halaman (Inertia pages)

### Publik — `resources/js/pages/`
| Page file | Route | Layout |
|---|---|---|
| `home.tsx` | `/` | PublicLayout (baru) |
| `products/index.tsx` | `/products` | PublicLayout |
| `products/show.tsx` | `/products/{slug}` | PublicLayout |
| `articles/index.tsx` | `/articles` | PublicLayout |
| `articles/show.tsx` | `/articles/{slug}` | PublicLayout |
| `articles/category.tsx` | `/articles/category/{slug}` | PublicLayout |
| `articles/tag.tsx` | `/articles/tag/{slug}` | PublicLayout |

### Admin — `resources/js/pages/admin/` (ataf reuse `settings/` pattern)
| Page file | Route | Layout |
|---|---|---|
| `dashboard.tsx` (existing, repurpose) | `/dashboard` | AppLayout (existing) |
| `admin/products/index.tsx` | `/admin/products` | AppLayout |
| `admin/products/form.tsx` | `/admin/products/create` & `/admin/products/{id}/edit` | AppLayout |
| `admin/categories/index.tsx` | `/admin/categories` | AppLayout |
| `admin/articles/index.tsx` | `/admin/articles` | AppLayout |
| `admin/articles/form.tsx` | `/admin/articles/create` & `/admin/articles/{id}/edit` | AppLayout |
| `admin/settings/index.tsx` | `/admin/settings` | AppLayout |

> **Catatan layout switching:** `resources/js/app.tsx` memilih layout berdasarkan prefix nama page. Tambah kasus untuk page publik (mis. `name.startsWith('products/')` → PublicLayout, `name.startsWith('articles/')` → PublicLayout, `name.startsWith('admin/')` → AppLayout). `welcome` & `dashboard` sudah ada.

### Layout baru
- `resources/js/layouts/public-layout.tsx` — header (logo, nav kategori, tombol kontak WA), footer (sosial, alamat). Reuse `app-layout.tsx` sebagai pola.

## 4. Peta Route (backend)

### `routes/web.php` (publik)
```php
Route::inertia('/', 'home')->name('home');
Route::get('/products', [CatalogController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [CatalogController::class, 'show'])->name('products.show');
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [ArticleController::class, 'show'])->name('articles.show');
Route::get('/articles/category/{category:slug}', [ArticleController::class, 'byCategory'])->name('articles.category');
Route::get('/articles/tag/{tag:slug}', [ArticleController::class, 'byTag'])->name('articles.tag');
```

### `routes/admin.php` (group admin — daftarkan di `bootstrap/app.php` atau `web.php`)
```php
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('products', Admin\ProductController::class);
    Route::resource('categories', Admin\CategoryController::class);
    Route::resource('articles', Admin\ArticleController::class);
    Route::get('/settings', [Admin\SiteSettingController::class, 'edit'])->name('settings.edit');
    Route::patch('/settings', [Admin\SiteSettingController::class, 'update'])->name('settings.update');
});
```

### Auth & settings (tetap)
- Fortify: login + reset password (register & 2FA tetap mati).
- `routes/settings.php` (profile/security) bisa tetap untuk admin.

## 5. Middleware Admin

Buat middleware `EnsureUserIsAdmin` (cek `auth()->user()?->is_admin`). Daftarkan alias `admin` di `bootstrap/app.php` `$middleware->alias(...)`. Route group admin pakai `['auth','admin']`.

## 6. WhatsApp Helper

```ts
// resources/js/lib/whatsapp.ts
export function waLink(number: string, message: string): string {
  const clean = number.replace(/\D/g, ''); // buang + spasi strip
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
```

Pesan disusun di komponen dari props produk + input form. Tanpa endpoint backend.

## 7. Upload Gambar

- Endpoint admin store/update terima `file` → simpan ke disk (default `public`/`local`), simpan path ke `product_images.path` / `articles.cover_image_path` / `site_settings.logo_path`.
- Validasi: `image`, `mimes:jpg,jpeg,png,webp`, `max:2048`.
- Symlink: `php artisan storage:link` (sekali).
