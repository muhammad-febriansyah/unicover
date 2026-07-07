import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, ArrowUpDown, Eye, FileText } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
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

interface Article {
    id: number;
    title: string;
    slug: string;
    author: { name: string } | null;
    articleCategory: { name: string } | null;
    created_at: string;
    is_published: boolean;
}

interface Props {
    articles: { data: Article[]; current_page: number; last_page: number; from: number; to: number; total: number };
}

const avaColor = ['#2547F9', '#4B8DB0', '#6B7F9E', '#3D8A6B', '#B08A4B', '#8A5BAF'];
const avaBg = (s: string) => {
    let h = 0;
    for (const ch of s) {
        h = (h + ch.charCodeAt(0)) % avaColor.length;
    }
    return avaColor[h];
};

export default function ArticleIndex({ articles }: Props) {
    const { delete: destroy } = useForm();
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

    const confirmDelete = () => {
        if (deleteTarget) {
            destroy(`/admin/articles/${deleteTarget.id}`);
            setDeleteTarget(null);
        }
    };

    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Judul <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div
                            className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] text-white"
                            style={{ background: avaBg(article.title) }}
                        >
                            <FileText size={20} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                            <Link
                                href={`/admin/articles/${article.id}`}
                                className="text-[13.5px] font-semibold text-[#0F172A] leading-tight hover:text-[#2547F9] transition-colors block"
                            >
                                {article.title}
                            </Link>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'author',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Penulis</span>,
            cell: ({ row }) => (
                <span className="text-[13px] text-[#475569]">{row.original.author?.name ?? '-'}</span>
            ),
        },
        {
            accessorKey: 'articleCategory',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Kategori</span>,
            cell: ({ row }) => {
                const name = row.original.articleCategory?.name ?? '-';
                return (
                    <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#475569]">
                        {name}
                    </span>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-center">
                    Tanggal
                </span>
            ),
            cell: ({ row }) => (
                <div className="text-center text-[12.5px] text-[#64748B] whitespace-nowrap">
                    {new Date(row.original.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            ),
        },
        {
            accessorKey: 'is_published',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Status</span>,
            cell: ({ row }) => {
                const published = row.original.is_published;
                const st = published
                    ? { c: '#15803D', b: '#F0FDF4', bc: '#BBF7D0' }
                    : { c: '#64748B', b: '#F1F5F9', bc: '#E2E8F0' };
                return (
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                        style={{ color: st.c, background: st.b, border: `1px solid ${st.bc}` }}
                    >
                        <span className="size-1.5 rounded-full" style={{ background: st.c }} />
                        {published ? 'Terbit' : 'Draft'}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-right">
                    Aksi
                </span>
            ),
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/articles/${article.id}`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#2547F9] hover:bg-[#1D3FD8]"
                            )}
                        >
                            <Eye size={14} />
                            Detail
                        </Link>
                        <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </Link>
                        <button
                            onClick={() => setDeleteTarget(article)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#DC2626] hover:bg-[#B91C1C]"
                            )}
                        >
                            <Trash2 size={14} />
                            Hapus
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Kelola Artikel" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Artikel' },
                    ]}
                    title="Kelola Artikel"
                    description={`${articles.total} artikel`}
                >
                    <Link
                        href="/admin/articles/create"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            height: 42,
                            padding: '0 18px',
                            background: '#2547F9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: '13.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px -1px rgba(37,71,249,.24)',
                            textDecoration: 'none',
                        }}
                    >
                        <Plus size={17} />
                        Tulis Artikel Baru
                    </Link>
                </PageHeader>

                <div
                    style={{
                        background: '#fff',
                        border: '1px solid #ECEDF1',
                        borderRadius: 14,
                        boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                        overflow: 'hidden',
                    }}
                >
                    <DataTable
                        columns={columns}
                        data={articles.data}
                        className="border-0 rounded-none"
                        emptyMessage="Belum ada artikel"
                    />

                    {/* pagination */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #EEF1F4' }}>
                        <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                            Menampilkan {articles.from}-{articles.to} dari {articles.total}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {Array.from({ length: articles.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/admin/articles?page=${page}`}
                                    style={{
                                        height: 34,
                                        width: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        fontSize: '12.5px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        border: page === articles.current_page ? '1px solid #2547F9' : '1px solid #ECEDF1',
                                        background: page === articles.current_page ? '#2547F9' : '#fff',
                                        color: page === articles.current_page ? '#fff' : '#334155',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Artikel <strong>{deleteTarget?.title}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
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
