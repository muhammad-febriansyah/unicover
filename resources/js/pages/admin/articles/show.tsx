import { Head, Link, useForm } from '@inertiajs/react';
import {
    Pencil,
    Trash2,
    FileText,
    User,
    Tag,
    Calendar,
    BarChart3,
    CheckCircle,
    Clock,
    Star,
    ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface UserModel {
    id: number;
    name: string;
}

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
}

interface TagModel {
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
    is_published: boolean;
    published_at: string | null;
    author: UserModel | null;
    article_category: ArticleCategory | null;
    tags: TagModel[];
    created_at: string;
    updated_at: string;
}

interface Props {
    article: Article;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ArticleShow({ article }: Props) {
    const { delete: destroy } = useForm();
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <Head title={article.title} />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Artikel', href: '/admin/articles' },
                        { label: article.title },
                    ]}
                    title={article.title}
                    description={`Slug: ${article.slug}`}
                >
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={15} />
                            Edit Artikel
                        </Link>
                        <button
                            onClick={() => setDeleteOpen(true)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                                "bg-[#DC2626] hover:bg-[#B91C1C]"
                            )}
                        >
                            <Trash2 size={15} />
                            Hapus
                        </button>
                    </div>
                </PageHeader>

                {/* layout 2 col */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18 }}>
                    {/* left: cover + content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* cover image */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ padding: '20px 20px 12px' }}>
                                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Cover Artikel</h2>
                            </div>
                            <div style={{ padding: '0 20px 20px' }}>
                                {article.cover_image_path ? (
                                    <div
                                        style={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            borderRadius: 12,
                                            background: `url(/storage/${article.cover_image_path}) center/cover`,
                                            border: '1px solid #F1F5F9',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            borderRadius: 12,
                                            background: '#F8FAFC',
                                            border: '1px dashed #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#94A3B8',
                                            fontSize: 13,
                                            fontWeight: 500,
                                        }}
                                    >
                                        <FileText size={24} style={{ marginRight: 8 }} />
                                        Tidak ada cover
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* excerpt */}
                        {article.excerpt && (
                            <div
                                style={{
                                    background: '#FAFBFC',
                                    border: '1px solid #ECEDF1',
                                    borderRadius: 14,
                                    padding: '18px 20px',
                                }}
                            >
                                <h3 style={{ margin: '0 0 8px', fontSize: 12.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                                    Ringkasan
                                </h3>
                                <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.6 }}>{article.excerpt}</p>
                            </div>
                        )}

                        {/* body */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ padding: '20px 20px 12px' }}>
                                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Konten</h2>
                            </div>
                            <div style={{ padding: '0 20px 20px' }}>
                                {article.body ? (
                                    <div
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: article.body }}
                                    />
                                ) : (
                                    <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Tidak ada konten.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* right: info cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* status */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                padding: '18px 20px',
                                boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: article.is_published ? '#F0FDF4' : '#F1F5F9',
                                        color: article.is_published ? '#16A34A' : '#64748B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <BarChart3 size={16} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Status</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '4px 10px',
                                        borderRadius: 20,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background: article.is_published ? '#F0FDF4' : '#F1F5F9',
                                        color: article.is_published ? '#15803D' : '#64748B',
                                        border: `1px solid ${article.is_published ? '#BBF7D0' : '#E2E8F0'}`,
                                    }}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: article.is_published ? '#15803D' : '#64748B' }} />
                                    {article.is_published ? 'Terbit' : 'Draft'}
                                </span>
                                {article.is_published && article.published_at && (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: '4px 10px',
                                            borderRadius: 20,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: '#FFFBEB',
                                            color: '#D97706',
                                            border: '1px solid #FDE68A',
                                        }}
                                    >
                                        <Calendar size={10} />
                                        {formatDate(article.published_at)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* author */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                padding: '18px 20px',
                                boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: '#EEF2FF',
                                        color: '#2547F9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <User size={16} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Penulis</span>
                            </div>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>
                                {article.author?.name ?? 'Tidak diketahui'}
                            </span>
                        </div>

                        {/* category */}
                        <div
                            style={{
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                padding: '18px 20px',
                                boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: '#F5F0FE',
                                        color: '#7C3AED',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Tag size={16} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Kategori</span>
                            </div>
                            {article.article_category ? (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#7C3AED',
                                        background: '#F5F0FE',
                                        padding: '5px 12px',
                                        borderRadius: 8,
                                    }}
                                >
                                    {article.article_category.name}
                                </span>
                            ) : (
                                <span style={{ fontSize: 13, color: '#94A3B8' }}>Tanpa kategori</span>
                            )}
                        </div>

                        {/* tags */}
                        {article.tags.length > 0 && (
                            <div
                                style={{
                                    background: '#fff',
                                    border: '1px solid #ECEDF1',
                                    borderRadius: 14,
                                    padding: '18px 20px',
                                    boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: '#F0F9FF',
                                            color: '#0891B2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Star size={16} />
                                    </div>
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Tag</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            style={{
                                                fontSize: 11.5,
                                                fontWeight: 600,
                                                color: '#0891B2',
                                                background: '#F0F9FF',
                                                padding: '3px 10px',
                                                borderRadius: 20,
                                                border: '1px solid #CFFAFE',
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* meta */}
                        <div
                            style={{
                                background: '#FAFBFC',
                                border: '1px solid #ECEDF1',
                                borderRadius: 14,
                                padding: '16px 20px',
                            }}
                        >
                            <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>
                                Dibuat: {formatDateTime(article.created_at)}
                            </div>
                            <div style={{ fontSize: 12, color: '#94A3B8' }}>
                                Diperbarui: {formatDateTime(article.updated_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* delete confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Artikel <strong>{article.title}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                destroy(`/admin/articles/${article.id}`);
                                setDeleteOpen(false);
                            }}
                            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
