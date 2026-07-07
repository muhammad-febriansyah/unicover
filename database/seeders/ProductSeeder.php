<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $coverMobil = Category::where('slug', 'cover-mobil')->first();
        $coverBan = Category::where('slug', 'cover-ban-mobil')->first();

        $coverMobilProducts = [
            [
                'name' => 'Cover Mobil Sedan Premium All-Weather',
                'description' => "Cover mobil sedan berbahan Oxford 190T dengan lapisan waterproof dan anti UV, cocok dipakai indoor maupun outdoor.\n\nJahitan double stitching di setiap sisi membuat cover ini tahan robek meski sering dipasang-lepas setiap hari. Dilengkapi tali pengikat di bagian bawah agar tidak mudah terbang saat angin kencang.",
                'price' => 385_000,
                'discount_price' => 329_000,
                'sku' => 'CM-001',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-01.jpg',
            ],
            [
                'name' => 'Cover Mobil Klasik Waterproof',
                'description' => "Didesain khusus untuk mobil-mobil klasik dan vintage yang butuh perlindungan ekstra dari kelembapan.\n\nMaterial parasut tebal dengan lapisan dalam berbahan lembut (soft fleece) menjaga cat mobil klasik Anda tetap mengkilap dan bebas baret halus.",
                'price' => 465_000,
                'discount_price' => null,
                'sku' => 'CM-002',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-02.jpg',
            ],
            [
                'name' => 'Cover Mobil Luxury Sedan Elite',
                'description' => "Cover premium untuk sedan mewah dengan bahan non-woven berlapis tiga (3-layer) yang breathable, mencegah kondensasi di bawah cover.\n\nFinishing jahitan rapi dengan logo emboss Unicover, memberi kesan eksklusif yang sepadan dengan kendaraan Anda.",
                'price' => 725_000,
                'discount_price' => 649_000,
                'sku' => 'CM-003',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-03.jpg',
            ],
            [
                'name' => 'Cover Mobil Luxury Sedan Elite Plus',
                'description' => "Versi upgrade dari Elite dengan tambahan lapisan reflective silver di bagian atap untuk memantulkan panas matahari secara maksimal.\n\nCocok untuk mobil yang sering diparkir outdoor dalam waktu lama, menjaga suhu interior tetap sejuk saat dipakai kembali.",
                'price' => 895_000,
                'discount_price' => null,
                'sku' => 'CM-004',
                'stock_status' => 'preorder',
                'is_featured' => false,
                'image' => 'product-04.jpg',
            ],
            [
                'name' => 'Cover Mobil City Car Soft Touch',
                'description' => "Dirancang pas untuk city car dan hatchback kecil, ringan dan mudah dilipat sehingga praktis disimpan di bagasi.\n\nBahan soft touch di bagian dalam aman untuk cat mobil, tidak meninggalkan baret meski dipakai setiap hari.",
                'price' => 275_000,
                'discount_price' => 249_000,
                'sku' => 'CM-005',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-05.jpg',
            ],
            [
                'name' => 'Cover Mobil City Car Compact Fit',
                'description' => "Potongan compact fit mengikuti lekuk bodi mobil-mobil city car populer, tidak kedodoran dan tidak sempit.\n\nDilengkapi lubang kaca spion agar tetap terpasang rapi tanpa perlu melipat spion terlebih dahulu.",
                'price' => 295_000,
                'discount_price' => null,
                'sku' => 'CM-006',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-06.jpg',
            ],
            [
                'name' => 'Cover Mobil Outdoor Heavy Duty',
                'description' => "Dibuat dari bahan Taffeta 210D dengan lapisan PVC di bagian dalam, tahan hujan deras dan sengatan matahari langsung.\n\nPilihan tepat untuk kendaraan yang tidak memiliki garasi dan harus parkir outdoor setiap hari.",
                'price' => 415_000,
                'discount_price' => 379_000,
                'sku' => 'CM-007',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-07.jpg',
            ],
            [
                'name' => 'Cover Mobil Sedan Harian Anti Debu',
                'description' => "Solusi ekonomis untuk perlindungan harian dari debu dan kotoran saat mobil diparkir di area terbuka maupun garasi.\n\nRingan, breathable, dan mudah dibersihkan cukup dengan dilap menggunakan kain lembab.",
                'price' => 225_000,
                'discount_price' => null,
                'sku' => 'CM-008',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-08.jpg',
            ],
            [
                'name' => 'Cover Mobil Dinas Anti Gores',
                'description' => "Dirancang untuk kendaraan operasional dan dinas yang sering dipakai-lepas, dengan bahan anti gores di bagian dalam.\n\nResleting samping mempermudah akses ke pintu pengemudi tanpa perlu membuka cover secara penuh.",
                'price' => 345_000,
                'discount_price' => 315_000,
                'sku' => 'CM-009',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-09.jpg',
            ],
            [
                'name' => 'Cover Mobil Hatchback Sporty',
                'description' => "Cover khusus hatchback dengan aksen list warna sporty, mengikuti gaya kendaraan tanpa mengurangi fungsi proteksi.\n\nBahan quick-dry membuat cover cepat kering setelah terkena hujan, mencegah bau apek saat disimpan.",
                'price' => 315_000,
                'discount_price' => null,
                'sku' => 'CM-010',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-10.jpg',
            ],
            [
                'name' => 'Cover Mobil Hatchback Sporty Fit',
                'description' => "Potongan slim fit untuk hatchback modern dengan bodi lebih ramping, memberikan tampilan rapi saat terpasang.\n\nElastis di bagian bawah roda depan dan belakang agar cover tidak mudah bergeser tertiup angin.",
                'price' => 325_000,
                'discount_price' => 299_000,
                'sku' => 'CM-011',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-11.jpg',
            ],
            [
                'name' => 'Cover Mobil Hatchback Compact Guard',
                'description' => "Perlindungan ekstra untuk hatchback compact dengan double layer di bagian atap yang paling sering terkena sinar matahari.\n\nTersedia dalam warna gelap netral yang mudah dipadukan dengan warna mobil apa saja.",
                'price' => 335_000,
                'discount_price' => null,
                'sku' => 'CM-012',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-12.jpg',
            ],
            [
                'name' => 'Cover Mobil Sedan Jepang Custom Fit',
                'description' => "Pola custom fit dikembangkan khusus mengikuti dimensi sedan-sedan Jepang populer di Indonesia.\n\nMenggunakan bahan non-woven premium yang lembut namun tetap kokoh menahan terpaan angin dan debu jalanan.",
                'price' => 395_000,
                'discount_price' => 349_000,
                'sku' => 'CM-013',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-13.jpg',
            ],
        ];

        $coverBanProducts = [
            [
                'name' => 'Cover Ban Mobil Sporty Alloy Guard',
                'description' => "Melindungi velg alloy dari baret dan kotoran saat mobil diparkir dalam waktu lama.\n\nBahan neoprene elastis membuat cover ini pas di berbagai ukuran ban, mudah dipasang tanpa alat bantu.",
                'price' => 85_000,
                'discount_price' => null,
                'sku' => 'CB-001',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-14.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Premium Elite',
                'description' => "Material waterproof dengan lapisan anti UV menjaga warna ban tetap pekat dan tidak cepat pudar/retak.\n\nCocok untuk mobil yang jarang dipakai dan sering diparkir outdoor dalam jangka waktu lama.",
                'price' => 110_000,
                'discount_price' => 95_000,
                'sku' => 'CB-002',
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'image' => 'product-15.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Racing Performance',
                'description' => "Desain terinspirasi dari ban racing dengan aksen merah yang tegas, cocok untuk mobil bergaya sporty.\n\nJahitan tepi elastis memastikan cover tetap kencang terpasang meski sering dibuka-tutup.",
                'price' => 125_000,
                'discount_price' => null,
                'sku' => 'CB-003',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-16.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Wrap Edition',
                'description' => "Terinspirasi dari mobil-mobil wrapping custom, cover ini punya finishing glossy yang elegan.\n\nBahan tahan air mencegah jamur dan lumut menempel pada permukaan ban saat musim hujan.",
                'price' => 105_000,
                'discount_price' => 89_000,
                'sku' => 'CB-004',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-17.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Classic Alloy',
                'description' => "Pilihan klasik dengan warna netral, cocok dipadukan dengan velg alloy warna apa saja.\n\nRingan dibawa bepergian, mudah dilipat dan disimpan di bagasi tanpa memakan banyak ruang.",
                'price' => 79_000,
                'discount_price' => null,
                'sku' => 'CB-005',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-18.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Anti Air Spike Guard',
                'description' => "Dilengkapi lapisan anti air ekstra yang efektif menahan cipratan saat musim hujan.\n\nDesain spike guard di bagian tepi menambah daya tahan terhadap gesekan aspal saat proses pemasangan.",
                'price' => 99_000,
                'discount_price' => 85_000,
                'sku' => 'CB-006',
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'image' => 'product-19.jpg',
            ],
            [
                'name' => 'Cover Ban Mobil Cadangan Universal',
                'description' => "Didesain khusus untuk ban serep/cadangan yang terpasang di luar bodi mobil (umum pada SUV klasik).\n\nMaterial tebal dan kokoh, mampu menahan paparan sinar matahari dan hujan sepanjang tahun.",
                'price' => 92_000,
                'discount_price' => null,
                'sku' => 'CB-007',
                'stock_status' => 'preorder',
                'is_featured' => false,
                'image' => 'product-20.jpg',
            ],
        ];

        foreach ($coverMobilProducts as $i => $data) {
            $product = Product::create([
                'category_id' => $coverMobil->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'discount_price' => $data['discount_price'],
                'sku' => $data['sku'],
                'stock_status' => $data['stock_status'],
                'is_featured' => $data['is_featured'],
                'is_active' => true,
                'sort_order' => $i,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'path' => 'products/'.$data['image'],
                'sort_order' => 0,
                'is_primary' => true,
            ]);
        }

        foreach ($coverBanProducts as $i => $data) {
            $product = Product::create([
                'category_id' => $coverBan->id,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'price' => $data['price'],
                'discount_price' => $data['discount_price'],
                'sku' => $data['sku'],
                'stock_status' => $data['stock_status'],
                'is_featured' => $data['is_featured'],
                'is_active' => true,
                'sort_order' => $i,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'path' => 'products/'.$data['image'],
                'sort_order' => 0,
                'is_primary' => true,
            ]);
        }
    }
}
