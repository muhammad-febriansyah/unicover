<?php

namespace App\Http\Controllers\Admin;

use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleCategoryController
{
    public function index(): Response
    {
        return Inertia::render('admin/article-categories/index', [
            'categories' => ArticleCategory::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        ArticleCategory::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori artikel berhasil ditambahkan.']);

        return redirect()->route('admin.article-categories.index');
    }

    public function update(Request $request, ArticleCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $category->update([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori artikel berhasil diperbarui.']);

        return redirect()->route('admin.article-categories.index');
    }

    public function destroy(ArticleCategory $category): RedirectResponse
    {
        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori artikel berhasil dihapus.']);

        return redirect()->route('admin.article-categories.index');
    }
}
