import { usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';

export interface SharedPageProps {
    auth: Auth;
    name: string;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export function useTypedPage() {
    return usePage<SharedPageProps>();
}
