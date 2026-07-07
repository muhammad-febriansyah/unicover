import { Head, Link } from '@inertiajs/react';
import { useState, type ComponentType } from 'react';
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
    NavbarButton,
} from '@/components/ui/resizable-navbar';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Spotlight } from '@/components/ui/spotlight';
import { Compare } from '@/components/ui/compare';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { WobbleCard } from '@/components/ui/wobble-card';
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
    Instagram,
    Facebook,
} from 'lucide-react';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
            <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.4 5.1 5.2-1.4A10 10 0 1 0 12 2z" />
        </svg>
    );
}

function TiktokIcon({ size = 18 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
            <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.57h-3.15v13.94c0 1.55-1.26 2.81-2.81 2.81a2.81 2.81 0 0 1 0-5.62c.28 0 .55.04.81.12V9.62a6.02 6.02 0 0 0-.81-.06 5.97 5.97 0 1 0 5.97 5.97V9.4a8.16 8.16 0 0 0 4.79 1.53V7.79a4.83 4.83 0 0 1-3.4-1.97z" />
        </svg>
    );
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface ProductImage {
    id: number;
    path: string;
    is_primary: boolean;
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

interface SiteSettings {
    brand_name: string;
    logo_path: string | null;
    wa_number: string;
    tagline: string | null;
    hero_heading: string | null;
    hero_subheading: string | null;
    address: string | null;
    email: string | null;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    footer_text: string | null;
    google_maps_embed: string | null;
}

interface Props {
    settings: SiteSettings | null;
    categories: Category[];
    products: Product[];
    articles: Article[];
}

const testimonials = [
    { name: 'Budi Santoso', city: 'Jakarta', quote: 'Bahannya tebal dan jahitannya rapi banget. Pas di mobil saya, gak ada bagian yang kedodoran. Recommended!' },
    { name: 'Rina Wijaya', city: 'Surabaya', quote: 'Sudah kena hujan berkali-kali tapi mobil tetap kering. Proses pesan lewat WA cepat dan ramah. Puas!' },
    { name: 'Ahmad Fauzi', city: 'Bandung', quote: 'Cover indoor-nya premium banget, lembut dan gak bikin baret cat. Worth every rupiah.' },
];

const features = [
    { icon: ShieldCheck, title: 'Bahan Berkualitas', desc: 'Material premium multi-lapis yang lembut di cat namun kuat menahan panas, hujan, dan debu.' },
    { icon: Ruler, title: 'Custom Sesuai Tipe', desc: 'Pola dipotong khusus per tipe mobil, pas mengikuti bodi dari kaca spion hingga bumper.' },
    { icon: CloudRain, title: 'Tahan Segala Cuaca', desc: 'Anti UV & anti air, melindungi cat mobil dari terik matahari maupun hujan deras.' },
    { icon: CheckCircle2, title: 'Jahitan Presisi', desc: 'Dijahit rapi dengan benang anti putus dan karet elastis di tepi agar tidak mudah lepas.' },
];

function formatRupiah(value: string | number) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

function waLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function Welcome({ settings, categories, products, articles }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);

    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';
    const waGeneral = waLink(waNumber, `Halo ${brandName}, saya ingin bertanya tentang produk cover mobil.`);

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#katalog', label: 'Katalog' },
        { href: '#artikel', label: 'Artikel' },
        { href: '#tentang', label: 'Tentang' },
        { href: '#kontak', label: 'Kontak' },
    ];

    const socialLinks = [
        settings?.instagram ? { icon: Instagram, href: `https://instagram.com/${settings.instagram}` } : null,
        settings?.facebook ? { icon: Facebook, href: `https://facebook.com/${settings.facebook}` } : null,
        settings?.tiktok ? { icon: TiktokIcon, href: `https://tiktok.com/@${settings.tiktok}` } : null,
    ].filter(Boolean) as { icon: ComponentType<{ size?: number }>; href: string }[];

    const heroProduct = products.find((p) => p.images.length > 0);
    const heroImage = heroProduct?.images.find((img) => img.is_primary) ?? heroProduct?.images[0];

    const compareProducts = products.filter((p) => p.images.length > 0).slice(0, 2);

    return (
        <>
            <Head title={`${brandName} — Cover Mobil Custom Premium`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                {/* NAVBAR */}
                <Navbar className="fixed inset-x-0 top-0">
                    <NavBody>
                        <a href="#beranda" className="relative z-20 flex items-center">
                            {settings?.logo_path ? (
                                <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-12 w-auto object-contain" />
                            ) : (
                                <span className="flex size-12 items-center justify-center rounded-[14px] bg-[#2547F9] shadow-[0_8px_20px_rgba(37,71,249,.28)]">
                                    <Truck size={22} className="text-white" />
                                </span>
                            )}
                        </a>
                        <NavItems items={navLinks.map((l) => ({ name: l.label, link: l.href }))} />
                        <NavbarButton
                            href={waGeneral}
                            variant="primary"
                            className="relative z-20 flex items-center gap-2 bg-[#2547F9] text-white shadow-[0_8px_22px_rgba(37,71,249,.28)] hover:bg-[#1a35c9]"
                        >
                            <WhatsAppIcon size={16} />
                            Chat WhatsApp
                        </NavbarButton>
                    </NavBody>

                    <MobileNav>
                        <MobileNavHeader>
                            <a href="#beranda" className="relative z-20 flex items-center">
                                {settings?.logo_path ? (
                                    <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-11 w-auto object-contain" />
                                ) : (
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#2547F9]">
                                        <Truck size={20} className="text-white" />
                                    </span>
                                )}
                            </a>
                            <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
                        </MobileNavHeader>
                        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-2 font-medium text-[#1a1a1a]"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <NavbarButton
                                href={waGeneral}
                                variant="primary"
                                className="flex w-full items-center justify-center gap-2 bg-[#2547F9] text-white"
                            >
                                <WhatsAppIcon size={16} />
                                Chat WhatsApp
                            </NavbarButton>
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>

                {/* HERO */}
                <section id="beranda" className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-12 overflow-hidden px-6 pt-32 pb-16 md:pt-40 md:pb-24">
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
                            <a
                                href="#katalog"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#2547F9] px-6 py-4 text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(37,71,249,.3)] hover:bg-[#1a35c9]"
                            >
                                Lihat Katalog
                                <ArrowRight size={18} />
                            </a>
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
                    <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 px-6 py-7">
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

                {/* KATALOG */}
                <section id="katalog" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">KATALOG PRODUK</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Produk Unggulan Kami</h2>
                        </div>
                        <p className="max-w-[360px] text-[15px] text-gray-500">
                            Semua cover tersedia untuk berbagai tipe mobil. Klik &quot;Pesan&quot; untuk order langsung via WhatsApp.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <p className="text-sm text-gray-500">Belum ada produk tersedia.</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
                            {products.map((product) => {
                                const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
                                const isOutOfStock = product.stock_status === 'out_of_stock';
                                const isPreorder = product.stock_status === 'preorder';
                                const isNew =
                                    !product.is_featured &&
                                    !isOutOfStock &&
                                    Date.now() - new Date(product.created_at).getTime() < 1000 * 60 * 60 * 24 * 30;
                                const productWa = waLink(
                                    waNumber,
                                    `Halo ${brandName}, saya tertarik memesan ${product.name} (${formatRupiah(product.discount_price ?? product.price)}). Apakah masih tersedia?`
                                );

                                return (
                                    <CardContainer key={product.id} containerClassName="py-0">
                                        <CardBody className="h-auto w-full flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(17,24,39,.05)] hover:shadow-[0_20px_44px_rgba(37,71,249,.12)]">
                                            <CardItem translateZ={60} className="relative aspect-[4/3] w-full bg-[#F9FAFB]">
                                                {primaryImage ? (
                                                    <img
                                                        src={`/storage/${primaryImage.path}`}
                                                        alt={product.name}
                                                        className={`size-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto produk</div>
                                                )}
                                                {isOutOfStock ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-gray-700 px-2.5 py-1 text-[11px] font-semibold text-white">
                                                        Stok Habis
                                                    </span>
                                                ) : product.is_featured ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-[#2547F9] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_16px_rgba(37,71,249,.32)]">
                                                        Best Seller
                                                    </span>
                                                ) : isNew ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-[#0EA96A] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_16px_rgba(14,169,106,.3)]">
                                                        New
                                                    </span>
                                                ) : isPreorder ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-[#B45309] px-2.5 py-1 text-[11px] font-semibold text-white">
                                                        Preorder
                                                    </span>
                                                ) : null}
                                            </CardItem>
                                            <CardItem translateZ={40} className="flex w-full flex-1 flex-col p-4.5">
                                                {product.category && (
                                                    <span className="self-start rounded-full bg-[#EEF1FF] px-2.5 py-0.5 text-xs font-semibold text-[#2547F9]">
                                                        {product.category.name}
                                                    </span>
                                                )}
                                                <h3 className="mt-3 text-base leading-snug font-semibold tracking-tight">{product.name}</h3>
                                                <div className="mt-3 mb-4">
                                                    {product.discount_price ? (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-xl font-extrabold">{formatRupiah(product.discount_price)}</span>
                                                            <span className="text-sm text-gray-400 line-through">{formatRupiah(product.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xl font-extrabold">{formatRupiah(product.price)}</div>
                                                    )}
                                                </div>
                                                {isOutOfStock ? (
                                                    <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-3 text-sm font-semibold text-gray-400">
                                                        Stok Habis
                                                    </span>
                                                ) : (
                                                    <CardItem
                                                        as="a"
                                                        translateZ={70}
                                                        href={productWa}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#2547F9] p-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,71,249,.22)] hover:bg-[#1a35c9]"
                                                    >
                                                        <WhatsAppIcon size={17} />
                                                        {isPreorder ? 'Pesan (Preorder)' : 'Pesan via WhatsApp'}
                                                    </CardItem>
                                                )}
                                            </CardItem>
                                        </CardBody>
                                    </CardContainer>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* BANDINGKAN PRODUK */}
                {compareProducts.length === 2 && (
                    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
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
                                    className="h-[320px] w-[320px] rounded-2xl md:h-[420px] md:w-[560px]"
                                    slideMode="hover"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* KEUNGGULAN */}
                <section id="tentang" className="border-y border-gray-200 bg-[#F9FAFB]">
                    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                        <div className="mx-auto mb-12 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">KENAPA {brandName.toUpperCase()}</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Kualitas yang Bisa Diandalkan</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
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

                {/* KATEGORI */}
                {categories.length > 0 && (
                    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                        <div className="mx-auto mb-11 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">CARI BERDASARKAN KATEGORI</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Pilih Kategori Cover Anda</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                            {categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={waLink(waNumber, `Halo ${brandName}, saya mau tanya cover untuk kategori ${cat.name}.`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block"
                                >
                                    <WobbleCard
                                        containerClassName="border border-gray-200 bg-white hover:border-[#2547F9]"
                                        className="flex flex-col gap-4 p-0 text-[#1a1a1a]"
                                    >
                                        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
                                            <Truck size={28} className="text-[#2547F9]" strokeWidth={1.7} />
                                        </span>
                                        <div>
                                            <div className="text-[19px] font-bold">{cat.name}</div>
                                            {cat.description && <div className="mt-0.5 line-clamp-2 text-[13px] text-gray-500">{cat.description}</div>}
                                        </div>
                                    </WobbleCard>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* TESTIMONI */}
                <section className="border-y border-gray-200 bg-[#F9FAFB]">
                    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                        <div className="mx-auto mb-11 max-w-[600px] text-center">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">TESTIMONI</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Kata Mereka Tentang {brandName}</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                            {testimonials.map((t, i) => (
                                <div key={i} className="flex flex-col rounded-[20px] border border-gray-200 bg-white p-7 shadow-[0_10px_30px_rgba(17,24,39,.05)]">
                                    <div className="mb-3.5 flex gap-0.5 text-[#F5A623]">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star key={s} size={18} className="fill-current" />
                                        ))}
                                    </div>
                                    <p className="mb-5.5 flex-1 text-[15px] leading-relaxed text-gray-700">{t.quote}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="size-[46px] shrink-0 rounded-full bg-[#EEF1FF]" />
                                        <div className="leading-tight">
                                            <div className="text-[15px] font-semibold">{t.name}</div>
                                            <div className="text-[13px] text-gray-500">{t.city}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ARTIKEL */}
                {articles.length > 0 && (
                    <section id="artikel" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                        <div className="mb-10">
                            <span className="text-sm font-semibold tracking-wide text-[#2547F9]">ARTIKEL &amp; TIPS</span>
                            <h2 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight">Artikel Terbaru</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
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
                <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
                    <div className="relative overflow-hidden rounded-[28px] bg-[#2547F9] p-10 text-center shadow-[0_30px_70px_rgba(37,71,249,.28)] md:p-16">
                        <div className="pointer-events-none absolute -top-[40%] -right-[10%] size-[340px] rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-[50%] -left-[8%] size-[300px] rounded-full bg-white/[.08]" />
                        <div className="relative">
                            <h2 className="mx-auto max-w-[640px] text-[clamp(28px,4.4vw,44px)] font-extrabold tracking-tight text-white">
                                Siap Melindungi Mobil Kesayangan Anda?
                            </h2>
                            <p className="mx-auto mt-4.5 max-w-[520px] text-[clamp(15px,2vw,18px)] leading-relaxed text-white/85">
                                Konsultasikan tipe mobil Anda, kami bantu pilihkan cover yang paling pas. Respon cepat via WhatsApp.
                            </p>
                            <a
                                href={waGeneral}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#2547F9] shadow-[0_16px_34px_rgba(0,0,0,.18)] hover:-translate-y-0.5"
                            >
                                <WhatsAppIcon size={22} />
                                Pesan Sekarang via WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* KONTAK */}
                <section id="kontak" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
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

                {/* FOOTER */}
                <footer className="relative overflow-hidden bg-white text-[#475569]">
                    <div className="pointer-events-none absolute -top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(37,71,249,.16),transparent_70%)] blur-[60px]" />
                    <div className="relative mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 px-6 pt-14 md:pt-18">
                        <div className="max-w-[300px]">
                            <div className="mb-4 flex items-center">
                                {settings?.logo_path ? (
                                    <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-14 w-auto object-contain" />
                                ) : (
                                    <span className="flex size-14 items-center justify-center rounded-[14px] bg-[#2547F9]">
                                        <Truck size={26} className="text-white" />
                                    </span>
                                )}
                            </div>
                            <p className="text-sm leading-relaxed text-[#64748b]">
                                {settings?.tagline ?? 'Spesialis cover mobil custom presisi untuk semua tipe kendaraan di Indonesia.'}
                            </p>
                            {socialLinks.length > 0 && (
                                <div className="mt-5 flex gap-2.5">
                                    {socialLinks.map((s, i) => (
                                        <a
                                            key={i}
                                            href={s.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex size-[38px] items-center justify-center rounded-xl border border-gray-200 bg-white text-[#475569] hover:border-[#2547F9] hover:bg-[#2547F9] hover:text-white"
                                        >
                                            <s.icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Menu</h4>
                            <div className="flex flex-col gap-3 text-sm">
                                {navLinks.map((link) => (
                                    <a key={link.href} href={link.href} className="text-[#64748b] hover:text-[#2547F9]">
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Kontak</h4>
                            <div className="flex flex-col gap-3.5 text-sm leading-relaxed text-[#64748b]">
                                {settings?.address && (
                                    <div className="flex gap-2.5">
                                        <MapPin size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />
                                        {settings.address}
                                    </div>
                                )}
                                {waNumber && (
                                    <a href={waGeneral} target="_blank" rel="noreferrer" className="flex gap-2.5 text-[#64748b] hover:text-[#2547F9]">
                                        <Phone size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />+{waNumber}
                                    </a>
                                )}
                                <div className="flex gap-2.5">
                                    <Clock size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />
                                    Senin–Sabtu, 08.00–20.00 WIB
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Pesan Cepat</h4>
                            <p className="mb-4 text-sm leading-relaxed text-[#64748b]">Chat kami sekarang untuk konsultasi gratis &amp; penawaran terbaik.</p>
                            <a
                                href={waGeneral}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2547F9] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,71,249,.22)] hover:bg-[#1a35c9]"
                            >
                                <WhatsAppIcon size={18} />
                                WhatsApp Kami
                            </a>
                        </div>
                    </div>
                    <div className="relative mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-3 border-t border-gray-200 px-6 py-7 text-[13px] text-[#94a3b8]">
                        <span>{settings?.footer_text ?? `© ${new Date().getFullYear()} ${brandName}. Semua hak dilindungi.`}</span>
                        <span>Dibuat dengan ❤ untuk pecinta otomotif Indonesia</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
