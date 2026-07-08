<?php

namespace App\Http\Controllers\Admin;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController
{
    public function index(): Response
    {
        $articles = Article::with(['author', 'articleCategory', 'tags'])
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('admin/articles/index', [
            'articles' => $articles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/articles/form', [
            'article' => null,
            'categories' => ArticleCategory::orderBy('sort_order')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'article_category_id' => ['nullable', 'exists:article_categories,id'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'cover_image.image' => 'File harus berupa gambar.',
            'cover_image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
            'cover_image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        unset($validated['cover_image']);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = $request->user()->id;

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        $article = Article::create($validated);

        if ($request->hasFile('cover_image')) {
            $article->update([
                'cover_image_path' => $request->file('cover_image')->store('articles', 'public'),
            ]);
        }

        if ($request->has('tags')) {
            $article->tags()->sync($request->input('tags'));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dibuat.']);

        return redirect()->route('admin.articles.index');
    }

    public function show(Article $article): Response
    {
        $article->load(['author', 'articleCategory', 'tags']);

        return Inertia::render('admin/articles/show', [
            'article' => $article,
        ]);
    }

    public function edit(Article $article): Response
    {
        $article->load('tags');

        return Inertia::render('admin/articles/form', [
            'article' => $article,
            'categories' => ArticleCategory::orderBy('sort_order')->get(),
            'tags' => Tag::orderBy('name')->get(),
            'selectedTags' => $article->tags->pluck('id'),
        ]);
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'article_category_id' => ['nullable', 'exists:article_categories,id'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'cover_image.image' => 'File harus berupa gambar.',
            'cover_image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
            'cover_image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        unset($validated['cover_image']);

        $validated['slug'] = Str::slug($validated['title']);

        if (($validated['is_published'] ?? false) && ! $article->published_at) {
            $validated['published_at'] = now();
        }

        $article->update($validated);

        if ($request->hasFile('cover_image')) {
            $article->update([
                'cover_image_path' => $request->file('cover_image')->store('articles', 'public'),
            ]);
        }

        if ($request->has('tags')) {
            $article->tags()->sync($request->input('tags'));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil diperbarui.']);

        return redirect()->route('admin.articles.index');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Artikel berhasil dihapus.']);

        return redirect()->route('admin.articles.index');
    }
}
