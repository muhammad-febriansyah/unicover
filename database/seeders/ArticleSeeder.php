<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('is_admin', true)->first();
        $category = ArticleCategory::first();
        $tags = Tag::all();

        $articles = [
            [
                'title' => 'Mengapa Cover Mobil Custom Lebih Baik daripada Cover Universal',
                'body' => "Banyak pemilik mobil bertanya: kenapa harus cover custom? Jawabannya sederhana — presisi.\n\nCover mobil custom dibuat sesuai ukuran spesifik kendaraan Anda, sehingga pas di setiap lekukan bodi. Tidak seperti cover universal yang longgar dan berpotensi menimbulkan goresan akibat gesekan angin.\n\nMaterial cover custom juga biasanya lebih premium — anti air, anti UV, dan breathable — sehingga cat mobil Anda tetap terlindungi tanpa risiko kondensasi yang bisa menyebabkan jamur.\n\nDengan cover custom, investasi Anda pada penampilan dan nilai jual kembali kendaraan lebih terjaga.",
            ],
            [
                'title' => '5 Tips Memilih Cover Ban Mobil yang Tepat',
                'body' => "Cover ban bukan sekadar aksesoris — ini investasi untuk melindungi ban dari kerusakan akibat sinar UV, debu, dan kelembapan.\n\nBerikut 5 tips memilih cover ban mobil yang tepat:\n\n1. Pilih material waterproof dengan lapisan UV protection.\n2. Pastikan ukuran sesuai diameter ban (umumnya R14–R18 untuk mobil penumpang).\n3. Cari yang memiliki ventilasi untuk mencegah kondensasi.\n4. Pilih desain yang match dengan tema kendaraan Anda.\n5. Perhatikan kemudahan pemasangan — elastis di tepi lebih praktis.\n\nDengan cover yang tepat, ban Anda awet dan tampilan mobil tetap stylish meski sedang parkir lama.",
            ],
            [
                'title' => 'Tren Custom Otomotif 2026: Personalisasi Jadi Raja',
                'body' => "Industri custom otomotif terus berkembang. Tahun 2026, tren utama bergeser ke personalisasi — bukan lagi sekadar modifikasi performa, tapi bagaimana kendaraan mencerminkan identitas pemiliknya.\n\nDari pemilihan warna cover, stitching pattern, hingga emblem personal, semuanya bisa disesuaikan. Cover mobil dan cover ban bukan lagi produk generic — mereka adalah kanvas ekspresi.\n\nUnicover hadir untuk menjawab tren ini dengan produk custom yang bisa dipersonalisasi dari material hingga detail finishing.",
            ],
        ];

        foreach ($articles as $i => $data) {
            $article = Article::create([
                'author_id' => $admin->id,
                'article_category_id' => $category->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'excerpt' => Str::limit(strip_tags($data['body']), 150),
                'body' => $data['body'],
                'is_published' => true,
                'published_at' => now()->subDays(fake()->numberBetween(1, 60)),
            ]);

            $article->tags()->attach(
                $tags->random(fake()->numberBetween(2, 4))->pluck('id')
            );
        }
    }
}
