import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Star,
    ShieldCheck,
    Truck,
    Ruler,
    CloudRain,
    CheckCircle2,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Clock,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/storefront/icons';
import { SiteFooter } from '@/components/storefront/site-footer';
import { SiteHeader } from '@/components/storefront/site-header';
import { Carousel } from '@/components/ui/apple-cards-carousel';
import { Compare } from '@/components/ui/compare';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Marquee } from '@/components/ui/marquee';
import { Spotlight } from '@/components/ui/spotlight';
import { waLink } from '@/lib/storefront';
import type {SiteSettings} from '@/lib/storefront';

interface ProductImage {
    id: number;
    path: string;
    is_primary: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
    products: { images: ProductImage[] }[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    discount_price: string | number | null;
    is_featured: boolean;
    stock_status: string;
    created_at: string;
    category: Category | null;
    images: ProductImage[];
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_path: string | null;
    published_at: string | null;
    articleCategory: { name: string } | null;
}

interface Testimonial {
    id: number;
    name: string;
    rating: number;
    message: string;
}

interface Props {
    settings: SiteSettings | null;
    categories: Category[];
    products: Product[];
    articles: Article[];
    testimonials: Testimonial[];
}

const features = [
    { icon: ShieldCheck, title: 'Bahan Berkualitas', desc: 'Material premium multi-lapis yang lembut di cat namun kuat menahan panas, hujan, dan debu.' },
    { icon: Ruler, title: 'Custom Sesuai Tipe', desc: 'Pola dipotong khusus per tipe mobil, pas mengikuti bodi dari kaca spion hingga bumper.' },
    { icon: CloudRain, title: 'Tahan Segala Cuaca', desc: 'Anti UV & anti air, melindungi cat mobil dari terik matahari maupun hujan deras.' },
    { icon: CheckCircle2, title: 'Jahitan Presisi', desc: 'Dijahit rapi dengan benang anti putus dan karet elastis di tepi agar tidak mudah lepas.' },
];

function ReviewCard({ name, rating, message }: Testimonial) {
    return (
        <figure className="flex w-80 flex-col rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,.05)]">
            <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-sm font-bold text-[#2547F9]">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight">
                    <figcaption className="text-[14px] font-semibold text-[#1a1a1a]">{name}</figcaption>
                    <div className="mt-0.5 flex gap-0.5 text-[#F5A623]">
                        {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} size={13} className={s < rating ? 'fill-current' : 'fill-none text-gray-300'} />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="mt-3.5 text-[14px] leading-relaxed text-gray-600">{message}</blockquote>
        </figure>
    );
}

export default function Welcome({ settings, categories, products, articles, testimonials }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';
    const waGeneral = waLink(waNumber, `Halo ${brandName}, saya ingin bertanya mengenai produk cover mobil yang tersedia. Mohon informasinya, terima kasih.`);

    const heroProduct = products.find((p) => p.images.length > 0);
    const heroImage = heroProduct?.images.find((img) => img.is_primary) ?? heroProduct?.images[0];

    const compareProducts = products.filter((p) => p.images.length > 0).slice(0, 2);

    return (
        <>
            <Head title={`${brandName} — Cover Mobil Custom Premium`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                {/* HERO */}
                <section id="beranda" className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-12 overflow-hidden px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#2547F9" />
                    <div className="min-w-[300px] flex-1 basis-[380px]">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF1FF] px-3.5 py-1.5 text-[13px] font-semibold text-[#2547F9]">
                            <span className="size-[7px] rounded-full bg-[#2547F9]" />
                            {settings?.tagline ?? 'Custom sesuai tipe mobil Anda'}
                        </span>
                        <h1 className="mt-5 text-[clamp(34px,5.2vw,56px)] leading-[1.08] font-extrabold tracking-tight">
                            {settings?.hero_heading ?? 'Lindungi Mobilmu dengan Cover Premium Custom'}
                        </h1>
                        <p className="mt-5 max-w-[520px] text-[clamp(16px,2vw,18px)] leading-relaxed text-gray-500">
                            {settings?.hero_subheading ?? 'Cover mobil dijahit presisi mengikuti lekuk kendaraan Anda. Bahan berkualitas, anti air, dan tahan segala cuaca.'}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3.5">
                            <Link
                                href="/produk"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#2547F9] px-6 py-4 text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(37,71,249,.3)] hover:bg-[#1a35c9]"
                            >
                                Lihat Katalog
                                <ArrowRight size={18} />
                            </Link>
                            <a
                                href={waGeneral}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-[15px] font-semibold text-[#1a1a1a] hover:border-[#2547F9] hover:text-[#2547F9]"
                            >
                                <WhatsAppIcon size={18} />
                                Pesan via WhatsApp
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-3.5">
                            <div className="flex">
                                <span className="size-9 rounded-full border-2 border-white bg-[#c7d2fe]" />
                                <span className="-ml-2.5 size-9 rounded-full border-2 border-white bg-[#a5b4fc]" />
                                <span className="-ml-2.5 size-9 rounded-full border-2 border-white bg-[#818cf8]" />
                                <span className="-ml-2.5 flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#2547F9] text-[11px] font-semibold text-white">
                                    5k+
                                </span>
                            </div>
                            <div className="text-[13px] leading-tight text-gray-500">
                                <strong className="text-[#1a1a1a]">5.000+ pelanggan</strong>
                                <br />
                                puas di seluruh Indonesia
                            </div>
                        </div>
                    </div>

                    <div className="relative min-w-[300px] flex-1 basis-[380px]">
                        <div className="pointer-events-none absolute -inset-x-[6%] -top-[8%] -bottom-[6%] rounded-full bg-[radial-gradient(60%_60%_at_70%_30%,rgba(37,71,249,.14),transparent_70%)] blur-[10px]" />
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gray-200 bg-[#F9FAFB] shadow-[0_30px_70px_rgba(37,71,249,.14)]">
                            {heroImage ? (
                                <img src={`/storage/${heroImage.path}`} alt={heroProduct?.name} className="size-full object-cover" />
                            ) : (
                                <div className="flex size-full items-center justify-center text-sm text-gray-400">Foto produk cover mobil</div>
                            )}
                        </div>
                        <div className="absolute -bottom-4.5 -left-3.5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4.5 py-3.5 shadow-[0_16px_40px_rgba(0,0,0,.08)]">
                            <span className="flex size-[42px] items-center justify-center rounded-xl bg-[#EEF1FF]">
                                <Star size={22} className="fill-[#2547F9] text-[#2547F9]" />
                            </span>
                            <div className="leading-tight">
                                <div className="text-base font-bold">4.9/5.0</div>
                                <div className="text-xs text-gray-500">Rating pelanggan</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST BAR */}
                <section className="border-y border-gray-200 bg-[#F9FAFB]">
                    <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-5 px-6 py-7">
                        {[
                            { icon: ShieldCheck, big: '5.000+', small: 'Pelanggan puas' },
                            { icon: CloudRain, big: '100% Anti Air', small: 'Bahan waterproof' },
                            { icon: CheckCircle2, big: 'Garansi 1 Tahun', small: 'Jahitan & bahan' },
                            { icon: Truck, big: 'Gratis Ongkir', small: 'Seluruh Indonesia' },
                        ].map((item, i) => (
                            <div key={i} className="flex min-w-[180px] flex-1 basis-[200px] items-center gap-3.5">
                                <item.icon size={26} className="shrink-0 text-[#2547F9]" strokeWidth={1.9} />
                                <div className="leading-tight">
                                    <div className="text-lg font-bold">{item.big}</div>
                                    <div className="text-[13px] text-gray-500">{item.small}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* KATEGORI */}
                {categories.length > 0 && (
                    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                        <div className="mx-auto mb-11 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">CARI BERDASARKAN KATEGORI</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Pilih Kategori Cover Anda</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5 sm:gap-6">
                            {categories.map((cat) => {
                                const image = cat.products[0]?.images.find((img) => img.is_primary) ?? cat.products[0]?.images[0];
                                return (
                                    <a
                                        key={cat.id}
                                        href={waLink(waNumber, `Halo ${brandName}, saya ingin bertanya mengenai cover mobil untuk kategori ${cat.name}. Mohon informasinya, terima kasih.`)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group relative flex aspect-[16/10] sm:aspect-[4/3] flex-col justify-end overflow-hidden rounded-[20px] sm:rounded-[24px] border border-gray-200 shadow-[0_10px_30px_rgba(17,24,39,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(37,71,249,.18)]"
                                    >
                                        {image ? (
                                            <img
                                                src={`/storage/${image.path}`}
                                                alt={cat.name}
                                                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-[linear-gradient(135deg,#5B7FB0,#3A5C8A)]" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                        <div className="relative flex flex-col gap-2 sm:gap-2.5 p-4 sm:p-6 text-white">
                                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-[12px] font-semibold backdrop-blur-sm">
                                                {cat.products_count} produk
                                            </span>
                                            <h3 className="text-[18px] sm:text-[22px] font-bold tracking-tight">{cat.name}</h3>
                                            {cat.description && <p className="line-clamp-2 text-[13px] sm:text-[13.5px] leading-relaxed text-white/80">{cat.description}</p>}
                                            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                                                Lihat produk
                                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* KATALOG */}
                <section id="katalog" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">KATALOG PRODUK</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Produk Unggulan Kami</h2>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                            <p className="max-w-[360px] text-[15px] text-gray-500">
                                Geser untuk menjelajahi koleksi cover mobil premium kami. Klik kartu untuk detail.
                            </p>
                            <Link href="/produk" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9] hover:underline">
                                Lihat semua produk
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <p className="text-sm text-gray-500">Belum ada produk tersedia.</p>
                    ) : (
                        <Carousel products={products} />
                    )}
                </section>

                {/* BANDINGKAN PRODUK */}
                {compareProducts.length === 2 && (
                    <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
                        <div className="mx-auto mb-11 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">BANDINGKAN PILIHAN</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Geser untuk Bandingkan Produk</h2>
                            <p className="mt-3 text-[15px] text-gray-500">
                                Geser slider untuk membandingkan {compareProducts[0].name} dengan {compareProducts[1].name}.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="rounded-[24px] border border-gray-200 bg-white p-3 shadow-[0_20px_50px_rgba(17,24,39,.08)]">
                                <Compare
                                    firstImage={`/storage/${(compareProducts[0].images.find((img) => img.is_primary) ?? compareProducts[0].images[0]).path}`}
                                    secondImage={`/storage/${(compareProducts[1].images.find((img) => img.is_primary) ?? compareProducts[1].images[0]).path}`}
                                    firstImageClassName="object-cover"
                                    secondImageClassname="object-cover"
                                    className="h-[min(320px,calc(100vw-6rem))] w-[min(320px,calc(100vw-6rem))] rounded-2xl md:h-[420px] md:w-[560px]"
                                    slideMode="hover"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* KEUNGGULAN */}
                <section id="tentang" className="border-y border-gray-200 bg-[#F9FAFB]">
                    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                        <div className="mx-auto mb-12 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">KENAPA {brandName.toUpperCase()}</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Kualitas yang Bisa Diandalkan</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="relative rounded-[20px] border border-gray-200 bg-white p-7 shadow-[0_10px_30px_rgba(17,24,39,.04)]">
                                    <GlowingEffect disabled={false} proximity={80} spread={30} borderWidth={2} />
                                    <span className="mb-4.5 flex size-[52px] items-center justify-center rounded-2xl bg-[#EEF1FF]">
                                        <f.icon size={26} className="text-[#2547F9]" strokeWidth={1.9} />
                                    </span>
                                    <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONI */}
                {testimonials.length > 0 && (
                    <section className="border-y border-gray-200 bg-[#F9FAFB] py-16 md:py-24">
                        <div className="mx-auto mb-11 max-w-[600px] px-6 text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">TESTIMONI</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Kata Mereka Tentang {brandName}</h2>
                        </div>
                        <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden">
                            <Marquee pauseOnHover className="[--duration:35s]">
                                {testimonials.slice(0, Math.ceil(testimonials.length / 2)).map((t) => (
                                    <ReviewCard key={t.id} {...t} />
                                ))}
                            </Marquee>
                            {testimonials.length > 1 && (
                                <Marquee reverse pauseOnHover className="[--duration:35s]">
                                    {testimonials.slice(Math.ceil(testimonials.length / 2)).map((t) => (
                                        <ReviewCard key={t.id} {...t} />
                                    ))}
                                </Marquee>
                            )}
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#F9FAFB]" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#F9FAFB]" />
                        </div>
                    </section>
                )}

                {/* ARTIKEL */}
                {articles.length > 0 && (
                    <section id="artikel" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <span className="text-sm font-semibold tracking-wide text-[#2547F9]">ARTIKEL &amp; TIPS</span>
                                <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Artikel Terbaru</h2>
                            </div>
                            <Link href="/artikel" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9] hover:underline">
                                Lihat semua artikel
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/artikel/${article.slug}`}
                                    className="flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white text-[#1a1a1a] shadow-[0_10px_30px_rgba(17,24,39,.05)] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(37,71,249,.1)]"
                                >
                                    <div className="aspect-[16/10] bg-[#F9FAFB]">
                                        {article.cover_image_path ? (
                                            <img src={`/storage/${article.cover_image_path}`} alt={article.title} className="size-full object-cover" />
                                        ) : (
                                            <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto artikel</div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="mb-2.5 flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={14} className="text-[#2547F9]" strokeWidth={1.8} />
                                            {article.published_at &&
                                                new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {article.articleCategory && ` · ${article.articleCategory.name}`}
                                        </div>
                                        <h3 className="mb-2.5 text-[17px] leading-snug font-semibold tracking-tight">{article.title}</h3>
                                        <p className="mb-3.5 flex-1 text-sm leading-relaxed text-gray-500">{article.excerpt}</p>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9]">
                                            Baca selengkapnya
                                            <ArrowRight size={15} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA PENUTUP */}
                <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
                    <div className="relative overflow-hidden rounded-[22px] bg-[#2547F9] p-7 text-center shadow-[0_30px_70px_rgba(37,71,249,.28)] sm:rounded-[28px] sm:p-10 md:p-16">
                        <div className="pointer-events-none absolute -top-[40%] -right-[10%] size-[340px] rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-[50%] -left-[8%] size-[300px] rounded-full bg-white/[.08]" />
                        <div className="relative">
                            <h2 className="mx-auto max-w-[640px] text-[clamp(22px,4.4vw,44px)] font-extrabold tracking-tight text-white">
                                Siap Melindungi Mobil Kesayangan Anda?
                            </h2>
                            <p className="mx-auto mt-3.5 max-w-[520px] text-[clamp(14px,2vw,18px)] leading-relaxed text-white/85 sm:mt-4.5">
                                Konsultasikan tipe mobil Anda, kami bantu pilihkan cover yang paling pas. Respon cepat via WhatsApp.
                            </p>
                            <a
                                href={waGeneral}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-center text-[13.5px] leading-snug font-bold text-[#2547F9] shadow-[0_16px_34px_rgba(0,0,0,.18)] hover:-translate-y-0.5 sm:mt-8 sm:w-auto sm:gap-2.5 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
                            >
                                <WhatsAppIcon size={20} />
                                Pesan Sekarang via WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* KONTAK */}
                <section id="kontak" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                    <div className="mx-auto mb-11 max-w-[600px] text-center">
                        <span className="text-sm font-semibold tracking-wide text-[#2547F9]">HUBUNGI KAMI</span>
                        <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Kami Siap Membantu Anda</h2>
                        <p className="mt-3 text-[15px] text-gray-500">
                            Kunjungi lokasi kami atau hubungi langsung via WhatsApp untuk konsultasi produk.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                        {settings?.google_maps_embed ? (
                            <div
                                className="aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-gray-200 shadow-[0_10px_30px_rgba(17,24,39,.05)] [&_iframe]:size-full"
                                dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }}
                            />
                        ) : (
                            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[24px] border border-gray-200 bg-[#F9FAFB] text-sm text-gray-400">
                                Peta lokasi belum diatur
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {settings?.address && (
                                <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,.04)]">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF]">
                                        <MapPin size={20} className="text-[#2547F9]" strokeWidth={1.9} />
                                    </span>
                                    <h3 className="mt-3.5 text-[15px] font-semibold">Alamat</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{settings.address}</p>
                                </div>
                            )}
                            {waNumber && (
                                <a
                                    href={waGeneral}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,.04)] hover:border-[#2547F9]"
                                >
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF]">
                                        <Phone size={20} className="text-[#2547F9]" strokeWidth={1.9} />
                                    </span>
                                    <h3 className="mt-3.5 text-[15px] font-semibold">WhatsApp</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-gray-500">+{waNumber}</p>
                                </a>
                            )}
                            {settings?.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,.04)] hover:border-[#2547F9]"
                                >
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF]">
                                        <Mail size={20} className="text-[#2547F9]" strokeWidth={1.9} />
                                    </span>
                                    <h3 className="mt-3.5 text-[15px] font-semibold">Email</h3>
                                    <p className="mt-1 text-sm leading-relaxed break-all text-gray-500">{settings.email}</p>
                                </a>
                            )}
                            <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,.04)]">
                                <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF]">
                                    <Clock size={20} className="text-[#2547F9]" strokeWidth={1.9} />
                                </span>
                                <h3 className="mt-3.5 text-[15px] font-semibold">Jam Operasional</h3>
                                <p className="mt-1 text-sm leading-relaxed text-gray-500">Senin–Sabtu, 08.00–20.00 WIB</p>
                            </div>
                        </div>
                    </div>
                </section>

                <SiteFooter settings={settings} />
            </div>
        </>
    );
}
