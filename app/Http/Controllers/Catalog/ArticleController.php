<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
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
