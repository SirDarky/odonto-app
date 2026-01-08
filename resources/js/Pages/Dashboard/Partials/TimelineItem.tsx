import { TransFunction } from '@/Hooks/useTrans';
import { TimelineSlot } from '@/Pages/Dashboard';
import { AppointmentStatus, DashboardAction } from '@/types/Enums';
import { Check, Clock, X } from 'lucide-react';

interface Props {
    slot: TimelineSlot;
    t: TransFunction;
    onAction: (id: number, action: DashboardAction) => void;
    onSelect: (time: string) => void;
}

export default function TimelineItem({ slot, t, onAction, onSelect }: Props) {
    const status = slot.appointment?.status;
    const hasAppointment = !!slot.appointment;
    const isPending = status === AppointmentStatus.PENDING;

    const getBgColor = () => {
        if (slot.is_blocked)
            return 'border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed';
        if (isPending)
            return 'border-amber-200 bg-amber-50/40 ring-4 ring-amber-500/5 cursor-default';
        if (status === AppointmentStatus.SCHEDULED)
            return 'border-emerald-100 bg-emerald-50/40 cursor-default';
        return 'border-slate-50 bg-white hover:border-rose-100 hover:shadow-md cursor-pointer';
    };

    const getTimeColor = () => {
        if (isPending) return 'text-amber-600';
        if (status === AppointmentStatus.SCHEDULED) return 'text-emerald-600';
        return 'text-slate-400';
    };

    // Handler para o clique no card
    const handleCardClick = () => {
        if (!hasAppointment && !slot.is_blocked) {
            onSelect(slot.time);
        }
    };

    return (
        <button
            onClick={handleCardClick}
            disabled={slot.is_blocked}
            className={`group relative flex w-full gap-4 rounded-[1.8rem] border p-4 text-left transition-all duration-300 ${getBgColor()}`}
        >
            {/* Indicador de Hora */}
            <div
                className={`flex min-w-[55px] flex-col items-center justify-center border-r border-black/5 pr-4 transition-colors ${getTimeColor()}`}
            >
                <span className="text-xs font-black">{slot.time}</span>
                <Clock className="mt-1 h-3 w-3 opacity-50" />
            </div>

            <div className="flex flex-1 flex-col justify-center">
                {slot.is_blocked ? (
                    <span className="text-[10px] font-bold uppercase italic text-slate-400">
                        {t('DASHBOARD.BLOCKED')}
                    </span>
                ) : slot.appointment ? (
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-tight text-slate-800">
                            {slot.appointment.patient_name}
                        </span>
                        <span
                            className={`text-[10px] font-bold ${status === AppointmentStatus.SCHEDULED ? 'text-emerald-600/60' : 'text-slate-400'}`}
                        >
                            {slot.appointment.procedure}
                        </span>

                        {isPending && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita disparar o clique do card pai
                                        onAction(
                                            slot.appointment!.id,
                                            DashboardAction.CONFIRM,
                                        );
                                    }}
                                    className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-[9px] font-black uppercase text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95"
                                >
                                    <Check className="h-3 w-3" />
                                    {t('ACTION.CONFIRM')}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction(
                                            slot.appointment!.id,
                                            DashboardAction.CANCEL,
                                        );
                                    }}
                                    className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-slate-400 transition-colors hover:text-rose-500 active:scale-95"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 transition-colors group-hover:text-rose-400">
                        {t('DASHBOARD.AVAILABLE')}
                    </span>
                )}
            </div>
        </button>
    );
}
