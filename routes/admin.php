<?php

use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Settings\ProfileController;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('search', [SearchController::class, 'index'])->name('search');

    Route::resource('products', ProductController::class);
    Route::resource('articles', ArticleController::class);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('article-categories', ArticleCategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('faqs', FaqController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('testimonials', TestimonialController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('messages', MessageController::class)->only(['index', 'update', 'destroy']);

    Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
    Route::patch('settings', [SiteSettingController::class, 'update'])->name('settings.update');

    Route::get('profile', function () {
        return Inertia::render('admin/profile', [
            'mustVerifyEmail' => request()->user() instanceof MustVerifyEmail,
            'status' => request()->session()->get('status'),
            'users' => User::orderByDesc('created_at')->get(['id', 'name', 'email', 'avatar_path', 'is_admin', 'created_at']),
        ]);
    })->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile/avatar', [ProfileController::class, 'deleteAvatar'])->name('profile.avatar.destroy');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
