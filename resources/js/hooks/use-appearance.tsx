import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light';
export type Appearance = 'light';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: () => void;
};

const listeners = new Set<() => void>();

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeTheme(): void {
    if (typeof document === 'undefined') {
        return;
    }

    localStorage.setItem('appearance', 'light');
    setCookie('appearance', 'light');
    applyTheme();
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => 'light',
        () => 'light',
    );

    const updateAppearance = (): void => {
        localStorage.setItem('appearance', 'light');
        setCookie('appearance', 'light');
        applyTheme();
        notify();
    };

    return {
        appearance,
        resolvedAppearance: 'light',
        updateAppearance,
    } as const;
}
