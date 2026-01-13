import { useTrans } from '@/Hooks/useTrans';
import { Check } from 'lucide-react';

interface Props {
    start: string;
    end: string;
    label: string;
    onRemove: () => void;
    isSelected: boolean;
    onToggleSelect: () => void;
}

export default function AvailabilityCard({
    start,
    end,
    label,
    onRemove,
    isSelected,
    onToggleSelect,
}: Props) {
    const { t } = useTrans();

    return (
        <div
            onClick={onToggleSelect}
            className={`group relative min-w-[240px] max-w-[280px] flex-1 cursor-pointer rounded-[2rem] border p-6 transition-all duration-500 ${
                isSelected
                    ? '-translate-y-1 border-blue-500 bg-blue-50 shadow-[0_20px_40px_rgba(37,99,235,0.15)]'
                    : 'border-slate-100 bg-white hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)]'
            }`}
        >
            <div
                className={`absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${isSelected ? 'scale-110 border-blue-600 bg-blue-600 shadow-lg shadow-blue-200' : 'border-slate-100 bg-slate-50 group-hover:border-blue-200'}`}
            >
                {isSelected && (
                    <Check
                        size={14}
                        className="stroke-[4px] text-white"
                    />
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <span
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}
                >
                    {label}
                </span>

                <div className="flex items-center justify-between gap-3">
                    <span
                        className={`text-2xl font-black tracking-tighter transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}
                    >
                        {start.substring(0, 5)}
                    </span>

                    <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className={`h-full origin-left bg-blue-500 transition-transform duration-700 ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                        />
                    </div>

                    <span
                        className={`text-2xl font-black tracking-tighter ${isSelected ? 'text-blue-700' : 'text-blue-600'}`}
                    >
                        {end.substring(0, 5)}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-blue-400 hover:text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                >
                    {t('SCHEDULE.REMOVE')} <span className="text-xs">×</span>
                </button>
            </div>
        </div>
    );
}
