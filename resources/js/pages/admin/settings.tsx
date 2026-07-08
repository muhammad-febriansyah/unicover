import { Head, useForm } from '@inertiajs/react';
import { Save, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';

interface SiteSetting {
    id: number; brand_name: string; wa_number: string; tagline: string | null; hero_heading: string | null;
    hero_subheading: string | null; address: string | null; google_maps_embed: string | null; email: string | null;
    instagram: string | null; facebook: string | null; tiktok: string | null; footer_text: string | null;
    logo_path: string | null; favicon_path: string | null;
}

interface Props { settings: SiteSetting; }

export default function SettingsIndex({ settings }: Props) {
    const { data, setData, patch, processing } = useForm({
        brand_name: settings.brand_name, wa_number: settings.wa_number,
        tagline: settings.tagline ?? '', hero_heading: settings.hero_heading ?? '',
        hero_subheading: settings.hero_subheading ?? '', address: settings.address ?? '',
        email: settings.email ?? '', instagram: settings.instagram ?? '',
        facebook: settings.facebook ?? '', tiktok: settings.tiktok ?? '',
        footer_text: settings.footer_text ?? '',
        google_maps_embed: settings.google_maps_embed ?? '',
        logo: null as File | null,
        favicon: null as File | null,
    });

    const [activeTab, setActiveTab] = useState('identitas');

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);

        if (logoPreview) {
URL.revokeObjectURL(logoPreview);
}

        setLogoPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('favicon', file);

        if (faviconPreview) {
URL.revokeObjectURL(faviconPreview);
}

        setFaviconPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/settings');
    };

    return (
        <>
            <Head title="Pengaturan Toko" />
            <div style={{ animation: 'cm-fade .3s ease', maxWidth: 720 }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Pengaturan Toko' },
                    ]}
                    title="Pengaturan Toko"
                    description="Kelola identitas toko dan konfigurasi."
                >
                    <button
                        type="submit"
                        form="settings-form"
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
                        Simpan Perubahan
                    </button>
                </PageHeader>

                <form id="settings-form" onSubmit={submit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-5">
                            <TabsTrigger value="identitas">Identitas Toko</TabsTrigger>
                            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                            <TabsTrigger value="kontak">Kontak</TabsTrigger>
                            <TabsTrigger value="sosial">Sosial Media</TabsTrigger>
                        </TabsList>

                        {/* Identitas Toko */}
                        <TabsContent value="identitas">
                            <div style={cardStyle}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Identitas Toko</div>
                                <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 20 }}>Informasi yang tampil di seluruh website.</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Nama Toko <span style={{ color: '#DC2626' }}>*</span></label>
                                        <input value={data.brand_name} onChange={(e) => setData('brand_name', e.target.value)} required style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div>
                                            <label style={labelStyle}>Tagline</label>
                                            <input value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} placeholder="Tagline toko..." style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Teks Footer</label>
                                            <input value={data.footer_text} onChange={(e) => setData('footer_text', e.target.value)} placeholder="Teks di footer..." style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div>
                                            <label style={labelStyle}>Hero Heading</label>
                                            <input value={data.hero_heading} onChange={(e) => setData('hero_heading', e.target.value)} placeholder="Judul hero..." style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Hero Subheading</label>
                                            <input value={data.hero_subheading} onChange={(e) => setData('hero_subheading', e.target.value)} placeholder="Sub-judul hero..." style={inputStyle} />
                                        </div>
                                    </div>
                                    {/* logo & favicon */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 6 }}>
                                        <SingleImageUpload
                                            label="Logo Toko"
                                            existingPath={settings.logo_path}
                                            preview={logoPreview}
                                            onChange={handleLogoChange}
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                        />
                                        <SingleImageUpload
                                            label="Favicon"
                                            existingPath={settings.favicon_path}
                                            preview={faviconPreview}
                                            onChange={handleFaviconChange}
                                            accept="image/png,image/x-icon,image/svg+xml"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* WhatsApp */}
                        <TabsContent value="whatsapp">
                            <div style={cardStyle}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Checkout WhatsApp</div>
                                <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 20 }}>Nomor tujuan saat pembeli menekan tombol Pesan via WhatsApp.</div>
                                <div>
                                    <label style={labelStyle}>Nomor WhatsApp <span style={{ color: '#DC2626' }}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '13.5px', color: '#64748B', fontWeight: 500 }}>+62</span>
                                        <input value={data.wa_number} onChange={(e) => setData('wa_number', e.target.value)} placeholder="81234567890" required style={{ ...inputStyle, paddingLeft: 46 }} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Kontak */}
                        <TabsContent value="kontak">
                            <div style={cardStyle}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Kontak & Alamat</div>
                                <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 20 }}>Ditampilkan di footer website.</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Alamat</label>
                                        <textarea value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Alamat toko..." style={{ ...inputStyle, minHeight: 72, padding: '12px 14px', resize: 'vertical' as const }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Google Maps Embed</label>
                                        <textarea
                                            value={data.google_maps_embed}
                                            onChange={(e) => setData('google_maps_embed', e.target.value)}
                                            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                                            style={{ ...inputStyle, minHeight: 100, padding: '12px 14px', resize: 'vertical' as const, fontFamily: 'monospace', fontSize: 12 }}
                                            rows={4}
                                        />
                                        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>Tempel kode iframe embed dari Google Maps. Masuk ke Google Maps → Bagikan → Sematkan peta → Salin HTML.</p>
                                    </div>
                                    {data.google_maps_embed && (
                                        <div>
                                            <label style={labelStyle}>Pratinjau Peta</label>
                                            <div
                                                style={{
                                                    border: '1px solid #E8EAF1',
                                                    borderRadius: 11,
                                                    overflow: 'hidden',
                                                    background: '#F8FAFC',
                                                }}
                                                dangerouslySetInnerHTML={{ __html: data.google_maps_embed }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label style={labelStyle}>Email</label>
                                        <input value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="toko@email.com" type="email" style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Sosial Media */}
                        <TabsContent value="sosial">
                            <div style={cardStyle}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Sosial Media</div>
                                <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 20 }}>Tautan ke akun sosial media.</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Instagram</label>
                                        <input value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} placeholder="username" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Facebook</label>
                                        <input value={data.facebook} onChange={(e) => setData('facebook', e.target.value)} placeholder="Nama halaman" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>TikTok</label>
                                        <input value={data.tiktok} onChange={(e) => setData('tiktok', e.target.value)} placeholder="username" style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </>
    );
}

/* ─── single image upload helper ─── */
function SingleImageUpload({ label, existingPath, preview, onChange, accept }: {
    label: string;
    existingPath: string | null;
    preview: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept: string;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const src = preview ?? (existingPath ? `/storage/${existingPath}` : null);

    return (
        <div>
            <label style={labelStyle}>{label}</label>
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
                    minHeight: 140,
                    justifyContent: 'center',
                }}
            >
                {src ? (
                    <img
                        src={src}
                        alt={label}
                        style={{
                            maxHeight: 80,
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: 6,
                        }}
                    />
                ) : (
                    <div style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
                        Belum ada {label.toLowerCase()}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
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
                    <Upload size={14} />
                    {src ? 'Ganti' : 'Unggah'}
                </button>
                <input ref={inputRef} type="file" accept={accept} onChange={onChange} style={{ display: 'none' }} />
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #ECEDF1',
    borderRadius: 14,
    padding: '22px 24px 24px',
    boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
};
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: 7,
};
const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 42,
    padding: '0 14px',
    border: '1px solid #E8EAF1',
    borderRadius: 9,
    background: '#F8FAFC',
    fontSize: '13.5px',
    fontFamily: 'inherit',
    color: '#0F172A',
};
