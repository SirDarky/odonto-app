import { router, Link } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useToast } from '@/Contexts/ToastContext';
import { ToastType } from '@/Components/Toast';
import { useState, useCallback, useMemo } from 'react';
import BlockCard from './BlockCard';

export default function BlockList({ blocks }: { blocks: any }) {
    const { t } = useTrans();
    const { addToast } = useToast();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const blockItems = blocks.data || [];

    const isPageAllSelected = useMemo(() => {
        return blockItems.length > 0 && blockItems.every((item: any) => selectedIds.includes(item.id));
    }, [blockItems, selectedIds]);

    const handleSelectAll = () => {
        const pageIds = blockItems.map((item: any) => item.id);
        if (isPageAllSelected) {
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
        }
    };

    const toggleSelect = useCallback((id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const deleteSingle = useCallback((id: number) => {
        if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
            router.delete(route('schedule.blocks.destroy', id), {
                onSuccess: () => {
                    addToast(t('BLOCKS.SUCCESS_REMOVE'), ToastType.SUCCESS);
                    setSelectedIds(prev => prev.filter(i => i !== id));
                },
                preserveScroll: true
            });
        }
    }, [t, addToast]);

    const deleteSelected = () => {
        const message = `${t('MESSAGES.CONFIRM_DELETE')} (${selectedIds.length})`;

        if (confirm(message)) {
            router.delete(route('schedule.blocks.bulk-destroy'), {
                data: { ids: selectedIds },
                onSuccess: () => {
                    addToast(t('BLOCKS.SUCCESS_REMOVE'), ToastType.SUCCESS);
                    setSelectedIds([]);
                },
                preserveScroll: true
            });
        }
    };

    if (blocks.total === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-sm text-slate-400 font-medium italic">{t('BLOCKS.EMPTY_STATE')}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4 min-h-[40px]">
                <div className="flex items-center gap-6">
                    <button onClick={handleSelectAll} className="group flex items-center gap-3 focus:outline-none">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isPageAllSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-200 group-hover:border-slate-300'}`}>
                            {isPageAllSelected && <svg className="w-3 h-3 text-white animate-in zoom-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-600 transition-colors">
                            {selectedIds.length > 0 ? `${selectedIds.length} ${t('BLOCKS.SELECTED')}` : t('BLOCKS.SELECT_ALL')}
                        </span>
                    </button>

                    {selectedIds.length > 0 && <div className="h-4 w-px bg-slate-200" />}

                    {selectedIds.length > 0 && (
                        <button onClick={() => setSelectedIds([])} className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-700 transition-colors">
                            {t('BLOCKS.CLEAN_SELECTION')}
                        </button>
                    )}
                </div>

                {selectedIds.length > 0 && (
                    <button onClick={deleteSelected} className="px-6 py-2 bg-rose-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg hover:bg-rose-600 transition-all active:scale-95 animate-in slide-in-from-right-4">
                        {t('BLOCKS.DELETE_BULK')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blockItems.map((block: any) => (
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
                <div className="flex justify-center gap-2 mt-12 pb-8">
                    {blocks.links.map((link: any, i: number) => {

                        const getLabel = () => {
                            if (i === 0) return t('PAGINATION.PREVIOUS');
                            if (i === blocks.links.length - 1) return t('PAGINATION.NEXT');

                            return link.label.replace('&laquo;', '').replace('&raquo;', '').trim();
                        };

                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all 
                        ${link.active
                                        ? 'bg-slate-900 text-white shadow-xl scale-110 z-10'
                                        : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600'
                                    } 
                        ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
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