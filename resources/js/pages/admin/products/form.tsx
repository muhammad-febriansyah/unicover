import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import CurrencyInput from '@/components/currency-input';
import ImageUpload from '@/components/image-upload';
import { PageHeader } from '@/components/page-header';
import RichTextEditor from '@/components/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Category { id: number; name: string; }
interface Image { id: number; path: string; is_primary: boolean; }

interface Props {
    product: { id: number; name: string; description: string | null; price: number; discount_price: number | null;
        sku: string | null; stock_status: string; is_featured: boolean; is_active: boolean; category_id: number; images?: Image[] } | null;
    categories: Category[];
}

const req = <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>;

export default function ProductForm({ product, categories }: Props) {
    const isEditing = product !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? 0,
        discount_price: product?.discount_price ?? null as number | null,
        sku: product?.sku ?? '',
        stock_status: product?.stock_status ?? 'in_stock',
        category_id: product?.category_id ?? categories[0]?.id ?? 0,
        is_featured: product?.is_featured ?? false,
        is_active: product?.is_active ?? true,
        images: [] as File[],
        delete_images: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/admin/products/${product!.id}`);
        } else {
            post('/admin/products');
        }
    };

    const imagesError = Object.entries(errors).find(([key]) => key.startsWith('images'))?.[1];

    return (
        <>
            <Head title={isEditing ? 'Edit Produk' : 'Tambah Produk'} />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Produk', href: '/admin/products' },
                        { label: isEditing ? 'Edit Produk' : 'Tambah Produk' },
                    ]}
                    title={isEditing ? 'Edit Produk' : 'Tambah Produk'}
                    description="Isi detail produk di bawah ini."
                >
                    <button
                        type="submit"
                        form="product-form"
                        disabled={processing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            height: 42,
                            padding: '0 20px',
                            background: '#2547F9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: '13.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px -1px rgba(37,71,249,.24)',
                            fontFamily: 'inherit',
                            opacity: processing ? 0.6 : 1,
                        }}
                    >
                        <Save size={16} />
                        {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
                    </button>
                </PageHeader>

                <form id="product-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
                    {/* LEFT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Informasi Produk</div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 18 }}>Nama, deskripsi, dan detail utama produk.</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Field label="Nama Produk" required error={errors.name}>
                                    <input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="cth. Cover Mobil Premium Toyota Fortuner" required style={inputStyle} />
                                </Field>
                                <Field label="Deskripsi">
                                    <RichTextEditor value={data.description} onChange={(v) => setData('description', v)} placeholder="Jelaskan bahan, keunggulan, garansi, dan cara perawatan produk..." />
                                </Field>
                            </div>
                        </div>

                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Foto Produk</div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 4 }}>Unggah hingga 6 foto. Foto pertama jadi thumbnail utama.</div>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>Maks 2MB per foto. Format JPG, PNG, atau WEBP.</div>
                            <ImageUpload
                                files={data.images}
                                onChange={(files) => setData('images', files)}
                                existingImages={product?.images ?? []}
                                onDeleteImage={(id) => setData('delete_images', [...data.delete_images, id])}
                                max={6}
                            />
                            {imagesError && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>{imagesError}</p>}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 90 }}>
                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Harga & Stok</div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 18 }}>Atur harga jual dan ketersediaan produk.</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Field label="Harga" required error={errors.price}>
                                    <CurrencyInput value={data.price} onChange={(v) => setData('price', v)} placeholder="0" required />
                                </Field>
                                <Field label="Harga Diskon">
                                    <CurrencyInput value={data.discount_price ?? 0} onChange={(v) => setData('discount_price', v)} placeholder="0" />
                                </Field>
                                <Field label="SKU">
                                    <input value={data.sku} onChange={(e) => setData('sku', e.target.value)} placeholder="cth. CVR-FRT-001" style={inputStyle} />
                                </Field>
                                <div>
                                    <label style={labelStyle}>Status Stok {req}</label>
                                    <Select value={data.stock_status} onValueChange={(v) => setData('stock_status', v)}>
                                        <SelectTrigger className="w-full" style={{ height: 42, borderRadius: 9, borderColor: '#E8EAF1', background: '#F8FAFC', fontSize: '13.5px' }}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_stock">Tersedia</SelectItem>
                                            <SelectItem value="out_of_stock">Habis</SelectItem>
                                            <SelectItem value="preorder">Preorder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Kategori</div>
                            <div>
                                <label style={labelStyle}>Kategori Produk {req}</label>
                                <Select value={String(data.category_id)} onValueChange={(v) => setData('category_id', Number(v))}>
                                    <SelectTrigger className="w-full" style={{ height: 42, borderRadius: 9, borderColor: '#E8EAF1', background: '#F8FAFC', fontSize: '13.5px' }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Status</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #F1F5F9' }}>
                                <div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{data.is_active ? 'Aktif' : 'Nonaktif'}</div>
                                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: 2 }}>{data.is_active ? 'Tampil di katalog & bisa dipesan.' : 'Disembunyikan dari katalog publik.'}</div>
                                </div>
                                <Switch checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #F1F5F9' }}>
                                <div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>Featured</div>
                                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: 2 }}>Tampil di halaman utama.</div>
                                </div>
                                <Switch checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v)} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

function Field({ label, required, error, children, style: extra }: { label: string; required?: boolean; error?: string; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={extra}>
            <label style={labelStyle}>{label}{required ? req : null}</label>
            {children}
            {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>
    );
}

const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #ECEDF1', borderRadius: 14, padding: '22px 24px 24px', boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: 7 };
const inputStyle: React.CSSProperties = { width: '100%', height: 42, padding: '0 14px', border: '1px solid #E8EAF1', borderRadius: 9, background: '#F8FAFC', fontSize: '13.5px', fontFamily: 'inherit', color: '#0F172A' };
