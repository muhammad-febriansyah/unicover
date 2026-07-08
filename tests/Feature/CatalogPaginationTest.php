<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Product;

test('product catalog paginates 13 per page', function () {
    $category = Category::factory()->create();
    Product::factory()->count(15)->create(['category_id' => $category->id, 'is_active' => true]);

    $response = $this->get('/produk');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('products.per_page', 13)
        ->where('products.total', 15)
    );
});

test('article catalog paginates 10 per page', function () {
    Article::factory()->count(12)->create(['is_published' => true]);

    $response = $this->get('/artikel');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('articles.per_page', 10)
        ->where('articles.total', 12)
    );
});
