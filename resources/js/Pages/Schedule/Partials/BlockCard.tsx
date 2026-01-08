import { TransFunction } from '@/Hooks/useTrans';
import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock, Trash2 } from 'lucide-react';
import { memo } from 'react';

interface Block {
    id: number;
    date: string;
    full_day: boolean;
    start_time: string | null;
    end_time: string | null;
}

interface Props {
    block: Block;
    isSelected: boolean;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    t: TransFunction;
}

const BlockCard = memo(
    ({ block, isSelected, onToggle, onDelete, t }: Props) => {
        const locale = window.document.documentElement.lang || 'pt-BR';
        const dateObj = new Date(block.date + 'T00:00:00');
        const day = dateObj.toLocaleDateString(locale, { day: '2-digit' });
        const month = dateObj
            .toLocaleDateString(locale, { month: 'short' })
            .toUpperCase()
            .replace('.', '');
        const weekday = dateObj.toLocaleDateString(locale, { weekday: 'long' });

        return (
            <motion.div
                layout
                onClick={() => onToggle(block.id)}
                whileHover={{ y: -4 }}
                className={`group relative flex cursor-pointer items-center gap-6 rounded-[2rem] border bg-white p-5 transition-all ${
                    isSelected
                        ? 'border-rose-500 shadow-2xl shadow-rose-500/10 ring-1 ring-rose-500'
                        : 'border-slate-100 shadow-sm hover:shadow-md'
                }`}
            >
                <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-200 group-hover:border-rose-300'}`}
                >
                    {isSelected && (
                        <Check
                            className="h-3 w-3"
                            strokeWidth={4}
                        />
                    )}
                </div>

                <div
                    className={`flex h-[70px] min-w-[65px] flex-col items-center justify-center rounded-2xl transition-colors ${isSelected ? 'bg-rose-50' : 'bg-slate-50'}`}
                >
                    <span
                        className={`text-[9px] font-black uppercase tracking-tighter ${isSelected ? 'text-rose-400' : 'text-slate-400'}`}
                    >
                        {month}
                    </span>
                    <span
                        className={`text-2xl font-black tracking-tighter ${isSelected ? 'text-rose-600' : 'text-slate-900'}`}
                    >
                        {day}
                    </span>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm font-black uppercase tracking-tight text-slate-800">
                        {weekday}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                        {block.full_day ? (
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                <CalendarDays className="h-3 w-3" />{' '}
                                {t('BLOCKS.TYPE_FULL')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                <Clock className="h-3 w-3" />{' '}
                                {block.start_time?.substring(0, 5)} —{' '}
                                {block.end_time?.substring(0, 5)}
                            </div>
                        )}
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                >
                    <Trash2 className="h-5 w-5" />
                </motion.button>
            </motion.div>
        );
    },
);

BlockCard.displayName = 'BlockCard';
export default BlockCard;
