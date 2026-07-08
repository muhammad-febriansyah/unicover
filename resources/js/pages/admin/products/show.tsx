import { Head, Link, useForm } from '@inertiajs/react';
import {
    Pencil,
    Trash2,
    Package,
    Tag,
    DollarSign,
    BarChart3,
    CheckCircle,
    XCircle,
    Star,
    Clock,
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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    path: string;
    sort_order: number;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    description: string | null;
    price: number;
    discount_price: number | null;
    stock_status: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    category: Category | null;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

const stockMap: Record<string, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
    in_stock: { label: 'Tersedia', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0', icon: CheckCircle },
    out_of_stock: { label: 'Habis', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: XCircle },
    preorder: { label: 'Pre-order', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: Clock },
};

function rupiah(n: number): string {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ProductShow({ product }: Props) {
    const { delete: destroy } = useForm();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
    const gallery = product.images.filter((img) => img.id !== primaryImage?.id);
    const stock = stockMap[product.stock_status] ?? stockMap.in_stock;
    const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

    return (
        <>
            <Head title={product.name} />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Produk', href: '/admin/products' },
                        { label: product.name },
                    ]}
                    title={product.name}
                    description={`SKU: ${product.sku ?? '-'} \u2022 Slug: ${product.slug}`}
                >
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                                "bg-[#16A34A] hover:bg-[#15803D]"
                            )}
                        >
                            <Pencil size={15} />
                            Edit Produk
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
                    {/* left: image + desc */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* image card */}
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
                                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Gambar Produk</h2>
                            </div>
                            <div style={{ padding: '0 20px 20px' }}>
                                {primaryImage ? (
                                    <>
                                        <div
                                            style={{
                                                width: '100%',
                                                aspectRatio: '16/10',
                                                borderRadius: 12,
                                                background: `url(/storage/${primaryImage.path}) center/cover`,
                                                border: '1px solid #F1F5F9',
                                            }}
                                        />
                                        {gallery.length > 0 && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                                {gallery.map((img) => (
                                                    <div
                                                        key={img.id}
                                                        style={{
                                                            width: 72,
                                                            height: 72,
                                                            borderRadius: 8,
                                                            background: `url(/storage/${img.path}) center/cover`,
                                                            border: '1px solid #F1F5F9',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            aspectRatio: '16/10',
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
                                        <Package size={24} style={{ marginRight: 8 }} />
                                        Tidak ada gambar
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* description */}
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
                                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Deskripsi</h2>
                            </div>
                            <div style={{ padding: '0 20px 20px' }}>
                                {product.description ? (
                                    <div
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                ) : (
                                    <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>Tidak ada deskripsi.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* right: info cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* price */}
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
                                    <DollarSign size={16} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Harga</span>
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-.3px' }}>
                                {rupiah(hasDiscount ? product.discount_price! : product.price)}
                            </div>
                            {hasDiscount && (
                                <div style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'line-through', marginTop: 3 }}>
                                    {rupiah(product.price)}
                                </div>
                            )}
                        </div>

                        {/* stock */}
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
                                        background: stock.bg,
                                        color: stock.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <stock.icon size={16} />
                                </div>
                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>Stok</span>
                            </div>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '5px 12px',
                                    borderRadius: 20,
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    background: stock.bg,
                                    color: stock.color,
                                    border: `1px solid ${stock.border}`,
                                }}
                            >
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: stock.color }} />
                                {stock.label}
                            </span>
                        </div>

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
                                        background: product.is_active ? '#F0FDF4' : '#F1F5F9',
                                        color: product.is_active ? '#16A34A' : '#64748B',
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
                                        background: product.is_active ? '#F0FDF4' : '#F1F5F9',
                                        color: product.is_active ? '#15803D' : '#64748B',
                                        border: `1px solid ${product.is_active ? '#BBF7D0' : '#E2E8F0'}`,
                                    }}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: product.is_active ? '#15803D' : '#64748B' }} />
                                    {product.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                                {product.is_featured && (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            padding: '4px 10px',
                                            borderRadius: 20,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            background: '#FEF6E7',
                                            color: '#D97706',
                                            border: '1px solid #FDE68A',
                                        }}
                                    >
                                        <Star size={10} />
                                        Unggulan
                                    </span>
                                )}
                            </div>
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
                            {product.category ? (
                                <Link
                                    href={`/admin/products?category=${product.category.id}`}
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
                                        textDecoration: 'none',
                                    }}
                                >
                                    {product.category.name}
                                    <ExternalLink size={12} />
                                </Link>
                            ) : (
                                <span style={{ fontSize: 13, color: '#94A3B8' }}>Tanpa kategori</span>
                            )}
                        </div>

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
                                Dibuat: {formatDate(product.created_at)}
                            </div>
                            <div style={{ fontSize: 12, color: '#94A3B8' }}>
                                Diperbarui: {formatDate(product.updated_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* delete confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Produk <strong>{product.name}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                destroy(`/admin/products/${product.id}`);
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
