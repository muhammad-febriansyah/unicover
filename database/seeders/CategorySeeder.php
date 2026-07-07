<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Cover Mobil', 'description' => 'Cover mobil custom untuk berbagai tipe kendaraan. Melindungi dari debu, goresan, dan cuaca.'],
            ['name' => 'Cover Ban Mobil', 'description' => 'Cover ban mobil custom dengan material berkualitas. Anti air, anti UV, dan tahan lama.'],
        ];

        foreach ($categories as $index => $cat) {
            Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'description' => $cat['description'],
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
