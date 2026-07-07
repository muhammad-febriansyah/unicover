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
            'Cover Mobil Premium All-Weather',
            'Cover Mobil Semi-Outdoor',
            'Cover Mobil Indoor Soft Touch',
            'Cover Mobil SUV Heavy Duty',
            'Cover Mobil Sedan Sporty Fit',
        ];

        $coverBanProducts = [
            'Cover Ban Mobil Waterproof',
            'Cover Ban Mobil UV Shield',
            'Cover Ban Mobil Premium Leather Look',
            'Cover Ban Mobil Racing Style',
        ];

        foreach ($coverMobilProducts as $i => $name) {
            $price = fake()->randomFloat(2, 150_000, 1_500_000);

            $product = Product::create([
                'category_id' => $coverMobil->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => fake()->paragraphs(3, true),
                'price' => $price,
                'discount_price' => fake()->optional(0.3)->randomFloat(2, 100_000, $price - 10_000),
                'sku' => 'CM-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT),
                'stock_status' => fake()->randomElement(['in_stock', 'in_stock', 'in_stock', 'preorder']),
                'is_featured' => $i < 3,
                'is_active' => true,
                'sort_order' => $i,
            ]);

            for ($j = 0; $j < fake()->numberBetween(1, 3); $j++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => 'products/cover-mobil-' . ($i + 1) . '-' . ($j + 1) . '.jpg',
                    'sort_order' => $j,
                    'is_primary' => $j === 0,
                ]);
            }
        }

        foreach ($coverBanProducts as $i => $name) {
            $price = fake()->randomFloat(2, 50_000, 500_000);

            $product = Product::create([
                'category_id' => $coverBan->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => fake()->paragraphs(2, true),
                'price' => $price,
                'discount_price' => null,
                'sku' => 'CB-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT),
                'stock_status' => 'in_stock',
                'is_featured' => $i < 2,
                'is_active' => true,
                'sort_order' => $i,
            ]);

            for ($j = 0; $j < fake()->numberBetween(1, 3); $j++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => 'products/cover-ban-' . ($i + 1) . '-' . ($j + 1) . '.jpg',
                    'sort_order' => $j,
                    'is_primary' => $j === 0,
                ]);
            }
        }
    }
}
