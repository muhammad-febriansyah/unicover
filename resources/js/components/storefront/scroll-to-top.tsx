import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            type="button"
            aria-label="Kembali ke atas"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full bg-[#2547F9] text-white shadow-[0_12px_30px_rgba(37,71,249,.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a35c9] sm:right-6 sm:bottom-6 ${
                visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
        >
            <ArrowUp size={22} strokeWidth={2.2} />
        </button>
    );
}
