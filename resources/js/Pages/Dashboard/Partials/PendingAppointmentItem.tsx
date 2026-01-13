import { DashboardAction } from '@/types/Enums';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar as CalendarIcon,
    Check,
    Clock,
    User,
    X,
} from 'lucide-react';
import { forwardRef } from 'react'; // Adicionado

interface Props {
    appointment: {
        id: number;
        patient_id: number;
        patient_name: string;
        date: string;
        time: string;
        is_past?: boolean;
    };
    onAction: (id: number, action: DashboardAction) => void;
    onViewProfile: (patientId: number) => void;
}

// Envolva o componente com forwardRef
const PendingAppointmentItem = forwardRef<HTMLDivElement, Props>(
    ({ appointment, onAction, onViewProfile }, ref) => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '';
            try {
                const [year, month, day] = dateString.split('-');
                const date = new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day),
                );
                return new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            } catch {
                return dateString;
            }
        };

        return (
            <motion.div
                ref={ref} // <--- IMPORTANTE: Repasse a ref para o motion.div aqui
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex items-center justify-between rounded-[1.5rem] border p-4 shadow-sm transition-all hover:shadow-md ${
                    appointment.is_past
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-slate-100 bg-white'
                }`}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onViewProfile(appointment.patient_id)}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                            appointment.is_past
                                ? 'bg-slate-200 text-slate-400'
                                : 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
                        }`}
                    >
                        <User className="h-6 w-6" />
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <h4
                                onClick={() =>
                                    onViewProfile(appointment.patient_id)
                                }
                                className="cursor-pointer text-sm font-black uppercase leading-none text-slate-800 transition-colors hover:text-rose-500"
                            >
                                {appointment.patient_name}
                            </h4>
                            {appointment.is_past && (
                                <span className="flex items-center gap-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-[8px] font-black uppercase text-rose-500">
                                    <AlertCircle className="h-2 w-2" /> Expirado
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3 w-3 text-rose-400" />
                                {formatDate(appointment.date)}
                            </span>
                            <span className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                                <Clock className="h-3 w-3 text-rose-400" />
                                {appointment.time}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!appointment.is_past && (
                        <button
                            onClick={() =>
                                onAction(
                                    appointment.id,
                                    DashboardAction.CONFIRM,
                                )
                            }
                            className="rounded-xl bg-emerald-500 p-2.5 text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600 active:scale-90"
                            title="Confirmar"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                    )}

                    <button
                        onClick={() =>
                            onAction(appointment.id, DashboardAction.CANCEL)
                        }
                        className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 active:scale-90"
                        title="Recusar/Cancelar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        );
    },
);

PendingAppointmentItem.displayName = 'PendingAppointmentItem'; // Boa prática ao usar forwardRef

export default PendingAppointmentItem;
