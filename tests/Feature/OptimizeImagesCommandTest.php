<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('local');
});

/**
 * Put an unoptimized image on the public disk the way the old upload code did.
 */
function legacyUpload(string $directory, string $filename, int $width, int $height): string
{
    return UploadedFile::fake()->image($filename, $width, $height)->store($directory, 'public');
}

test('a legacy category image is converted and the column repointed', function () {
    $category = Category::factory()->create([
        'image_path' => legacyUpload('categories', 'old.jpg', 2400, 1800),
    ]);
    $oldPath = $category->image_path;

    $this->artisan('images:optimize')->assertSuccessful();

    $category->refresh();

    expect($category->image_path)->toEndWith('.webp')
        ->and($category->image_path)->not->toBe($oldPath);

    Storage::disk('public')->assertExists($category->image_path);
    Storage::disk('public')->assertMissing($oldPath);
});

test('the converted image is downscaled to its configured width', function () {
    $category = Category::factory()->create([
        'image_path' => legacyUpload('categories', 'old.jpg', 2400, 1800),
    ]);

    $this->artisan('images:optimize')->assertSuccessful();

    $size = getimagesizefromstring(Storage::disk('public')->get($category->refresh()->image_path));

    expect([$size[0], $size[1]])->toBe([800, 600]);
});

test('the original is archived on the private disk before being replaced', function () {
    $category = Category::factory()->create([
        'image_path' => legacyUpload('categories', 'old.jpg', 2400, 1800),
    ]);
    $original = Storage::disk('public')->get($category->image_path);

    $this->artisan('images:optimize')->assertSuccessful();

    $archived = 'image-originals/'.$category->image_path;

    Storage::disk('local')->assertExists($archived);
    expect(Storage::disk('local')->get($archived))->toBe($original);
});

test('it converts every image-bearing model', function () {
    $settings = SiteSetting::factory()->create([
        'logo_path' => legacyUpload('site', 'logo.png', 1800, 600),
        'hero_image_path' => legacyUpload('site', 'hero.jpg', 3000, 2000),
    ]);
    $article = Article::factory()->create(['cover_image_path' => legacyUpload('articles', 'cover.jpg', 2800, 1575)]);
    $image = ProductImage::factory()->for(Product::factory())->create(['path' => legacyUpload('products', 'p.jpg', 3000, 2000)]);

    $this->artisan('images:optimize')->assertSuccessful();

    expect($settings->refresh()->logo_path)->toEndWith('.webp')
        ->and($settings->hero_image_path)->toEndWith('.webp')
        ->and($article->refresh()->cover_image_path)->toEndWith('.webp')
        ->and($image->refresh()->path)->toEndWith('.webp');
});

test('a second run is a no-op because everything is already optimized', function () {
    $category = Category::factory()->create([
        'image_path' => legacyUpload('categories', 'old.jpg', 2400, 1800),
    ]);

    $this->artisan('images:optimize')->assertSuccessful();

    $pathAfterFirst = $category->refresh()->image_path;
    $bytesAfterFirst = Storage::disk('public')->get($pathAfterFirst);

    $this->artisan('images:optimize')->expectsOutputToContain('Already optimized')->assertSuccessful();

    expect($category->refresh()->image_path)->toBe($pathAfterFirst)
        ->and(Storage::disk('public')->get($pathAfterFirst))->toBe($bytesAfterFirst);
});

test('a dry run reports without touching disk or database', function () {
    $category = Category::factory()->create([
        'image_path' => legacyUpload('categories', 'old.jpg', 2400, 1800),
    ]);
    $path = $category->image_path;
    $before = Storage::disk('public')->get($path);

    $this->artisan('images:optimize', ['--dry-run' => true])
        ->expectsOutputToContain('Nothing will be written.')
        ->assertSuccessful();

    expect($category->refresh()->image_path)->toBe($path)
        ->and(Storage::disk('public')->get($path))->toBe($before);

    Storage::disk('local')->assertDirectoryEmpty('/');
});

test('a corrupt file is reported and does not stop the run', function () {
    Storage::disk('public')->put('categories/broken.jpg', 'this is not an image');

    $broken = Category::factory()->create(['image_path' => 'categories/broken.jpg']);
    $healthy = Category::factory()->create(['image_path' => legacyUpload('categories', 'ok.jpg', 2400, 1800)]);

    $this->artisan('images:optimize')->assertSuccessful();

    expect($broken->refresh()->image_path)->toBe('categories/broken.jpg')
        ->and($healthy->refresh()->image_path)->toEndWith('.webp');
});

test('a row pointing at a missing file is left alone', function () {
    $category = Category::factory()->create(['image_path' => 'categories/gone.jpg']);

    $this->artisan('images:optimize')->assertSuccessful();

    expect($category->refresh()->image_path)->toBe('categories/gone.jpg');
});
