import type { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className} {...props}>
            <p className="text-sm text-muted-foreground">
                Light mode is the default theme.
            </p>
        </div>
    );
}
