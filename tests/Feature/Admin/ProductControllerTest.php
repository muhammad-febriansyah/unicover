<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('creating a product with a name that slugifies the same as an existing product fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();
    Product::factory()->create(['name' => 'Cover Mobil Sedan', 'slug' => 'cover-mobil-sedan']);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Cover Mobil Sedan',
        'category_id' => $category->id,
        'price' => 100_000,
        'stock_status' => 'in_stock',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseCount('products', 1);
});

test('updating a product to a name that collides with another product fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();
    Product::factory()->create(['name' => 'Cover Mobil Sedan', 'slug' => 'cover-mobil-sedan']);
    $other = Product::factory()->create(['name' => 'Cover Mobil SUV', 'slug' => 'cover-mobil-suv']);

    $response = $this->actingAs($admin)->put(route('admin.products.update', $other), [
        'name' => 'Cover Mobil Sedan',
        'category_id' => $category->id,
        'price' => 100_000,
        'stock_status' => 'in_stock',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseHas('products', ['id' => $other->id, 'slug' => 'cover-mobil-suv']);
});
