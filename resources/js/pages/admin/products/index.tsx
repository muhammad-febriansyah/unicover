import { Head, Link, useForm, router } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Plus, Search, Pencil, Trash2, ArrowUpDown, Eye } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
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
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    path: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    price: number;
    category: Category | null;
    images: ProductImage[];
    stock_status: string;
    is_active: boolean;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    categories: Category[];
    filters: { search?: string; category?: string };
}

const stockLabel: Record<string, string> = { in_stock: 'Tersedia', out_of_stock: 'Habis', preorder: 'Preorder' };
const catColor: Record<string, string> = {
    SUV: 'linear-gradient(135deg,#4E6BFF,#2547F9)',
    MPV: 'linear-gradient(135deg,#4B8DB0,#2C5E82)',
    Hatchback: 'linear-gradient(135deg,#6B7F9E,#455876)',
    Sedan: 'linear-gradient(135deg,#5A6C8C,#38455E)',
};

export default function ProductIndex({ products, categories, filters }: Props) {
    const { delete: destroy } = useForm();
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const confirmDelete = () => {
        if (deleteTarget) {
            destroy(`/admin/products/${deleteTarget.id}`);
            setDeleteTarget(null);
        }
    };

    const visitFilters = useCallback((params: Record<string, string>) => {
        const query: Record<string, string> = {};

        for (const [k, v] of Object.entries(params)) {
            if (v && v !== 'all') {
query[k] = v;
}
        }

        router.visit('/admin/products', {
            data: query,
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const onSearchChange = (value: string) => {
        setSearchValue(value);

        if (debounceRef.current) {
clearTimeout(debounceRef.current);
}

        debounceRef.current = setTimeout(() => {
            visitFilters({ search: value, category: filters.category ?? '' });
        }, 400);
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Produk <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => {
                const product = row.original;
                const colorGrad = catColor[product.category?.name ?? ''] ?? 'linear-gradient(135deg,#5B7FB0,#3A5C8A)';
                const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];

                return (
                    <div className="flex items-center gap-3">
                        {primaryImage ? (
                            <img
                                src={`/storage/${primaryImage.path}`}
                                alt={product.name}
                                className="size-[46px] shrink-0 rounded-[10px] object-cover"
                                style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)' }}
                            />
                        ) : (
                            <div
                                className="flex size-[46px] shrink-0 items-center justify-center rounded-[10px] text-[15px] font-bold text-white"
                                style={{ background: colorGrad, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)' }}
                            >
                                {product.category?.name?.[0] ?? 'P'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="text-[13.5px] font-semibold text-[#0F172A] leading-tight hover:text-[#2547F9] transition-colors"
                            >
                                {product.name}
                            </Link>
                            {product.sku && (
                                <div className="text-[11.5px] text-[#94A3B8] mt-0.5">{product.sku}</div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'category',
            header: () => <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Kategori</span>,
            cell: ({ row }) => {
                const name = row.original.category?.name ?? '-';

                return (
                    <span className="inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#475569]">
                        {name}
                    </span>
                );
            },
        },
        {
            accessorKey: 'price',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-right">
                    Harga
                </span>
            ),
            cell: ({ row }) => (
                <div className="text-right text-[13.5px] font-semibold text-[#0F172A] whitespace-nowrap">
                    Rp {row.original.price.toLocaleString('id-ID')}
                </div>
            ),
        },
        {
            accessorKey: 'stock_status',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-center">
                    Stok
                </span>
            ),
            cell: ({ row }) => {
                const s = row.original.stock_status;
                const sc = s === 'in_stock' ? '#334155' : s === 'preorder' ? '#B45309' : '#DC2626';

                return (
                    <div className="text-center text-[13px] font-semibold" style={{ color: sc }}>
                        {stockLabel[s]}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Status</span>
            ),
            cell: ({ row }) => {
                const active = row.original.is_active;
                const st = active
                    ? { c: '#15803D', b: '#F0FDF4', bc: '#BBF7D0' }
                    : { c: '#64748B', b: '#F1F5F9', bc: '#E2E8F0' };

                return (
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                        style={{ color: st.c, background: st.b, border: `1px solid ${st.bc}` }}
                    >
                        <span className="size-1.5 rounded-full" style={{ background: st.c }} />
                        {active ? 'Aktif' : 'Draft'}
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
                const product = row.original;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/products/${product.id}`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#2547F9] hover:bg-[#1D3FD8]"
                            )}
                        >
                            <Eye size={14} />
                            Detail
                        </Link>
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={14} />
                            Edit
                        </Link>
                        <button
                            onClick={() => setDeleteTarget(product)}
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
            <Head title="Kelola Produk" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Produk' },
                    ]}
                    title="Kelola Produk"
                    description={`${products.total} produk terdaftar`}
                >
                    <Link
                        href="/admin/products/create"
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
                        Tambah Produk
                    </Link>
                </PageHeader>

                {/* table card */}
                <div
                    style={{
                        background: '#fff',
                        border: '1px solid #ECEDF1',
                        borderRadius: 14,
                        boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                        overflow: 'hidden',
                    }}
                >
                    {/* filters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #EEF1F4', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                value={searchValue}
                                placeholder="Cari nama produk..."
                                onChange={(e) => onSearchChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: 40,
                                    padding: '0 14px 0 36px',
                                    border: '1px solid #E8EAF1',
                                    borderRadius: 9,
                                    background: '#F8FAFC',
                                    fontSize: 13,
                                    fontFamily: 'inherit',
                                }}
                            />
                        </div>
                        <select
                            defaultValue={filters.category ?? 'all'}
                            onChange={(e) => visitFilters({ search: searchValue, category: e.target.value === 'all' ? '' : e.target.value })}
                            style={{
                                height: 40,
                                padding: '0 32px 0 14px',
                                border: '1px solid #E8EAF1',
                                borderRadius: 9,
                                background: '#F8FAFC',
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#334155',
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='3 5 7 9 11 5'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                fontFamily: 'inherit',
                            }}
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* data table */}
                    <DataTable
                        columns={columns}
                        data={products.data}
                        className="border-0 rounded-none"
                        emptyMessage="Tidak ada produk"
                        enablePagination={false}
                    />

                    {/* pagination */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #EEF1F4' }}>
                        <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                            Menampilkan {products.from}-{products.to} dari {products.total}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/admin/products?page=${page}`}
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
                                        border: page === products.current_page ? '1px solid #2547F9' : '1px solid #ECEDF1',
                                        background: page === products.current_page ? '#2547F9' : '#fff',
                                        color: page === products.current_page ? '#fff' : '#334155',
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

            {/* delete confirmation dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Produk <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
