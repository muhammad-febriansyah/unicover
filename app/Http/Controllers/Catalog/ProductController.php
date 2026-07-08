<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::where('is_active', true)->with(['category', 'images']);

        if ($search = $request->string('search')->trim()->toString()) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($categorySlug = $request->string('category')->trim()->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        $products = $query->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->paginate(13)
            ->withQueryString();

        return Inertia::render('products-index', [
            'settings' => SiteSetting::first(),
            'products' => $products,
            'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category', 'images'])
            ->firstOrFail();

        $relatedProducts = Product::where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('images')
            ->orderByDesc('is_featured')
            ->take(4)
            ->get();

        $primaryImage = $product->images->firstWhere('is_primary', true) ?? $product->images->first();

        return Inertia::render('product-show', [
            'settings' => SiteSetting::first(),
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'ogImage' => $primaryImage ? asset('storage/'.$primaryImage->path) : null,
        ]);
    }
}
