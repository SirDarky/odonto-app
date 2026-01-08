import { TransFunction } from '@/Hooks/useTrans';
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
            <div
                onClick={() => onToggle(block.id)}
                className={`group relative flex cursor-pointer items-center gap-6 rounded-[2rem] border bg-white p-5 transition-all duration-300 ${
                    isSelected
                        ? 'translate-x-1 border-rose-500 shadow-xl shadow-rose-500/10 ring-4 ring-rose-500/5'
                        : 'border-slate-100 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]'
                }`}
            >
                <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isSelected
                            ? 'border-rose-500 bg-rose-500'
                            : 'border-slate-200 group-hover:border-rose-300'
                    }`}
                >
                    {isSelected && (
                        <svg
                            className="h-3 w-3 text-white"
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

                <div
                    className={`flex h-[70px] min-w-[60px] flex-col items-center justify-center rounded-2xl transition-colors duration-500 ${
                        isSelected ? 'bg-rose-50' : 'bg-slate-50'
                    }`}
                >
                    <span
                        className={`text-[10px] font-black uppercase ${
                            isSelected ? 'text-rose-400' : 'text-slate-400'
                        }`}
                    >
                        {month}
                    </span>
                    <span
                        className={`text-2xl font-black leading-none tracking-tighter ${
                            isSelected ? 'text-rose-600' : 'text-slate-900'
                        }`}
                    >
                        {day}
                    </span>
                </div>

                <div className="flex flex-1 flex-col">
                    <span className="text-sm font-bold capitalize tracking-tight text-slate-800">
                        {weekday}
                    </span>

                    <div className="mt-1 flex items-center gap-2">
                        {block.full_day ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                                {t('BLOCKS.TYPE_FULL')}
                            </span>
                        ) : (
                            <span className="font-mono text-xs font-bold text-slate-500">
                                {block.start_time?.substring(0, 5)} —{' '}
                                {block.end_time?.substring(0, 5)}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 opacity-0 transition-all hover:text-rose-500 group-hover:opacity-100"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        );
    },
    (prev, next) =>
        prev.isSelected === next.isSelected && prev.block.id === next.block.id,
);

BlockCard.displayName = 'BlockCard';

export default BlockCard;
