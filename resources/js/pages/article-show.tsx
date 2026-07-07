import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string | null;
    cover_image_path: string | null;
    published_at: string | null;
    author: { name: string } | null;
    articleCategory: { name: string } | null;
    tags: Tag[];
}

interface SiteSettings {
    brand_name: string;
    logo_path: string | null;
}

interface Props {
    settings: SiteSettings | null;
    article: Article;
}

export default function ArticleShow({ settings, article }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const paragraphs = article.body ? article.body.split('\n\n') : [];

    return (
        <>
            <Head title={`${article.title} — ${brandName}`} />

            <div className="min-h-screen bg-white text-[#1a1a1a]">
                <header className="border-b border-gray-200 bg-white/85 backdrop-blur-md">
                    <nav className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-5">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-[#2547F9]">
                            <ArrowLeft size={16} />
                            Kembali ke {brandName}
                        </Link>
                    </nav>
                </header>

                <article className="mx-auto max-w-3xl px-6 py-12">
                    {article.articleCategory && (
                        <span className="inline-flex rounded-full bg-[#EEF1FF] px-3 py-1 text-xs font-semibold text-[#2547F9]">
                            {article.articleCategory.name}
                        </span>
                    )}
                    <h1 className="mt-4 text-[clamp(28px,4.5vw,44px)] leading-tight font-extrabold tracking-tight">{article.title}</h1>

                    <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                        {article.author && (
                            <span className="inline-flex items-center gap-1.5">
                                <User size={15} />
                                {article.author.name}
                            </span>
                        )}
                        {article.published_at && (
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar size={15} />
                                {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {article.cover_image_path && (
                        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-[#F9FAFB]">
                            <img src={`/storage/${article.cover_image_path}`} alt={article.title} className="size-full object-cover" />
                        </div>
                    )}

                    <div className="mt-10 flex flex-col gap-5 text-[16px] leading-relaxed text-gray-700">
                        {paragraphs.length > 0 ? (
                            paragraphs.map((p, i) => <p key={i}>{p}</p>)
                        ) : (
                            <p className="text-gray-400">Belum ada konten.</p>
                        )}
                    </div>

                    {article.tags.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-200 pt-6">
                            {article.tags.map((tag) => (
                                <span key={tag.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </>
    );
}
