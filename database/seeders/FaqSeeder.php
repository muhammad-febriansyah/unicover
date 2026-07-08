<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Berapa lama proses pembuatan cover mobil custom?',
                'answer' => "Proses pembuatan cover custom umumnya memakan waktu 2-4 hari kerja setelah ukuran dan tipe mobil dikonfirmasi.\n\nUntuk pesanan dengan jumlah banyak atau bahan khusus, waktu pengerjaan bisa sedikit lebih lama. Kami akan selalu informasikan estimasi waktu saat Anda konsultasi via WhatsApp.",
            ],
            [
                'question' => 'Apakah cover mobil bisa dipakai untuk semua tipe kendaraan?',
                'answer' => "Bisa. Kami menyediakan pola custom untuk berbagai tipe kendaraan mulai dari city car, sedan, SUV, hingga MPV.\n\nCukup informasikan merek dan tipe mobil Anda saat pemesanan, tim kami akan menyesuaikan pola potongan agar pas dengan bodi kendaraan.",
            ],
            [
                'question' => 'Bagaimana cara memesan cover mobil di Unicover?',
                'answer' => "Anda bisa memilih produk di halaman katalog, lalu klik \"Lihat Detail\" untuk melihat informasi lengkap produk.\n\nSetelah itu klik tombol \"Pesan via WhatsApp\" untuk langsung terhubung dengan admin kami dan menyelesaikan pemesanan.",
            ],
            [
                'question' => 'Apakah tersedia garansi untuk produk cover mobil?',
                'answer' => "Ya, semua produk cover mobil dan cover ban kami dilengkapi garansi jahitan dan bahan selama 1 tahun.\n\nJika terjadi kerusakan akibat cacat produksi dalam masa garansi, kami akan memperbaiki atau mengganti produk tanpa biaya tambahan.",
            ],
            [
                'question' => 'Metode pembayaran apa saja yang tersedia?',
                'answer' => "Pembayaran dapat dilakukan melalui transfer bank, e-wallet, atau QRIS. Detail pembayaran akan diinformasikan admin saat proses pemesanan via WhatsApp.\n\nUntuk pemesanan custom, biasanya diperlukan DP (uang muka) sebelum proses produksi dimulai.",
            ],
            [
                'question' => 'Apakah bisa request warna dan desain khusus?',
                'answer' => "Tentu bisa. Kami menerima request warna, kombinasi warna, hingga logo/emblem tambahan sesuai keinginan Anda.\n\nSampaikan preferensi desain Anda saat konsultasi, tim kami akan membantu mewujudkannya selama material tersedia.",
            ],
            [
                'question' => 'Bagaimana cara merawat cover mobil agar awet?',
                'answer' => "Cuci cover secara berkala dengan air bersih dan sabun lembut, lalu keringkan sepenuhnya sebelum disimpan atau dipasang kembali.\n\nHindari melipat cover dalam keadaan basah karena bisa menyebabkan jamur. Simpan di tempat kering saat tidak digunakan.",
            ],
            [
                'question' => 'Apakah ada opsi pengiriman ke luar kota?',
                'answer' => "Ada. Kami melayani pengiriman ke seluruh Indonesia menggunakan jasa ekspedisi terpercaya.\n\nBiaya dan estimasi waktu pengiriman akan disesuaikan dengan lokasi tujuan dan diinformasikan sebelum pembayaran.",
            ],
            [
                'question' => 'Apa perbedaan cover indoor dan outdoor?',
                'answer' => "Cover indoor menggunakan bahan yang lebih lembut dan ringan, cocok untuk mobil yang disimpan di garasi atau carport.\n\nCover outdoor menggunakan bahan tebal dengan lapisan waterproof dan anti UV, dirancang khusus untuk menahan paparan hujan dan sinar matahari langsung.",
            ],
            [
                'question' => 'Bisakah membatalkan atau mengubah pesanan yang sudah dibuat?',
                'answer' => "Pembatalan atau perubahan pesanan bisa dilakukan selama produk belum masuk tahap produksi.\n\nSegera hubungi admin via WhatsApp jika ingin melakukan perubahan, kami akan bantu sesuaikan sebisa mungkin.",
            ],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::create([
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
