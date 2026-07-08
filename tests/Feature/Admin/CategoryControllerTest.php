<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('deleting an unused category succeeds and flashes a success toast', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Kategori berhasil dihapus.']);
    $this->assertModelMissing($category);
});

test('deleting a category still used by a product fails and flashes an error toast', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertInertiaFlash('toast', ['type' => 'error', 'message' => 'Kategori tidak bisa dihapus karena masih dipakai produk.']);
    $this->assertModelExists($category);
});

test('creating a category with a name that slugifies the same as an existing category fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Category::factory()->create(['name' => 'Cover Mobil', 'slug' => 'cover-mobil']);

    $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Cover Mobil',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseCount('categories', 1);
});

test('updating a category to a name that collides with another category fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Category::factory()->create(['name' => 'Cover Mobil', 'slug' => 'cover-mobil']);
    $other = Category::factory()->create(['name' => 'Cover Motor', 'slug' => 'cover-motor']);

    $response = $this->actingAs($admin)->put(route('admin.categories.update', $other), [
        'name' => 'Cover Mobil',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseHas('categories', ['id' => $other->id, 'slug' => 'cover-motor']);
});
