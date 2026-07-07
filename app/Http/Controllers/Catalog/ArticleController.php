<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Article::where('is_published', true)->with('articleCategory');

        if ($categorySlug = $request->string('category')->trim()->toString()) {
            $query->whereHas('articleCategory', fn ($q) => $q->where('slug', $categorySlug));
        }

        $articles = $query->orderByDesc('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('articles-index', [
            'settings' => SiteSetting::first(),
            'articles' => $articles,
            'categories' => ArticleCategory::where('is_active', true)->orderBy('sort_order')->get(),
            'filters' => $request->only(['category']),
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::where('slug', $slug)
            ->where('is_published', true)
            ->with(['author', 'articleCategory', 'tags'])
            ->firstOrFail();

        return Inertia::render('article-show', [
            'settings' => SiteSetting::first(),
            'article' => $article,
        ]);
    }
}
