import InputError from '@/Components/InputError';
import { useTrans } from '@/Hooks/useTrans';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Check,
    Fingerprint,
    Mail,
    Phone,
    Search,
    Sparkles,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingFormProps {
    doctorId: number;
    doctorSlug: string;
    selectedDate: string;
    selectedSlot: string;
    onBack: () => void;
}

interface ExistingPatient {
    id: number;
    name: string;
    phone: string;
    email: string;
}

export default function BookingForm({
    doctorId,
    doctorSlug,
    selectedDate,
    selectedSlot,
    onBack,
}: BookingFormProps) {
    const { t } = useTrans();
    const [step, setStep] = useState<
        'identify' | 'register' | 'confirm_existing'
    >('identify');
    const [searching, setSearching] = useState(false);
    const [foundPatient, setFoundPatient] = useState<ExistingPatient | null>(
        null,
    );

    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            user_id: doctorId,
            cpf: '',
            name: '',
            phone: '',
            email: '',
            appointment_date: selectedDate,
            start_time: selectedSlot,
            website_url: '',
        });

    const maskCPF = (v: string) =>
        v
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14);

    const maskPhone = (v: string) =>
        v
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);

    const handleSearchPatient = async (cleanCpf: string) => {
        setSearching(true);
        clearErrors();
        try {
            const response = await axios.get(route('patients.searchPublic'), {
                params: { cpf: cleanCpf },
            });

            if (response.data && response.data.id) {
                const patient = response.data as ExistingPatient;
                setFoundPatient(patient);

                setData((prev) => ({
                    ...prev,
                    name: patient.name,
                    phone: patient.phone,
                    email: patient.email,
                    cpf: data.cpf,
                }));

                setStep('confirm_existing');
            } else {
                setFoundPatient(null);
                setData((prev) => ({
                    ...prev,
                    name: '',
                    phone: '',
                    email: '',
                    cpf: data.cpf,
                }));
                setStep('register');
            }
        } catch {
            setStep('register');
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        const cleanCpf = data.cpf.replace(/\D/g, '');
        if (cleanCpf.length === 11 && step === 'identify') {
            handleSearchPatient(cleanCpf);
        }
    }, [data.cpf]);

    const handleReset = () => {
        setStep('identify');
        setFoundPatient(null);
        reset('cpf', 'name', 'phone', 'email');
        clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searching) return;

        post(route('public.book', doctorSlug), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Agendamento postado com sucesso');
            },
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3rem] border border-slate-50 bg-white p-8 shadow-2xl md:p-10"
        >
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 transition-colors hover:text-rose-500"
            >
                <ArrowLeft size={14} /> {t('PUBLIC_PROFILE.BACK_TO_SCHEDULE')}
            </button>

            <header className="mb-8">
                <h2 className="text-2xl font-black italic text-slate-800">
                    {t('PUBLIC_PROFILE.CONFIRM_TITLE')}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-400">
                    {selectedSlot} •{' '}
                    <span className="font-black uppercase text-rose-500">
                        {new Date(
                            selectedDate + 'T00:00:00',
                        ).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                        })}
                    </span>
                </p>
            </header>

            <form
                onSubmit={submit}
                className="space-y-6"
            >
                <div className="relative">
                    <div className="mb-2 flex items-center justify-between px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {t('PUBLIC_PROFILE.LABEL_CPF')}
                        </label>
                        {searching && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Search
                                    size={12}
                                    className="text-rose-500"
                                />
                            </motion.div>
                        )}
                    </div>
                    <div className="relative">
                        <Fingerprint
                            className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${step !== 'identify' ? 'text-emerald-500' : 'text-slate-300'}`}
                        />
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            readOnly={step !== 'identify'}
                            className={`w-full rounded-2xl border-slate-100 py-4 pl-12 text-sm font-bold outline-none transition-all ${step !== 'identify' ? 'cursor-not-allowed border-transparent bg-slate-50/50 text-slate-500' : 'bg-slate-50 focus:ring-4 focus:ring-rose-500/5'}`}
                            value={data.cpf}
                            onChange={(e) =>
                                setData('cpf', maskCPF(e.target.value))
                            }
                            disabled={processing || searching}
                        />
                        {step !== 'identify' && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-rose-500 underline underline-offset-4 hover:text-rose-600"
                            >
                                {t('PUBLIC_PROFILE.ALTER_CPF')}
                            </button>
                        )}
                    </div>
                    <InputError message={errors.cpf} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 'confirm_existing' && foundPatient && (
                        <motion.div
                            key="existing"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6"
                        >
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                                    <Check size={16} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    {t('PUBLIC_PROFILE.PATIENT_FOUND_TITLE')}
                                </p>
                            </div>
                            <h3 className="text-lg font-black text-slate-800">
                                {foundPatient.name}
                            </h3>
                            <p className="mt-2 text-xs italic text-slate-500">
                                {t('PUBLIC_PROFILE.PATIENT_FOUND_DESC')}
                            </p>
                        </motion.div>
                    )}

                    {step === 'register' && (
                        <motion.div
                            key="new"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-4 border-t border-slate-50 pt-4"
                        >
                            <div className="mb-4 flex items-center gap-2 text-rose-500">
                                <Sparkles size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    {t('PUBLIC_PROFILE.NEW_PATIENT_TITLE')}
                                </span>
                            </div>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder={t('PUBLIC_PROFILE.LABEL_NAME')}
                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-rose-500/5"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder={t(
                                            'PUBLIC_PROFILE.LABEL_PHONE',
                                        )}
                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-rose-500/5"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData(
                                                'phone',
                                                maskPhone(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="email"
                                        placeholder={t(
                                            'PUBLIC_PROFILE.LABEL_EMAIL',
                                        )}
                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none focus:ring-4 focus:ring-rose-500/5"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step !== 'identify' && (
                    <button
                        type="submit"
                        disabled={processing || searching}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-rose-600 active:scale-[0.98] disabled:opacity-50"
                    >
                        {processing ? (
                            '...'
                        ) : (
                            <>
                                <Check size={16} />{' '}
                                {t('PUBLIC_PROFILE.SUBMIT_BUTTON')}
                            </>
                        )}
                    </button>
                )}
            </form>
        </motion.div>
    );
}
