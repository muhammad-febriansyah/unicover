<?php

use App\Models\Article;
use App\Models\User;

test('creating an article with a title that slugifies the same as an existing article fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Article::factory()->create(['title' => 'Tips Merawat Cover Mobil', 'slug' => 'tips-merawat-cover-mobil']);

    $response = $this->actingAs($admin)->post(route('admin.articles.store'), [
        'title' => 'Tips Merawat Cover Mobil',
    ]);

    $response->assertSessionHasErrors('title');
    $this->assertDatabaseCount('articles', 1);
});

test('the article index filters results by the search query on title', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Article::factory()->create(['title' => 'Tips Merawat Cover Mobil', 'slug' => 'tips-merawat-cover-mobil']);
    Article::factory()->create(['title' => 'Panduan Cover Motor', 'slug' => 'panduan-cover-motor']);

    $response = $this->actingAs($admin)->get(route('admin.articles.index', ['search' => 'Motor']));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/articles/index')
        ->where('filters.search', 'Motor')
        ->has('articles.data', 1)
        ->where('articles.data.0.title', 'Panduan Cover Motor'));
});

test('updating an article to a title that collides with another article fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Article::factory()->create(['title' => 'Tips Merawat Cover Mobil', 'slug' => 'tips-merawat-cover-mobil']);
    $other = Article::factory()->create(['title' => 'Cara Memilih Cover Mobil', 'slug' => 'cara-memilih-cover-mobil']);

    $response = $this->actingAs($admin)->put(route('admin.articles.update', $other), [
        'title' => 'Tips Merawat Cover Mobil',
    ]);

    $response->assertSessionHasErrors('title');
    $this->assertDatabaseHas('articles', ['id' => $other->id, 'slug' => 'cara-memilih-cover-mobil']);
});
