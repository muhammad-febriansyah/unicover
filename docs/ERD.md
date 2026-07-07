# Unicover — Entity Relationship Diagram

> 8 tabel inti (+ pivot). TIDAK ada tabel `orders`, `order_items`, atau `cart` (checkout WA-only, tidak ada data pesanan disimpan).

## Diagram Relasi (teks)

```
users (1) ─────< (N) articles
users.is_admin bool

categories (1) ──< (N) products (1) ──< (N) product_images

article_categories (1) ──< (N) articles (N) ──< (M) tags
                                                ^ via article_tag (pivot)

site_settings (singleton, id=1)
```

## Tabel & Field

### users *(existing — tambah kolom)*
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | |
| email | string unique | |
| email_verified_at | timestamp nullable | |
| password | string | |
| remember_token | string | |
| **is_admin** | bool default 0 | **BARU** — pembeda admin |
| timestamps | | |

> Migrasi baru: `add_is_admin_to_users_table` → `$table->boolean('is_admin')->default(false)->after('remember_token')`.

### categories *(kategori produk)*
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | covermobil, coverban mobil, dst |
| slug | string unique | |
| description | text nullable | |
| image_path | string nullable | |
| is_active | bool default true | |
| sort_order | integer default 0 | |
| timestamps | | |

> Relasi: 1—N products. Flat (tanpa parent_id di MVP; tambah jika butuh nesting).

### products
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| category_id | FK→categories | index, restrictOnDelete |
| name | string | |
| slug | string unique | |
| description | text nullable | rich text |
| price | decimal(12,2) | |
| discount_price | decimal(12,2) nullable | |
| sku | string nullable | |
| stock_status | enum: in_stock, out_of_stock, preorder | default in_stock |
| is_featured | bool default false | |
| is_active | bool default true | |
| sort_order | integer default 0 | |
| timestamps | | |

> Relasi: N—1 category; 1—N product_images. Tanpa varian (1 produk 1 harga).

### product_images
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| product_id | FK→products cascadeOnDelete | |
| path | string | path di storage |
| sort_order | integer default 0 | |
| is_primary | bool default false | |
| timestamps | | |

> 1 produk punya banyak gambar. Pastikan satu `is_primary=true` per produk (atur di controller/service).

### article_categories
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | |
| slug | string unique | |
| description | text nullable | |
| is_active | bool default true | |
| sort_order | integer default 0 | |
| timestamps | | |

> Relasi: 1—N articles.

### articles
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| author_id | FK→users | restrictOnDelete |
| article_category_id | FK→article_categories nullable | nullOnDelete |
| title | string | |
| slug | string unique | |
| excerpt | text nullable | |
| body | text nullable | rich text |
| cover_image_path | string nullable | |
| is_published | bool default false | |
| published_at | timestamp nullable | |
| timestamps | | |

> Relasi: N—1 user (author); N—1 article_category; M—N tags via pivot.

### tags
| Field | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | |
| slug | string unique | |
| timestamps | | |

> Relasi: M—N articles via `article_tag`.

### article_tag *(pivot)*
| Field | Tipe |
|---|---|
| article_id | FK→articles cascadeOnDelete |
| tag_id | FK→tags cascadeOnDelete |
| (PK composite: article_id, tag_id) | |

### site_settings *(singleton, id=1)*
| Field | Tipe | Keterangan |
|---|---|---|
| id | PK (selalu 1) | |
| brand_name | string | |
| logo_path | string nullable | |
| wa_number | string | format 62xxx, tanpa + |
| tagline | string nullable | |
| hero_heading | string nullable | |
| hero_subheading | string nullable | |
| hero_image_path | string nullable | |
| address | string nullable | |
| email | string nullable | |
| instagram | string nullable | |
| facebook | string nullable | |
| tiktok | string nullable | |
| footer_text | string nullable | |
| timestamps | | |

> Singleton: seed id=1 di `DatabaseSeeder`. Controller update baris id=1.

## Commands Pembuatan Model (per konvensi AGENTS.md)

```bash
php artisan make:model Category -mfsc      # model + migration + factory + seeder + controller
php artisan make:model Product -mfsc
php artisan make:model ProductImage -mfsc
php artisan make:model ArticleCategory -mfsc
php artisan make:model Article -mfsc
php artisan make:model Tag -mfsc
php artisan make:model SiteSetting -mfsc
php artisan make:migration add_is_admin_to_users_table --table=users
```

- `-mfsc` = `--migration --factory --seed --controller`.
- Untuk `Tag`, relasi many-to-many: di model `Article` pakai `belongsToMany(Tag::class)`, di `Tag` pakai `belongsToMany(Article::class)`. Pivot otomatis `article_tag`.
- `php artisan make:model ProductImage -mfsc` menghasilkan nama `ProductImage` (PascalCase) — sesuai konvensi.

## Seed Order (urutan dependensi)

1. `UserSeeder` (admin awal, `is_admin=true`).
2. `CategorySeeder` (covermobil, coverban mobil).
3. `ArticleCategorySeeder`.
4. `TagSeeder`.
5. `ProductSeeder` (attach category).
6. `ProductImageSeeder` (attach product).
7. `ArticleSeeder` (attach author + category + tags).
8. `SiteSettingSeeder` (id=1).

Panggil semua di `DatabaseSeeder::run()` berurutan.
