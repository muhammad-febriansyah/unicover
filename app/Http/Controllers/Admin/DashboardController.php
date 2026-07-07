<?php

namespace App\Http\Controllers\Admin;

use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function index(): Response
    {
        $stats = [
            'productCount' => Product::count(),
            'activeProductCount' => Product::where('is_active', true)->count(),
            'featuredProductCount' => Product::where('is_featured', true)->count(),
            'categoryCount' => Category::count(),
            'activeCategoryCount' => Category::where('is_active', true)->count(),
            'articleCount' => Article::count(),
            'publishedArticleCount' => Article::where('is_published', true)->count(),
            'draftArticleCount' => Article::where('is_published', false)->count(),
            'tagCount' => Tag::count(),
            'totalImageCount' => ProductImage::count(),
            'lowStockCount' => Product::where('stock_status', 'out_of_stock')->count(),
        ];

        $recentProducts = Product::with(['category', 'images'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => $p->price,
                'discount_price' => $p->discount_price,
                'stock_status' => $p->stock_status,
                'is_active' => $p->is_active,
                'category' => $p->category?->name,
                'primary_image' => $p->images->first()?->path,
                'created_at' => $p->created_at->diffForHumans(),
            ]);

        $recentArticles = Article::with('articleCategory')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'is_published' => $a->is_published,
                'category' => $a->articleCategory?->name,
                'created_at' => $a->created_at->diffForHumans(),
            ]);

        $productsByCategory = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(6)
            ->get()
            ->map(fn ($c) => [
                'name' => $c->name,
                'count' => $c->products_count,
                'slug' => $c->slug,
            ]);

        $articlesByCategory = \App\Models\ArticleCategory::withCount('articles')
            ->orderByDesc('articles_count')
            ->limit(6)
            ->get()
            ->map(fn ($c) => [
                'name' => $c->name,
                'count' => $c->articles_count,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentProducts' => $recentProducts,
            'recentArticles' => $recentArticles,
            'productsByCategory' => $productsByCategory,
            'articlesByCategory' => $articlesByCategory,
        ]);
    }
}
