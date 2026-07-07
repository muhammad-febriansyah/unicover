import { Head, Link, router } from '@inertiajs/react';
import { useCallback } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { SiteHeader } from '@/components/storefront/site-header';
import { SiteFooter } from '@/components/storefront/site-footer';
import { type SiteSettings } from '@/lib/storefront';

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

export default function ArticlesIndex({ settings, articles, categories, filters }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';

    const visitFilters = useCallback((params: Record<string, string>) => {
        const query: Record<string, string> = {};
        for (const [k, v] of Object.entries(params)) {
            if (v) query[k] = v;
        }
        router.get('/artikel', query, { preserveState: true, preserveScroll: true, replace: true });
    }, []);

    return (
        <>
            <Head title={`Artikel & Tips — ${brandName}`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <section className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                    <div className="mb-10 text-center">
                        <span className="text-sm font-semibold tracking-wide text-[#2547F9]">ARTIKEL &amp; TIPS</span>
                        <h1 className="mt-2 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight">Semua Artikel {brandName}</h1>
                        <p className="mx-auto mt-3 max-w-[520px] text-[15px] text-gray-500">{articles.total} artikel tips &amp; perawatan mobil.</p>
                    </div>

                    {categories.length > 0 && (
                        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
                            <button
                                onClick={() => visitFilters({ category: '' })}
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                    !filters.category ? 'bg-[#2547F9] text-white' : 'border border-gray-200 text-[#334155] hover:border-[#2547F9]'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => visitFilters({ category: cat.slug })}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                        filters.category === cat.slug
                                            ? 'bg-[#2547F9] text-white'
                                            : 'border border-gray-200 text-[#334155] hover:border-[#2547F9]'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {articles.data.length === 0 ? (
                        <p className="py-16 text-center text-sm text-gray-500">Belum ada artikel.</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                            {articles.data.map((article) => (
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
                    )}

                    {articles.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-between">
                            <div className="text-[13px] text-gray-500">
                                Menampilkan {articles.from}-{articles.to} dari {articles.total}
                            </div>
                            <div className="flex gap-2">
                                {Array.from({ length: articles.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => visitFilters({ category: filters.category ?? '', page: String(page) })}
                                        className={`flex size-9 items-center justify-center rounded-lg text-[13px] font-semibold ${
                                            page === articles.current_page
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
