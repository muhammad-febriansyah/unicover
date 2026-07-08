<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Budi Santoso',
                'rating' => 5,
                'message' => 'Bahannya tebal dan jahitannya rapi banget. Pas di mobil saya, gak ada bagian yang kedodoran. Recommended!',
            ],
            [
                'name' => 'Rina Wijaya',
                'rating' => 5,
                'message' => 'Sudah kena hujan berkali-kali tapi mobil tetap kering. Proses pesan lewat WA cepat dan ramah. Puas!',
            ],
            [
                'name' => 'Ahmad Fauzi',
                'rating' => 5,
                'message' => 'Cover indoor-nya premium banget, lembut dan gak bikin baret cat. Worth every rupiah.',
            ],
            [
                'name' => 'Dewi Lestari',
                'rating' => 4,
                'message' => 'Ukurannya pas banget sesuai mobil saya, custom fit-nya beneran presisi. Pengiriman juga cepat.',
            ],
            [
                'name' => 'Hendra Gunawan',
                'rating' => 5,
                'message' => 'Sudah 2 tahun pakai cover dari sini, masih awet dan warnanya belum pudar meski sering kena panas.',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'rating' => 5,
                'message' => 'Admin ramah, respon cepat, dan kasih rekomendasi cover yang cocok untuk mobil city car saya.',
            ],
            [
                'name' => 'Agus Setiawan',
                'rating' => 4,
                'message' => 'Cover ban-nya bagus, pemasangan mudah, dan harganya masih terjangkau untuk kualitas segini.',
            ],
            [
                'name' => 'Maya Puspita',
                'rating' => 5,
                'message' => 'Baru pertama kali coba custom cover mobil, ternyata hasilnya jauh lebih rapi dari cover biasa yang saya beli sebelumnya.',
            ],
            [
                'name' => 'Rizky Pratama',
                'rating' => 5,
                'message' => 'Proses konsultasi via WhatsApp gampang banget, tinggal kasih tipe mobil langsung direkomendasikan bahan yang cocok.',
            ],
            [
                'name' => 'Indah Permatasari',
                'rating' => 4,
                'message' => 'Kualitas jahitan rapi dan bahannya breathable, gak lembap meski dipakai setiap hari di garasi.',
            ],
        ];

        foreach ($testimonials as $index => $testimonial) {
            Testimonial::create([
                'name' => $testimonial['name'],
                'rating' => $testimonial['rating'],
                'message' => $testimonial['message'],
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
