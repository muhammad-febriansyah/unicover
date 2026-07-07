<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence();

        return [
            'author_id' => User::factory(),
            'article_category_id' => ArticleCategory::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->optional(0.8)->sentences(2, true),
            'body' => fake()->paragraphs(4, true),
            'cover_image_path' => fake()->optional(0.6)->regexify('articles/[a-f0-9]{8}\.jpg'),
            'is_published' => fake()->boolean(80),
            'published_at' => fn (array $attributes) => $attributes['is_published'] ? fake()->dateTimeBetween('-3 months', 'now') : null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
