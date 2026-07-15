<?php

namespace App\Console\Commands;

use App\Actions\OptimizeImage;
use App\Models\Article;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Throwable;

#[Signature('images:optimize {--dry-run : Report what would change without writing anything}')]
#[Description('Downscale and re-encode uploads stored before image optimization was in place')]
class OptimizeImages extends Command
{
    private int $bytesBefore = 0;

    private int $bytesAfter = 0;

    private int $converted = 0;

    private int $skipped = 0;

    private int $failed = 0;

    public function handle(OptimizeImage $images): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $this->components->info($dryRun
            ? 'Inspecting stored images. Nothing will be written.'
            : 'Optimizing stored images.');

        foreach ($this->targets() as [$model, $column, $widthKey]) {
            $maxWidth = (int) config("images.max_widths.{$widthKey}");

            $model::query()
                ->whereNotNull($column)
                ->where($column, '!=', '')
                ->each(fn (Model $record) => $this->process($images, $record, $column, $maxWidth, $dryRun));
        }

        $this->newLine();
        $this->components->twoColumnDetail('<fg=green;options=bold>Converted</>', (string) $this->converted);
        $this->components->twoColumnDetail('Already optimized', (string) $this->skipped);

        if ($this->failed > 0) {
            $this->components->twoColumnDetail('<fg=red;options=bold>Failed</>', (string) $this->failed);
        }

        if ($this->bytesBefore > 0 && ! $dryRun) {
            $this->components->twoColumnDetail(
                'Shrank',
                sprintf('%s → %s (%d%% smaller)',
                    $this->format($this->bytesBefore),
                    $this->format($this->bytesAfter),
                    (int) round(100 - ($this->bytesAfter / $this->bytesBefore * 100)),
                )
            );
        }

        return self::SUCCESS;
    }

    private function process(OptimizeImage $images, Model $record, string $column, int $maxWidth, bool $dryRun): void
    {
        $path = (string) $record->getAttribute($column);
        $public = Storage::disk('public');

        if (! $public->exists($path)) {
            return;
        }

        $sizeBefore = (int) $public->size($path);

        try {
            if ($dryRun) {
                $this->reportPlanned($path, $sizeBefore, $maxWidth);

                return;
            }

            $newPath = $images->fromStoredPath($path, $maxWidth);

            if ($newPath === null) {
                $this->skipped++;

                return;
            }

            $record->forceFill([$column => $newPath])->save();

            $sizeAfter = (int) $public->size($newPath);

            $this->bytesBefore += $sizeBefore;
            $this->bytesAfter += $sizeAfter;
            $this->converted++;

            $this->components->twoColumnDetail(
                $newPath,
                sprintf('%s → %s', $this->format($sizeBefore), $this->format($sizeAfter))
            );
        } catch (Throwable $e) {
            $this->failed++;
            $this->components->twoColumnDetail("<fg=red>{$path}</>", "<fg=red>{$e->getMessage()}</>");
        }
    }

    private function reportPlanned(string $path, int $sizeBefore, int $maxWidth): void
    {
        $dimensions = @getimagesizefromstring((string) Storage::disk('public')->get($path));
        $width = $dimensions === false ? 0 : $dimensions[0];

        if (strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'webp' && $width <= $maxWidth) {
            $this->skipped++;

            return;
        }

        $this->converted++;

        $this->components->twoColumnDetail(
            $path,
            $width > $maxWidth
                ? sprintf('%s, %dpx wide → %dpx webp', $this->format($sizeBefore), $width, $maxWidth)
                : sprintf('%s, %dpx wide → webp', $this->format($sizeBefore), $width)
        );
    }

    /**
     * Model, path column, and the config key holding that image's width limit.
     * The favicon is left out on purpose: it is tiny, and browsers are
     * particular about the formats they accept for a rel="icon" link.
     *
     * @return list<array{0: class-string<Model>, 1: string, 2: string}>
     */
    private function targets(): array
    {
        return [
            [SiteSetting::class, 'logo_path', 'logo'],
            [SiteSetting::class, 'hero_image_path', 'hero'],
            [Article::class, 'cover_image_path', 'article'],
            [Category::class, 'image_path', 'category'],
            [ProductImage::class, 'path', 'product'],
            [User::class, 'avatar_path', 'avatar'],
        ];
    }

    private function format(int $bytes): string
    {
        return $bytes >= 1048576
            ? sprintf('%.1f MB', $bytes / 1048576)
            : sprintf('%d KB', (int) round($bytes / 1024));
    }
}
