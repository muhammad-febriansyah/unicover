<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController
{
    public function index(Request $request): Response
    {
        $query = Product::query()->with(['category', 'images']);

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($categoryId = $request->input('category')) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->orderBy('sort_order')->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => Category::orderBy('sort_order')->get(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'categories' => Category::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'sku' => ['nullable', 'string', 'max:100'],
            'stock_status' => ['required', 'in:in_stock,out_of_stock,preorder'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product = Product::create($validated);

        $this->handleImages($request, $product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil ditambahkan.']);

        return redirect()->route('admin.products.index');
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('admin/products/form', [
            'product' => $product,
            'categories' => Category::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'sku' => ['nullable', 'string', 'max:100'],
            'stock_status' => ['required', 'in:in_stock,out_of_stock,preorder'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product->update($validated);

        $this->handleImages($request, $product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil diperbarui.']);

        return redirect()->route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil dihapus.']);

        return redirect()->route('admin.products.index');
    }

    private function handleImages(Request $request, Product $product): void
    {
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                if ($file instanceof UploadedFile) {
                    $path = $file->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'sort_order' => $index,
                        'is_primary' => $index === 0 && ! $product->images()->where('is_primary', true)->exists(),
                    ]);
                }
            }
        }

        if ($request->has('delete_images')) {
            foreach ((array) $request->input('delete_images') as $imageId) {
                $image = ProductImage::find($imageId);

                if ($image && $image->product_id === $product->id) {
                    $image->delete();
                }
            }
        }
    }
}
