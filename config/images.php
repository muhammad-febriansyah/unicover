<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WebP Encoding Quality
    |--------------------------------------------------------------------------
    |
    | Quality handed to the WebP encoder, from 0 to 100. At 82 the result is
    | visually indistinguishable from the source for photographs while being
    | far smaller than the equivalent JPEG.
    |
    */

    'quality' => (int) env('IMAGE_WEBP_QUALITY', 82),

    /*
    |--------------------------------------------------------------------------
    | Maximum Widths
    |--------------------------------------------------------------------------
    |
    | Uploads wider than these are downscaled before being stored. Each value
    | is roughly twice the width the image is actually displayed at, which
    | keeps it sharp on high density screens without carrying pixels no
    | visitor will ever see. Height follows the source aspect ratio.
    |
    */

    'max_widths' => [
        'article' => 1400,
        'avatar' => 400,
        'category' => 800,
        'hero' => 1400,
        'logo' => 600,
        'product' => 1400,
    ],

];
