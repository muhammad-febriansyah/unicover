<?php

namespace App\Http\Controllers\Admin;

use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController
{
    public function index(): Response
    {
        return Inertia::render('admin/faqs/index', [
            'faqs' => Faq::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        Faq::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil ditambahkan.']);

        return redirect()->route('admin.faqs.index');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $faq->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil diperbarui.']);

        return redirect()->route('admin.faqs.index');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'FAQ berhasil dihapus.']);

        return redirect()->route('admin.faqs.index');
    }
}
