import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface Crumb {
    label: string;
    href?: string;
}

interface Props {
    breadcrumbs: Crumb[];
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export function PageHeader({ breadcrumbs, title, description, children }: Props) {
    return (
        <div style={{ marginBottom: 22 }}>
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb">
                <ol style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
                    {breadcrumbs.map((crumb, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        return (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {i > 0 && (
                                    <ChevronRight size={14} color="#94A3B8" />
                                )}
                                {isLast || !crumb.href ? (
                                    <span
                                        style={{
                                            fontSize: 12.5,
                                            fontWeight: isLast ? 600 : 500,
                                            color: isLast ? '#0F172A' : '#64748B',
                                        }}
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        style={{
                                            fontSize: 12.5,
                                            fontWeight: 500,
                                            color: '#64748B',
                                            textDecoration: 'none',
                                        }}
                                        className="hover:text-[#2547F9] transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* title row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, letterSpacing: '-.4px', color: '#0F172A' }}>
                        {title}
                    </h1>
                    {description && (
                        <p style={{ margin: '5px 0 0', fontSize: '13.5px', color: '#64748B' }}>{description}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
