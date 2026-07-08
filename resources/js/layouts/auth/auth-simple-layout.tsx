import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { useTypedPage } from '@/hooks/use-typed-page';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

interface SiteSettings {
    brand_name?: string;
    logo_path?: string | null;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { siteSettings } = useTypedPage().props as { siteSettings?: SiteSettings | null };
    const brandName = siteSettings?.brand_name ?? 'Unicover';
    const logoPath = siteSettings?.logo_path;

    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#fafaf9] p-5 text-[#0f172a] sm:p-8 dark:bg-[#0a0a0f]">
            {/* Animated ambient orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="absolute -top-[15%] -left-[15%] h-[600px] w-[600px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(37,71,249,0.08) 0%, transparent 60%)' }}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
                    className="absolute top-[35%] -right-[15%] h-[500px] w-[500px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)' }}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
                    className="absolute -bottom-[10%] left-[10%] h-[400px] w-[400px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(37,71,249,0.05) 0%, transparent 60%)' }}
                />
            </div>

            {/* Subtle dot grid texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10 w-full max-w-[380px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="flex flex-col gap-8"
                >
                    {/* Logo + Brand */}
                    <div className="flex flex-col items-center gap-5">
                        <Link
                            href={home()}
                            className="group flex items-center gap-3 transition-opacity duration-200 hover:opacity-75"
                        >
                            {logoPath ? (
                                <img
                                    src={`/storage/${logoPath}`}
                                    alt={brandName}
                                    className="h-16 w-auto object-contain"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2547F9] text-white shadow-lg shadow-[#2547F9]/15 transition-transform duration-200 group-hover:scale-105">
                                    <span className="text-2xl font-bold">U</span>
                                </div>
                            )}
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-[22px] font-semibold tracking-tight text-[#0f172a] dark:text-[#f1f5f9]">
                                {title}
                            </h1>
                            <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Liquid glass card */}
                    <div
                        className="rounded-[20px] border border-gray-200/50 bg-white/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-2xl dark:border-white/[0.05] dark:bg-slate-900/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)]"
                        style={{
                            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
                        }}
                    >
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
