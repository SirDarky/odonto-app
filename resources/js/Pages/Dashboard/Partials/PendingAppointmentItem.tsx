import { DashboardAction } from '@/types/Enums';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, Clock, User, X } from 'lucide-react';

interface Props {
    appointment: {
        id: number;
        patient_name: string;
        date: string;
        time: string;
    };
    onAction: (id: number, action: DashboardAction) => void;
}

export default function PendingAppointmentItem({
    appointment,
    onAction,
}: Props) {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        try {
            const [year, month, day] = dateString.split('-');
            const date = new Date(Number(year), Number(month) - 1, Number(day));

            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(date);
        } catch {
            console.error('Erro ao formatar data:', dateString);
            return dateString;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                    <User className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="mb-1 text-sm font-black uppercase leading-none text-slate-800">
                        {appointment.patient_name}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <CalendarIcon className="h-3 w-3 text-rose-400" />
                            {formatDate(appointment.date)}
                        </span>
                        <span className="flex items-center gap-1.5 border-l border-slate-100 pl-3">
                            <Clock className="h-3 w-3 text-rose-400" />
                            {appointment.time}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() =>
                        onAction(appointment.id, DashboardAction.CONFIRM)
                    }
                    className="rounded-xl bg-emerald-500 p-2.5 text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600 active:scale-90"
                >
                    <Check className="h-4 w-4" />
                </button>
                <button
                    onClick={() =>
                        onAction(appointment.id, DashboardAction.CANCEL)
                    }
                    className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 active:scale-90"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}
