import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useTypedPage } from '@/hooks/use-typed-page';
import { Menu, X, User, Settings as SettingsIcon, LogOut } from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    active: boolean;
    svgPath: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = useTypedPage();
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => url.startsWith(path);

    const navGroups: { label: string | null; items: NavItem[] }[] = [
        {
            label: null,
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin',
                    active: url === '/admin',
                    svgPath: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
                },
            ],
        },
        {
            label: 'Produk',
            items: [
                {
                    title: 'Kelola Produk',
                    href: '/admin/products',
                    active: isActive('/admin/products'),
                    svgPath: '<path d="M21 8V21H3V8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
                },
                {
                    title: 'Kategori Produk',
                    href: '/admin/categories',
                    active: isActive('/admin/categories'),
                    svgPath: '<path d="M4 20h16"/><path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
                },
            ],
        },
        {
            label: 'Artikel',
            items: [
                {
                    title: 'Kelola Artikel',
                    href: '/admin/articles',
                    active: isActive('/admin/articles'),
                    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
                },
                {
                    title: 'Kategori Artikel',
                    href: '/admin/article-categories',
                    active: isActive('/admin/article-categories'),
                    svgPath: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
                },
                {
                    title: 'Tag',
                    href: '/admin/tags',
                    active: isActive('/admin/tags'),
                    svgPath: '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>',
                },
            ],
        },
        {
            label: null,
            items: [
                {
                    title: 'Pengaturan Toko',
                    href: '/admin/settings',
                    active: isActive('/admin/settings'),
                    svgPath: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
                },
            ],
        },
    ];

    const navStyle = (active: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: sidebarOpen ? '11px 13px' : '11px 0',
        justifyContent: sidebarOpen ? 'flex-start' : 'center',
        marginBottom: 3,
        border: 'none',
        borderRadius: 10,
        fontSize: '13.5px',
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'left' as const,
        fontFamily: 'inherit',
        background: active
            ? 'linear-gradient(90deg,#3D5BFF,#2547F9)'
            : 'transparent',
        color: active ? '#fff' : '#64748B',
        boxShadow: active ? '0 2px 8px -2px rgba(37,71,249,.38)' : 'none',
        textDecoration: 'none',
    });

    const user = page.props.auth?.user;
    const siteSettings = (page.props as any).siteSettings as { brand_name?: string; logo_path?: string | null } | null;

    /* close dropdown on outside click */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }
    }, [dropdownOpen]);

    const sidebarWidth = sidebarOpen ? 250 : 68;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <aside
                style={{
                    width: sidebarWidth,
                    flex: 'none',
                    background: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    boxShadow: 'inset -1px 0 0 #ECEDF1',
                    overflow: 'hidden',
                    transition: 'width .25s ease',
                }}
            >
                {/* brand */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: sidebarOpen ? '28px 20px 30px' : '22px 0 24px',
                        transition: 'padding .25s ease',
                    }}
                >
                    {siteSettings?.logo_path ? (
                        <img
                            src={`/storage/${siteSettings.logo_path}`}
                            alt={siteSettings.brand_name ?? 'Logo'}
                            style={{
                                width: sidebarOpen ? '100%' : 56,
                                height: 56,
                                borderRadius: 12,
                                objectFit: 'contain',
                                flex: 'none',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 14,
                                background: 'linear-gradient(135deg,#4E6BFF,#2547F9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 'none',
                                boxShadow: '0 2px 6px -1px rgba(37,71,249,.45)',
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 17H3v-4l2-5h9l4 5h2a2 2 0 0 1 2 2v2h-2" />
                                <circle cx="7" cy="17" r="2" />
                                <path d="M9 17h6" />
                                <circle cx="17" cy="17" r="2" />
                            </svg>
                        </div>
                    )}

                </div>

                {/* nav */}
                <div style={{ padding: sidebarOpen ? '0 12px' : '0 8px', transition: 'padding .25s ease' }}>
                    {navGroups.map((group, i) => (
                        <div key={group.label ?? `group-${i}`} style={{ marginBottom: 4 }}>
                            {sidebarOpen && group.label && (
                                <div
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: 1,
                                        color: '#94A3B8',
                                        padding: '10px 12px 6px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {group.label}
                                </div>
                            )}
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={navStyle(item.active)}
                                    className="cm-nav"
                                    title={!sidebarOpen ? item.title : undefined}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        dangerouslySetInnerHTML={{ __html: item.svgPath }}
                                        style={{ flexShrink: 0 }}
                                    />
                                    {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.title}</span>}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>


            </aside>

            {/* MAIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* TOPBAR */}
                <header
                    style={{
                        height: 66,
                        background: '#fff',
                        borderBottom: '1px solid #ECEDF1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '0 26px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                    }}
                >
                    {/* hamburger toggle */}
                    <button
                        onClick={() => setSidebarOpen((s) => !s)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            border: '1px solid #ECEDF1',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748B',
                            flexShrink: 0,
                        }}
                        aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
                        <svg
                            style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            placeholder="Cari produk, artikel..."
                            style={{
                                width: '100%',
                                height: 40,
                                padding: '0 14px 0 38px',
                                border: '1px solid #E8EAF1',
                                borderRadius: 10,
                                background: '#F8FAFC',
                                fontSize: '13.5px',
                                color: '#0F172A',
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: 1, height: 28, background: '#ECEDF1' }} />

                    {/* avatar dropdown */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen((d) => !d)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 11,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 6px',
                                borderRadius: 10,
                                fontFamily: 'inherit',
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg,#4E6BFF,#2547F9)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    flex: 'none',
                                }}
                            >
                                {user?.name?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() ?? 'AD'}
                            </div>
                            <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                                    {user?.name ?? 'Admin'}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748B' }}>Admin</div>
                            </div>
                        </button>

                        {dropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    right: 0,
                                    width: 200,
                                    background: '#fff',
                                    border: '1px solid #ECEDF1',
                                    borderRadius: 12,
                                    boxShadow: '0 10px 30px -8px rgba(16,24,40,.18)',
                                    padding: '6px',
                                    zIndex: 50,
                                    animation: 'cm-fade .15s ease',
                                }}
                            >
                                <Link
                                    href="/admin/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 12px',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#0F172A',
                                        textDecoration: 'none',
                                    }}
                                    className="cm-dropdown-item"
                                >
                                    <User size={16} color="#64748B" />
                                    Profile
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    onClick={() => setDropdownOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 12px',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#0F172A',
                                        textDecoration: 'none',
                                    }}
                                    className="cm-dropdown-item"
                                >
                                    <SettingsIcon size={16} color="#64748B" />
                                    Pengaturan
                                </Link>
                                <div style={{ height: 1, background: '#ECEDF1', margin: '4px 0' }} />
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={() => setDropdownOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 12px',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: '#DC2626',
                                        textDecoration: 'none',
                                        width: '100%',
                                        textAlign: 'left',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                    }}
                                    className="cm-dropdown-item"
                                >
                                    <LogOut size={16} color="#DC2626" />
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* CONTENT */}
                <main style={{ flex: 1, overflow: 'auto', padding: '28px 30px 60px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
