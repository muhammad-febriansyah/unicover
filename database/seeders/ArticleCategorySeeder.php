<?php

namespace Database\Seeders;

use App\Models\ArticleCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Tips & Trik Otomotif',
            'Review Produk',
            'Inspirasi Custom',
            'Berita & Event',
        ];

        foreach ($categories as $index => $name) {
            ArticleCategory::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => fake()->optional(0.5)->sentence(),
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
