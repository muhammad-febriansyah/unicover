<?php

namespace App\Actions;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

/**
 * Downscales images to the size they are actually displayed at and re-encodes
 * them as WebP. The untouched source is kept on a private disk so derivatives
 * can be regenerated at a different size or quality later.
 */
class OptimizeImage
{
    /**
     * Extensions GD cannot rasterise. Stored byte for byte instead.
     *
     * @var list<string>
     */
    private const PASSTHROUGH_EXTENSIONS = ['svg', 'ico'];

    private const ARCHIVE_DISK = 'local';

    private const ARCHIVE_PREFIX = 'image-originals';

    /**
     * Store an upload, downscaled and re-encoded, and return its public path.
     */
    public function fromUpload(UploadedFile $file, string $directory, int $maxWidth): string
    {
        $maxWidth = $this->usableWidth($maxWidth);

        $extension = $this->extensionOf($file);

        if (in_array($extension, self::PASSTHROUGH_EXTENSIONS, true)) {
            $stored = $file->store($directory, 'public');

            if ($stored === false) {
                throw new RuntimeException("The image could not be stored in [{$directory}].");
            }

            return $stored;
        }

        $contents = (string) file_get_contents($file->getRealPath());
        $name = Str::random(40);

        Storage::disk(self::ARCHIVE_DISK)->put(
            self::ARCHIVE_PREFIX.'/'.$directory.'/'.$name.'.'.$extension,
            $contents
        );

        $path = $directory.'/'.$name.'.webp';

        Storage::disk('public')->put($path, $this->encode($contents, $maxWidth));

        return $path;
    }

    /**
     * Optimize an image already on the public disk. Returns its new path, or
     * null when the file is missing, unreadable, or already small enough.
     */
    public function fromStoredPath(string $path, int $maxWidth): ?string
    {
        $maxWidth = $this->usableWidth($maxWidth);

        $public = Storage::disk('public');

        if (! $public->exists($path)) {
            return null;
        }

        if (in_array($this->extensionOfPath($path), self::PASSTHROUGH_EXTENSIONS, true)) {
            return null;
        }

        $contents = (string) $public->get($path);

        if ($this->isAlreadyOptimized($path, $contents, $maxWidth)) {
            return null;
        }

        $archive = self::ARCHIVE_PREFIX.'/'.$path;

        if (! Storage::disk(self::ARCHIVE_DISK)->exists($archive)) {
            Storage::disk(self::ARCHIVE_DISK)->put($archive, $contents);
        }

        $encoded = $this->encode($contents, $maxWidth);
        $newPath = preg_replace('/\.[^.]+$/', '', $path).'.webp';

        $public->put($newPath, $encoded);

        if ($newPath !== $path) {
            $public->delete($path);
        }

        return $newPath;
    }

    /**
     * Rasterise, orient, downscale, and encode to WebP.
     *
     * @param  int<1, max>  $maxWidth
     */
    private function encode(string $contents, int $maxWidth): string
    {
        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            throw new RuntimeException('The image could not be read.');
        }

        // GIFs and 8-bit PNGs arrive palette-based, which the WebP encoder rejects.
        if (! imageistruecolor($image)) {
            imagepalettetotruecolor($image);
        }

        $image = $this->applyExifOrientation($image, $contents);
        $image = $this->downscale($image, $maxWidth);

        imagealphablending($image, false);
        imagesavealpha($image, true);

        ob_start();
        imagewebp($image, null, config('images.quality'));
        $encoded = (string) ob_get_clean();

        imagedestroy($image);

        return $encoded;
    }

    /**
     * @param  int<1, max>  $maxWidth
     */
    private function downscale(GdImage $image, int $maxWidth): GdImage
    {
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width <= $maxWidth) {
            return $image;
        }

        $targetWidth = $maxWidth;
        $targetHeight = max(1, (int) round($height * ($maxWidth / $width)));

        $resized = imagecreatetruecolor($targetWidth, $targetHeight);

        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
        imagedestroy($image);

        return $resized;
    }

    /**
     * GD reads raw pixels and ignores the EXIF orientation flag that browsers
     * honour, so a photo shot on a phone would come out rotated. Bake the
     * rotation into the pixels while the flag is still available.
     */
    private function applyExifOrientation(GdImage $image, string $contents): GdImage
    {
        if (! function_exists('exif_read_data') || ! str_starts_with($contents, "\xFF\xD8\xFF")) {
            return $image;
        }

        $exif = @exif_read_data('data://image/jpeg;base64,'.base64_encode($contents));

        return match ($exif['Orientation'] ?? 1) {
            2 => $this->flip($image, IMG_FLIP_HORIZONTAL),
            3 => $this->rotate($image, 180),
            4 => $this->flip($image, IMG_FLIP_VERTICAL),
            5 => $this->flip($this->rotate($image, -90), IMG_FLIP_HORIZONTAL),
            6 => $this->rotate($image, -90),
            7 => $this->flip($this->rotate($image, 90), IMG_FLIP_HORIZONTAL),
            8 => $this->rotate($image, 90),
            default => $image,
        };
    }

    private function rotate(GdImage $image, float $angle): GdImage
    {
        $rotated = imagerotate($image, $angle, 0);

        if ($rotated === false) {
            return $image;
        }

        imagedestroy($image);

        return $rotated;
    }

    private function flip(GdImage $image, int $mode): GdImage
    {
        imageflip($image, $mode);

        return $image;
    }

    private function isAlreadyOptimized(string $path, string $contents, int $maxWidth): bool
    {
        if ($this->extensionOfPath($path) !== 'webp') {
            return false;
        }

        $size = @getimagesizefromstring($contents);

        return $size !== false && $size[0] <= $maxWidth;
    }

    /**
     * A width of zero means config/images.php never loaded, usually a config
     * cache built before it existed. Resizing to it would silently reduce
     * every image to a single pixel, so refuse the work instead.
     *
     * @return int<1, max>
     */
    private function usableWidth(int $maxWidth): int
    {
        if ($maxWidth < 1) {
            throw new InvalidArgumentException(
                "Refusing to resize to [{$maxWidth}px]. Check that config/images.php is present and, "
                .'if the config is cached, run `php artisan config:clear`.'
            );
        }

        return $maxWidth;
    }

    private function extensionOf(UploadedFile $file): string
    {
        return strtolower($file->getClientOriginalExtension() ?: (string) $file->guessExtension());
    }

    private function extensionOfPath(string $path): string
    {
        return strtolower(pathinfo($path, PATHINFO_EXTENSION));
    }
}
