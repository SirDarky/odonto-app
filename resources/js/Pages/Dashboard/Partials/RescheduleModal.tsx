import { useTrans } from '@/Hooks/useTrans';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, X } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    appointment: {
        id: number;
        patient_name: string;
        time: string;
        date: string;
    } | null;
}

export default function RescheduleModal({
    isOpen,
    onClose,
    appointment,
}: Props) {
    const { t } = useTrans();
    const { data, setData, patch, processing, errors, reset, clearErrors } =
        useForm({
            appointment_date: '',
            start_time: '',
        });

    useEffect(() => {
        if (appointment && isOpen) {
            setData({
                appointment_date: appointment.date,
                start_time: appointment.time,
            });
        }
    }, [appointment, isOpen, setData]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!appointment) return;

        patch(route('appointments.reschedule', appointment.id), {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black uppercase italic text-slate-800">
                            {t('MODAL_RESCHEDULE.TITLE')}
                        </h2>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {appointment.patient_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-rose-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Calendar className="h-3 w-3" />{' '}
                                {t('MODAL_RESCHEDULE.NEW_DATE')}
                            </label>
                            <input
                                type="date"
                                value={data.appointment_date}
                                onChange={(e) =>
                                    setData('appointment_date', e.target.value)
                                }
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Clock className="h-3 w-3" />{' '}
                                {t('MODAL_RESCHEDULE.NEW_TIME')}
                            </label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                                required
                            />
                        </div>
                    </div>

                    {errors.start_time && (
                        <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-[10px] font-bold uppercase tracking-widest text-rose-500">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errors.start_time}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                    >
                        {processing
                            ? t('MODAL_RESCHEDULE.UPDATING')
                            : t('MODAL_RESCHEDULE.SUBMIT')}
                    </button>
                </form>
            </div>
        </div>
    );
}
