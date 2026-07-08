import { Head, Link, router } from '@inertiajs/react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { SiteFooter } from '@/components/storefront/site-footer';
import { SiteHeader } from '@/components/storefront/site-header';
import { formatRupiah } from '@/lib/storefront';
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
    price: string | number;
    discount_price: string | number | null;
    is_featured: boolean;
    stock_status: string;
    created_at: string;
    category: Category | null;
    images: ProductImage[];
}

interface Props {
    settings: SiteSettings | null;
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
    categories: Category[];
    filters: { search?: string; category?: string };
}

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function ProductsIndex({ settings, products, categories, filters }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';


    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visitFilters = useCallback((params: Record<string, string>) => {
        const query: Record<string, string> = {};

        for (const [k, v] of Object.entries(params)) {
            if (v) {
                query[k] = v;
            }
        }

        router.get('/produk', query, { preserveState: true, preserveScroll: true, replace: true });
    }, []);

    const onSearchChange = (value: string) => {
        setSearchValue(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            visitFilters({ search: value, category: filters.category ?? '' });
        }, 400);
    };

    const clearSearch = () => {
        setSearchValue('');

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        visitFilters({ search: '', category: filters.category ?? '' });
    };

    const onCategoryClick = (slug: string) => {
        visitFilters({ search: searchValue, category: slug });
    };

    const hasActiveFilters = Boolean(filters.search || filters.category);

    const clearAllFilters = () => {
        setSearchValue('');

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        visitFilters({});
    };

    const featured = products.data.find((p) => p.is_featured);
    const gridProducts = featured ? products.data.filter((p) => p.id !== featured.id) : products.data;

    return (
        <>
            <Head title={`Katalog Produk — ${brandName}`} />

            <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <main className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        className="mb-10"
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">Katalog Produk</span>
                        <h1 className="mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] leading-[1.1] font-bold tracking-tight text-[#0f172a]">
                            Temukan cover mobil terbaik untuk Anda
                        </h1>
                        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500">
                            {products.total} produk berkualitas. Pilih, lihat detail, dan pesan langsung via WhatsApp.
                        </p>
                    </motion.div>

                    {/* Search & Filter bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        className="mb-10 rounded-[20px] border border-gray-100 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] md:p-5"
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[200px] flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
                                <input
                                    value={searchValue}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="h-12 w-full rounded-xl border border-gray-200/70 bg-[#fafafa] pr-10 pl-11 text-[14px] text-[#1a1a1a] transition-all duration-200 placeholder:text-gray-400/70 focus:border-[#2547F9]/40 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#2547F9]/10"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="Hapus pencarian"
                                        className="absolute top-1/2 right-3.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-600"
                                    >
                                        <X size={13} strokeWidth={2} />
                                    </button>
                                )}
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="h-12 shrink-0 rounded-xl px-4 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Reset filter
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                onClick={() => onCategoryClick('')}
                                className={`rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                                    !filters.category
                                        ? 'bg-[#2547F9] text-white shadow-md shadow-[#2547F9]/20'
                                        : 'bg-[#f3f4f6] text-gray-600 hover:bg-[#eef1ff] hover:text-[#2547F9]'
                                }`}
                            >
                                Semua Kategori
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onCategoryClick(cat.slug)}
                                    className={`rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                                        filters.category === cat.slug
                                            ? 'bg-[#2547F9] text-white shadow-md shadow-[#2547F9]/20'
                                            : 'bg-[#f3f4f6] text-gray-600 hover:bg-[#eef1ff] hover:text-[#2547F9]'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Featured product */}
                    {featured && !filters.search && !filters.category && products.current_page === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            className="mt-14"
                        >
                            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">Featured</span>
                            <Link
                                href={`/produk/${featured.slug}`}
                                className="group grid overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-[#F3F4F6] md:aspect-auto">
                                    {(() => {
                                        const img = featured.images.find((i) => i.is_primary) ?? featured.images[0];

                                        return img ? (
                                            <img
                                                src={`/storage/${img.path}`}
                                                alt={featured.name}
                                                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center text-sm text-gray-400">Foto produk</div>
                                        );
                                    })()}
                                </div>
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    {featured.category && (
                                        <span className="mb-3 inline-flex self-start rounded-full bg-[#eef1ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2547F9]">
                                            {featured.category.name}
                                        </span>
                                    )}
                                    <h2 className="text-[clamp(22px,2.5vw,30px)] leading-tight font-bold tracking-tight text-[#0f172a] transition-colors duration-300 group-hover:text-[#2547F9]">
                                        {featured.name}
                                    </h2>
                                    <div className="mt-4">
                                        {featured.discount_price ? (
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-2xl font-extrabold text-[#0f172a]">{formatRupiah(featured.discount_price)}</span>
                                                <span className="text-sm text-gray-400 line-through">{formatRupiah(featured.price)}</span>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-extrabold text-[#0f172a]">{formatRupiah(featured.price)}</div>
                                        )}
                                    </div>
                                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2547F9] transition-transform duration-300 group-hover:translate-x-1">
                                        Lihat detail <ArrowUpRight size={15} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Product Grid */}
                    {products.data.length === 0 ? (
                        <div className="mt-20 flex flex-col items-center justify-center py-24">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700">Tidak ada produk</p>
                            <p className="mt-1 text-sm text-gray-400">Coba ubah kata kunci atau filter kategori.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {(filters.search || filters.category || products.current_page > 1 ? products.data : gridProducts).map((product) => {
                                const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
                                const isOutOfStock = product.stock_status === 'out_of_stock';
                                const isPreorder = product.stock_status === 'preorder';

                                return (
                                    <motion.div key={product.id} variants={itemVariants}>
                                        <Link
                                            href={`/produk/${product.slug}`}
                                            className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)]"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                                                {primaryImage ? (
                                                    <img
                                                        src={`/storage/${primaryImage.path}`}
                                                        alt={product.name}
                                                        className={`size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto produk</div>
                                                )}
                                                {isOutOfStock ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-gray-700/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                                        Stok Habis
                                                    </span>
                                                ) : product.is_featured ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-[#2547F9] px-2.5 py-1 text-[11px] font-semibold text-white shadow-md shadow-[#2547F9]/20">
                                                        Best Seller
                                                    </span>
                                                ) : isPreorder ? (
                                                    <span className="absolute top-3 left-3 rounded-full bg-[#B45309] px-2.5 py-1 text-[11px] font-semibold text-white">
                                                        Preorder
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="flex flex-1 flex-col p-5">
                                                {product.category && (
                                                    <span className="mb-2 inline-flex self-start rounded-full bg-[#eef1ff] px-2 py-0.5 text-[11px] font-semibold text-[#2547F9]">
                                                        {product.category.name}
                                                    </span>
                                                )}
                                                <h3 className="mb-2 text-[15px] leading-snug font-bold tracking-tight text-[#0f172a] transition-colors duration-300 group-hover:text-[#2547F9]">
                                                    {product.name}
                                                </h3>
                                                <div className="mt-auto pt-2">
                                                    {product.discount_price ? (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg font-extrabold text-[#0f172a]">{formatRupiah(product.discount_price)}</span>
                                                            <span className="text-xs text-gray-400 line-through">{formatRupiah(product.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-lg font-extrabold text-[#0f172a]">{formatRupiah(product.price)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="mt-16 flex items-center justify-between border-t border-gray-100 pt-8">
                            <div className="text-[13px] text-gray-400">
                                Menampilkan <span className="font-semibold text-gray-700">{products.from}-{products.to}</span> dari{' '}
                                <span className="font-semibold text-gray-700">{products.total}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => visitFilters({ search: searchValue, category: filters.category ?? '', page: String(page) })}
                                        className={`flex size-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                                            page === products.current_page
                                                ? 'bg-[#2547F9] text-white shadow-md shadow-[#2547F9]/15'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <div className="mt-20">
                    <SiteFooter settings={settings} />
                </div>
            </div>
        </>
    );
}
