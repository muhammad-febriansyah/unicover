<?php

use App\Models\SiteSetting;

test('homepage renders open graph meta tags for link previews', function () {
    SiteSetting::factory()->create([
        'brand_name' => 'Unicover',
        'tagline' => 'Custom Automotive Covers',
        'logo_path' => 'site/logo.png',
        'favicon_path' => 'site/favicon.png',
    ]);

    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('og:title" content="Unicover"', false);
    $response->assertSee('og:description" content="Custom Automotive Covers"', false);
    $response->assertSee('og:image" content="'.asset('storage/site/logo.png').'"', false);
    $response->assertSee('name="twitter:card" head-key="twitter:card" content="summary_large_image"', false);
    $response->assertSee('rel="icon" href="'.asset('storage/site/favicon.png').'"', false);
});
