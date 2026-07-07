<?php

namespace App\Http\Controllers\Admin;

use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings', [
            'settings' => SiteSetting::firstOrFail(),
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
        ]);

        $settings = SiteSetting::firstOrFail();

        if ($request->hasFile('logo')) {
            $request->validate(['logo' => ['image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048']]);
            $validated['logo_path'] = $request->file('logo')->store('site', 'public');
        }

        if ($request->hasFile('hero_image')) {
            $request->validate(['hero_image' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048']]);
            $validated['hero_image_path'] = $request->file('hero_image')->store('site', 'public');
        }

        if ($request->hasFile('favicon')) {
            $request->validate(['favicon' => ['image', 'mimes:png,ico,svg', 'max:512']]);
            $validated['favicon_path'] = $request->file('favicon')->store('site', 'public');
        }

        $settings->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengaturan toko berhasil disimpan.']);

        return redirect()->route('admin.settings.edit');
    }
}
