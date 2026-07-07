<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ArticleCategorySeeder::class,
            TagSeeder::class,
            ProductSeeder::class,
            ArticleSeeder::class,
            SiteSettingSeeder::class,
        ]);
    }
}
