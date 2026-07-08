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
import { cn } from '@/lib/utils';

interface Item {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface Props {
    categories: Item[];
}

export default function ArticleCategoryIndex({ categories }: Props) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

    const { data, setData, post, processing: saving } = useForm({ name: '', description: '' });
    const { data: editData, setData: setEdit, put, processing: updating } = useForm({ name: '', description: '' });
    const { delete: destroy } = useForm();

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setData({ name: '', description: '' });
        setEdit({ name: '', description: '' });
    };

    const startEdit = (item: Item) => {
        setEditId(item.id);
        setShowForm(true);
        setEdit({ name: item.name, description: item.description ?? '' });
    };

    const handleSave = () => {
        post('/admin/article-categories', { onSuccess: () => resetForm() });
    };

    const handleUpdate = () => {
        if (editId) {
            put(`/admin/article-categories/${editId}`, { onSuccess: () => resetForm() });
        }
    };

    const columns: ColumnDef<Item>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Nama <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="text-[13.5px] font-semibold text-[#0F172A]">{row.original.name}</span>
            ),
        },
        {
            accessorKey: 'slug',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Slug</span>,
            cell: ({ row }) => (
                <code className="text-[12.5px] text-[#94A3B8] font-mono">{row.original.slug}</code>
            ),
        },
        {
            accessorKey: 'description',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Deskripsi</span>,
            cell: ({ row }) => (
                <span className="text-[13px] text-[#475569]">{row.original.description ?? '-'}</span>
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
                const item = row.original;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => startEdit(item)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => setDeleteTarget(item)}
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
            <Head title="Kategori Artikel" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kategori Artikel' },
                    ]}
                    title="Kategori Artikel"
                    description={`${categories.length} kategori`}
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
                        Tambah Kategori
                    </button>
                </PageHeader>

                {/* data table */}
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
                        data={categories}
                        className="border-0 rounded-none"
                        emptyMessage="Belum ada kategori"
                        searchKey="name"
                        searchPlaceholder="Cari nama kategori..."
                    />
                </div>
            </div>

            {/* add / edit form */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category-name">
                                Nama Kategori<span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Input
                                id="category-name"
                                value={editId ? editData.name : data.name}
                                onChange={(e) => editId ? setEdit('name', e.target.value) : setData('name', e.target.value)}
                                placeholder="cth. Tips & Trik"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category-description">Deskripsi</Label>
                            <Input
                                id="category-description"
                                value={editId ? editData.description : data.description}
                                onChange={(e) => editId ? setEdit('description', e.target.value) : setData('description', e.target.value)}
                                placeholder="Deskripsi singkat kategori..."
                            />
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

            {/* delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kategori <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen. Artikel yang menggunakan kategori ini mungkin terpengaruh.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    destroy(`/admin/article-categories/${deleteTarget.id}`);
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
