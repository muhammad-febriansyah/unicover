<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

        Tag::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag berhasil ditambahkan.']);

        return redirect()->route('admin.tags.index');
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $tag->update([
            ...$validated,
            'slug' => Str::slug($validated['name']),
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
