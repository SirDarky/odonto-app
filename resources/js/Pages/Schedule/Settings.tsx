import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import AvailabilityCard from './Partials/AvailabilityCard';
import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { useTrans } from '@/Hooks/useTrans';
import { useToast } from '@/Contexts/ToastContext';
import { ToastType } from '@/Components/Toast';

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
    const hours = Math.floor(i / 4).toString().padStart(2, '0');
    const minutes = ((i % 4) * 15).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
});

export default function Settings({ availabilities }: Props) {
    const { t } = useTrans();
    const { addToast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
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

    const timeOptionsFormatted = timeOptions.map(t => ({ label: t, value: t }));

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (data.start_time >= data.end_time) {
            addToast(t('ERRORS.AFTER_START'), ToastType.ERROR);
            return;
        }

        post(route('schedule.settings.store'), {
            onSuccess: () => {
                reset('start_time', 'end_time');
                addToast(t('SUCCESS.ADDED'), ToastType.SUCCESS);
            },
            onError: (err) => addToast(Object.values(err)[0] as string, ToastType.ERROR)
        });
    };

    const handleRemove = (id: number) => {
        if (confirm(t('MESSAGES.CONFIRM_DELETE'))) {
            router.delete(route('schedule.settings.destroy', id), {
                preserveScroll: true,
                onSuccess: () => addToast(t('SUCCESS.REMOVED'), ToastType.SUCCESS)
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative min-h-screen bg-[#FBFDFF] overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-6 py-6">

                    <div className="relative z-50 isolate mb-8 animate-in fade-in zoom-in-95 duration-1000">
                        <div className="bg-white/70 backdrop-blur-xl border border-white p-1 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <form onSubmit={submit} className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.2rem] grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                                <div className="md:col-span-4 group">
                                    <CustomAutocomplete
                                        label={t('SCHEDULE.DAY_OF_WEEK')}
                                        value={data.day_of_week}
                                        options={daysSelection}
                                        onChange={(val) => setData('day_of_week', val)}
                                        error={errors.day_of_week}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <CustomAutocomplete
                                        label={t('SCHEDULE.START')}
                                        value={data.start_time}
                                        options={timeOptionsFormatted}
                                        onChange={(val) => setData('start_time', val)}
                                        isTime
                                        placeholder="08:00"
                                        error={errors.start_time}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <CustomAutocomplete
                                        label={t('SCHEDULE.END')}
                                        value={data.end_time}
                                        options={timeOptionsFormatted}
                                        onChange={(val) => setData('end_time', val)}
                                        isTime
                                        placeholder="18:00"
                                        error={errors.start_time}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <button
                                        disabled={processing}
                                        className="w-full h-[60px] bg-slate-900 hover:bg-blue-600 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                                    >
                                        {processing ? '...' : (
                                            <>
                                                {t('SCHEDULE.ADD_BUTTON')}
                                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 0].map((dayValue, index) => {
                            const slots = availabilities.filter(s => s.day_of_week === dayValue);
                            if (slots.length === 0) return null;

                            return (
                                <section key={dayValue} className={`animate-in fade-in slide-in-from-bottom-8 duration-700`} style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex items-center gap-6 mb-5">
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight italic">
                                            {getDayLabel(dayValue)}
                                        </h4>
                                        <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-1" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                                            {slots.length} {slots.length === 1 ? 'Slot' : 'Slots'}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex flex-wrap justify-start gap-6 md:gap-8">
                                        {slots.map((slot) => (
                                            <AvailabilityCard
                                                key={slot.id}
                                                start={slot.start_time}
                                                end={slot.end_time}
                                                label={t('SCHEDULE.LABEL_TIME')}
                                                onRemove={() => handleRemove(slot.id)}
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