<?php

use App\Models\Category;
use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('local');
});

/**
 * Reproduce the state a run with a zero width left behind: the archive holds
 * the real original, while the public disk holds a one pixel WebP.
 */
function ruinedImage(string $directory, string $name, int $width, int $height): string
{
    $original = UploadedFile::fake()->image('src.jpg', $width, $height)->get();
    Storage::disk('local')->put("image-originals/{$directory}/{$name}.jpg", $original);

    $pixel = imagecreatetruecolor(1, 1);
    ob_start();
    imagewebp($pixel, null, 82);
    Storage::disk('public')->put("{$directory}/{$name}.webp", (string) ob_get_clean());
    imagedestroy($pixel);

    return "{$directory}/{$name}.webp";
}

test('a ruined image is replaced by its archived original', function () {
    $category = Category::factory()->create([
        'image_path' => ruinedImage('categories', 'abc', 2400, 1800),
    ]);

    $this->artisan('images:restore')->assertSuccessful();

    $category->refresh();

    expect($category->image_path)->toBe('categories/abc.jpg');

    $size = getimagesizefromstring(Storage::disk('public')->get($category->image_path));
    expect([$size[0], $size[1]])->toBe([2400, 1800]);
});

test('the one pixel file is removed once the original is back', function () {
    $category = Category::factory()->create([
        'image_path' => ruinedImage('categories', 'abc', 2400, 1800),
    ]);

    $this->artisan('images:restore')->assertSuccessful();

    Storage::disk('public')->assertMissing('categories/abc.webp');
});

test('the restored bytes match the archived original exactly', function () {
    $category = Category::factory()->create([
        'image_path' => ruinedImage('categories', 'abc', 2400, 1800),
    ]);
    $archived = Storage::disk('local')->get('image-originals/categories/abc.jpg');

    $this->artisan('images:restore')->assertSuccessful();

    expect(Storage::disk('public')->get($category->refresh()->image_path))->toBe($archived);
});

test('it restores every image-bearing model', function () {
    $settings = SiteSetting::factory()->create([
        'logo_path' => ruinedImage('site', 'logo', 1800, 600),
        'hero_image_path' => ruinedImage('site', 'hero', 3000, 2000),
    ]);

    $this->artisan('images:restore')->assertSuccessful();

    $settings->refresh();

    expect($settings->logo_path)->toBe('site/logo.jpg')
        ->and($settings->hero_image_path)->toBe('site/hero.jpg');
});

test('an image with no archive is left untouched', function () {
    Storage::disk('public')->put('categories/orphan.webp', UploadedFile::fake()->image('x.jpg', 400, 300)->get());
    $category = Category::factory()->create(['image_path' => 'categories/orphan.webp']);
    $before = Storage::disk('public')->get('categories/orphan.webp');

    $this->artisan('images:restore')->assertSuccessful();

    expect($category->refresh()->image_path)->toBe('categories/orphan.webp')
        ->and(Storage::disk('public')->get('categories/orphan.webp'))->toBe($before);
});

test('a dry run reports without writing anything', function () {
    $category = Category::factory()->create([
        'image_path' => ruinedImage('categories', 'abc', 2400, 1800),
    ]);

    $this->artisan('images:restore', ['--dry-run' => true])
        ->expectsOutputToContain('Nothing will be written.')
        ->assertSuccessful();

    expect($category->refresh()->image_path)->toBe('categories/abc.webp');
    Storage::disk('public')->assertExists('categories/abc.webp');
    Storage::disk('public')->assertMissing('categories/abc.jpg');
});

test('restore then optimize returns the library to a correct optimized state', function () {
    $category = Category::factory()->create([
        'image_path' => ruinedImage('categories', 'abc', 2400, 1800),
    ]);

    $this->artisan('images:restore')->assertSuccessful();
    $this->artisan('images:optimize')->assertSuccessful();

    $category->refresh();

    expect($category->image_path)->toBe('categories/abc.webp');

    $size = getimagesizefromstring(Storage::disk('public')->get($category->image_path));
    expect([$size[0], $size[1]])->toBe([800, 600]);
});
