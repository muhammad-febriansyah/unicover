<?php

namespace App\Http\Controllers\Admin;

use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => Testimonial::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'message' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        Testimonial::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil ditambahkan.']);

        return redirect()->route('admin.testimonials.index');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'message' => ['required', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $testimonial->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil diperbarui.']);

        return redirect()->route('admin.testimonials.index');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Testimoni berhasil dihapus.']);

        return redirect()->route('admin.testimonials.index');
    }
}
