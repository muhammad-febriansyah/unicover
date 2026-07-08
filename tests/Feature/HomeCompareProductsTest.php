<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\SiteSetting;
use Inertia\Testing\AssertableInertia as Assert;

test('homepage uses the manually selected compare products when both are set', function () {
    $settings = SiteSetting::factory()->create();
    $productA = Product::factory()->create(['is_active' => true]);
    $productB = Product::factory()->create(['is_active' => true]);
    ProductImage::factory()->primary()->create(['product_id' => $productA->id]);
    ProductImage::factory()->primary()->create(['product_id' => $productB->id]);
    $settings->update(['compare_product_a_id' => $productA->id, 'compare_product_b_id' => $productB->id]);

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->has('compareProducts', 2)
        ->where('compareProducts.0.id', $productA->id)
        ->where('compareProducts.1.id', $productB->id)
    );
});

test('homepage falls back to featured products when no compare products are configured', function () {
    SiteSetting::factory()->create();
    $withImage = Product::factory()->create(['is_active' => true, 'is_featured' => true, 'sort_order' => 0]);
    ProductImage::factory()->primary()->create(['product_id' => $withImage->id]);
    $withoutImage = Product::factory()->create(['is_active' => true, 'is_featured' => true, 'sort_order' => 1]);
    $anotherWithImage = Product::factory()->create(['is_active' => true, 'is_featured' => false, 'sort_order' => 2]);
    ProductImage::factory()->primary()->create(['product_id' => $anotherWithImage->id]);

    $this->get('/')->assertInertia(fn (Assert $page) => $page
        ->has('compareProducts', 2)
        ->where('compareProducts.0.id', $withImage->id)
        ->where('compareProducts.1.id', $anotherWithImage->id)
    );
});
