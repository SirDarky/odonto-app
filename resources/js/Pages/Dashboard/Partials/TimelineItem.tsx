import { TransFunction } from '@/Hooks/useTrans';
import { TimelineSlot } from '@/Pages/Dashboard';
import { AppointmentStatus, DashboardAction } from '@/types/Enums';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Ban,
    CalendarDays,
    Check,
    Clock,
    MoreVertical,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface RescheduleData {
    id: number;
    patient_name: string;
    time: string;
    date: string;
}

interface Props {
    slot: TimelineSlot & { is_past?: boolean };
    t: TransFunction;
    selectedDate: string;
    onAction: (id: number, action: DashboardAction) => void;
    onSelect: (time: string) => void;
    onReschedule: (data: RescheduleData) => void;
    onViewProfile: (patientId: number) => void;
}

export default function TimelineItem({
    slot,
    t,
    selectedDate,
    onAction,
    onSelect,
    onReschedule,
    onViewProfile,
}: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const status = slot.appointment?.status;
    const isPending = status === AppointmentStatus.PENDING;
    const isScheduled = status === AppointmentStatus.SCHEDULED;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getBgColor = () => {
        if (slot.is_blocked)
            return 'border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed';
        if (slot.is_past && !slot.appointment)
            return 'border-slate-50 bg-slate-50/30 opacity-50 cursor-default';
        if (isPending)
            return 'border-amber-200 bg-amber-50/40 ring-4 ring-amber-500/5';
        if (isScheduled) return 'border-emerald-100 bg-emerald-50/40';
        return 'border-slate-50 bg-white hover:border-rose-100 hover:shadow-md cursor-pointer';
    };

    const getTimeColor = () => {
        if (isPending) return 'text-amber-600';
        if (isScheduled) return 'text-emerald-600';
        return 'text-slate-400';
    };

    const handleSlotClick = () => {
        if (!slot.appointment && !slot.is_blocked && !slot.is_past) {
            onSelect(slot.time);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
                !slot.is_past || slot.appointment ? { scale: 1.01, x: 5 } : {}
            }
            whileTap={!slot.is_past || slot.appointment ? { scale: 0.98 } : {}}
            onClick={handleSlotClick}
            className={`group relative flex w-full gap-4 rounded-[1.8rem] border p-4 text-left transition-all duration-300 ${getBgColor()} ${
                menuOpen ? 'z-[60] shadow-xl' : 'z-10'
            }`}
        >
            <div
                className={`flex min-w-[55px] flex-col items-center justify-center border-r border-black/5 pr-4 transition-colors ${getTimeColor()}`}
            >
                <span className="text-xs font-black">{slot.time}</span>
                <Clock className="mt-1 h-3 w-3 opacity-50" />
            </div>

            <div className="flex flex-1 flex-col justify-center pr-8">
                {slot.is_blocked ? (
                    <span className="text-[10px] font-bold uppercase italic text-slate-400">
                        {t('DASHBOARD.BLOCKED')}
                    </span>
                ) : slot.appointment ? (
                    <div className="flex flex-col">
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                if (slot.appointment?.patient_id)
                                    onViewProfile(slot.appointment.patient_id);
                            }}
                            className="cursor-pointer text-xs font-black uppercase tracking-tight text-slate-800 transition-colors hover:text-rose-500"
                        >
                            {slot.appointment.patient_name}
                        </span>
                        <span
                            className={`text-[10px] font-bold ${isScheduled ? 'text-emerald-600/60' : 'text-slate-400'}`}
                        >
                            {slot.appointment.procedure}
                        </span>

                        {isPending && (
                            <div className="mt-3 flex items-center gap-2">
                                {!slot.is_past ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
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
                                ) : (
                                    <div className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[9px] font-black uppercase text-rose-500">
                                        <AlertCircle className="h-3 w-3" />
                                        Horário Expirado (Reagendar)
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 group-hover:text-rose-400">
                        {slot.is_past
                            ? 'Indisponível'
                            : t('DASHBOARD.AVAILABLE')}
                    </span>
                )}
            </div>

            {slot.appointment && (
                <div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    ref={menuRef}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        className={`rounded-full p-2 transition-all active:scale-90 ${
                            menuOpen
                                ? 'bg-slate-100 text-slate-600'
                                : 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'
                        }`}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {menuOpen && (
                        <div className="animate-in fade-in zoom-in-95 absolute right-0 z-[70] mt-2 w-48 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onReschedule({
                                        id: slot.appointment!.id,
                                        patient_name:
                                            slot.appointment!.patient_name,
                                        time: slot.time,
                                        date: selectedDate,
                                    });
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                <CalendarDays className="h-4 w-4 text-blue-500" />
                                {t('ACTION.RESCHEDULE')}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAction(
                                        slot.appointment!.id,
                                        DashboardAction.CANCEL,
                                    );
                                    setMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-rose-500 transition-colors hover:bg-rose-50"
                            >
                                <Ban className="h-4 w-4" />
                                {t('ACTION.CANCEL')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
