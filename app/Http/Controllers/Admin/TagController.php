<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TagController
{
    public function index(): Response
    {
        return Inertia::render('admin/tags/index', [
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($validated['name']);

        if (Tag::where('slug', $slug)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama tag sudah dipakai, gunakan nama lain.',
            ]);
        }

        Tag::create([
            ...$validated,
            'slug' => $slug,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag berhasil ditambahkan.']);

        return redirect()->route('admin.tags.index');
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $slug = Str::slug($validated['name']);

        if (Tag::where('slug', $slug)->where('id', '!=', $tag->id)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Nama tag sudah dipakai, gunakan nama lain.',
            ]);
        }

        $tag->update([
            ...$validated,
            'slug' => $slug,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag berhasil diperbarui.']);

        return redirect()->route('admin.tags.index');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag berhasil dihapus.']);

        return redirect()->route('admin.tags.index');
    }
}
