<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'settings' => SiteSetting::first(),
            'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(),
            'products' => Product::where('is_active', true)
                ->with(['category', 'images'])
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->take(8)
                ->get(),
            'articles' => Article::where('is_published', true)
                ->with('articleCategory')
                ->orderByDesc('published_at')
                ->take(3)
                ->get(),
        ]);
    }
}
