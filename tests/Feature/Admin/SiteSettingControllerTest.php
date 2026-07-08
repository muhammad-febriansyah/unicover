<?php

use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;

test('saving the same product as both compare slots fails validation', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $settings = SiteSetting::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.settings.update'), [
        'brand_name' => $settings->brand_name,
        'wa_number' => $settings->wa_number,
        'compare_product_a_id' => $product->id,
        'compare_product_b_id' => $product->id,
    ]);

    $response->assertSessionHasErrors('compare_product_a_id');
});

test('saving two different products for the compare slots succeeds', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $settings = SiteSetting::factory()->create();
    $productA = Product::factory()->create();
    $productB = Product::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.settings.update'), [
        'brand_name' => $settings->brand_name,
        'wa_number' => $settings->wa_number,
        'compare_product_a_id' => $productA->id,
        'compare_product_b_id' => $productB->id,
    ]);

    $response->assertRedirect(route('admin.settings.edit'));
    $this->assertDatabaseHas('site_settings', [
        'id' => $settings->id,
        'compare_product_a_id' => $productA->id,
        'compare_product_b_id' => $productB->id,
    ]);
});
