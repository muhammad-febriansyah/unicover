<?php

use App\Actions\OptimizeImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('local');

    $this->action = new OptimizeImage;
});

/**
 * @return array{0: int, 1: int}
 */
function dimensionsOf(string $disk, string $path): array
{
    $size = getimagesizefromstring(Storage::disk($disk)->get($path));

    return [$size[0], $size[1]];
}

test('an oversized upload is downscaled to the configured width', function () {
    $path = $this->action->fromUpload(
        UploadedFile::fake()->image('cover.jpg', 3000, 2000),
        'articles',
        1400
    );

    expect(dimensionsOf('public', $path))->toBe([1400, 933]);
});

test('downscaling preserves the source aspect ratio', function () {
    $path = $this->action->fromUpload(
        UploadedFile::fake()->image('tall.jpg', 1600, 2400),
        'products',
        800
    );

    [$width, $height] = dimensionsOf('public', $path);

    expect($width)->toBe(800)
        ->and($height)->toBe(1200);
});

test('an image already narrower than the limit keeps its dimensions', function () {
    $path = $this->action->fromUpload(
        UploadedFile::fake()->image('small.jpg', 320, 240),
        'categories',
        800
    );

    expect(dimensionsOf('public', $path))->toBe([320, 240]);
});

test('uploads are stored as webp regardless of source format', function (string $filename) {
    $path = $this->action->fromUpload(
        UploadedFile::fake()->image($filename, 900, 600),
        'products',
        1400
    );

    expect($path)->toEndWith('.webp')
        ->and(Storage::disk('public')->mimeType($path))->toBe('image/webp');
})->with(['photo.jpg', 'photo.png', 'photo.gif']);

test('the untouched original is archived on the private disk', function () {
    $file = UploadedFile::fake()->image('cover.jpg', 3000, 2000);
    $originalBytes = file_get_contents($file->getRealPath());

    $path = $this->action->fromUpload($file, 'articles', 1400);

    $name = pathinfo($path, PATHINFO_FILENAME);
    $archived = "image-originals/articles/{$name}.jpg";

    Storage::disk('local')->assertExists($archived);

    expect(Storage::disk('local')->get($archived))->toBe($originalBytes)
        ->and(dimensionsOf('local', $archived))->toBe([3000, 2000]);
});

test('the optimized file is meaningfully smaller than the original', function () {
    $file = UploadedFile::fake()->image('cover.jpg', 3000, 2000);
    $originalSize = filesize($file->getRealPath());

    $path = $this->action->fromUpload($file, 'articles', 1400);

    expect(Storage::disk('public')->size($path))->toBeLessThan($originalSize);
});

test('an svg is stored untouched because gd cannot rasterise it', function () {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';

    $path = $this->action->fromUpload(
        UploadedFile::fake()->createWithContent('logo.svg', $svg),
        'site',
        600
    );

    expect($path)->toEndWith('.svg')
        ->and(Storage::disk('public')->get($path))->toBe($svg);
});

test('transparency survives the conversion to webp', function () {
    $source = imagecreatetruecolor(400, 400);
    imagealphablending($source, false);
    imagesavealpha($source, true);
    imagefill($source, 0, 0, imagecolorallocatealpha($source, 255, 0, 0, 127));

    $file = tempnam(sys_get_temp_dir(), 'alpha').'.png';
    imagepng($source, $file);
    imagedestroy($source);

    $path = $this->action->fromUpload(
        new UploadedFile($file, 'logo.png', 'image/png', null, true),
        'site',
        600
    );

    $result = imagecreatefromstring(Storage::disk('public')->get($path));
    $alpha = (imagecolorat($result, 0, 0) >> 24) & 0x7F;
    imagedestroy($result);

    expect($alpha)->toBeGreaterThan(100);
});

test('a stored file is converted in place and the old file removed', function () {
    Storage::disk('public')->put('categories/old.jpg', UploadedFile::fake()->image('x.jpg', 2000, 1500)->get());

    $newPath = $this->action->fromStoredPath('categories/old.jpg', 800);

    expect($newPath)->toBe('categories/old.webp')
        ->and(dimensionsOf('public', $newPath))->toBe([800, 600]);

    Storage::disk('public')->assertMissing('categories/old.jpg');
    Storage::disk('local')->assertExists('image-originals/categories/old.jpg');
});

test('a stored file that is already optimized is left alone', function () {
    $path = $this->action->fromUpload(UploadedFile::fake()->image('x.jpg', 500, 400), 'categories', 800);
    $before = Storage::disk('public')->get($path);

    expect($this->action->fromStoredPath($path, 800))->toBeNull()
        ->and(Storage::disk('public')->get($path))->toBe($before);
});

test('an oversized webp is still downscaled', function () {
    $path = $this->action->fromUpload(UploadedFile::fake()->image('x.jpg', 2000, 1000), 'categories', 1400);

    expect($this->action->fromStoredPath($path, 800))->toBe($path)
        ->and(dimensionsOf('public', $path))->toBe([800, 400]);
});

test('a missing file yields null rather than an error', function () {
    expect($this->action->fromStoredPath('categories/gone.jpg', 800))->toBeNull();
});

test('unreadable bytes raise a runtime exception', function () {
    Storage::disk('public')->put('categories/broken.jpg', 'this is not an image');

    $this->action->fromStoredPath('categories/broken.jpg', 800);
})->throws(RuntimeException::class);
