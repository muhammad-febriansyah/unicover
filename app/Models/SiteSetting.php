<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['brand_name', 'logo_path', 'favicon_path', 'wa_number', 'tagline', 'hero_heading', 'hero_subheading', 'hero_image_path', 'address', 'google_maps_embed', 'email', 'instagram', 'facebook', 'tiktok', 'footer_text'])]
class SiteSetting extends Model
{
    /** @use HasFactory<\Database\Factories\SiteSettingFactory> */
    use HasFactory;
}
