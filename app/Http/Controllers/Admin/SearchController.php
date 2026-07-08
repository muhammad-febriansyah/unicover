<?php

namespace App\Http\Controllers\Admin;

use App\Models\Article;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->string('q')->trim()->toString();

        if (mb_strlen($query) < 2) {
            return response()->json(['products' => [], 'articles' => []]);
        }

        $products = Product::query()
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'slug']);

        $articles = Article::query()
            ->where('title', 'like', "%{$query}%")
            ->orderBy('title')
            ->limit(5)
            ->get(['id', 'title', 'slug']);

        return response()->json([
            'products' => $products,
            'articles' => $articles,
        ]);
    }
}
