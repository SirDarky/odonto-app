import { useTrans } from '@/Hooks/useTrans';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

interface AvailableSlot {
    id: number;
    time: string;
}

interface AvailableDay {
    full: string;
    day: string;
    month: string;
    weekday: string;
}

interface SlotPickerProps {
    availableDays: AvailableDay[];
    availableSlots: AvailableSlot[];
    selectedDate: string;
    onDateChange: (date: string) => void;
    onSlotSelect: (time: string) => void;
}

export default function SlotPicker({
    availableDays,
    availableSlots,
    selectedDate,
    onDateChange,
    onSlotSelect,
}: SlotPickerProps) {
    const { t } = useTrans();

    return (
        <motion.div
            key="slots"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            <div className="mb-10">
                <h2 className="mb-6 text-xl font-black italic tracking-tight text-slate-800">
                    {t('PUBLIC_PROFILE.CHOOSE_DAY') || 'Escolha o melhor dia'}
                </h2>
                <div className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
                    {availableDays.map((day) => (
                        <button
                            key={day.full}
                            onClick={() => onDateChange(day.full)}
                            className={`flex min-w-[75px] snap-center flex-col items-center rounded-[1.5rem] border py-4 transition-all active:scale-95 ${
                                selectedDate === day.full
                                    ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'border-slate-100 bg-white text-slate-400 hover:border-rose-200'
                            }`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-tighter">
                                {day.month}
                            </span>
                            <span className="text-xl font-black">
                                {day.day}
                            </span>
                            <span className="text-[8px] font-bold uppercase">
                                {day.weekday}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-[3rem] border border-slate-50 bg-white p-6 shadow-[0_40px_100px_rgba(0,0,0,0.03)] md:p-10">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black italic tracking-tight text-slate-800">
                        {t('PUBLIC_PROFILE.AVAILABLE_HOURS') ||
                            'Horários disponíveis'}
                    </h2>
                    <CalendarDays className="h-5 w-5 text-rose-500/30" />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {availableSlots.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => onSlotSelect(slot.time)}
                            className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 py-5 transition-all hover:border-rose-500 hover:bg-white hover:shadow-xl hover:shadow-rose-500/10 active:scale-95"
                        >
                            <span className="text-lg font-black text-slate-700 group-hover:text-rose-600">
                                {slot.time}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-rose-400">
                                {t('DASHBOARD.AVAILABLE') || 'Disponível'}
                            </span>
                        </button>
                    ))}
                </div>

                {availableSlots.length === 0 && (
                    <div className="py-10 text-center">
                        <p className="text-sm font-medium italic text-slate-400">
                            {t('PUBLIC_PROFILE.NO_SLOTS') ||
                                'Nenhum horário livre para esta data.'}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
