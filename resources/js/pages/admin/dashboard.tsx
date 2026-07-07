import { Head, Link } from '@inertiajs/react';
import {
    Package,
    FileText,
    Tags,
    CheckCircle,
    Star,
    Image,
    AlertTriangle,
    TrendingUp,
    Plus,
    Settings,
    ArrowRight,
    DollarSign,
    Clock,
    Eye,
} from 'lucide-react';
import { useTypedPage } from '@/hooks/use-typed-page';
import { PageHeader } from '@/components/page-header';

/* ─── types ─── */
interface Stat {
    productCount: number;
    activeProductCount: number;
    featuredProductCount: number;
    categoryCount: number;
    activeCategoryCount: number;
    articleCount: number;
    publishedArticleCount: number;
    draftArticleCount: number;
    tagCount: number;
    totalImageCount: number;
    lowStockCount: number;
}

interface RecentProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    stock_status: string;
    is_active: boolean;
    category: string | null;
    primary_image: string | null;
    created_at: string;
}

interface RecentArticle {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    category: string | null;
    created_at: string;
}

interface CategoryItem {
    name: string;
    count: number;
    slug?: string;
}

interface Props {
    stats: Stat;
    recentProducts: RecentProduct[];
    recentArticles: RecentArticle[];
    productsByCategory: CategoryItem[];
    articlesByCategory: CategoryItem[];
}

/* ─── helpers ─── */
const rupiah = (n: number): string =>
    'Rp' + Math.round(n).toLocaleString('id-ID');

const statusBadge = (active: boolean, label: string) => (
    <span
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            background: active ? '#F0FDF4' : '#FEF2F2',
            color: active ? '#16A34A' : '#DC2626',
            border: `1px solid ${active ? '#BBF7D0' : '#FECACA'}`,
        }}
    >
        <span
            style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: active ? '#16A34A' : '#DC2626',
            }}
        />
        {label}
    </span>
);

const stockBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
        in_stock: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', label: 'Tersedia' },
        out_of_stock: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Habis' },
        pre_order: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Pre-order' },
    };
    const s = map[status] || map.in_stock;
    return (
        <span
            style={{
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 600,
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
            }}
        >
            {s.label}
        </span>
    );
};

const cardBase: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #ECEDF1',
    borderRadius: 14,
    padding: '20px 22px',
    boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
};

const sectionTitle = (text: string, icon?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {icon && <span style={{ color: '#2547F9' }}>{icon}</span>}
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A', letterSpacing: '-.3px' }}>
            {text}
        </h2>
    </div>
);

/* ─── stat card ─── */
function StatCard({
    icon: Icon,
    iconBg,
    iconColor,
    value,
    label,
    trend,
    trendUp,
}: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    value: string | number;
    label: string;
    trend?: string;
    trendUp?: boolean;
}) {
    return (
        <div style={cardBase}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: iconBg,
                        color: iconColor,
                    }}
                >
                    <Icon size={20} />
                </div>
                {trend && (
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: trendUp ? '#16A34A' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        {trendUp && <TrendingUp size={12} />}
                        {trend}
                    </span>
                )}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.5px', lineHeight: 1, color: '#0F172A' }}>
                {value}
            </div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 6, fontWeight: 500 }}>{label}</div>
        </div>
    );
}

