@php
$siteSettings = null;
try {
    $siteSettings = \App\Models\SiteSetting::first();
} catch (\Throwable $e) {
    // table may not exist yet
}
$brandName = $siteSettings?->brand_name ?? config('app.name', 'Laravel');
$favicon = $siteSettings?->favicon_path;
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
        @else
            <link rel="icon" href="/favicon.ico" sizes="any">
        @endif

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
