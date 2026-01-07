import { useTrans } from "@/Hooks/useTrans";

interface Props {
    start: string;
    end: string;
    label: string;
    onRemove: () => void;
}

export default function AvailabilityCard({ start, end, label, onRemove }: Props) {
    const { t } = useTrans();
    return (
        /* min-w-[200px] garante que o card não esmague o texto */
        <div className="group relative flex-1 min-w-[240px] max-w-[280px] bg-white border border-slate-100 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">

            <div className="flex flex-col space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    {label}
                </span>

                <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        {start.substring(0, 5)}
                    </span>

                    {/* Linha decorativa que não quebra o layout */}
                    <div className="flex-1 h-[2px] bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </div>

                    <span className="text-2xl font-black text-blue-600 tracking-tighter">
                        {end.substring(0, 5)}
                    </span>
                </div>

                <button
                    onClick={onRemove}
                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors"
                >
                    {t('SCHEDULE.REMOVE') ?? 'REMOVER'} <span className="text-xs">×</span>
                </button>
            </div>
        </div>
    );
}