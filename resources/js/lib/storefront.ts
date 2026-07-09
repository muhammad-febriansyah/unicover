export interface SiteSettings {
    brand_name: string;
    logo_path: string | null;
    wa_number: string;
    tagline: string | null;
    hero_heading: string | null;
    hero_subheading: string | null;
    hero_image_path: string | null;
    address: string | null;
    email: string | null;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    footer_text: string | null;
    google_maps_embed: string | null;
}

export function formatRupiah(value: string | number) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

export function waLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const storefrontNavLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/produk', label: 'Katalog' },
    { href: '/artikel', label: 'Artikel' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#tentang', label: 'Tentang' },
    { href: '/#kontak', label: 'Kontak' },
];
