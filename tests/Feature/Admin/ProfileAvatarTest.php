<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can delete their avatar photo', function () {
    Storage::fake('public');
    $path = UploadedFile::fake()->image('avatar.jpg')->store('avatars', 'public');

    $admin = User::factory()->create(['is_admin' => true, 'avatar_path' => $path]);
    Storage::disk('public')->assertExists($path);

    $this->actingAs($admin)->delete(route('admin.profile.avatar.destroy'))->assertRedirect();

    expect($admin->fresh()->avatar_path)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

test('replacing an avatar removes the previous file', function () {
    Storage::fake('public');
    $oldPath = UploadedFile::fake()->image('old.jpg')->store('avatars', 'public');

    $admin = User::factory()->create(['is_admin' => true, 'avatar_path' => $oldPath]);

    $this->actingAs($admin)->patch(route('admin.profile.update'), [
        'name' => $admin->name,
        'email' => $admin->email,
        'avatar' => UploadedFile::fake()->image('new.jpg'),
    ])->assertRedirect();

    Storage::disk('public')->assertMissing($oldPath);
    expect($admin->fresh()->avatar_path)->not->toBeNull();
});