/* ─── main ─── */
export default function AdminDashboard({
    stats,
    recentProducts,
    recentArticles,
    productsByCategory,
    articlesByCategory,
}: Props) {
    const { auth } = useTypedPage().props;
    const userName = auth.user?.name?.split(' ')[0] ?? 'Admin';
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const statRows = [
        [
            { icon: Package, iconBg: '#EEF2FF', iconColor: '#2547F9', value: stats.productCount, label: 'Total Produk', trend: `${stats.activeProductCount} aktif`, trendUp: true },
            { icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#16A34A', value: stats.activeProductCount, label: 'Produk Aktif', trend: `${Math.round((stats.activeProductCount / (stats.productCount || 1)) * 100)}%`, trendUp: true },
            { icon: Star, iconBg: '#FEF6E7', iconColor: '#D97706', value: stats.featuredProductCount, label: 'Produk Unggulan', trend: stats.featuredProductCount > 0 ? 'ditampilkan' : undefined },
            { icon: Tags, iconBg: '#F5F0FE', iconColor: '#7C3AED', value: stats.categoryCount, label: 'Kategori Produk', trend: `${stats.activeCategoryCount} aktif` },
        ],
        [
            { icon: FileText, iconBg: '#F0FDF4', iconColor: '#16A34A', value: stats.publishedArticleCount, label: 'Artikel Terbit', trend: `${stats.draftArticleCount} draft`, trendUp: true },
            { icon: Eye, iconBg: '#EFF6FF', iconColor: '#2563EB', value: stats.articleCount, label: 'Total Artikel', trend: undefined },
            { icon: Image, iconBg: '#FDF2F8', iconColor: '#DB2777', value: stats.totalImageCount, label: 'Total Gambar', trend: undefined },
            { icon: Tags, iconBg: '#F0F9FF', iconColor: '#0891B2', value: stats.tagCount, label: 'Tag', trend: undefined },
        ],
    ];

    const maxProd = Math.max(1, ...productsByCategory.map((c) => c.count));
    const maxArt = Math.max(1, ...articlesByCategory.map((c) => c.count));

    return (
        <>
            <Head title="Dashboard" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader breadcrumbs={[{ label: 'Dashboard' }]} />
                {/* ── welcome banner ── */}
                <div
                    style={{
                        ...cardBase,
                        background: 'linear-gradient(135deg,#2547F9 0%,#4F6DF5 100%)',
                        color: '#fff',
                        marginBottom: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 16,
                    }}
                >
                    <div>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-.4px' }}>
                            Selamat datang, {userName} 👋
                        </h1>
                        <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.9 }}>{today}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <Link
                            href="/admin/products/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '9px 16px',
                                borderRadius: 10,
                                background: '#fff',
                                color: '#2547F9',
                                fontSize: 12.5,
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 2px 6px rgba(0,0,0,.08)',
                            }}
                        >
                            <Plus size={15} /> Produk Baru
                        </Link>
                        <Link
                            href="/admin/articles/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '9px 16px',
                                borderRadius: 10,
                                background: 'rgba(255,255,255,.15)',
                                color: '#fff',
                                fontSize: 12.5,
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '1px solid rgba(255,255,255,.25)',
                            }}
                        >
                            <Plus size={15} /> Artikel Baru
                        </Link>
                    </div>
                </div>

                {/* ── low stock alert ── */}
                {stats.lowStockCount > 0 && (
                    <div
                        style={{
                            ...cardBase,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            marginBottom: 18,
                            borderColor: '#FECACA',
                            background: '#FEF2F2',
                        }}
                    >
                        <AlertTriangle size={20} color="#DC2626" />
                        <div style={{ flex: 1 }}>
                            <strong style={{ color: '#DC2626', fontSize: 13 }}>{stats.lowStockCount} produk stok habis</strong>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7F1D1D' }}>
                                Segera perbarui stok atau ubah status produk agar tidak muncul di katalog.
                            </p>
                        </div>
                        <Link
                            href="/admin/products"
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#DC2626',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Kelola <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                {/* ── stats grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
                    {statRows[0].map((s, i) => (
                        <StatCard key={`s0-${i}`} {...s} />
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
                    {statRows[1].map((s, i) => (
                        <StatCard key={`s1-${i}`} {...s} />
                    ))}
                </div>

                {/* ── recent tables ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
                    {/* recent products */}
                    <div style={cardBase}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            {sectionTitle('Produk Terbaru', <Package size={16} />)}
                            <Link
                                href="/admin/products"
                                style={{ fontSize: 12, fontWeight: 600, color: '#2547F9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                Lihat semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentProducts.length === 0 ? (
                            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>Belum ada produk</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {recentProducts.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '10px 12px',
                                            borderRadius: 10,
                                            background: '#FAFBFC',
                                            border: '1px solid #F1F5F9',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                background: p.primary_image ? `url(/storage/${p.primary_image}) center/cover` : '#E2E8F0',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 10,
                                                color: '#94A3B8',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {!p.primary_image && <Package size={16} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {p.name}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span>{p.category ?? 'Tanpa kategori'}</span>
                                                <span>•</span>
                                                <span style={{ fontWeight: 600, color: '#2547F9' }}>
                                                    {rupiah(p.discount_price ?? p.price)}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                            {statusBadge(p.is_active, p.is_active ? 'Aktif' : 'Nonaktif')}
                                            {stockBadge(p.stock_status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* recent articles */}
                    <div style={cardBase}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            {sectionTitle('Artikel Terbaru', <FileText size={16} />)}
                            <Link
                                href="/admin/articles"
                                style={{ fontSize: 12, fontWeight: 600, color: '#2547F9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                Lihat semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentArticles.length === 0 ? (
                            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>Belum ada artikel</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {recentArticles.map((a) => (
                                    <div
                                        key={a.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '10px 12px',
                                            borderRadius: 10,
                                            background: '#FAFBFC',
                                            border: '1px solid #F1F5F9',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                background: '#EEF2FF',
                                                color: '#2547F9',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FileText size={16} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {a.title}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span>{a.category ?? 'Tanpa kategori'}</span>
                                                <span>•</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Clock size={10} /> {a.created_at}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            {statusBadge(a.is_published, a.is_published ? 'Terbit' : 'Draft')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── category distribution ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
                    {/* products by category */}
                    <div style={cardBase}>
                        {sectionTitle('Distribusi Produk per Kategori', <Tags size={16} />)}
                        {productsByCategory.length === 0 ? (
                            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>Belum ada data</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {productsByCategory.map((c) => (
                                    <div key={c.slug ?? c.name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 5 }}>
                                            <span>{c.name}</span>
                                            <span style={{ color: '#64748B' }}>{c.count}</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    borderRadius: 3,
                                                    width: `${(c.count / maxProd) * 100}%`,
                                                    background: 'linear-gradient(90deg,#2547F9,#4F6DF5)',
                                                    transition: 'width .6s ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* articles by category */}
                    <div style={cardBase}>
                        {sectionTitle('Distribusi Artikel per Kategori', <FileText size={16} />)}
                        {articlesByCategory.length === 0 ? (
                            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>Belum ada data</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {articlesByCategory.map((c, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 5 }}>
                                            <span>{c.name}</span>
                                            <span style={{ color: '#64748B' }}>{c.count}</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    borderRadius: 3,
                                                    width: `${(c.count / maxArt) * 100}%`,
                                                    background: 'linear-gradient(90deg,#16A34A,#4ADE80)',
                                                    transition: 'width .6s ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── quick links footer ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    {[
                        { label: 'Kelola Produk', href: '/admin/products', icon: Package, color: '#2547F9', bg: '#EEF2FF' },
                        { label: 'Kelola Artikel', href: '/admin/articles', icon: FileText, color: '#16A34A', bg: '#F0FDF4' },
                        { label: 'Kategori', href: '/admin/categories', icon: Tags, color: '#7C3AED', bg: '#F5F0FE' },
                        { label: 'Pengaturan', href: '/admin/settings', icon: Settings, color: '#64748B', bg: '#F1F5F9' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '14px 16px',
                                borderRadius: 12,
                                background: '#fff',
                                border: '1px solid #ECEDF1',
                                textDecoration: 'none',
                                color: '#0F172A',
                                fontSize: 13,
                                fontWeight: 600,
                                boxShadow: '0 1px 2px rgba(16,24,40,.04)',
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: item.bg,
                                    color: item.color,
                                    flexShrink: 0,
                                }}
                            >
                                <item.icon size={16} />
                            </div>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
