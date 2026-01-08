import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import { Link, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { Block } from '../Blocks';
import BlockCard from './BlockCard';

// 1. Interfaces para tipagem rigorosa

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBlocks {
    data: Block[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    blocks: PaginatedBlocks;
}

export default function BlockList({ blocks }: Props) {
    const { t } = useTrans();
    const { addToast } = useToast();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const blockItems = useMemo(() => {
        return blocks.data || [];
    }, [blocks.data]);

    const isPageAllSelected = useMemo(() => {
        return (
            blockItems.length > 0 &&
            blockItems.every((item: Block) => selectedIds.includes(item.id))
        );
    }, [blockItems, selectedIds]);

    const handleSelectAll = () => {
        const pageIds = blockItems.map((item: Block) => item.id);
        if (isPageAllSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !pageIds.includes(id)),
            );
        } else {
            setSelectedIds((prev) =>
                Array.from(new Set([...prev, ...pageIds])),
            );
        }
    };

    const toggleSelect = useCallback((id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const deleteSingle = useCallback(
        (id: number) => {
            if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
                router.delete(route('schedule.blocks.destroy', id), {
                    onSuccess: () => {
                        addToast(t('BLOCKS.SUCCESS_REMOVE'), ToastType.SUCCESS);
                        setSelectedIds((prev) => prev.filter((i) => i !== id));
                    },
                    preserveScroll: true,
                });
            }
        },
        [t, addToast],
    );

    const deleteSelected = () => {
        const message = `${t('MESSAGES.CONFIRM_DELETE')} (${selectedIds.length})`;

        if (confirm(message)) {
            router.delete(route('schedule.blocks.bulk-destroy'), {
                data: { ids: selectedIds },
                onSuccess: () => {
                    addToast(t('BLOCKS.SUCCESS_REMOVE'), ToastType.SUCCESS);
                    setSelectedIds([]);
                },
                preserveScroll: true,
            });
        }
    };

    if (blocks.total === 0) {
        return (
            <div className="animate-in fade-in flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-slate-200 bg-white py-20 duration-700">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <span className="text-sm font-medium italic text-slate-400">
                    {t('BLOCKS.EMPTY_STATE')}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex min-h-[40px] items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleSelectAll}
                        className="group flex items-center gap-3 focus:outline-none"
                    >
                        <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                                isPageAllSelected
                                    ? 'border-slate-900 bg-slate-900'
                                    : 'border-slate-200 group-hover:border-slate-300'
                            }`}
                        >
                            {isPageAllSelected && (
                                <svg
                                    className="animate-in zoom-in h-3 w-3 text-white duration-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={4}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 transition-colors group-hover:text-slate-600">
                            {selectedIds.length > 0
                                ? `${selectedIds.length} ${t('BLOCKS.SELECTED')}`
                                : t('BLOCKS.SELECT_ALL')}
                        </span>
                    </button>

                    {selectedIds.length > 0 && (
                        <div className="h-4 w-px bg-slate-200" />
                    )}

                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-[10px] font-black uppercase text-rose-500 transition-colors hover:text-rose-700"
                        >
                            {t('BLOCKS.CLEAN_SELECTION')}
                        </button>
                    )}
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={deleteSelected}
                        className="animate-in slide-in-from-right-4 rounded-full bg-rose-500 px-6 py-2 text-[10px] font-black uppercase text-white shadow-lg transition-all hover:bg-rose-600 active:scale-95"
                    >
                        {t('BLOCKS.DELETE_BULK')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {blockItems.map((block: Block) => (
                    <BlockCard
                        key={block.id}
                        block={block}
                        isSelected={selectedIds.includes(block.id)}
                        onToggle={toggleSelect}
                        onDelete={deleteSingle}
                        t={t}
                    />
                ))}
            </div>

            {blocks.links && blocks.links.length > 3 && (
                <div className="mt-12 flex justify-center gap-2 pb-8">
                    {blocks.links.map((link: PaginationLink, i: number) => {
                        const getLabel = () => {
                            if (i === 0) return t('PAGINATION.PREVIOUS');
                            if (i === blocks.links.length - 1)
                                return t('PAGINATION.NEXT');

                            return link.label
                                .replace('&laquo;', '')
                                .replace('&raquo;', '')
                                .trim();
                        };

                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all ${
                                    link.active
                                        ? 'z-10 scale-110 bg-slate-900 text-white shadow-xl'
                                        : 'border border-slate-100 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                } ${!link.url ? 'cursor-not-allowed opacity-30' : ''}`}
                            >
                                {getLabel()}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
