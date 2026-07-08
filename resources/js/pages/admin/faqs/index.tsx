import { Head, useForm } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Save, ArrowUpDown } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    faqs: Faq[];
}

export default function FaqIndex({ faqs }: Props) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

    const { data, setData, post, processing: saving } = useForm({
        question: '',
        answer: '',
        is_active: true,
        sort_order: 0,
    });
    const { data: editData, setData: setEdit, put, processing: updating } = useForm({
        question: '',
        answer: '',
        is_active: true,
        sort_order: 0,
    });
    const { delete: destroy } = useForm();

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setData({ question: '', answer: '', is_active: true, sort_order: 0 });
        setEdit({ question: '', answer: '', is_active: true, sort_order: 0 });
    };

    const startEdit = (faq: Faq) => {
        setEditId(faq.id);
        setShowForm(true);
        setEdit({
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
            sort_order: faq.sort_order,
        });
    };

    const handleSave = () => {
        post('/admin/faqs', { onSuccess: () => resetForm() });
    };

    const handleUpdate = () => {
        if (editId) {
            put(`/admin/faqs/${editId}`, { onSuccess: () => resetForm() });
        }
    };

    const activeCount = faqs.filter(f => f.is_active).length;

    const columns: ColumnDef<Faq>[] = [
        {
            accessorKey: 'question',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Pertanyaan <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="line-clamp-2 block max-w-xs text-[13.5px] font-semibold text-[#0F172A]">{row.original.question}</span>
            ),
        },
        {
            accessorKey: 'answer',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Jawaban</span>
            ),
            cell: ({ row }) => (
                <span className="line-clamp-2 block max-w-sm text-[13px] text-[#64748B]">{row.original.answer}</span>
            ),
        },
        {
            accessorKey: 'is_active',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Status</span>
            ),
            cell: ({ row }) => (
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        row.original.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    )}
                >
                    {row.original.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            ),
        },
        {
            accessorKey: 'sort_order',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Urutan <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="text-[13px] text-[#64748B]">{row.original.sort_order}</span>
            ),
        },
        {
            id: 'actions',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-right">
                    Aksi
                </span>
            ),
            cell: ({ row }) => {
                const faq = row.original;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => startEdit(faq)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => setDeleteTarget(faq)}
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
            <Head title="FAQ" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'FAQ' },
                    ]}
                    title="FAQ"
                    description={`${activeCount} aktif dari ${faqs.length} FAQ`}
                >
                    <button
                        onClick={() => {
 resetForm(); setShowForm(true); 
}}
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
                            fontFamily: 'inherit',
                        }}
                    >
                        <Plus size={17} />
                        Tambah FAQ
                    </button>
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
                        data={faqs}
                        className="border-0 rounded-none"
                        emptyMessage="Belum ada FAQ"
                        searchKey="question"
                        searchPlaceholder="Cari pertanyaan..."
                    />
                </div>
            </div>

            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit FAQ' : 'Tambah FAQ'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="faq-question">
                                Pertanyaan<span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Input
                                id="faq-question"
                                value={editId ? editData.question : data.question}
                                onChange={(e) => editId ? setEdit('question', e.target.value) : setData('question', e.target.value)}
                                placeholder="cth. Bagaimana cara mendaftar?"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="faq-answer">
                                Jawaban<span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Textarea
                                id="faq-answer"
                                value={editId ? editData.answer : data.answer}
                                onChange={(e) => editId ? setEdit('answer', e.target.value) : setData('answer', e.target.value)}
                                placeholder="cth. Untuk mendaftar, kunjungi halaman registrasi..."
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="grid gap-2 w-32">
                                <Label htmlFor="faq-sort">Urutan</Label>
                                <Input
                                    id="faq-sort"
                                    type="number"
                                    min={0}
                                    value={editId ? editData.sort_order : data.sort_order}
                                    onChange={(e) => editId ? setEdit('sort_order', parseInt(e.target.value) || 0) : setData('sort_order', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="grid gap-2 flex-1">
                                <Label htmlFor="faq-active">Status</Label>
                                <div className="flex items-center gap-2 h-10">
                                    <input
                                        id="faq-active"
                                        type="checkbox"
                                        checked={editId ? editData.is_active : data.is_active}
                                        onChange={(e) => editId ? setEdit('is_active', e.target.checked) : setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {editId ? (editData.is_active ? 'Aktif' : 'Nonaktif') : (data.is_active ? 'Aktif' : 'Nonaktif')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                            Batal
                        </Button>
                        <Button type="button" className="bg-[#2547F9] text-white hover:bg-[#1e3ce0]" onClick={editId ? handleUpdate : handleSave} disabled={saving || updating}>
                            <Save size={15} /> Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            FAQ <strong>&quot;{deleteTarget?.question}&quot;</strong> akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    destroy(`/admin/faqs/${deleteTarget.id}`);
                                    setDeleteTarget(null);
                                }
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
