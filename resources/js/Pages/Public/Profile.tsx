import { useTrans } from '@/Hooks/useTrans';
import { PageProps } from '@/types'; // Importe sua interface de tipos
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import BookingForm from './Partials/BookingForm';
import DoctorLocationInfo from './Partials/DoctorLocationInfo';
import SlotPicker from './Partials/SlotPicker';

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    bio: string;
    avatar_path: string | null;
    slug: string;
    address?: string;
    google_maps_link?: string;
    phone?: string;
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
    availableSlots = [],
    availableDays = [],
    selectedDate,
}: Props) {
    const { t } = useTrans();
    const { props } = usePage<PageProps>();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const showSuccessScreen = !!props.flash?.success;

    const changeDate = (date: string): void => {
        router.get(
            route('public.profile', doctor.slug),
            { date },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['availableSlots', 'selectedDate'],
                onSuccess: () => setSelectedSlot(null),
            },
        );
    };

    if (showSuccessScreen) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic text-slate-900">
                        {t('PUBLIC_PROFILE.SUCCESS_TITLE')}
                    </h2>
                    <p className="mx-auto mt-4 max-w-sm font-medium text-slate-500">
                        {t('PUBLIC_PROFILE.SUCCESS_MESSAGE')}
                    </p>
                    <button
                        onClick={() =>
                            (window.location.href = route(
                                'public.profile',
                                doctor.slug,
                            ))
                        }
                        className="mx-auto mt-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 transition-colors hover:text-rose-600"
                    >
                        <ArrowLeft size={14} />
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
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-10 space-y-10"
                        >
                            <div className="space-y-6 text-center lg:text-left">
                                <div className="mx-auto h-40 w-40 overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl ring-1 ring-slate-100 lg:mx-0">
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
                                    <h1 className="text-4xl font-black italic leading-none tracking-tight text-slate-900">
                                        {doctor.name}
                                    </h1>
                                    <p className="mt-3 inline-block rounded-full bg-rose-50 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                        {doctor.specialty}
                                    </p>
                                </div>
                                <p className="text-md font-medium leading-relaxed text-slate-500">
                                    {doctor.bio || t('PUBLIC_PROFILE.NO_BIO')}
                                </p>
                            </div>
                            <DoctorLocationInfo
                                address={doctor.address}
                                mapsLink={doctor.google_maps_link}
                                phone={doctor.phone}
                            />
                        </motion.div>
                    </div>

                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {!selectedSlot ? (
                                <SlotPicker
                                    availableDays={availableDays}
                                    availableSlots={availableSlots}
                                    selectedDate={selectedDate}
                                    onDateChange={changeDate}
                                    onSlotSelect={setSelectedSlot}
                                />
                            ) : (
                                <BookingForm
                                    doctorId={doctor.id}
                                    doctorSlug={doctor.slug}
                                    selectedDate={selectedDate}
                                    selectedSlot={selectedSlot}
                                    onBack={() => setSelectedSlot(null)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
