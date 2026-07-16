<?php

namespace App\Console\Commands;

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

#[Signature('images:restore {--dry-run : Report what would be restored without writing anything}')]
#[Description('Put the archived original back for every image that images:optimize replaced')]
class RestoreImages extends Command
{
    private const ARCHIVE_DISK = 'local';

    private const ARCHIVE_PREFIX = 'image-originals';

    private int $restored = 0;

    private int $noArchive = 0;

    private int $failed = 0;

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $this->components->info($dryRun
            ? 'Inspecting archived originals. Nothing will be written.'
            : 'Restoring archived originals.');

        foreach ($this->targets() as [$model, $column]) {
            $model::query()
                ->whereNotNull($column)
                ->where($column, '!=', '')
                ->each(fn (Model $record) => $this->process($record, $column, $dryRun));
        }

        $this->newLine();
        $this->components->twoColumnDetail('<fg=green;options=bold>Restored</>', (string) $this->restored);
        $this->components->twoColumnDetail('No archive found', (string) $this->noArchive);

        if ($this->failed > 0) {
            $this->components->twoColumnDetail('<fg=red;options=bold>Failed</>', (string) $this->failed);
        }

        if ($this->restored > 0 && ! $dryRun) {
            $this->newLine();
            $this->components->warn('Originals are back in place. Fix the cause before running images:optimize again.');
        }

        return self::SUCCESS;
    }

    private function process(Model $record, string $column, bool $dryRun): void
    {
        $current = (string) $record->getAttribute($column);
        $archive = $this->archiveFor($current);

        if ($archive === null) {
            $this->noArchive++;

            return;
        }

        $restoredPath = dirname($current).'/'.basename($archive);

        try {
            if ($dryRun) {
                $this->restored++;
                $this->components->twoColumnDetail($current, "would become {$restoredPath}");

                return;
            }

            Storage::disk('public')->put($restoredPath, (string) Storage::disk(self::ARCHIVE_DISK)->get($archive));

            if ($restoredPath !== $current) {
                Storage::disk('public')->delete($current);
                $record->forceFill([$column => $restoredPath])->save();
            }

            $this->restored++;
            $this->components->twoColumnDetail($restoredPath, '<fg=green>restored</>');
        } catch (Throwable $e) {
            $this->failed++;
            $this->components->twoColumnDetail("<fg=red>{$current}</>", "<fg=red>{$e->getMessage()}</>");
        }
    }

    /**
     * The archive mirrors the public path but keeps the original extension,
     * so match on the filename and accept whatever extension it was stored as.
     */
    private function archiveFor(string $currentPath): ?string
    {
        $directory = self::ARCHIVE_PREFIX.'/'.dirname($currentPath);
        $name = pathinfo($currentPath, PATHINFO_FILENAME);

        foreach (Storage::disk(self::ARCHIVE_DISK)->files($directory) as $candidate) {
            if (pathinfo($candidate, PATHINFO_FILENAME) === $name) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * @return list<array{0: class-string<Model>, 1: string}>
     */
    private function targets(): array
    {
        return [
            [SiteSetting::class, 'logo_path'],
            [SiteSetting::class, 'hero_image_path'],
            [Article::class, 'cover_image_path'],
            [Category::class, 'image_path'],
            [ProductImage::class, 'path'],
            [User::class, 'avatar_path'],
        ];
    }
}
