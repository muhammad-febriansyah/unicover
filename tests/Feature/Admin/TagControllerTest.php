<?php

use App\Models\Tag;
use App\Models\User;

test('creating a tag with a name that slugifies the same as an existing tag fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Tag::factory()->create(['name' => 'Sedan', 'slug' => 'sedan']);

    $response = $this->actingAs($admin)->post(route('admin.tags.store'), [
        'name' => 'Sedan',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseCount('tags', 1);
});

test('updating a tag to a name that collides with another tag fails validation instead of a server error', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Tag::factory()->create(['name' => 'Sedan', 'slug' => 'sedan']);
    $other = Tag::factory()->create(['name' => 'SUV', 'slug' => 'suv']);

    $response = $this->actingAs($admin)->put(route('admin.tags.update', $other), [
        'name' => 'Sedan',
    ]);

    $response->assertSessionHasErrors('name');
    $this->assertDatabaseHas('tags', ['id' => $other->id, 'slug' => 'suv']);
});
