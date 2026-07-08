<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'rating', 'message', 'is_active', 'sort_order'])]
class Testimonial extends Model
{
    use HasFactory;
}
