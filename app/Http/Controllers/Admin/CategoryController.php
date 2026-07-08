<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $slug = Str::slug($validated['name']);

        if (Category::where('slug', $slug)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama kategori sudah dipakai, gunakan nama lain.',
            ]);
        }

        Category::create([
            ...$validated,
            'slug' => $slug,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori berhasil ditambahkan.']);

        return redirect()->route('admin.categories.index');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $slug = Str::slug($validated['name']);

        if (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama kategori sudah dipakai, gunakan nama lain.',
            ]);
        }

        $category->update([
            ...$validated,
            'slug' => $slug,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori berhasil diperbarui.']);

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Kategori tidak bisa dihapus karena masih dipakai produk.']);

            return redirect()->route('admin.categories.index');
        }

        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kategori berhasil dihapus.']);

        return redirect()->route('admin.categories.index');
    }
}
