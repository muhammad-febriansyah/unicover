<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('product image upload rejects oversized file with indonesian message', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post('/admin/products', [
        'name' => 'Cover Mobil Test',
        'category_id' => $category->id,
        'price' => 100000,
        'stock_status' => 'in_stock',
        'images' => [UploadedFile::fake()->image('big.jpg')->size(3000)],
    ]);

    $response->assertSessionHasErrors(['images.0']);
    expect(session('errors')->first('images.0'))->toBe('Ukuran setiap gambar maksimal 2MB.');
    expect(Product::count())->toBe(0);
});

test('article cover image upload rejects non image file with indonesian message', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->post('/admin/articles', [
        'title' => 'Artikel Test',
        'cover_image' => UploadedFile::fake()->create('doc.pdf', 100),
    ]);

    $response->assertSessionHasErrors(['cover_image']);
    expect(session('errors')->first('cover_image'))->toBe('File harus berupa gambar.');
});

test('site setting favicon upload rejects oversized file with indonesian message', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    SiteSetting::factory()->create();

    $response = $this->actingAs($admin)->patch('/admin/settings', [
        'brand_name' => 'Unicover',
        'wa_number' => '6281234567890',
        'favicon' => UploadedFile::fake()->image('favicon.png')->size(600),
    ]);

    $response->assertSessionHasErrors(['favicon']);
    expect(session('errors')->first('favicon'))->toBe('Ukuran favicon maksimal 512KB.');
});
