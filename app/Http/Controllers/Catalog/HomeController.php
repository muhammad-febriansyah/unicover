<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::first();

        $products = Product::where('is_active', true)
            ->with(['category', 'images'])
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->take(8)
            ->get();

        return Inertia::render('welcome', [
            'settings' => $settings,
            'categories' => Category::where('is_active', true)
                ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
                ->with(['products' => fn ($q) => $q->where('is_active', true)
                    ->with('images')
                    ->orderByDesc('is_featured')
                    ->orderBy('sort_order')
                    ->limit(1),
                ])
                ->orderBy('sort_order')
                ->get(),
            'products' => $products,
            'compareProducts' => $this->resolveCompareProducts($settings, $products),
            'articles' => Article::where('is_published', true)
                ->with('articleCategory')
                ->orderByDesc('published_at')
                ->take(3)
                ->get(),
            'testimonials' => Testimonial::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Collection<int, Product>  $fallbackProducts
     * @return Collection<int, Product>
     */
    private function resolveCompareProducts(?SiteSetting $settings, $fallbackProducts)
    {
        if ($settings?->compare_product_a_id && $settings->compare_product_b_id) {
            $manual = Product::whereIn('id', [$settings->compare_product_a_id, $settings->compare_product_b_id])
                ->where('is_active', true)
                ->with('images')
                ->get()
                ->sortBy(fn (Product $product) => $product->id === $settings->compare_product_a_id ? 0 : 1)
                ->values();

            if ($manual->count() === 2) {
                return $manual;
            }
        }

        return $fallbackProducts->filter(fn (Product $product) => $product->images->isNotEmpty())->take(2)->values();
    }
}
