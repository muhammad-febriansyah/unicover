<?php

namespace App\Http\Controllers\Admin;

use App\Actions\OptimizeImage;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController
{
    public function __construct(private OptimizeImage $images) {}

    public function edit(): Response
    {
        return Inertia::render('admin/settings', [
            'settings' => SiteSetting::firstOrFail(),
            'products' => Product::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brand_name' => ['required', 'string', 'max:255'],
            'wa_number' => ['required', 'string', 'max:20'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_subheading' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'google_maps_embed' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:100'],
            'facebook' => ['nullable', 'string', 'max:100'],
            'tiktok' => ['nullable', 'string', 'max:100'],
            'footer_text' => ['nullable', 'string', 'max:500'],
            'compare_product_a_id' => ['nullable', 'exists:products,id', 'different:compare_product_b_id'],
            'compare_product_b_id' => ['nullable', 'exists:products,id'],
        ], [
            'compare_product_a_id.different' => 'Pilih dua produk yang berbeda untuk dibandingkan.',
        ]);

        $settings = SiteSetting::firstOrFail();

        if ($request->hasFile('logo')) {
            $request->validate(['logo' => ['image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048']], [
                'logo.image' => 'File harus berupa gambar.',
                'logo.mimes' => 'Format logo harus JPG, JPEG, PNG, SVG, atau WEBP.',
                'logo.max' => 'Ukuran logo maksimal 2MB.',
            ]);
            $validated['logo_path'] = $this->images->fromUpload(
                $request->file('logo'), 'site', config('images.max_widths.logo')
            );
        }

        if ($request->hasFile('hero_image')) {
            $request->validate(['hero_image' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048']], [
                'hero_image.image' => 'File harus berupa gambar.',
                'hero_image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
                'hero_image.max' => 'Ukuran gambar maksimal 2MB.',
            ]);
            $validated['hero_image_path'] = $this->images->fromUpload(
                $request->file('hero_image'), 'site', config('images.max_widths.hero')
            );
        }

        // The favicon is stored as uploaded: it is already tiny, and browsers are
        // particular about the formats they accept for a rel="icon" link.
        if ($request->hasFile('favicon')) {
            $request->validate(['favicon' => ['image', 'mimes:png,ico,svg', 'max:512']], [
                'favicon.image' => 'File harus berupa gambar.',
                'favicon.mimes' => 'Format favicon harus PNG, ICO, atau SVG.',
                'favicon.max' => 'Ukuran favicon maksimal 512KB.',
            ]);
            $validated['favicon_path'] = $request->file('favicon')->store('site', 'public');
        }

        $settings->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengaturan toko berhasil disimpan.']);

        return redirect()->route('admin.settings.edit');
    }
}
