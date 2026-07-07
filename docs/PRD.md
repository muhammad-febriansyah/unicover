# Unicover — Product Requirement Document

> Katalog produk dinamis untuk bisnis custom otomotif (cover mobil & cover ban mobil) dengan checkout WhatsApp dan CMS mandiri. Nama sistem: **unicover**.

## 1. Latar Belakang

Klien menjalankan bisnis custom otomotif (covermobil & coverban mobil) dan butuh website katalog yang fokus estetika premium, dengan kemampuan mandiri mengelola produk, kategori, logo, dan artikel. Checkout tidak lewat payment gateway, melainkan langsung ke WhatsApp penjual.

## 2. Tujuan

- Menyajikan katalog produk dinamis yang bisa difilter per kategori (covermobil, coverban mobil, dst).
- Memberi CMS agar admin (klien) bisa CRUD produk, kategori, artikel, dan pengaturan situs (logo, brand, nomor WA, hero, sosial) tanpa bantuan developer.
- Mengubah kunjungan menjadi percakapan penjualan via WhatsApp.
- Membangun konten/artikel otomotif untuk SEO.

## 3. User Roles

| Role | Akun | Akses |
|---|---|---|
| **Admin** | Login via Fortify (seed 1 admin) | CMS: Produk, Kategori, Artikel, Pengaturan Situs |
| **Guest** | Tanpa akun | Browse katalog + checkout WhatsApp |

- **Tidak ada registrasi publik.** Konfigurasi Fortify saat ini hanya `resetPasswords()` → register & 2FA mati. Pertahankan.
- Admin dibedakan via kolom `users.is_admin` (bool). Middleware `admin` membatasi route CMS.

## 4. Fitur Inti

### 4.1 Katalog Publik (guest)
- Halaman katalog dengan grid produk.
- Filter dinamis per **kategori produk** (covermobil / coverban mobil / dst — dibuat admin).
- Search (cari nama produk), sort (termurah/termahal/terbaru), pagination.
- Halaman detail produk: multi-gambar (galeri), deskripsi kaya, harga, status stok, tombol **Pesan via WhatsApp**.

### 4.2 Checkout WhatsApp
- **Direct per-produk** (TIDAK ada keranjang, TIDAK ada tabel order).
- Di halaman detail produk: form ringkas (nama, no. WhatsApp, catatan, qty) → compose pesan → buka `https://wa.me/{nomor}?text={urlencode pesan}`.
- Nomor tujuan & nama brand diambil dari `site_settings`.
- **Tidak ada data pesanan disimpan** ke database (WA-only).

### 4.3 CMS Admin
- **Dashboard** (`/dashboard`): ringkasan jumlah produk, kategori, artikel.
- **Produk** (CRUD): nama, slug, kategori, deskripsi rich, harga, harga diskon, sku, status stok, unggah multi-gambar, set featured/aktif, urutan.
- **Kategori Produk** (CRUD): nama, slug, deskripsi, gambar, aktif, urutan. Dinamis (admin bisa tambah kategori baru kapan saja).
- **Artikel** (CRUD): judul, slug, kategori artikel, tag, ringkasan, body rich, cover image, publish toggle, publish date.
- **Kategori Artikel** (CRUD): nama, slug, aktif.
- **Tag** (CRUD): nama, slug.
- **Pengaturan Situs** (singleton): brand name, logo, nomor WhatsApp, tagline, hero (heading + subheading + image), kontak (alamat, email), sosial (instagram, facebook, tiktok), footer text.

### 4.4 Artikel/Blog (publik)
- List artikel dengan pagination.
- Detail artikel per slug.
- Filter per kategori artikel (`/articles/category/{slug}`) dan per tag (`/articles/tag/{slug}`).

## 5. Non-Functional

- **Desain:** premium otomotif, responsif, dark mode. Palet final menunggu referensi/brand color klien. Basis: shadcn/ui (new-york) + Tailwind v4.
- **SEO:** meta title/description per halaman via Inertia `<Head>`, slug ramah URL. Sitemap opsional (lihat Implementation).
- **Performa:** SSR Inertia (baik untuk SEO), optimasi gambar.
- **Keamanan:** route admin dibatasi middleware `auth` + `admin`; validasi input via Form Request; throttle login (bawaan Fortify).
- **Kualitas:** Pest test untuk setiap perubahan, PHPStan level 7, Pint preset laravel.

## 6. Out of Scope (dikecualikan)

- Keranjang belanja (cart) multi-produk.
- Pencatatan/tabel order & order items (WA-only).
- Varian produk (SKU per ukuran/warna/material) & daftar kompatibilitas tipe mobil.
- Akun pelanggan / registrasi publik / wishlist.
- Payment gateway.
- Multi-bahasa (ID-only untuk sekarang).

## 7. Open Items (wajib dikonfirmasi sebelum/n saat implementasi)

1. **Referensi desain / brand color dari klien** — desain tema ter-block sampai ini masuk.
2. **Rich text editor** — butuh dependency (mis. TipTap). Wajib approval sebelum tambah package (aturan AGENTS.md: dependencies butuh approval).
3. **DB** — konfirmasi MySQL (konfigurasi saat ini) vs SQLite vs Laravel Cloud.
4. **Konten seed** — nomor WhatsApp, nama brand, copy hero, kredensial admin awal.

## 8. Asumsi

- 1 produk = 1 kategori produk.
- 1 artikel = 1 kategori artikel + N tag.
- DB: MySQL.
- Bahasa: Indonesia.
- Checkout langsung per-produk WA.
