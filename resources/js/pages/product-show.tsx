import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/storefront/icons';
import { SiteFooter } from '@/components/storefront/site-footer';
import { SiteHeader } from '@/components/storefront/site-header';
import { formatRupiah, waLink } from '@/lib/storefront';
import type { SiteSettings } from '@/lib/storefront';

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
    ogImage: string | null;
}

const stockLabel: Record<string, { text: string; color: string; bg: string }> = {
    in_stock: { text: 'Tersedia', color: '#15803D', bg: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
    out_of_stock: { text: 'Stok Habis', color: '#DC2626', bg: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
    preorder: { text: 'Preorder', color: '#B45309', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
};

export default function ProductShow({ settings, product, relatedProducts, ogImage }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';

    const sortedImages = [...product.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
    const [activeImage, setActiveImage] = useState(sortedImages[0]);

    const isOutOfStock = product.stock_status === 'out_of_stock';
    const stock = stockLabel[product.stock_status] ?? stockLabel.in_stock;

    const productWa = waLink(
        waNumber,
        `Halo ${brandName}, saya tertarik dengan ${product.name} (${formatRupiah(product.discount_price ?? product.price)}). Apakah produk ini masih tersedia? Mohon informasinya, terima kasih.`
    );

    const paragraphs = product.description ? product.description.split('\n\n') : [];

    const shareTitle = `${product.name} — ${brandName}`;
    const shareDescription = product.description
        ? product.description.replace(/\n+/g, ' ').slice(0, 160)
        : `${product.name} tersedia di ${brandName}.`;
    const shareImage = ogImage ?? undefined;

    return (
        <>
            <Head title={shareTitle}>
                <meta head-key="description" name="description" content={shareDescription} />
                <meta head-key="og:title" property="og:title" content={shareTitle} />
                <meta head-key="og:description" property="og:description" content={shareDescription} />
                <meta head-key="og:type" property="og:type" content="product" />
                {shareImage && <meta head-key="og:image" property="og:image" content={shareImage} />}
                <meta head-key="twitter:title" name="twitter:title" content={shareTitle} />
                <meta head-key="twitter:description" name="twitter:description" content={shareDescription} />
                {shareImage && <meta head-key="twitter:image" name="twitter:image" content={shareImage} />}
            </Head>

            <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <main className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    >
                        <Link
                            href="/produk"
                            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#94a3b8] transition-colors hover:text-[#2547F9]"
                        >
                            <ArrowLeft size={15} />
                            Kembali ke Katalog
                        </Link>
                    </motion.div>

                    <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* GALLERY */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        >
                            <div className="aspect-square w-full overflow-hidden rounded-[20px] border border-gray-100 bg-[#F3F4F6] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
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
                                <div className="mt-4 flex gap-3">
                                    {sortedImages.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(img)}
                                            className={`size-18 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                                activeImage?.id === img.id
                                                    ? 'border-[#2547F9] shadow-md shadow-[#2547F9]/10'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={`/storage/${img.path}`} alt="" className="size-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* INFO */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        >
                            {product.category && (
                                <span className="inline-flex rounded-full bg-[#eef1ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2547F9]">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="mt-4 text-[clamp(26px,3.4vw,38px)] leading-tight font-bold tracking-tight text-[#0f172a]">
                                {product.name}
                            </h1>

                            <div className="mt-4 flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${stock.bg}`}>
                                    <span className="size-1.5 rounded-full" style={{ background: stock.color }} />
                                    {stock.text}
                                </span>
                                {product.sku && <span className="text-[13px] text-gray-400">SKU {product.sku}</span>}
                            </div>

                            <div className="mt-6">
                                {product.discount_price ? (
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-extrabold text-[#0f172a]">{formatRupiah(product.discount_price)}</span>
                                        <span className="text-lg text-gray-400 line-through">{formatRupiah(product.price)}</span>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-extrabold text-[#0f172a]">{formatRupiah(product.price)}</div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-gray-600">
                                {paragraphs.length > 0 ? (
                                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                                ) : (
                                    <p className="text-gray-400">Belum ada deskripsi.</p>
                                )}
                            </div>

                            {isOutOfStock ? (
                                <div className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100/70 py-3.5 text-[14px] font-semibold text-gray-400 backdrop-blur-sm md:w-auto md:px-10">
                                    <CheckCircle2 size={17} />
                                    Stok Habis
                                </div>
                            ) : (
                                <a
                                    href={productWa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2547F9] py-3.5 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(37,71,249,0.3)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#1e3ce0] hover:shadow-[0_4px_12px_rgba(37,71,249,0.25)] active:translate-y-0 active:scale-[0.98] md:w-auto md:px-10"
                                >
                                    <WhatsAppIcon size={20} />
                                    Pesan via WhatsApp
                                </a>
                            )}
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            className="mt-20"
                        >
                            <h2 className="mb-8 text-xl font-bold tracking-tight text-[#0f172a]">Produk Terkait</h2>
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                                {relatedProducts.map((rp) => {
                                    const rpImage = rp.images.find((img) => img.is_primary) ?? rp.images[0];

                                    return (
                                        <Link
                                            key={rp.id}
                                            href={`/produk/${rp.slug}`}
                                            className="group flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)]"
                                        >
                                            <div className="aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                                                {rpImage ? (
                                                    <img
                                                        src={`/storage/${rpImage.path}`}
                                                        alt={rp.name}
                                                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto produk</div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-[13px] leading-snug font-semibold text-[#0f172a] transition-colors duration-300 group-hover:text-[#2547F9]">
                                                    {rp.name}
                                                </h3>
                                                <div className="mt-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[#0f172a]">
                                                    {formatRupiah(rp.discount_price ?? rp.price)}
                                                    <ArrowRight size={13} className="text-[#2547F9] transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </main>

                <div className="mt-8">
                    <SiteFooter settings={settings} />
                </div>
            </div>
        </>
    );
}
