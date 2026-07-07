import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Check, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
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
import { cn } from '@/lib/utils';

interface ArticleCategory { id: number; name: string }
interface Tag { id: number; name: string }

interface Article {
    id: number;
    title: string;
    excerpt: string | null;
    body: string | null;
    article_category_id: number | null;
    cover_image_path: string | null;
    is_published: boolean;
}

interface Props {
    article: Article | null;
    categories: ArticleCategory[];
    tags: Tag[];
    selectedTags?: number[];
}

const req = <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>;

export default function ArticleForm({ article, categories, tags, selectedTags }: Props) {
    const isEditing = article !== null;
    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title ?? '',
        excerpt: article?.excerpt ?? '',
        body: article?.body ?? '',
        article_category_id: article?.article_category_id ?? null as number | null,
        is_published: article?.is_published ?? false,
        tags: selectedTags ?? [],
        cover_image: null as File | null,
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('cover_image', file);
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/articles/${article!.id}`);
        } else {
            post('/admin/articles');
        }
    };

    const toggleTag = (id: number) =>
        setData('tags', data.tags.includes(id) ? data.tags.filter((t) => t !== id) : [...data.tags, id]);

    const coverSrc = coverPreview ?? (article?.cover_image_path ? `/storage/${article.cover_image_path}` : null);

    return (
        <>
            <Head title={isEditing ? 'Edit Artikel' : 'Tulis Artikel'} />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Kelola Artikel', href: '/admin/articles' },
                        { label: isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru' },
                    ]}
                    title={isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                    description="Isi detail artikel di bawah ini."
                >
                    <button
                        type="submit"
                        form="article-form"
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
                        {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                    </button>
                </PageHeader>

                <form id="article-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
                    {/* LEFT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Informasi Artikel</div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 18 }}>Judul, ringkasan, dan isi utama artikel.</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <Field label="Judul Artikel" required error={errors.title}>
                                    <input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Masukkan judul artikel yang menarik..." required style={inputStyle} />
                                </Field>
                                <Field label="Ringkasan" hint={`${data.excerpt.length}/500`}>
                                    <textarea value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} placeholder="Ringkasan singkat artikel (2-3 kalimat)..." maxLength={500} style={{ ...inputStyle, minHeight: 72, padding: '12px 14px', resize: 'vertical' as const }} rows={3} />
                                </Field>
                                <div>
                                    <label style={labelStyle}>Gambar Sampul</label>
                                    <div
                                        style={{
                                            border: '1px solid #E8EAF1',
                                            borderRadius: 11,
                                            background: '#F8FAFC',
                                            padding: 14,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 10,
                                            minHeight: 160,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {coverSrc ? (
                                            <img
                                                src={coverSrc}
                                                alt="Cover"
                                                style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>Belum ada gambar sampul</div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => coverInputRef.current?.click()}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                padding: '6px 14px',
                                                borderRadius: 8,
                                                border: '1px solid #E8EAF1',
                                                background: '#fff',
                                                fontSize: 12.5,
                                                fontWeight: 600,
                                                color: '#334155',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            <ImageIcon size={14} />
                                            {coverSrc ? 'Ganti Gambar' : 'Unggah Gambar'}
                                        </button>
                                        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <Field label="Isi Artikel" required error={errors.body}>
                                    <RichTextEditor value={data.body} onChange={(v) => setData('body', v)} placeholder="Tulis isi artikel di sini..." minHeight={280} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Publikasi</div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 14 }}>Atur status dan visibilitas artikel.</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #F1F5F9' }}>
                                <div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{data.is_published ? 'Terbit' : 'Draft'}</div>
                                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: 2 }}>{data.is_published ? 'Artikel tampil di blog publik.' : 'Belum dipublikasikan.'}</div>
                                </div>
                                <Switch checked={data.is_published} onCheckedChange={(v) => setData('is_published', v)} />
                            </div>
                        </div>

                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Kategori</div>
                            <label style={labelStyle}>Kategori Artikel</label>
                            <Select
                                value={data.article_category_id ? String(data.article_category_id) : 'none'}
                                onValueChange={(v) => setData('article_category_id', v === 'none' ? null : Number(v))}
                            >
                                <SelectTrigger className="w-full" style={{ height: 42, borderRadius: 9, borderColor: '#E8EAF1', background: '#F8FAFC', fontSize: '13.5px' }}>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="cm-card" style={cardStyle}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Tag</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {tags.map((tag) => {
                                    const selected = data.tags.includes(tag.id);
                                    return (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.id)}
                                            className={cn(
                                                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                                                selected
                                                    ? 'border-[#2547F9] bg-[#2547F9] text-white'
                                                    : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]'
                                            )}
                                        >
                                            {selected && <Check size={12} />}
                                            {tag.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

function Field({ label, required, error, hint, children, style: extra }: { label: string; required?: boolean; error?: string; hint?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={extra}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={labelStyle}>{label}{required ? req : null}</label>
                {hint && <span style={{ fontSize: 11, color: '#94A3B8' }}>{hint}</span>}
            </div>
            {children}
            {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</p>}
        </div>
    );
}

const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #ECEDF1', borderRadius: 14, padding: '22px 24px 24px', boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: 7 };
const inputStyle: React.CSSProperties = { width: '100%', height: 42, padding: '0 14px', border: '1px solid #E8EAF1', borderRadius: 9, background: '#F8FAFC', fontSize: '13.5px', fontFamily: 'inherit', color: '#0F172A' };
