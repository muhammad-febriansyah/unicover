<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'cover mobil', 'cover ban', 'perawatan mobil',
            'custom otomotif', 'aksesoris mobil', 'proteksi kendaraan',
            'material premium', 'anti air', 'anti UV',
            'gaya hidup', 'modifikasi',
        ];

        foreach ($tags as $name) {
            Tag::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}
