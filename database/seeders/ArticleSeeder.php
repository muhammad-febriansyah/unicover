<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('is_admin', true)->first();
        $categories = ArticleCategory::orderBy('sort_order')->get();
        $tags = Tag::all();

        $articles = [
            [
                'title' => 'Panduan Lengkap Merawat Mesin Mobil Harian',
                'body' => "Merawat mesin mobil tidak harus menunggu jadwal servis besar. Beberapa kebiasaan sederhana setiap hari bisa memperpanjang umur mesin secara signifikan.\n\nPanaskan mesin sebentar sebelum berkendara, terutama di pagi hari, agar oli melumasi seluruh komponen dengan sempurna. Perhatikan juga suara mesin — jika terdengar kasar atau berbeda dari biasanya, segera periksa ke bengkel terdekat.\n\nJangan menunda penggantian oli sesuai jarak tempuh yang direkomendasikan pabrikan, karena oli yang sudah kotor justru mempercepat keausan komponen dalam mesin.",
                'image' => 'article-01.jpg',
            ],
            [
                'title' => 'Cara Cek Aki Mobil Sebelum Perjalanan Jauh',
                'body' => "Aki yang lemah adalah salah satu penyebab utama mobil mogok di tengah perjalanan jauh. Untungnya, kondisi aki cukup mudah dicek sendiri sebelum berangkat.\n\nPerhatikan indikator tegangan pada aki (jika ada), idealnya berada di atas 12,4 volt saat mesin mati. Nyalakan lampu depan selama beberapa menit — jika cahaya meredup drastis, itu tanda aki mulai soak.\n\nBawa selalu kabel jumper di bagasi, dan pastikan terminal aki bersih dari korosi agar arus listrik mengalir optimal.",
                'image' => 'article-02.jpg',
            ],
            [
                'title' => 'Tips Servis Berkala di Bengkel Terpercaya',
                'body' => "Memilih bengkel yang tepat sama pentingnya dengan rutin melakukan servis itu sendiri. Bengkel yang asal-asalan justru bisa memperparah kerusakan yang sudah ada.\n\nCari bengkel dengan mekanik bersertifikat dan gunakan suku cadang original atau setara OEM. Jangan ragu bertanya detail pekerjaan yang dilakukan dan minta laporan servis tertulis.\n\nCatat riwayat servis mobil Anda agar mudah dipantau kapan waktunya servis berikutnya.",
                'image' => 'article-03.jpg',
            ],
            [
                'title' => 'Kenali Tanda Mobil Perlu Turun Mesin',
                'body' => "Turun mesin adalah perbaikan besar yang sebaiknya dihindari dengan perawatan preventif. Namun penting mengenali tanda-tanda awalnya.\n\nAsap knalpot berwarna putih tebal, konsumsi oli yang boros drastis, dan suara ketukan dari dalam mesin adalah indikasi yang tidak boleh diabaikan.\n\nSemakin cepat ditangani, semakin kecil kemungkinan kerusakan menjalar ke komponen lain yang lebih mahal diperbaiki.",
                'image' => 'article-04.jpg',
            ],
            [
                'title' => 'Rutinitas Maintenance Mesin agar Awet',
                'body' => "Mesin yang awet bukan soal keberuntungan, melainkan hasil dari rutinitas perawatan yang konsisten.\n\nGanti filter udara dan filter oli sesuai jadwal, periksa selang-selang radiator dari retak, dan jaga suhu mesin tetap dalam batas normal saat berkendara jarak jauh.\n\nDengan disiplin merawat, mesin mobil bisa tetap prima meski sudah menempuh ratusan ribu kilometer.",
                'image' => 'article-05.jpg',
            ],
            [
                'title' => 'Pentingnya Cek Rutin di Bawah Kap Mesin',
                'body' => "Banyak pemilik mobil jarang membuka kap mesin kecuali saat servis. Padahal pengecekan rutin di bawah kap bisa mendeteksi masalah lebih awal.\n\nPeriksa level oli, air radiator, minyak rem, dan air wiper secara berkala. Perhatikan juga apakah ada kebocoran cairan atau selang yang mengeras dan retak.\n\nLuangkan waktu lima menit sebelum perjalanan jauh untuk memastikan semua dalam kondisi aman.",
                'image' => 'article-06.jpg',
            ],
            [
                'title' => 'Checklist Perawatan Mobil Bulanan',
                'body' => "Membuat checklist bulanan membantu memastikan tidak ada komponen penting yang terlewat dari perhatian.\n\nCek tekanan angin ban, kondisi wiper, lampu-lampu kendaraan, serta kebersihan filter kabin. Jangan lupa periksa juga kondisi rem dan suspensi terutama jika sering melewati jalan berlubang.\n\nChecklist sederhana ini bisa mencegah kerusakan kecil berkembang menjadi masalah besar di kemudian hari.",
                'image' => 'article-07.jpg',
            ],
            [
                'title' => 'Kesalahan Umum Saat Servis Mobil Sendiri',
                'body' => "Melakukan servis ringan sendiri di rumah bisa menghemat biaya, tapi ada beberapa kesalahan umum yang perlu dihindari.\n\nMenggunakan oli yang tidak sesuai spesifikasi pabrikan, lupa mengganti seal setelah membuka komponen, atau mengencangkan baut secara berlebihan adalah kesalahan yang sering terjadi.\n\nJika ragu, lebih baik konsultasikan ke mekanik profesional untuk pekerjaan yang membutuhkan presisi tinggi.",
                'image' => 'article-08.jpg',
            ],
            [
                'title' => 'Kapan Waktu Tepat Ganti Oli Mesin',
                'body' => "Waktu ideal mengganti oli sebenarnya bergantung pada jenis oli dan kondisi pemakaian kendaraan, bukan hanya angka kilometer yang kaku.\n\nOli mineral umumnya perlu diganti setiap 5.000 km, sementara oli sintetis bisa bertahan hingga 10.000 km. Kondisi macet parah juga mempercepat degradasi oli meski jarak tempuh belum jauh.\n\nSelalu cek buku manual kendaraan untuk rekomendasi spesifik dari pabrikan.",
                'image' => 'article-09.jpg',
            ],
            [
                'title' => 'Panduan Memilih Bengkel Resmi vs Umum',
                'body' => "Keduanya punya kelebihan masing-masing tergantung kebutuhan dan usia kendaraan Anda.\n\nBengkel resmi unggul dalam garansi dan suku cadang original, cocok untuk mobil yang masih dalam masa garansi. Bengkel umum sering lebih fleksibel dari segi harga dan waktu pengerjaan.\n\nPertimbangkan riwayat servis, biaya jangka panjang, dan tingkat kepercayaan sebelum memutuskan.",
                'image' => 'article-10.jpg',
            ],
            [
                'title' => 'Review Layanan Cuci Mobil Panggilan',
                'body' => "Layanan cuci mobil panggilan semakin diminati karena kepraktisannya — mobil dicuci bersih tanpa perlu keluar rumah.\n\nDari pengalaman menggunakan layanan ini, hasil cuci cukup memuaskan untuk kebutuhan harian, meski untuk detailing menyeluruh tetap disarankan datang ke tempat cuci mobil profesional.\n\nPastikan memilih penyedia jasa yang menggunakan produk sabun aman untuk cat mobil.",
                'image' => 'article-11.jpg',
            ],
            [
                'title' => 'Event Cuci Mobil Amal Komunitas Otomotif',
                'body' => "Akhir pekan lalu, komunitas otomotif lokal mengadakan event cuci mobil amal yang hasilnya disumbangkan untuk kegiatan sosial.\n\nAntusiasme peserta cukup tinggi, dengan puluhan mobil dicuci secara bergotong royong oleh anggota komunitas.\n\nEvent seperti ini tidak hanya mempererat komunitas, tapi juga membangun kesadaran merawat kendaraan sambil berbagi kebaikan.",
                'image' => 'article-12.jpg',
            ],
            [
                'title' => 'Rahasia Foam Wash agar Cat Mobil Kinclong',
                'body' => "Foam wash menjadi favorit karena mampu mengangkat kotoran tanpa menggosok permukaan cat secara langsung, mengurangi risiko baret halus.\n\nGunakan foam dengan pH seimbang dan diamkan beberapa menit sebelum dibilas agar kotoran terangkat sempurna. Bilas dengan tekanan air yang cukup untuk menghindari residu sabun menempel.\n\nDengan teknik yang tepat, cat mobil bisa tetap kinclong tanpa risiko baret akibat gesekan berlebihan.",
                'image' => 'article-13.jpg',
            ],
            [
                'title' => 'Serunya Kunjungan ke Tempat Cuci Mobil Lokal',
                'body' => "Mengunjungi tempat cuci mobil lokal ternyata memberi pengalaman berbeda dibanding cuci mobil otomatis di pusat perbelanjaan.\n\nProses manual memungkinkan perhatian lebih detail pada bagian-bagian sulit seperti celah bumper dan velg. Harga juga cenderung lebih terjangkau dengan hasil yang tak kalah bersih.\n\nMendukung usaha cuci mobil lokal juga turut membantu perekonomian di sekitar lingkungan kita.",
                'image' => 'article-14.jpg',
            ],
            [
                'title' => 'Inspirasi Interior Mobil Minimalis',
                'body' => "Interior minimalis semakin digemari karena kesannya yang bersih, rapi, dan tidak berlebihan.\n\nPenggunaan aksesoris secukupnya, warna netral pada jok dan dashboard, serta pengorganisasian barang yang tertata membuat kabin terasa lebih lapang.\n\nKonsep ini juga memudahkan perawatan kebersihan interior dalam jangka panjang.",
                'image' => 'article-15.jpg',
            ],
            [
                'title' => 'Cerita Pelanggan: Cuci Mobil di Spinners',
                'body' => "Salah satu pelanggan setia berbagi pengalamannya mencuci mobil secara rutin di tempat cuci langganan.\n\nMenurutnya, konsistensi kualitas dan keramahan staf menjadi alasan utama ia terus kembali meski ada banyak pilihan tempat cuci mobil lain di sekitar rumahnya.\n\nPengalaman seperti ini menunjukkan pentingnya membangun kepercayaan pelanggan dalam bisnis jasa otomotif.",
                'image' => 'article-16.jpg',
            ],
            [
                'title' => 'Tips Detailing Interior Mobil Sendiri di Rumah',
                'body' => "Detailing interior tidak melulu harus dilakukan di tempat profesional — dengan alat sederhana, hasil maksimal tetap bisa dicapai di rumah.\n\nGunakan vacuum cleaner untuk membersihkan sela-sela jok, microfiber cloth untuk dashboard, dan cairan khusus untuk membersihkan kaca bagian dalam tanpa meninggalkan bekas.\n\nLakukan secara rutin setiap dua minggu agar interior selalu terasa nyaman dan segar.",
                'image' => 'article-17.jpg',
            ],
            [
                'title' => 'Review Auto Detailing Profesional',
                'body' => "Mencoba layanan auto detailing profesional untuk pertama kalinya memberikan pengalaman yang berbeda dari cuci mobil biasa.\n\nProses meliputi clay bar treatment, poles bodi, hingga coating pelindung cat yang membuat mobil terlihat seperti baru kembali.\n\nMeski harganya lebih mahal, hasil dan daya tahannya sepadan untuk perawatan berkala tiap beberapa bulan.",
                'image' => 'article-18.jpg',
            ],
            [
                'title' => 'Belajar dari Studio Detailing Ternama',
                'body' => "Berkunjung ke studio detailing ternama membuka wawasan baru soal standar kualitas dalam perawatan kendaraan.\n\nSetiap tahapan dikerjakan dengan sangat teliti, mulai dari pencucian awal, dekontaminasi permukaan, hingga finishing coating dengan alat-alat khusus.\n\nStandar seperti ini menjadi acuan bagi banyak detailer pemula yang ingin meningkatkan kualitas layanan mereka.",
                'image' => 'article-19.jpg',
            ],
            [
                'title' => 'Servis Kunci Pintu Mobil yang Sering Diabaikan',
                'body' => "Kunci dan mekanisme pintu mobil sering luput dari perhatian dalam perawatan rutin, padahal komponen ini juga rentan aus.\n\nBeri pelumas ringan secara berkala pada engsel dan mekanisme kunci untuk mencegah bunyi berdecit atau macet saat dibuka-tutup.\n\nJika kunci mulai terasa berat atau tidak responsif, segera periksa ke bengkel sebelum masalah bertambah parah.",
                'image' => 'article-20.jpg',
            ],
            [
                'title' => 'Cara Merawat Wiper agar Tidak Bergaret',
                'body' => "Wiper yang getas justru bisa menggores kaca depan alih-alih membersihkannya, terutama saat musim hujan tiba.\n\nBersihkan karet wiper secara rutin dengan lap microfiber basah untuk mengangkat debu dan pasir halus yang menempel. Hindari menyalakan wiper saat kaca dalam kondisi kering agar karet tidak cepat aus.\n\nGanti wiper setiap 6-12 bulan sekali, atau lebih cepat jika sudah mulai meninggalkan bercak air saat menyapu kaca.",
                'image' => 'article-21.jpg',
            ],
        ];

        foreach ($articles as $i => $data) {
            $isPublished = ! in_array($i, [3, 18], true);
            $category = $categories[$i % $categories->count()];

            $article = Article::create([
                'author_id' => $admin->id,
                'article_category_id' => $category->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'excerpt' => Str::limit(str_replace("\n\n", ' ', $data['body']), 150),
                'body' => $data['body'],
                'cover_image_path' => 'articles/'.$data['image'],
                'is_published' => $isPublished,
                'published_at' => $isPublished ? now()->subDays(fake()->numberBetween(1, 90)) : null,
            ]);

            $article->tags()->attach(
                $tags->random(fake()->numberBetween(2, 4))->pluck('id')
            );
        }
    }
}
