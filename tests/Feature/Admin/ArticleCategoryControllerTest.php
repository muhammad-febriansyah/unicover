<?php

use App\Models\ArticleCategory;
use App\Models\User;

test('creating an article category with a name that slugifies the same as an existing one fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    ArticleCategory::factory()->create(['name' => 'Tips Perawatan', 'slug' => 'tips-perawatan']);

    $response = $this->actingAs($admin)->post(route('admin.article-categories.store'), [
        'name' => 'Tips Perawatan',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseCount('article_categories', 1);
});

test('updating an article category to a name that collides with another fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    ArticleCategory::factory()->create(['name' => 'Tips Perawatan', 'slug' => 'tips-perawatan']);
    $other = ArticleCategory::factory()->create(['name' => 'Berita', 'slug' => 'berita']);

    $response = $this->actingAs($admin)->put(route('admin.article-categories.update', $other), [
        'name' => 'Tips Perawatan',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseHas('article_categories', ['id' => $other->id, 'slug' => 'berita']);
});
