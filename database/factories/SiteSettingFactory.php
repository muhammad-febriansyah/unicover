<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_name' => 'Unicover',
            'logo_path' => null,
            'wa_number' => '6281234567890',
            'tagline' => 'Custom Automotive Covers – Presisi & Estetika',
            'hero_heading' => 'Lindungi Kendaraan Anda dengan Style',
            'hero_subheading' => 'Cover mobil & cover ban custom berkualitas premium',
            'hero_image_path' => null,
            'address' => fake()->optional()->address(),
            'email' => fake()->optional()->email(),
            'instagram' => 'unicover.id',
            'facebook' => 'unicover.id',
            'tiktok' => null,
            'footer_text' => '© ' . date('Y') . ' Unicover. All rights reserved.',
        ];
    }
}
