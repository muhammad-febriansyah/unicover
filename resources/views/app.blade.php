@php
$siteSettings = null;
try {
    $siteSettings = \App\Models\SiteSetting::first();
} catch (\Throwable $e) {
    // table may not exist yet
}
$brandName = $siteSettings?->brand_name ?? config('app.name', 'Laravel');
$favicon = $siteSettings?->favicon_path;
$logo = $siteSettings?->logo_path;
$tagline = $siteSettings?->tagline ?? 'Custom Automotive Covers';
$ogImage = $logo ? asset('storage/' . $logo) : ($favicon ? asset('storage/' . $favicon) : null);
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
            html { background-color: oklch(1 0 0); }
        </style>

        @if ($favicon)
            <link rel="icon" href="{{ asset('storage/' . $favicon) }}" sizes="any">
            <link rel="apple-touch-icon" href="{{ asset('storage/' . $favicon) }}">
        @endif

        <meta name="description" head-key="description" content="{{ $tagline }}">
        <meta property="og:site_name" head-key="og:site_name" content="{{ $brandName }}">
        <meta property="og:type" head-key="og:type" content="website">
        <meta property="og:title" head-key="og:title" content="{{ $brandName }}">
        <meta property="og:description" head-key="og:description" content="{{ $tagline }}">
        <meta property="og:url" head-key="og:url" content="{{ url()->current() }}">
        @if ($ogImage)
            <meta property="og:image" head-key="og:image" content="{{ $ogImage }}">
        @endif
        <meta name="twitter:card" head-key="twitter:card" content="summary_large_image">
        <meta name="twitter:title" head-key="twitter:title" content="{{ $brandName }}">
        <meta name="twitter:description" head-key="twitter:description" content="{{ $tagline }}">
        @if ($ogImage)
            <meta name="twitter:image" head-key="twitter:image" content="{{ $ogImage }}">
        @endif

        @php
            $fontsUrl = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
        @endphp
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="{{ $fontsUrl }}" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="{{ $fontsUrl }}"></noscript>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $brandName }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
