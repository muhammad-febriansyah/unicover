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
            'logo_path' => 'site/CGLdoEGTzbIiFBCnb7BAK87CsQWK0SbFPTETB6Bg.png',
            'favicon_path' => 'site/MorqJQdR6qSAnQnnV5GjqtnjhJADat60iSXweqFI.png',
            'wa_number' => '6281234567890',
            'tagline' => 'Custom Automotive Covers – Presisi & Estetika',
            'hero_heading' => 'Lindungi Kendaraan Anda dengan Style',
            'hero_subheading' => 'Cover mobil & cover ban custom berkualitas premium untuk segala tipe kendaraan',
            'address' => 'Kawasan Monumen Nasional (Monas), Jl. Silang Monas, Gambir, Jakarta Pusat, DKI Jakarta 10110',
            'google_maps_embed' => '<iframe src="https://maps.google.com/maps?q=Monumen%20Nasional%20Monas%20Jakarta&t=&z=16&ie=UTF8&iwloc=&output=embed" width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            'email' => 'halo@unicover.id',
            'instagram' => 'unicover.id',
            'facebook' => 'unicover.id',
            'tiktok' => 'unicover.id',
            'footer_text' => '© '.date('Y').' Unicover. All rights reserved.',
        ]);
    }
}
