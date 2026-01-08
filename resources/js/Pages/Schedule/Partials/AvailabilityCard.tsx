import { useTrans } from '@/Hooks/useTrans';

interface Props {
    start: string;
    end: string;
    label: string;
    onRemove: () => void;
}

export default function AvailabilityCard({
    start,
    end,
    label,
    onRemove,
}: Props) {
    const { t } = useTrans();
    return (
        <div className="group relative min-w-[240px] max-w-[280px] flex-1 rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {label}
                </span>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-black tracking-tighter text-slate-900">
                        {start.substring(0, 5)}
                    </span>

                    <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full origin-left scale-x-0 bg-blue-500 transition-transform duration-700 group-hover:scale-x-100" />
                    </div>

                    <span className="text-2xl font-black tracking-tighter text-blue-600">
                        {end.substring(0, 5)}
                    </span>
                </div>

                <button
                    onClick={onRemove}
                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:text-red-500"
                >
                    {t('SCHEDULE.REMOVE') ?? 'REMOVER'}{' '}
                    <span className="text-xs">×</span>
                </button>
            </div>
        </div>
    );
}
