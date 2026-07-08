<?php

namespace App\Http\Controllers\Admin;

use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
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

        $slug = Str::slug($validated['name']);

        if (ArticleCategory::where('slug', $slug)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama kategori artikel sudah dipakai, gunakan nama lain.',
            ]);
        }

        ArticleCategory::create([
            ...$validated,
            'slug' => $slug,
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

        $slug = Str::slug($validated['name']);

        if (ArticleCategory::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama kategori artikel sudah dipakai, gunakan nama lain.',
            ]);
        }

        $category->update([
            ...$validated,
            'slug' => $slug,
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
