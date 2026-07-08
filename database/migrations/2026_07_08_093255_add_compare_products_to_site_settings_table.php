<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->foreignId('compare_product_a_id')->nullable()->after('hero_image_path')->constrained('products')->nullOnDelete();
            $table->foreignId('compare_product_b_id')->nullable()->after('compare_product_a_id')->constrained('products')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('compare_product_a_id');
            $table->dropConstrainedForeignId('compare_product_b_id');
        });
    }
};
