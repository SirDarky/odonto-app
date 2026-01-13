import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { CalendarDays, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import AvailabilityCard from './Partials/AvailabilityCard';

interface Availability {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

interface Props {
    availabilities: Availability[];
}

const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4)
        .toString()
        .padStart(2, '0');
    const minutes = ((i % 4) * 15).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
});

export default function Settings({ availabilities }: Props) {
    const { t } = useTrans();
    const { addToast } = useToast();
    const [isBulk, setIsBulk] = useState(true);
    const [slotDuration, setSlotDuration] = useState(30);
    const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            day_of_week: 1,
            start_time: '',
            end_time: '',
        });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    };

    const daysSelection = useMemo(
        () => [
            { label: t('DAYS.MONDAY'), value: 1 },
            { label: t('DAYS.TUESDAY'), value: 2 },
            { label: t('DAYS.WEDNESDAY'), value: 3 },
            { label: t('DAYS.THURSDAY'), value: 4 },
            { label: t('DAYS.FRIDAY'), value: 5 },
            { label: t('DAYS.SATURDAY'), value: 6 },
            { label: t('DAYS.SUNDAY'), value: 0 },
        ],
        [t],
    );

    const timeOptionsFormatted = useMemo(
        () => timeOptions.map((time) => ({ label: time, value: time })),
        [],
    );

    const getDayLabel = (value: number) => {
        const day = daysSelection.find((d) => d.value === value);
        return day ? day.label : '';
    };

    const parseTimeToMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    const formatMinutesToTime = (totalMinutes: number) => {
        const h = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, '0');
        const m = (totalMinutes % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        clearErrors();
        if (!data.start_time || !data.end_time) {
            addToast(t('ERRORS.REQUIRED'), ToastType.ERROR);
            return;
        }
        if (data.start_time >= data.end_time) {
            addToast(t('ERRORS.AFTER_START'), ToastType.ERROR);
            return;
        }

        if (isBulk) {
            generateBulkSlots();
        } else {
            post(route('schedule.settings.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('start_time', 'end_time');
                    addToast(t('SUCCESS.ADDED'), ToastType.SUCCESS);
                },
                onError: (err) =>
                    addToast(Object.values(err)[0] as string, ToastType.ERROR),
            });
        }
    };

    const generateBulkSlots = () => {
        const start = parseTimeToMinutes(data.start_time);
        const end = parseTimeToMinutes(data.end_time);
        let current = start;
        const slotsToGenerate = [];

        while (current + slotDuration <= end) {
            slotsToGenerate.push({
                day_of_week: data.day_of_week,
                start_time: formatMinutesToTime(current),
                end_time: formatMinutesToTime(current + slotDuration),
            });
            current += slotDuration;
        }

        if (slotsToGenerate.length === 0) return;

        router.post(
            route('schedule.settings.store-bulk'),
            { slots: slotsToGenerate },
            {
                preserveScroll: true,
                onSuccess: () => {
                    addToast(t('SUCCESS.ADDED'), ToastType.SUCCESS);
                    reset('start_time', 'end_time');
                    router.reload({ only: ['availabilities'] });
                },
                onError: (err) => {
                    const firstError = Object.values(err)[0] as string;
                    addToast(firstError, ToastType.ERROR);
                },
            },
        );
    };

    const handleRemove = (id: number) => {
        if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
            router.delete(route('schedule.settings.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    addToast(t('SUCCESS.REMOVED'), ToastType.SUCCESS);
                    setSelectedIds((prev) =>
                        prev.filter((selectedId) => selectedId !== id),
                    );
                },
            });
        }
    };

    const handleBulkRemove = () => {
        if (selectedIds.length === 0) return;

        if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
            const idsToDelete = [...selectedIds];
            setSelectedIds([]);

            router.delete(route('schedule.settings.bulk-destroy'), {
                data: { ids: idsToDelete },
                preserveScroll: true,
                onSuccess: () => {
                    addToast(t('SUCCESS.REMOVED'), ToastType.SUCCESS);
                },
                onError: () => {
                    setSelectedIds(idsToDelete);
                    addToast(t('MESSAGES.ERROR'), ToastType.ERROR);
                },
            });
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const toggleSelectDay = (daySlots: number[]) => {
        const allSelected = daySlots.every((id) => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !daySlots.includes(id)),
            );
        } else {
            setSelectedIds((prev) =>
                Array.from(new Set([...prev, ...daySlots])),
            );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative min-h-screen bg-[#FBFDFF] pb-32">
                <div className="relative mx-auto max-w-7xl px-6 py-12">
                    {/* BARRA DE SELEÇÃO EM MASSA */}
                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.div
                                initial={{ y: 100, x: '-50%', opacity: 0 }}
                                animate={{ y: 0, x: '-50%', opacity: 1 }}
                                exit={{ y: 100, x: '-50%', opacity: 0 }}
                                className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 pr-6 shadow-2xl backdrop-blur-md"
                            >
                                <div className="flex items-center gap-4 rounded-xl bg-slate-800/50 px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            {t('BLOCKS.SELECTED')}
                                        </span>
                                        <span className="text-lg font-black leading-none text-white">
                                            {selectedIds.length}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBulkRemove}
                                    className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-600 active:scale-95"
                                >
                                    <Trash2 size={14} />
                                    {t('BLOCKS.DELETE_BULK')}
                                </button>

                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-white"
                                >
                                    {t('PROFILE.CANCEL')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ zIndex: isAnyDropdownOpen ? 50 : 10 }}
                        className="relative mb-16 rounded-[3rem] border border-white bg-white/70 p-1 shadow-sm backdrop-blur-xl"
                    >
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-10 rounded-[2.8rem] border border-slate-100 bg-white p-8 md:p-12"
                        >
                            <div className="flex justify-center">
                                <div className="flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1.5 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setIsBulk(true)}
                                        className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isBulk ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400'}`}
                                    >
                                        <Sparkles className="mr-2 inline h-3 w-3" />{' '}
                                        {t('SCHEDULE.GENERATOR')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsBulk(false)}
                                        className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${!isBulk ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400'}`}
                                    >
                                        <CalendarDays className="mr-2 inline h-3 w-3" />{' '}
                                        {t('SCHEDULE.INDIVIDUAL')}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
                                <div className="md:col-span-4">
                                    <CustomAutocomplete
                                        label={t('SCHEDULE.DAY_OF_WEEK')}
                                        value={data.day_of_week}
                                        options={daysSelection}
                                        onChange={(val) =>
                                            setData('day_of_week', Number(val))
                                        }
                                        onToggleOpen={setIsAnyDropdownOpen}
                                        error={errors.day_of_week}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <CustomAutocomplete
                                        label={
                                            isBulk
                                                ? t('SCHEDULE.SHIFT_START')
                                                : t('SCHEDULE.START')
                                        }
                                        value={data.start_time}
                                        options={timeOptionsFormatted}
                                        onChange={(val) =>
                                            setData('start_time', String(val))
                                        }
                                        onToggleOpen={setIsAnyDropdownOpen}
                                        isTime
                                        placeholder="08:00"
                                        error={errors.start_time}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <CustomAutocomplete
                                        label={
                                            isBulk
                                                ? t('SCHEDULE.SHIFT_END')
                                                : t('SCHEDULE.END')
                                        }
                                        value={data.end_time}
                                        options={timeOptionsFormatted}
                                        onChange={(val) =>
                                            setData('end_time', String(val))
                                        }
                                        onToggleOpen={setIsAnyDropdownOpen}
                                        isTime
                                        placeholder="18:00"
                                        error={errors.end_time}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={processing}
                                        className="h-[60px] w-full rounded-2xl bg-slate-900 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {processing
                                            ? '...'
                                            : isBulk
                                              ? t('SCHEDULE.ACTION_GENERATE')
                                              : t('SCHEDULE.ACTION_ADD')}
                                    </motion.button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isBulk && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden border-t border-slate-50 pt-8"
                                    >
                                        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-blue-100/50 bg-blue-50/20 p-8 md:flex-row">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black uppercase tracking-tighter text-blue-900">
                                                    {t(
                                                        'SCHEDULE.SESSION_DURATION',
                                                    )}
                                                </span>
                                                <span className="text-xs font-bold text-blue-500/70">
                                                    {t('SCHEDULE.BULK_HELPER')}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap justify-center gap-3">
                                                {[30, 45, 60, 90].map((min) => (
                                                    <button
                                                        key={min}
                                                        type="button"
                                                        onClick={() =>
                                                            setSlotDuration(min)
                                                        }
                                                        className={`rounded-xl px-6 py-2.5 text-xs font-black transition-all ${slotDuration === min ? 'bg-blue-600 text-white shadow-xl' : 'border border-slate-100 bg-white text-slate-400'}`}
                                                    >
                                                        {min >= 60
                                                            ? `${min / 60}h`
                                                            : `${min}m`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>

                    <div className="space-y-16">
                        {[1, 2, 3, 4, 5, 6, 0].map((dayValue) => {
                            const slots = availabilities.filter(
                                (s) => s.day_of_week === dayValue,
                            );
                            if (slots.length === 0) return null;

                            const dayIds = slots.map((s) => s.id);
                            const isAllDaySelected = dayIds.every((id) =>
                                selectedIds.includes(id),
                            );

                            return (
                                <motion.section
                                    key={dayValue}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="w-full"
                                >
                                    <div className="mb-10 flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                                                {getDayLabel(dayValue)}
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    toggleSelectDay(dayIds)
                                                }
                                                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${isAllDaySelected ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200' : 'border-slate-200 bg-white text-slate-400 hover:border-blue-300 hover:text-blue-500'}`}
                                            >
                                                <CheckCircle2 size={12} />
                                                {isAllDaySelected
                                                    ? t(
                                                          'BLOCKS.CLEAN_SELECTION',
                                                      )
                                                    : t('BLOCKS.SELECT_ALL')}
                                            </button>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                                        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-5 py-2 ring-1 ring-slate-100">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                {slots.length}{' '}
                                                {slots.length === 1
                                                    ? t('SCHEDULE.SLOT_ACTIVE')
                                                    : t(
                                                          'SCHEDULE.SLOTS_ACTIVE',
                                                      )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                        <AnimatePresence mode="popLayout">
                                            {slots.map((slot) => (
                                                <motion.div
                                                    key={slot.id}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                >
                                                    <AvailabilityCard
                                                        start={slot.start_time}
                                                        end={slot.end_time}
                                                        label={t(
                                                            'SCHEDULE.LABEL_TIME',
                                                        )}
                                                        isSelected={selectedIds.includes(
                                                            slot.id,
                                                        )}
                                                        onToggleSelect={() =>
                                                            toggleSelect(
                                                                slot.id,
                                                            )
                                                        }
                                                        onRemove={() =>
                                                            handleRemove(
                                                                slot.id,
                                                            )
                                                        }
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.section>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
