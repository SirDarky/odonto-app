import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
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

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            day_of_week: 1,
            start_time: '',
            end_time: '',
        });

    const daysSelection = [
        { label: t('DAYS.MONDAY'), value: 1 },
        { label: t('DAYS.TUESDAY'), value: 2 },
        { label: t('DAYS.WEDNESDAY'), value: 3 },
        { label: t('DAYS.THURSDAY'), value: 4 },
        { label: t('DAYS.FRIDAY'), value: 5 },
        { label: t('DAYS.SATURDAY'), value: 6 },
        { label: t('DAYS.SUNDAY'), value: 0 },
    ];

    const getDayLabel = (value: number) => {
        const labels: Record<number, string> = {
            1: t('DAYS.MONDAY'),
            2: t('DAYS.TUESDAY'),
            3: t('DAYS.WEDNESDAY'),
            4: t('DAYS.THURSDAY'),
            5: t('DAYS.FRIDAY'),
            6: t('DAYS.SATURDAY'),
            0: t('DAYS.SUNDAY'),
        };
        return labels[value] || '';
    };

    const timeOptionsFormatted = timeOptions.map((t) => ({
        label: t,
        value: t,
    }));

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
            const start = parseTimeToMinutes(data.start_time);
            const end = parseTimeToMinutes(data.end_time);
            if (end - start < slotDuration) {
                addToast(t('ERRORS.INVALID_DURATION'), ToastType.ERROR);
                return;
            }
            await generateBulkSlots();
        } else {
            post(route('schedule.settings.store'), {
                onSuccess: () => {
                    reset('start_time', 'end_time');
                    addToast(t('SUCCESS.ADDED'), ToastType.SUCCESS);
                },
                onError: (err) =>
                    addToast(Object.values(err)[0] as string, ToastType.ERROR),
            });
        }
    };

    const generateBulkSlots = async () => {
        const start = parseTimeToMinutes(data.start_time);
        const end = parseTimeToMinutes(data.end_time);
        let current = start;

        while (current + slotDuration <= end) {
            const slotStart = formatMinutesToTime(current);
            const slotEnd = formatMinutesToTime(current + slotDuration);

            router.post(
                route('schedule.settings.store'),
                {
                    day_of_week: data.day_of_week,
                    start_time: slotStart,
                    end_time: slotEnd,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => reset('start_time', 'end_time'),
                },
            );

            current += slotDuration;
        }
        addToast(t('SUCCESS.ADDED'), ToastType.SUCCESS);
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

    const handleRemove = (id: number) => {
        if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
            router.delete(route('schedule.settings.destroy', id), {
                preserveScroll: true,
                onSuccess: () =>
                    addToast(t('SUCCESS.REMOVED'), ToastType.SUCCESS),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative min-h-screen overflow-hidden bg-[#FBFDFF] pb-20">
                <div className="relative mx-auto max-w-7xl px-6 py-6">
                    <div className="animate-in fade-in zoom-in-95 relative z-50 mb-12 duration-700">
                        <div className="rounded-[2.5rem] border border-white bg-white/70 p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-8 rounded-[2.2rem] border border-slate-100 bg-white p-8 md:p-10"
                            >
                                <div className="flex justify-center">
                                    <div className="flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setIsBulk(true)}
                                            className={`rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isBulk ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {t('SCHEDULE.GENERATOR')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsBulk(false)}
                                            className={`rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!isBulk ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {t('SCHEDULE.INDIVIDUAL')}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
                                    <div className="md:col-span-4">
                                        <CustomAutocomplete
                                            label={t('SCHEDULE.DAY_OF_WEEK')}
                                            value={data.day_of_week}
                                            options={daysSelection}
                                            onChange={(val) =>
                                                setData('day_of_week', val)
                                            }
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
                                                setData('start_time', val)
                                            }
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
                                                setData('end_time', val)
                                            }
                                            isTime
                                            placeholder="18:00"
                                            error={errors.end_time}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            disabled={processing}
                                            className="group flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-blue-600 active:scale-95 disabled:opacity-50"
                                        >
                                            {processing
                                                ? '...'
                                                : isBulk
                                                  ? t(
                                                        'SCHEDULE.ACTION_GENERATE',
                                                    )
                                                  : t('SCHEDULE.ACTION_ADD')}
                                        </button>
                                    </div>
                                </div>

                                {isBulk && (
                                    <div className="animate-in slide-in-from-top-4 border-t border-slate-50 pt-6 duration-500">
                                        <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-blue-100/50 bg-blue-50/30 p-6 md:flex-row">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-tighter text-blue-900">
                                                    {t(
                                                        'SCHEDULE.SESSION_DURATION',
                                                    )}
                                                </span>
                                                <span className="text-xs font-medium text-blue-600">
                                                    {t('SCHEDULE.BULK_HELPER')}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {[30, 45, 60, 90].map((min) => (
                                                    <button
                                                        key={min}
                                                        type="button"
                                                        onClick={() =>
                                                            setSlotDuration(min)
                                                        }
                                                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${slotDuration === min ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'border border-slate-100 bg-white text-slate-400'}`}
                                                    >
                                                        {min >= 60
                                                            ? `${min / 60}h`
                                                            : `${min}m`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {[1, 2, 3, 4, 5, 6, 0].map((dayValue, index) => {
                            const slots = availabilities.filter(
                                (s) => s.day_of_week === dayValue,
                            );
                            if (slots.length === 0) return null;

                            return (
                                <section
                                    key={dayValue}
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="mb-8 flex items-center gap-6">
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                                            {getDayLabel(dayValue)}
                                        </h4>
                                        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                                        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-1.5">
                                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
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

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {slots.map((slot) => (
                                            <AvailabilityCard
                                                key={slot.id}
                                                start={slot.start_time}
                                                end={slot.end_time}
                                                label={t('SCHEDULE.LABEL_TIME')}
                                                onRemove={() =>
                                                    handleRemove(slot.id)
                                                }
                                            />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
