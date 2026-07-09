import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Clock, ArrowRight, Eye, Facebook, Twitter, Link2, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SiteFooter } from '@/components/storefront/site-footer';
import { SiteHeader } from '@/components/storefront/site-header';
import { WhatsAppIcon } from '@/components/storefront/icons';
import type { SiteSettings } from '@/lib/storefront';

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
    views: number;
}

interface Props {
    settings: SiteSettings | null;
    article: Article;
    ogImage: string | null;
}

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

function ShareButtons({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const links = [
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            icon: <WhatsAppIcon size={16} />,
            href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
            className: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
        },
        {
            key: 'facebook',
            label: 'Facebook',
            icon: <Facebook size={16} strokeWidth={1.75} />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            className: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
        },
        {
            key: 'twitter',
            label: 'X',
            icon: <Twitter size={16} strokeWidth={1.75} />,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            className: 'hover:bg-black hover:text-white hover:border-black',
        },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Tautan disalin');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Gagal menyalin tautan');
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Bagikan</span>
            {links.map((l) => (
                <a
                    key={l.key}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Bagikan ke ${l.label}`}
                    className={`flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors duration-200 ${l.className}`}
                >
                    {l.icon}
                </a>
            ))}
            <button
                type="button"
                onClick={handleCopy}
                aria-label="Salin tautan"
                className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors duration-200 hover:border-[#2547F9] hover:bg-[#2547F9] hover:text-white"
            >
                {copied ? <Check size={16} /> : <Link2 size={16} strokeWidth={1.75} />}
            </button>
        </div>
    );
}

export default function ArticleShow({ settings, article, ogImage }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';

    const shareTitle = `${article.title} — ${brandName}`;
    const shareDescription = article.excerpt ?? `${article.title} — ${brandName}`;

    return (
        <>
            <Head title={shareTitle}>
                <meta head-key="description" name="description" content={shareDescription} />
                <meta head-key="og:title" property="og:title" content={shareTitle} />
                <meta head-key="og:description" property="og:description" content={shareDescription} />
                <meta head-key="og:type" property="og:type" content="article" />
                {ogImage && <meta head-key="og:image" property="og:image" content={ogImage} />}
                <meta head-key="twitter:title" name="twitter:title" content={shareTitle} />
                <meta head-key="twitter:description" name="twitter:description" content={shareDescription} />
                {ogImage && <meta head-key="twitter:image" name="twitter:image" content={ogImage} />}
            </Head>

            <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
                <SiteHeader settings={settings} />

                <article className="relative mx-auto max-w-3xl px-6 pt-16 pb-16 md:pt-24 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/artikel"
                            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#94a3b8] transition-colors hover:text-[#2547F9]"
                        >
                            <ArrowLeft size={15} />
                            Kembali ke Artikel
                        </Link>

                        {article.articleCategory && (
                            <span className="mt-5 inline-flex rounded-full bg-[#eef1ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2547F9]">
                                {article.articleCategory.name}
                            </span>
                        )}

                        <h1 className="mt-4 text-[clamp(28px,4.5vw,48px)] leading-[1.1] font-bold tracking-tight text-[#0f172a]">
                            {article.title}
                        </h1>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-gray-500">
                            {article.author && (
                                <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                                    <User size={14} strokeWidth={1.5} />
                                    {article.author.name}
                                </span>
                            )}
                            {article.published_at && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar size={14} strokeWidth={1.5} />
                                    {formatDate(article.published_at)}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <Clock size={14} strokeWidth={1.5} />
                                {readingTime(article.body)} baca
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Eye size={14} strokeWidth={1.5} />
                                {article.views.toLocaleString('id-ID')} dilihat
                            </span>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4">
                            <ShareButtons title={article.title} />
                        </div>
                    </motion.div>

                    {/* Hero image */}
                    {article.cover_image_path && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8 overflow-hidden rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                        >
                            <img
                                src={`/storage/${article.cover_image_path}`}
                                alt={article.title}
                                className="aspect-[16/9] w-full object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Body */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 text-[16.5px] leading-[1.75] text-[#334155]"
                    >
                        {article.body ? (
                            <div className="rich-text" dangerouslySetInnerHTML={{ __html: article.body }} />
                        ) : (
                            <p className="text-gray-400">Belum ada konten.</p>
                        )}
                    </motion.div>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-12 flex flex-wrap gap-2 border-t border-gray-100 pt-8"
                        >
                            <span className="mr-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Tags:</span>
                            {article.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-full border border-gray-200 bg-white px-3.5 py-1 text-[12px] font-medium text-gray-600 transition-colors hover:border-[#2547F9] hover:text-[#2547F9]"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </motion.div>
                    )}

                    {/* Author card */}
                    {article.author && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="mt-10 flex items-center gap-4 rounded-[16px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#2547F9]">
                                <User size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold text-[#0f172a]">{article.author.name}</p>
                                <p className="text-[12px] text-gray-500">Penulis artikel</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Back to articles CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-14 text-center"
                    >
                        <Link
                            href="/artikel"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2547F9] px-7 py-3 text-[13px] font-semibold text-white shadow-lg shadow-[#2547F9]/20 transition-all duration-300 hover:bg-[#1e3ce0] hover:shadow-xl hover:shadow-[#2547F9]/25"
                        >
                            Lihat artikel lainnya <ArrowRight size={15} />
                        </Link>
                    </motion.div>
                </article>

                <div className="mt-8">
                    <SiteFooter settings={settings} />
                </div>
            </div>
        </>
    );
}
