<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = $this->siteSettings();

        return [
            ...parent::share($request),
            'name' => $settings?->brand_name ?? config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => $settings,
            'unreadMessages' => $this->unreadMessages($request),
        ];
    }

    private function unreadMessages(Request $request): int
    {
        if (! $request->user()?->is_admin || ! Schema::hasTable('contact_messages')) {
            return 0;
        }

        return ContactMessage::where('is_read', false)->count();
    }

    private function siteSettings(): ?SiteSetting
    {
        if (! Schema::hasTable('site_settings')) {
            return null;
        }

        return SiteSetting::first();
    }
}
