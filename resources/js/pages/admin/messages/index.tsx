import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/storefront/icons';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    messages: ContactMessage[];
}

function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function waNumberFromPhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');

    if (digits.startsWith('0')) {
        digits = '62' + digits.slice(1);
    }

    return digits;
}

export default function MessagesIndex({ messages }: Props) {
    const [viewTarget, setViewTarget] = useState<ContactMessage | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

    const unreadCount = messages.filter((m) => !m.is_read).length;

    const setRead = (m: ContactMessage, isRead: boolean) => {
        router.patch(`/admin/messages/${m.id}`, { is_read: isRead }, { preserveScroll: true, preserveState: true });
    };

    const openMessage = (m: ContactMessage) => {
        setViewTarget(m);

        if (!m.is_read) {
            setRead(m, true);
        }
    };

    const columns: ColumnDef<ContactMessage>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Pengirim <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {!row.original.is_read && <span className="h-2 w-2 flex-none rounded-full bg-[#2547F9]" />}
                    <div>
                        <div className={cn('text-[13.5px] text-[#0F172A]', row.original.is_read ? 'font-medium' : 'font-bold')}>
                            {row.original.name}
                        </div>
                        <div className="text-xs text-[#94A3B8]">{row.original.email}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'message',
            header: () => (
                <span className="font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Pesan</span>
            ),
            cell: ({ row }) => (
                <span className="line-clamp-2 max-w-[320px] text-[13px] text-[#64748B]">{row.original.message}</span>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]"
                >
                    Waktu <ArrowUpDown size={12} />
                </button>
            ),
            cell: ({ row }) => (
                <span className="text-[12.5px] whitespace-nowrap text-[#64748B]">{formatDateTime(row.original.created_at)}</span>
            ),
        },
        {
            id: 'actions',
            header: () => (
                <span className="block text-right font-semibold text-[11px] uppercase tracking-wide text-[#94A3B8]">Aksi</span>
            ),
            cell: ({ row }) => {
                const m = row.original;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => openMessage(m)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2547F9] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1e3ce0]"
                        >
                            <Eye size={14} />
                            Lihat
                        </button>
                        <button
                            onClick={() => setDeleteTarget(m)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#B91C1C]"
                        >
                            <Trash2 size={14} />
                            Hapus
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Pesan Masuk" />
            <div style={{ animation: 'cm-fade .3s ease' }}>
                <PageHeader
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/admin' },
                        { label: 'Pesan Masuk' },
                    ]}
                    title="Pesan Masuk"
                    description={`${unreadCount} belum dibaca dari ${messages.length} pesan`}
                />

                <div
                    style={{
                        background: '#fff',
                        border: '1px solid #ECEDF1',
                        borderRadius: 14,
                        boxShadow: '0 1px 2px rgba(16,24,40,.04),0 4px 14px -10px rgba(16,24,40,.10)',
                        overflow: 'hidden',
                    }}
                >
                    <DataTable
                        columns={columns}
                        data={messages}
                        className="rounded-none border-0"
                        emptyMessage="Belum ada pesan masuk"
                        searchKey="name"
                        searchPlaceholder="Cari pengirim..."
                    />
                </div>
            </div>

            {/* view message */}
            <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Pesan dari {viewTarget?.name}</DialogTitle>
                    </DialogHeader>
                    {viewTarget && (
                        <div className="grid gap-3 text-sm">
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-[#64748B]">
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail size={14} /> {viewTarget.email}
                                </span>
                                {viewTarget.phone && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Phone size={14} /> {viewTarget.phone}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-[#94A3B8]">{formatDateTime(viewTarget.created_at)}</div>
                            <div className="whitespace-pre-wrap rounded-xl bg-[#F8FAFC] p-4 text-[13.5px] leading-relaxed text-[#0F172A]">
                                {viewTarget.message}
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex-wrap gap-2 sm:justify-between">
                        {viewTarget?.is_read && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (viewTarget) {
                                        setRead(viewTarget, false);
                                        setViewTarget(null);
                                    }
                                }}
                            >
                                <MailOpen size={15} /> Tandai belum dibaca
                            </Button>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {viewTarget?.phone && (
                                <a
                                    href={`https://wa.me/${waNumberFromPhone(viewTarget.phone)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#22C55E] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#16A34A]"
                                >
                                    <WhatsAppIcon size={15} /> WhatsApp
                                </a>
                            )}
                            <a
                                href={`mailto:${viewTarget?.email}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2547F9] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1e3ce0]"
                            >
                                <Mail size={15} /> Balas Email
                            </a>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Pesan dari <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    router.delete(`/admin/messages/${deleteTarget.id}`, { preserveScroll: true });
                                    setDeleteTarget(null);
                                }
                            }}
                            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
