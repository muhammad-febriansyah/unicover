import { useState } from 'react';
import { Truck } from 'lucide-react';
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
    NavbarButton,
} from '@/components/ui/resizable-navbar';
import { WhatsAppIcon } from '@/components/storefront/icons';
import { type SiteSettings, waLink, storefrontNavLinks } from '@/lib/storefront';

interface Props {
    settings: SiteSettings | null;
}

export function SiteHeader({ settings }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);

    const brandName = settings?.brand_name ?? 'Unicover';
    const waNumber = settings?.wa_number ?? '';
    const waGeneral = waLink(waNumber, `Halo ${brandName}, saya ingin bertanya tentang produk cover mobil.`);

    return (
        <Navbar className="fixed inset-x-0 top-0">
            <NavBody>
                <a href="/#beranda" className="relative z-20 flex items-center">
                    {settings?.logo_path ? (
                        <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-12 w-auto object-contain" />
                    ) : (
                        <span className="flex size-12 items-center justify-center rounded-[14px] bg-[#2547F9] shadow-[0_8px_20px_rgba(37,71,249,.28)]">
                            <Truck size={22} className="text-white" />
                        </span>
                    )}
                </a>
                <NavItems items={storefrontNavLinks.map((l) => ({ name: l.label, link: l.href }))} />
                <NavbarButton
                    href={waGeneral}
                    variant="primary"
                    className="relative z-20 flex items-center gap-2 bg-[#2547F9] text-white shadow-[0_8px_22px_rgba(37,71,249,.28)] hover:bg-[#1a35c9]"
                >
                    <WhatsAppIcon size={16} />
                    Chat WhatsApp
                </NavbarButton>
            </NavBody>

            <MobileNav>
                <MobileNavHeader>
                    <a href="/#beranda" className="relative z-20 flex items-center">
                        {settings?.logo_path ? (
                            <img src={`/storage/${settings.logo_path}`} alt={brandName} className="h-11 w-auto object-contain" />
                        ) : (
                            <span className="flex size-11 items-center justify-center rounded-xl bg-[#2547F9]">
                                <Truck size={20} className="text-white" />
                            </span>
                        )}
                    </a>
                    <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
                </MobileNavHeader>
                <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                    {storefrontNavLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="w-full py-2 font-medium text-[#1a1a1a]"
                        >
                            {link.label}
                        </a>
                    ))}
                    <NavbarButton
                        href={waGeneral}
                        variant="primary"
                        className="flex w-full items-center justify-center gap-2 bg-[#2547F9] text-white"
                    >
                        <WhatsAppIcon size={16} />
                        Chat WhatsApp
                    </NavbarButton>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}
