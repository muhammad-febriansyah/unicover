import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock, ArrowUpRight, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback } from 'react';
import { SiteFooter } from '@/components/storefront/site-footer';
import { SiteHeader } from '@/components/storefront/site-header';
import type {SiteSettings} from '@/lib/storefront';

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_path: string | null;
    published_at: string | null;
    articleCategory: ArticleCategory | null;
    views: number;
}

interface Props {
    settings: SiteSettings | null;
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
    };
    categories: ArticleCategory[];
    filters: { category?: string };
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function readingTime(text: string | null): string {
    if (!text) {
return '1 menit';
}

    const words = text.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));

    return `${mins} menit`;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) {
return '';
}

    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticlesIndex({ settings, articles, categories, filters }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const featured = articles.data[0];
    const rest = articles.data.slice(1);

    const visitFilters = useCallback((params: Record<string, string>) => {
        const query: Record<string, string> = {};

        for (const [k, v] of Object.entries(params)) {
            if (v) {
query[k] = v;
}
        }

        router.get('/artikel', query, { preserveState: true, preserveScroll: true, replace: true });
    }, []);

    return (
        <>
            <Head title={`Artikel & Tips — ${brandName}`} />

            <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <main className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        className="mb-10"
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">Artikel &amp; Tips</span>
                        <h1 className="mt-3 max-w-2xl text-[clamp(30px,4vw,48px)] leading-[1.1] font-bold tracking-tight text-[#0f172a]">
                            Wawasan, tips, dan panduan perawatan mobil
                        </h1>
                        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500">
                            {articles.total} artikel untuk membantu Anda merawat mobil dengan lebih baik.
                        </p>
                    </motion.div>

                    {/* Category pills */}
                    {categories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            className="mb-10 flex flex-wrap gap-2"
                        >
                            <button
                                onClick={() => visitFilters({ category: '' })}
                                className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                                    !filters.category
                                        ? 'bg-[#2547F9] text-white shadow-lg shadow-[#2547F9]/20'
                                        : 'bg-white text-[#334155] shadow-sm hover:shadow-md border border-gray-100'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => visitFilters({ category: cat.slug })}
                                    className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                                        filters.category === cat.slug
                                            ? 'bg-[#2547F9] text-white shadow-lg shadow-[#2547F9]/20'
                                            : 'bg-white text-[#334155] shadow-sm hover:shadow-md border border-gray-100'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Featured article */}
                    {featured && !filters.category && articles.current_page === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-14"
                        >
                            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">Featured</span>
                            <Link
                                href={`/artikel/${featured.slug}`}
                                className="group grid overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2"
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[#F3F4F6] md:aspect-auto">
                                    {featured.cover_image_path ? (
                                        <img
                                            src={`/storage/${featured.cover_image_path}`}
                                            alt={featured.title}
                                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-sm text-gray-400">Foto artikel</div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    <div className="mb-4 flex items-center gap-3 text-[13px] text-gray-500">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar size={14} strokeWidth={1.5} />
                                            {formatDate(featured.published_at)}
                                        </span>
                                        <span className="text-gray-300">·</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock size={14} strokeWidth={1.5} />
                                            {readingTime(featured.excerpt)}
                                        </span>
                                        {featured.articleCategory && (
                                            <>
                                                <span className="text-gray-300">·</span>
                                                <span className="rounded-full bg-[#eef1ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2547F9]">
                                                    {featured.articleCategory.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <h2 className="text-[clamp(22px,2.5vw,30px)] leading-tight font-bold tracking-tight text-[#0f172a] transition-colors duration-300 group-hover:text-[#2547F9]">
                                        {featured.title}
                                    </h2>
                                    <p className="mt-4 text-[15px] leading-relaxed text-gray-500">{featured.excerpt}</p>
                                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2547F9] transition-transform duration-300 group-hover:translate-x-1">
                                        Baca selengkapnya <ArrowRight size={15} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Grid */}
                    {articles.data.length === 0 ? (
                        <div className="mt-20 flex flex-col items-center justify-center py-24">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
                                <Calendar size={24} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700">Belum ada artikel</p>
                            <p className="mt-1 text-sm text-gray-400">Nantikan update artikel terbaru dari kami.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {(filters.category || articles.current_page > 1 ? articles.data : rest).map((article) => (
                                <motion.div key={article.id} variants={itemVariants}>
                                    <Link
                                        href={`/artikel/${article.slug}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)] hover:-translate-y-1"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden bg-[#F3F4F6]">
                                            {article.cover_image_path ? (
                                                <img
                                                    src={`/storage/${article.cover_image_path}`}
                                                    alt={article.title}
                                                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center text-xs text-gray-400">Foto artikel</div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-3 flex items-center gap-2.5 text-[12px] text-gray-400">
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar size={12} strokeWidth={1.5} />
                                                    {article.published_at &&
                                                        new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                {article.articleCategory && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="text-gray-500">{article.articleCategory.name}</span>
                                                    </>
                                                )}
                                                <span>·</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Eye size={12} strokeWidth={1.5} />
                                                    {article.views.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <h3 className="mb-2 text-[17px] leading-snug font-bold tracking-tight text-[#0f172a] transition-colors duration-300 group-hover:text-[#2547F9]">
                                                {article.title}
                                            </h3>
                                            <p className="mb-4 flex-1 text-[13.5px] leading-relaxed text-gray-500 line-clamp-3">{article.excerpt}</p>
                                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2547F9] transition-transform duration-300 group-hover:translate-x-1">
                                                Baca selengkapnya <ArrowUpRight size={13} />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {articles.last_page > 1 && (
                        <div className="mt-16 flex items-center justify-between border-t border-gray-100 pt-8">
                            <div className="text-[13px] text-gray-400">
                                Menampilkan <span className="font-semibold text-gray-700">{articles.from}-{articles.to}</span> dari{' '}
                                <span className="font-semibold text-gray-700">{articles.total}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: articles.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => visitFilters({ category: filters.category ?? '', page: String(page) })}
                                        className={`flex size-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                                            page === articles.current_page
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
