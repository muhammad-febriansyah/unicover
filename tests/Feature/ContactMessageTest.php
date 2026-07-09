<?php

use App\Models\ContactMessage;
use App\Models\User;

test('guest can submit the contact form and it is stored', function () {
    $response = $this->post(route('contact.store'), [
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'phone' => '08123456789',
        'message' => 'Saya tertarik dengan cover mobil custom.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('contact_messages', [
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'phone' => '08123456789',
        'is_read' => false,
    ]);
});

test('contact form submission works without a phone number', function () {
    $this->post(route('contact.store'), [
        'name' => 'Ani',
        'email' => 'ani@example.com',
        'message' => 'Halo, mohon info harga.',
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseCount('contact_messages', 1);
});

test('contact form requires name, email, and message', function () {
    $response = $this->post(route('contact.store'), [
        'name' => '',
        'email' => 'not-an-email',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
    $this->assertDatabaseCount('contact_messages', 0);
});

test('admin can view the messages inbox', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    ContactMessage::create(['name' => 'X', 'email' => 'x@example.com', 'message' => 'Hi']);

    $this->actingAs($admin)->get(route('admin.messages.index'))->assertOk();
});

test('non admin cannot access the messages inbox', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)->get(route('admin.messages.index'))->assertForbidden();
});

test('admin can mark a message as read and unread', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $message = ContactMessage::create(['name' => 'X', 'email' => 'x@example.com', 'message' => 'Hi']);

    $this->actingAs($admin)->patch(route('admin.messages.update', $message), ['is_read' => true]);
    $this->assertDatabaseHas('contact_messages', ['id' => $message->id, 'is_read' => true]);

    $this->actingAs($admin)->patch(route('admin.messages.update', $message), ['is_read' => false]);
    $this->assertDatabaseHas('contact_messages', ['id' => $message->id, 'is_read' => false]);
});

test('admin can delete a message', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $message = ContactMessage::create(['name' => 'X', 'email' => 'x@example.com', 'message' => 'Hi']);

    $this->actingAs($admin)->delete(route('admin.messages.destroy', $message))->assertRedirect();
    $this->assertDatabaseCount('contact_messages', 0);
});
