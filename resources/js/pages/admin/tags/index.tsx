import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Save, ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    tags: Tag[];
}

export default function TagIndex({ tags }: Props) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);

    const { data, setData, post, processing: saving } = useForm({ name: '' });
    const { data: editData, setData: setEdit, put, processing: updating } = useForm({ name: '' });
    const { delete: destroy } = useForm();

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setData({ name: '' });
        setEdit({ name: '' });
    };

    const startEdit = (tag: Tag) => {
        setEditId(tag.id);
        setShowForm(true);
        setEdit({ name: tag.name });
    };

    const handleSave = () => {
        post('/admin/tags', { onSuccess: () => resetForm() });
    };

    const handleUpdate = () => {
        if (editId) {
            put(`/admin/tags/${editId}`, { onSuccess: () => resetForm() });
        }
    };

    const columns: ColumnDef<Tag>[] = [
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
            id: 'actions',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-right">
                    Aksi
                </span>
            ),
            cell: ({ row }) => {
                const tag = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => startEdit(tag)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => setDeleteTarget(tag)}
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
            <Head title="Tag Artikel" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Tag Artikel' },
                    ]}
                    title="Tag Artikel"
                    description={`${tags.length} tag`}
                >
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
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
                        Tambah Tag
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
                        data={tags}
                        className="border-0 rounded-none"
                        emptyMessage="Belum ada tag"
                    />
                </div>
            </div>

            {/* add / edit form */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit Tag' : 'Tambah Tag'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="tag-name">
                            Nama Tag<span className="text-destructive ml-0.5">*</span>
                        </Label>
                        <Input
                            id="tag-name"
                            value={editId ? editData.name : data.name}
                            onChange={(e) => editId ? setEdit('name', e.target.value) : setData('name', e.target.value)}
                            placeholder="cth. cover mobil"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                            Batal
                        </Button>
                        <Button type="button" onClick={editId ? handleUpdate : handleSave} disabled={saving || updating}>
                            <Save size={15} /> Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tag <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen. Artikel yang menggunakan tag ini mungkin terpengaruh.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    destroy(`/admin/tags/${deleteTarget.id}`);
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
