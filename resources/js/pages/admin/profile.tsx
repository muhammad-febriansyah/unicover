import { Head, useForm, usePage } from '@inertiajs/react';
import type {ColumnDef} from '@tanstack/react-table';
import { Save, ArrowUpDown, Eye, EyeOff, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/ui/data-table';

interface UserModel {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
    users: UserModel[];
}

export default function ProfilePage({ mustVerifyEmail, status, users }: Props) {
    const user = usePage().props.auth?.user as { id: number; name: string; email: string; email_verified_at?: string | null; avatar?: string | null };

    const { data, setData, patch, processing, errors } = useForm<{ name: string; email: string; avatar: File | null }>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/profile');
    };

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword(SecurityController.update.url(), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    const userColumns: ColumnDef<UserModel>[] = [
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4E6BFF,#2547F9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                        {row.original.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{row.original.name}</div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>{row.original.email}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'is_admin',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8] block text-center">Role</span>
            ),
            cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        background: row.original.is_admin ? '#F0FDF4' : '#F1F5F9',
                        color: row.original.is_admin ? '#16A34A' : '#64748B',
                        border: `1px solid ${row.original.is_admin ? '#BBF7D0' : '#E2E8F0'}`,
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: row.original.is_admin ? '#16A34A' : '#94A3B8' }} />
                        {row.original.is_admin ? 'Admin' : 'User'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Tanggal Dibuat <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <span style={{ fontSize: 12.5, color: '#64748B' }}>
                    {new Date(row.original.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            ),
        },
    ];

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

    const passwordInputStyle: React.CSSProperties = {
        ...inputStyle,
        paddingRight: 42,
    };

    const passwordToggleStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 42,
        width: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#94A3B8',
        fontFamily: 'inherit',
    };

    return (
        <>
            <Head title="Profil" />
            <div style={{ animation: 'cm-fade .3s ease', maxWidth: 720 }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Profil' },
                    ]}
                    title="Profil"
                    description="Perbarui informasi akun Anda."
                >
                    <button
                        type="submit"
                        form="profile-form"
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
                        Simpan
                    </button>
                </PageHeader>

                <form id="profile-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={cardStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Informasi Profil</div>
                        <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 18 }}>Perbarui nama dan email akun.</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                {avatarPreview ?? user?.avatar ? (
                                    <img
                                        src={avatarPreview ?? user.avatar ?? undefined}
                                        alt={user?.name}
                                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flex: 'none' }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg,#4E6BFF,#2547F9)',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: 20,
                                            flex: 'none',
                                        }}
                                    >
                                        {user?.name?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() ?? 'AD'}
                                    </div>
                                )}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => avatarInputRef.current?.click()}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '7px 14px',
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
                                        Ganti Foto
                                    </button>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>JPG, PNG, atau WEBP. Maks 2MB.</div>
                                    {errors.avatar && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.avatar}</p>}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Nama <span style={{ color: '#DC2626' }}>*</span></label>
                                <input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                                {errors.name && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Email <span style={{ color: '#DC2626' }}>*</span></label>
                                <input
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    type="email"
                                    required
                                    style={inputStyle}
                                />
                                {errors.email && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                            </div>
                            {mustVerifyEmail && !user.email_verified_at && (
                                <div style={{ fontSize: 12, color: '#D97706', background: '#FFFBEB', padding: '8px 12px', borderRadius: 8, border: '1px solid #FDE68A' }}>
                                    Email belum diverifikasi.
                                </div>
                            )}
                            {status && (
                                <div style={{ fontSize: 12, color: '#15803D', background: '#F0FDF4', padding: '8px 12px', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>


                </form>

                <form onSubmit={submitPassword} style={{ marginTop: 20 }}>
                    <div style={cardStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Ubah Password</div>
                        <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: 18 }}>Pastikan akun Anda menggunakan password yang panjang dan acak.</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Password Saat Ini</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                        style={passwordInputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent((v) => !v)}
                                        aria-label={showCurrent ? 'Sembunyikan password' : 'Tampilkan password'}
                                        style={passwordToggleStyle}
                                    >
                                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.current_password && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.current_password}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Password Baru</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                        autoComplete="new-password"
                                        style={passwordInputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew((v) => !v)}
                                        aria-label={showNew ? 'Sembunyikan password' : 'Tampilkan password'}
                                        style={passwordToggleStyle}
                                    >
                                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.password && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.password}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Konfirmasi Password Baru</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        style={passwordInputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                                        style={passwordToggleStyle}
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {passwordErrors.password_confirmation && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{passwordErrors.password_confirmation}</p>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
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
                                        opacity: passwordProcessing ? 0.6 : 1,
                                    }}
                                >
                                    <Save size={16} />
                                    Simpan Password
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </>
    );
}
