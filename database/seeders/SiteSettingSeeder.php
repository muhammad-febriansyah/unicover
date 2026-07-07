<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::create([
            'brand_name' => 'Unicover',
            'wa_number' => '6281234567890',
            'tagline' => 'Custom Automotive Covers – Presisi & Estetika',
            'hero_heading' => 'Lindungi Kendaraan Anda dengan Style',
            'hero_subheading' => 'Cover mobil & cover ban custom berkualitas premium untuk segala tipe kendaraan',
            'instagram' => 'unicover.id',
            'facebook' => 'unicover.id',
            'footer_text' => '© ' . date('Y') . ' Unicover. All rights reserved.',
        ]);
    }
}
