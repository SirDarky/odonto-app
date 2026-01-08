import InputError from '@/Components/InputError';
import { useTrans } from '@/Hooks/useTrans';
import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
    CalendarDays,
    CheckCircle2,
    Fingerprint,
    Phone,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Interfaces estritas
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    bio: string;
    avatar_path: string | null;
    slug: string;
}

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

interface Props {
    doctor: Doctor;
    availableSlots: AvailableSlot[];
    availableDays: AvailableDay[];
    selectedDate: string;
}

export default function Profile({
    doctor,
    availableSlots = [], // Default value para evitar undefined
    availableDays = [], // Default value para evitar undefined
    selectedDate,
}: Props) {
    const { t } = useTrans();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            user_id: doctor.id,
            name: '',
            cpf: '',
            phone: '',
            email: '',
            appointment_date: selectedDate,
            start_time: '',
            website_url: '', // HONEYPOT
        });

    // Atualiza a data no formulário sempre que a selectedDate mudar via router.get
    useEffect(() => {
        setData('appointment_date', selectedDate);
    }, [selectedDate]);

    // --- FUNÇÕES DE MÁSCARA ---
    const maskCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const changeDate = (date: string) => {
        router.get(
            route('public.profile', doctor.slug),
            { date },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['availableSlots', 'selectedDate'],
                onSuccess: () => {
                    setSelectedSlot(null);
                },
            },
        );
    };

    const handleSelectSlot = (time: string) => {
        setSelectedSlot(time);
        setData('start_time', time);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('public.book', doctor.slug));
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 },
        },
        exit: { opacity: 0, y: -20 },
    };

    if (recentlySuccessful) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black italic text-slate-900">
                        {t('PUBLIC_PROFILE.SUCCESS_TITLE')}
                    </h1>
                    <p className="mt-4 font-medium text-slate-500">
                        {t('PUBLIC_PROFILE.SUCCESS_MESSAGE')}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 transition-colors hover:text-rose-600"
                    >
                        {t('PUBLIC_PROFILE.BACK_TO_SITE')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBFC] selection:bg-rose-100">
            <Head title={`${doctor.name} - Agendamento Online`} />
            <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    {/* Perfil */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-10 space-y-8"
                        >
                            <div className="h-40 w-40 overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl ring-1 ring-slate-100">
                                {doctor.avatar_path ? (
                                    <img
                                        src={`/storage/${doctor.avatar_path}`}
                                        alt={doctor.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-4xl font-black italic text-slate-300">
                                        {doctor.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl font-black leading-none tracking-tight text-slate-900">
                                    {doctor.name}
                                </h1>
                                <p className="mt-3 inline-block rounded-full bg-rose-50 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                    {doctor.specialty}
                                </p>
                            </div>
                            <p className="text-md font-medium leading-relaxed text-slate-500">
                                {doctor.bio}
                            </p>
                        </motion.div>
                    </div>

                    {/* Área de Agendamento */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {!selectedSlot ? (
                                <motion.div
                                    key="slots"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="mb-10">
                                        <h2 className="mb-6 text-xl font-black italic tracking-tight text-slate-800">
                                            Escolha o melhor dia
                                        </h2>
                                        <div className="custom-scrollbar flex gap-3 overflow-x-auto pb-4">
                                            {/* Uso de Optional Chaining para evitar o erro de map */}
                                            {availableDays?.map((day) => (
                                                <button
                                                    key={day.full}
                                                    onClick={() =>
                                                        changeDate(day.full)
                                                    }
                                                    className={`flex min-w-[75px] flex-col items-center rounded-[1.5rem] border py-4 transition-all active:scale-95 ${selectedDate === day.full ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border-slate-100 bg-white text-slate-400 hover:border-rose-200'}`}
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

                                    <div className="rounded-[3rem] border border-slate-50 bg-white p-10 shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
                                        <div className="mb-8 flex items-center justify-between">
                                            <h2 className="text-2xl font-black italic tracking-tight text-slate-800">
                                                Horários disponíveis
                                            </h2>
                                            <CalendarDays className="h-5 w-5 text-rose-500/30" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Uso de Optional Chaining para evitar o erro de map */}
                                            {availableSlots?.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() =>
                                                        handleSelectSlot(
                                                            slot.time,
                                                        )
                                                    }
                                                    className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 py-5 transition-all hover:border-rose-500 hover:bg-white hover:shadow-xl hover:shadow-rose-500/10 active:scale-95"
                                                >
                                                    <span className="text-lg font-black text-slate-700 group-hover:text-rose-600">
                                                        {slot.time}
                                                    </span>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-rose-400">
                                                        Disponível
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {(!availableSlots ||
                                            availableSlots.length === 0) && (
                                            <div className="py-10 text-center">
                                                <p className="text-sm font-medium italic text-slate-400">
                                                    Nenhum horário livre para
                                                    esta data.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="rounded-[3rem] border border-slate-50 bg-white p-10 shadow-2xl"
                                >
                                    <button
                                        onClick={() => setSelectedSlot(null)}
                                        className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-rose-500"
                                    >
                                        ← Voltar para datas e horários
                                    </button>
                                    <header className="mb-10">
                                        <h2 className="text-2xl font-black italic text-slate-800">
                                            {t('PUBLIC_PROFILE.CONFIRM_TITLE')}
                                        </h2>
                                        <p className="mt-1 text-sm font-medium italic text-slate-400">
                                            Agendando para:{' '}
                                            <span className="font-black text-rose-500 underline underline-offset-4">
                                                {selectedSlot}
                                            </span>
                                        </p>
                                    </header>

                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        <input
                                            type="text"
                                            name="website_url"
                                            value={data.website_url}
                                            onChange={(e) =>
                                                setData(
                                                    'website_url',
                                                    e.target.value,
                                                )
                                            }
                                            className="hidden"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                                <input
                                                    placeholder={t(
                                                        'PUBLIC_PROFILE.LABEL_NAME',
                                                    )}
                                                    className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none transition-all focus:ring-4 focus:ring-rose-500/5"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.name}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="relative">
                                                    <Fingerprint className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                                    <input
                                                        placeholder={t(
                                                            'PUBLIC_PROFILE.LABEL_CPF',
                                                        )}
                                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none transition-all focus:ring-4 focus:ring-rose-500/5"
                                                        value={data.cpf}
                                                        onChange={(e) =>
                                                            setData(
                                                                'cpf',
                                                                maskCPF(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.cpf}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                                                    <input
                                                        placeholder={t(
                                                            'PUBLIC_PROFILE.LABEL_PHONE',
                                                        )}
                                                        className="w-full rounded-2xl border-slate-100 bg-slate-50 py-4 pl-12 text-sm font-bold outline-none transition-all focus:ring-4 focus:ring-rose-500/5"
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData(
                                                                'phone',
                                                                maskPhone(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            disabled={processing}
                                            className="group w-full rounded-2xl bg-slate-900 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-rose-600 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {processing
                                                ? '...'
                                                : t(
                                                      'PUBLIC_PROFILE.SUBMIT_BUTTON',
                                                  )}
                                        </button>
                                        <InputError
                                            message={errors.start_time}
                                            className="text-center"
                                        />
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
