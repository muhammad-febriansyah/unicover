import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/storefront/site-header';
import { SiteFooter } from '@/components/storefront/site-footer';
import { WhatsAppIcon } from '@/components/storefront/icons';
import { type SiteSettings, formatRupiah, waLink } from '@/lib/storefront';

interface Category {
    id: number;
    name: string;
    slug: string;
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
    description: string | null;
    price: string | number;
    discount_price: string | number | null;
    sku: string | null;
    stock_status: string;
    is_featured: boolean;
    category: Category | null;
    images: ProductImage[];
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    discount_price: string | number | null;
    images: ProductImage[];
}

interface Props {
    settings: SiteSettings | null;
    product: Product;
    relatedProducts: RelatedProduct[];
}

const stockLabel: Record<string, { text: string; color: string }> = {
    in_stock: { text: 'Tersedia', color: '#15803D' },
    out_of_stock: { text: 'Stok Habis', color: '#DC2626' },
    preorder: { text: 'Preorder', color: '#B45309' },
};

export default function ProductShow({ settings, product, relatedProducts }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';

    const sortedImages = [...product.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
    const [activeImage, setActiveImage] = useState(sortedImages[0]);

    const isOutOfStock = product.stock_status === 'out_of_stock';
    const stock = stockLabel[product.stock_status] ?? stockLabel.in_stock;

    const productWa = waLink(
        waNumber,
        `Halo ${brandName}, saya tertarik memesan ${product.name} (${formatRupiah(product.discount_price ?? product.price)}). Apakah masih tersedia?`
    );

    const paragraphs = product.description ? product.description.split('\n\n') : [];

    return (
        <>
            <Head title={`${product.name} — ${brandName}`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <section className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <Link href="/produk" className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#2547F9]">
                        <ArrowLeft size={16} />
                        Kembali ke Katalog
                    </Link>

                    <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* GALLERY */}
                        <div>
                            <div className="aspect-square w-full overflow-hidden rounded-[24px] border border-gray-200 bg-[#F9FAFB] shadow-[0_10px_30px_rgba(17,24,39,.05)]">
                                {activeImage ? (
                                    <img
                                        src={`/storage/${activeImage.path}`}
                                        alt={product.name}
                                        className={`size-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-sm text-gray-400">Foto produk</div>
                                )}
                            </div>
                            {sortedImages.length > 1 && (
                                <div className="mt-3 flex gap-3">
                                    {sortedImages.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(img)}
                                            className={`size-16 overflow-hidden rounded-xl border-2 ${
                                                activeImage?.id === img.id ? 'border-[#2547F9]' : 'border-transparent'
                                            }`}
                                        >
                                            <img src={`/storage/${img.path}`} alt="" className="size-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* INFO */}
                        <div>
                            {product.category && (
                                <span className="inline-flex rounded-full bg-[#EEF1FF] px-3 py-1 text-xs font-semibold text-[#2547F9]">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="mt-4 text-[clamp(26px,3.4vw,38px)] leading-tight font-extrabold tracking-tight">{product.name}</h1>

                            <div className="mt-3 flex items-center gap-2.5">
                                <span className="size-1.5 rounded-full" style={{ background: stock.color }} />
                                <span className="text-sm font-semibold" style={{ color: stock.color }}>
                                    {stock.text}
                                </span>
                                {product.sku && <span className="text-sm text-gray-400">· SKU {product.sku}</span>}
                            </div>

                            <div className="mt-5">
                                {product.discount_price ? (
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-extrabold">{formatRupiah(product.discount_price)}</span>
                                        <span className="text-lg text-gray-400 line-through">{formatRupiah(product.price)}</span>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-extrabold">{formatRupiah(product.price)}</div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 text-[15px] leading-relaxed text-gray-600">
                                {paragraphs.length > 0 ? (
                                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                                ) : (
                                    <p className="text-gray-400">Belum ada deskripsi.</p>
                                )}
                            </div>

                            {isOutOfStock ? (
                                <span className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 p-4 text-base font-semibold text-gray-400 md:w-auto md:px-8">
                                    Stok Habis
                                </span>
                            ) : (
                                <a
                                    href={productWa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#2547F9] p-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,71,249,.28)] hover:bg-[#1a35c9] md:w-auto md:px-8"
                                >
                                    <WhatsAppIcon size={20} />
                                    Pesan via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="mt-20">
                            <h2 className="mb-8 text-xl font-bold tracking-tight">Produk Terkait</h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
                                {relatedProducts.map((rp) => {
                                    const rpImage = rp.images.find((img) => img.is_primary) ?? rp.images[0];
                                    return (
                                        <Link
                                            key={rp.id}
                                            href={`/produk/${rp.slug}`}
                                            className="flex flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_8px_24px_rgba(17,24,39,.04)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(37,71,249,.1)]"
                                        >
                                            <div className="aspect-[4/3] bg-[#F9FAFB]">
                                                {rpImage ? (
                                                    <img src={`/storage/${rpImage.path}`} alt={rp.name} className="size-full object-cover" />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto produk</div>
                                                )}
                                            </div>
                                            <div className="p-3.5">
                                                <h3 className="text-sm leading-snug font-semibold">{rp.name}</h3>
                                                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold">
                                                    {formatRupiah(rp.discount_price ?? rp.price)}
                                                    <ArrowRight size={13} className="text-[#2547F9]" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                <SiteFooter settings={settings} />
            </div>
        </>
    );
}
