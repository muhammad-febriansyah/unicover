<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['brand_name', 'logo_path', 'favicon_path', 'wa_number', 'tagline', 'hero_heading', 'hero_subheading', 'hero_image_path', 'address', 'google_maps_embed', 'email', 'instagram', 'facebook', 'tiktok', 'footer_text', 'compare_product_a_id', 'compare_product_b_id'])]
class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Product, $this>
     */
    public function compareProductA(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'compare_product_a_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function compareProductB(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'compare_product_b_id');
    }
}
