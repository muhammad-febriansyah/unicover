import { type ComponentType } from 'react';
import { Truck, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { WhatsAppIcon, TiktokIcon } from '@/components/storefront/icons';
import { type SiteSettings, waLink, storefrontNavLinks } from '@/lib/storefront';

interface Props {
    settings: SiteSettings | null;
}

export function SiteFooter({ settings }: Props) {
    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';
    const waGeneral = waLink(waNumber, `Halo ${brandName}, saya ingin bertanya tentang produk cover mobil.`);

    const socialLinks = [
        settings?.instagram ? { icon: Instagram, href: `https://instagram.com/${settings.instagram}` } : null,
        settings?.facebook ? { icon: Facebook, href: `https://facebook.com/${settings.facebook}` } : null,
        settings?.tiktok ? { icon: TiktokIcon, href: `https://tiktok.com/@${settings.tiktok}` } : null,
    ].filter(Boolean) as { icon: ComponentType<{ size?: number }>; href: string }[];

    return (
        <footer className="relative overflow-hidden bg-white text-[#475569]">
            <div className="pointer-events-none absolute -top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(37,71,249,.16),transparent_70%)] blur-[60px]" />
            <div className="relative mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 px-6 pt-14 md:pt-18">
                <div className="max-w-[300px]">
                    <div className="mb-4 flex items-center">
                        {settings?.logo_path ? (
                            <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-14 w-auto object-contain" />
                        ) : (
                            <span className="flex size-14 items-center justify-center rounded-[14px] bg-[#2547F9]">
                                <Truck size={26} className="text-white" />
                            </span>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed text-[#64748b]">
                        {settings?.tagline ?? 'Spesialis cover mobil custom presisi untuk semua tipe kendaraan di Indonesia.'}
                    </p>
                    {socialLinks.length > 0 && (
                        <div className="mt-5 flex gap-2.5">
                            {socialLinks.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex size-[38px] items-center justify-center rounded-xl border border-gray-200 bg-white text-[#475569] hover:border-[#2547F9] hover:bg-[#2547F9] hover:text-white"
                                >
                                    <s.icon size={18} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Menu</h4>
                    <div className="flex flex-col gap-3 text-sm">
                        {storefrontNavLinks.map((link) => (
                            <a key={link.href} href={link.href} className="text-[#64748b] hover:text-[#2547F9]">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Kontak</h4>
                    <div className="flex flex-col gap-3.5 text-sm leading-relaxed text-[#64748b]">
                        {settings?.address && (
                            <div className="flex gap-2.5">
                                <MapPin size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />
                                {settings.address}
                            </div>
                        )}
                        {waNumber && (
                            <a href={waGeneral} target="_blank" rel="noreferrer" className="flex gap-2.5 text-[#64748b] hover:text-[#2547F9]">
                                <Phone size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />+{waNumber}
                            </a>
                        )}
                        <div className="flex gap-2.5">
                            <Clock size={18} className="mt-0.5 shrink-0 text-[#2547F9]" strokeWidth={1.8} />
                            Senin–Sabtu, 08.00–20.00 WIB
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="mb-4 text-[15px] font-semibold text-[#1a1a1a]">Pesan Cepat</h4>
                    <p className="mb-4 text-sm leading-relaxed text-[#64748b]">Chat kami sekarang untuk konsultasi gratis &amp; penawaran terbaik.</p>
                    <a
                        href={waGeneral}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2547F9] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,71,249,.22)] hover:bg-[#1a35c9]"
                    >
                        <WhatsAppIcon size={18} />
                        WhatsApp Kami
                    </a>
                </div>
            </div>
            <div className="relative mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-3 border-t border-gray-200 px-6 py-7 text-[13px] text-[#94a3b8]">
                <span>{settings?.footer_text ?? `© ${new Date().getFullYear()} ${brandName}. Semua hak dilindungi.`}</span>
                <span>Dibuat dengan ❤ untuk pecinta otomotif Indonesia</span>
            </div>
        </footer>
    );
}
