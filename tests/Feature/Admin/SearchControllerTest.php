<?php

use App\Models\Article;
use App\Models\Product;
use App\Models\User;

test('search returns matching products and articles', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Product::factory()->create(['name' => 'Cover Mobil Sedan Premium']);
    Product::factory()->create(['name' => 'Cover Ban Serep']);
    Article::factory()->create(['title' => 'Tips Merawat Cover Mobil']);

    $response = $this->actingAs($admin)->getJson(route('admin.search', ['q' => 'cover mobil']));

    $response->assertOk();
    $response->assertJsonCount(1, 'products');
    $response->assertJsonCount(1, 'articles');
    $response->assertJsonPath('products.0.name', 'Cover Mobil Sedan Premium');
    $response->assertJsonPath('articles.0.title', 'Tips Merawat Cover Mobil');
});

test('search returns empty results for a short query', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Product::factory()->create(['name' => 'Cover Mobil Sedan Premium']);

    $response = $this->actingAs($admin)->getJson(route('admin.search', ['q' => 'c']));

    $response->assertOk();
    $response->assertJson(['products' => [], 'articles' => []]);
});
