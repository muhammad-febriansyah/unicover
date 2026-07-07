import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
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

export default function ProductsIndex({ settings, products, categories, filters }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';

    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visitFilters = useCallback((params: Record<string, string>) => {
        const query: Record<string, string> = {};
        for (const [k, v] of Object.entries(params)) {
            if (v) query[k] = v;
        }
        router.get('/produk', query, { preserveState: true, preserveScroll: true, replace: true });
    }, []);

    const onSearchChange = (value: string) => {
        setSearchValue(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            visitFilters({ search: value, category: filters.category ?? '' });
        }, 400);
    };

    return (
        <>
            <Head title={`Katalog Produk — ${brandName}`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <section className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <div className="mb-10 text-center">
                        <span className="text-sm font-semibold tracking-wide text-[#2547F9]">KATALOG PRODUK</span>
                        <h1 className="mt-2 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">Semua Produk {brandName}</h1>
                        <p className="mx-auto mt-3 max-w-[520px] text-[15px] text-gray-500">
                            {products.total} produk tersedia. Klik &quot;Pesan&quot; untuk order langsung via WhatsApp.
                        </p>
                    </div>

                    <div className="mb-10 flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[240px] flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Cari nama produk..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pr-4 pl-10 text-sm text-[#1a1a1a] focus:border-[#2547F9] focus:outline-none"
                            />
                        </div>
                        <select
                            defaultValue={filters.category ?? ''}
                            onChange={(e) => visitFilters({ search: searchValue, category: e.target.value })}
                            className="h-11 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm font-medium text-[#1a1a1a] focus:border-[#2547F9] focus:outline-none"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {products.data.length === 0 ? (
                        <p className="py-16 text-center text-sm text-gray-500">Tidak ada produk yang cocok.</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
                            {products.data.map((product) => {
                                const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
                                const isOutOfStock = product.stock_status === 'out_of_stock';
                                const isPreorder = product.stock_status === 'preorder';
                                const productWa = waLink(
                                    waNumber,
                                    `Halo ${brandName}, saya tertarik memesan ${product.name} (${formatRupiah(product.discount_price ?? product.price)}). Apakah masih tersedia?`
                                );

                                return (
                                    <CardContainer key={product.id} containerClassName="py-0">
                                        <CardBody className="h-auto w-full flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(17,24,39,.05)] hover:shadow-[0_20px_44px_rgba(37,71,249,.12)]">
                                            <CardItem as={Link} href={`/produk/${product.slug}`} translateZ={60} className="relative block aspect-[4/3] w-full bg-[#F9FAFB]">
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
                                                <Link href={`/produk/${product.slug}`} className="mt-3 block text-base leading-snug font-semibold tracking-tight hover:text-[#2547F9]">
                                                    {product.name}
                                                </Link>
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

                    {products.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-between">
                            <div className="text-[13px] text-gray-500">
                                Menampilkan {products.from}-{products.to} dari {products.total}
                            </div>
                            <div className="flex gap-2">
                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => visitFilters({ search: searchValue, category: filters.category ?? '', page: String(page) })}
                                        className={`flex size-9 items-center justify-center rounded-lg text-[13px] font-semibold ${
                                            page === products.current_page
                                                ? 'bg-[#2547F9] text-white'
                                                : 'border border-gray-200 text-[#334155] hover:border-[#2547F9]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <SiteFooter settings={settings} />
            </div>
        </>
    );
}
