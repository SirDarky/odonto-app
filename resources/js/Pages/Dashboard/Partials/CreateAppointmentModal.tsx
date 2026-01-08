import { useTrans } from '@/Hooks/useTrans';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { FileText, Mail, Phone, Search, User, X } from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedTime: string;
    selectedDate: string;
}

interface PatientData {
    name: string;
    phone: string;
    email?: string;
}

export default function CreateAppointmentModal({
    isOpen,
    onClose,
    selectedTime,
    selectedDate,
}: Props) {
    const { t } = useTrans();
    const { auth } = usePage().props;
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            user_id: auth.user.id,
            name: '',
            cpf: '',
            phone: '',
            email: '',
            appointment_date: selectedDate,
            start_time: selectedTime,
        });

    useEffect(() => {
        if (isOpen) {
            setData((prev) => ({
                ...prev,
                appointment_date: selectedDate,
                start_time: selectedTime,
            }));
        }
    }, [isOpen, selectedTime, selectedDate, setData]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const maskCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .substring(0, 14);
    };

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15);
    };

    const fetchPatient = useCallback(
        async (cpfValue: string) => {
            const cleanCpf = cpfValue.replace(/\D/g, '');
            if (cleanCpf.length !== 11) return;

            setIsSearching(true);
            try {
                const response = await axios.get<PatientData | null>(
                    route('patients.search'),
                    { params: { cpf: cleanCpf } },
                );

                if (response.data) {
                    const patient = response.data;
                    setData((prev) => ({
                        ...prev,
                        name: patient.name || '',
                        phone: patient.phone ? maskPhone(patient.phone) : '',
                        email: patient.email || '',
                    }));
                }
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setIsSearching(false);
            }
        },
        [setData],
    );

    useEffect(() => {
        const clean = data.cpf.replace(/\D/g, '');
        if (clean.length === 11) {
            fetchPatient(clean);
        }
    }, [data.cpf, fetchPatient]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointments.store'), {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl duration-300">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">
                            {t('MODAL_APPOINTMENT.TITLE')}
                        </h2>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                            {selectedTime} • {selectedDate}
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
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <FileText className="h-3 w-3" />{' '}
                            {t('MODAL_APPOINTMENT.CPF_LABEL')}
                        </label>
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={data.cpf}
                                    onChange={(e) =>
                                        setData('cpf', maskCPF(e.target.value))
                                    }
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                                    placeholder="000.000.000-00"
                                    required
                                />
                                {isSearching && (
                                    <Search className="absolute right-4 top-4 h-4 w-4 animate-spin text-rose-500" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fetchPatient(data.cpf)}
                                disabled={
                                    isSearching ||
                                    data.cpf.replace(/\D/g, '').length < 11
                                }
                                className="flex items-center justify-center rounded-2xl bg-slate-100 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-200 disabled:opacity-50"
                            >
                                {t('MODAL_APPOINTMENT.SEARCH_BUTTON')}
                            </button>
                        </div>
                        {errors.cpf && (
                            <p className="px-1 text-[10px] font-bold text-rose-500">
                                {errors.cpf}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <User className="h-3 w-3" />{' '}
                            {t('MODAL_APPOINTMENT.PATIENT_NAME')}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                            placeholder={t(
                                'MODAL_APPOINTMENT.PATIENT_NAME_PLACEHOLDER',
                            )}
                            required
                        />
                        {errors.name && (
                            <p className="px-1 text-[10px] font-bold text-rose-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Phone className="h-3 w-3" />{' '}
                                {t('MODAL_APPOINTMENT.PHONE_LABEL')}
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', maskPhone(e.target.value))
                                }
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Mail className="h-3 w-3" />{' '}
                                {t('MODAL_APPOINTMENT.EMAIL_LABEL')}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-rose-500 focus:ring-rose-500"
                                placeholder={t(
                                    'MODAL_APPOINTMENT.EMAIL_PLACEHOLDER',
                                )}
                            />
                        </div>
                    </div>

                    {errors.start_time && (
                        <div className="rounded-2xl bg-rose-50 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-rose-500">
                            {errors.start_time}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || isSearching}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-slate-800 disabled:opacity-50"
                    >
                        {processing
                            ? t('MODAL_APPOINTMENT.SAVING')
                            : t('MODAL_APPOINTMENT.SUBMIT')}
                    </button>
                </form>
            </div>
        </div>
    );
}
