<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $price = fake()->randomFloat(2, 50_000, 5_000_000);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->optional(0.8)->paragraphs(3, true),
            'price' => $price,
            'discount_price' => fake()->optional(0.3)->randomFloat(2, 25_000, $price),
            'sku' => fake()->optional(0.7)->regexify('[A-Z]{3}-[0-9]{4}'),
            'stock_status' => fake()->randomElement(['in_stock', 'out_of_stock', 'preorder']),
            'is_featured' => fake()->boolean(20),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }
}
