<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('local');

    $this->admin = User::factory()->create(['is_admin' => true]);
});

/**
 * @return array{0: int, 1: int}
 */
function storedDimensions(string $path): array
{
    $size = getimagesizefromstring(Storage::disk('public')->get($path));

    return [$size[0], $size[1]];
}

test('a category image is downscaled and stored as webp', function () {
    $this->actingAs($this->admin)->post(route('admin.categories.store'), [
        'name' => 'Cover Sedan',
        'image' => UploadedFile::fake()->image('big.jpg', 2400, 1800),
    ])->assertRedirect();

    $path = Category::first()->image_path;

    expect($path)->toEndWith('.webp')
        ->and(storedDimensions($path))->toBe([800, 600]);
});

test('a product image is downscaled and stored as webp', function () {
    $category = Category::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.products.store'), [
        'name' => 'Cover Mobil Sedan',
        'category_id' => $category->id,
        'price' => 100_000,
        'stock_status' => 'in_stock',
        'images' => [UploadedFile::fake()->image('shot.jpg', 3000, 2000)],
    ])->assertRedirect();

    $path = Product::first()->images()->first()->path;

    expect($path)->toEndWith('.webp')
        ->and(storedDimensions($path))->toBe([1400, 933]);
});

test('an article cover is downscaled and stored as webp', function () {
    $this->actingAs($this->admin)->post(route('admin.articles.store'), [
        'title' => 'Tips Merawat Cover Mobil',
        'cover_image' => UploadedFile::fake()->image('cover.jpg', 2800, 1575),
    ])->assertRedirect();

    $path = Article::first()->cover_image_path;

    expect($path)->toEndWith('.webp')
        ->and(storedDimensions($path))->toBe([1400, 788]);
});

test('the logo and hero image are downscaled to their own limits', function () {
    $settings = SiteSetting::factory()->create();

    $this->actingAs($this->admin)->patch(route('admin.settings.update'), [
        'brand_name' => $settings->brand_name,
        'wa_number' => $settings->wa_number,
        'logo' => UploadedFile::fake()->image('logo.png', 1800, 600),
        'hero_image' => UploadedFile::fake()->image('hero.jpg', 3000, 2250),
    ])->assertRedirect();

    $settings->refresh();

    expect(storedDimensions($settings->logo_path))->toBe([600, 200])
        ->and(storedDimensions($settings->hero_image_path))->toBe([1400, 1050]);
});

test('the favicon is stored as uploaded because browsers are picky about icon formats', function () {
    $settings = SiteSetting::factory()->create();

    $this->actingAs($this->admin)->patch(route('admin.settings.update'), [
        'brand_name' => $settings->brand_name,
        'wa_number' => $settings->wa_number,
        'favicon' => UploadedFile::fake()->image('icon.png', 64, 64),
    ])->assertRedirect();

    expect($settings->refresh()->favicon_path)->toEndWith('.png');
});

test('an avatar is downscaled and stored as webp', function () {
    $this->actingAs($this->admin)->patch(route('admin.profile.update'), [
        'name' => $this->admin->name,
        'email' => $this->admin->email,
        'avatar' => UploadedFile::fake()->image('me.jpg', 1200, 1200),
    ])->assertRedirect();

    $path = $this->admin->fresh()->avatar_path;

    expect($path)->toEndWith('.webp')
        ->and(storedDimensions($path))->toBe([400, 400]);
});

test('every upload leaves its untouched original on the private disk', function () {
    $this->actingAs($this->admin)->post(route('admin.categories.store'), [
        'name' => 'Cover Sedan',
        'image' => UploadedFile::fake()->image('big.jpg', 2400, 1800),
    ])->assertRedirect();

    $name = pathinfo(Category::first()->image_path, PATHINFO_FILENAME);

    Storage::disk('local')->assertExists("image-originals/categories/{$name}.jpg");
});
