import { Head, useForm } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Save, ArrowUpDown, Star } from 'lucide-react';
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

interface Testimonial {
    id: number;
    name: string;
    rating: number;
    message: string;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    testimonials: Testimonial[];
}

function StarRating({ rating, setRating }: { rating: number; setRating?: (v: number) => void }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!setRating}
                    onClick={() => setRating?.(star)}
                    className={cn(
                        'transition-colors',
                        setRating && 'cursor-pointer hover:scale-110',
                    )}
                >
                    <Star
                        size={20}
                        className={star <= rating ? 'fill-[#EAB308] text-[#EAB308]' : 'text-gray-300'}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
}

export default function TestimonialIndex({ testimonials }: Props) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

    const { data, setData, post, processing: saving } = useForm({
        name: '',
        rating: 5,
        message: '',
        is_active: true,
        sort_order: 0,
    });
    const { data: editData, setData: setEdit, put, processing: updating } = useForm({
        name: '',
        rating: 5,
        message: '',
        is_active: true,
        sort_order: 0,
    });
    const { delete: destroy } = useForm();

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setData({ name: '', rating: 5, message: '', is_active: true, sort_order: 0 });
        setEdit({ name: '', rating: 5, message: '', is_active: true, sort_order: 0 });
    };

    const startEdit = (t: Testimonial) => {
        setEditId(t.id);
        setShowForm(true);
        setEdit({
            name: t.name,
            rating: t.rating,
            message: t.message,
            is_active: t.is_active,
            sort_order: t.sort_order,
        });
    };

    const handleSave = () => {
        post('/admin/testimonials', { onSuccess: () => resetForm() });
    };

    const handleUpdate = () => {
        if (editId) {
            put(`/admin/testimonials/${editId}`, { onSuccess: () => resetForm() });
        }
    };

    const activeCount = testimonials.filter((t) => t.is_active).length;

    const columns: ColumnDef<Testimonial>[] = [
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
            accessorKey: 'rating',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Rating</span>
            ),
            cell: ({ row }) => <StarRating rating={row.original.rating} />,
        },
        {
            accessorKey: 'message',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Pesan</span>
            ),
            cell: ({ row }) => (
                <span className="text-[13px] text-[#64748B] line-clamp-2 max-w-[300px]">{row.original.message}</span>
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
                            : 'bg-gray-100 text-gray-800',
                    )}
                >
                    {row.original.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
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
                const t = row.original;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => startEdit(t)}
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors',
                                'bg-[#16A34A] hover:bg-[#15803D]',
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => setDeleteTarget(t)}
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors',
                                'bg-[#DC2626] hover:bg-[#B91C1C]',
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
            <Head title="Testimoni" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Testimoni' },
                    ]}
                    title="Testimoni"
                    description={`${activeCount} aktif dari ${testimonials.length} testimoni`}
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
                        Tambah Testimoni
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
                        data={testimonials}
                        className="border-0 rounded-none"
                        emptyMessage="Belum ada testimoni"
                        searchKey="name"
                        searchPlaceholder="Cari nama..."
                    />
                </div>
            </div>

            {/* add / edit form */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="testi-name">
                                Nama<span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Input
                                id="testi-name"
                                value={editId ? editData.name : data.name}
                                onChange={(e) => editId ? setEdit('name', e.target.value) : setData('name', e.target.value)}
                                placeholder="cth. Budi Santoso"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Rating</Label>
                            <StarRating
                                rating={editId ? editData.rating : data.rating}
                                setRating={(v) => editId ? setEdit('rating', v) : setData('rating', v)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="testi-msg">
                                Pesan<span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Textarea
                                id="testi-msg"
                                value={editId ? editData.message : data.message}
                                onChange={(e) => editId ? setEdit('message', e.target.value) : setData('message', e.target.value)}
                                placeholder="cth. Produknya bagus, sesuai dengan pesanan..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="grid gap-2 w-32">
                                <Label htmlFor="testi-sort">Urutan</Label>
                                <Input
                                    id="testi-sort"
                                    type="number"
                                    min={0}
                                    value={editId ? editData.sort_order : data.sort_order}
                                    onChange={(e) => editId ? setEdit('sort_order', parseInt(e.target.value) || 0) : setData('sort_order', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="grid gap-2 flex-1">
                                <Label htmlFor="testi-active">Status</Label>
                                <div className="flex items-center gap-2 h-10">
                                    <input
                                        id="testi-active"
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
                        <Button
                            type="button"
                            className="bg-[#2547F9] text-white hover:bg-[#1e3ce0]"
                            onClick={editId ? handleUpdate : handleSave}
                            disabled={saving || updating}
                        >
                            <Save size={15} /> Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Testimoni?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Testimoni dari <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    destroy(`/admin/testimonials/${deleteTarget.id}`);
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
