import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4)
        .toString()
        .padStart(2, '0');
    const minutes = ((i % 4) * 15).toString().padStart(2, '0');
    return { label: `${hours}:${minutes}`, value: `${hours}:${minutes}` };
});

export default function BlockForm() {
    const { t } = useTrans();
    const { addToast } = useToast();

    const [isPeriod, setIsPeriod] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            date: '',
            end_date: '',
            full_day: true,
            start_time: '',
            end_time: '',
        });

    useEffect(() => {
        if (!isPeriod) setData('end_date', '');
    }, [isPeriod]);

    useEffect(() => {
        if (isPeriod) {
            setData((prev) => ({
                ...prev,
                full_day: true,
                start_time: '',
                end_time: '',
            }));
        }
    }, [isPeriod]);

    const validate = () => {
        clearErrors();
        const today = new Date().toISOString().split('T')[0];

        if (!data.date) {
            addToast(t('ERRORS.REQUIRED_DATE'), ToastType.ERROR);
            return false;
        }

        if (data.date < today) {
            addToast(t('ERRORS.PAST_DATE'), ToastType.ERROR);
            return false;
        }

        if (isPeriod && (!data.end_date || data.end_date <= data.date)) {
            addToast(
                'Para períodos, a data final deve ser posterior à inicial.',
                ToastType.ERROR,
            );
            return false;
        }

        if (!data.full_day) {
            if (!data.start_time || !data.end_time) {
                addToast(t('ERRORS.REQUIRED'), ToastType.ERROR);
                return false;
            }
            if (data.start_time >= data.end_time) {
                addToast(t('ERRORS.AFTER_START'), ToastType.ERROR);
                return false;
            }
        }
        return true;
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        post(route('schedule.blocks.store'), {
            onSuccess: () => {
                reset();
                setIsPeriod(false);
                addToast(t('BLOCKS.SUCCESS_ADD'), ToastType.SUCCESS);
            },
            onError: (err) =>
                addToast(
                    (Object.values(err)[0] as string) || t('MESSAGES.ERROR'),
                    ToastType.ERROR,
                ),
        });
    };

    return (
        <div className="animate-in fade-in zoom-in-95 mb-8 duration-1000">
            <div className="rounded-[2.5rem] border border-rose-100/50 bg-white p-1 shadow-[0_32px_64px_-16px_rgba(225,29,72,0.05)]">
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-[2.2rem] border border-slate-50 bg-white p-8 md:p-10"
                >
                    <div className="flex w-fit gap-4 rounded-2xl bg-slate-50 p-1">
                        <button
                            type="button"
                            onClick={() => setIsPeriod(false)}
                            className={`rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${!isPeriod ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Dia Único
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPeriod(true)}
                            className={`rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isPeriod ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Vários Dias / Férias
                        </button>
                    </div>

                    <div className="grid grid-cols-1 items-end gap-6 text-left md:grid-cols-12 md:gap-8">
                        <div
                            className={
                                isPeriod ? 'md:col-span-4' : 'md:col-span-6'
                            }
                        >
                            <label
                                className={`mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${errors.date ? 'text-rose-500' : 'text-slate-400'}`}
                            >
                                {isPeriod
                                    ? t('BLOCKS.START_DATE')
                                    : 'Data do Bloqueio'}
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                className={`h-14 w-full rounded-2xl border-none bg-slate-50 px-5 font-medium text-slate-700 transition-all focus:ring-4 ${errors.date ? 'ring-2 ring-rose-500/20' : 'focus:ring-rose-500/5'}`}
                            />
                        </div>

                        {isPeriod && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500 md:col-span-4">
                                <label
                                    className={`mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400`}
                                >
                                    {t('BLOCKS.END_DATE')}
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    min={
                                        data.date ||
                                        new Date().toISOString().split('T')[0]
                                    }
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                    className="h-14 w-full rounded-2xl border-none bg-slate-50 px-5 font-medium text-slate-700 focus:ring-4 focus:ring-rose-500/5"
                                />
                            </div>
                        )}

                        {!isPeriod && (
                            <div className="flex h-14 items-center md:col-span-6">
                                <label className="group relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.full_day}
                                        onChange={(e) =>
                                            setData(
                                                'full_day',
                                                e.target.checked,
                                            )
                                        }
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-7 w-14 rounded-full bg-slate-200 shadow-inner after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-rose-500 peer-checked:after:translate-x-full"></div>
                                    <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-900">
                                        {t('BLOCKS.FULL_DAY')}
                                    </span>
                                </label>
                            </div>
                        )}

                        {!isPeriod && !data.full_day && (
                            <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-2 gap-4 md:col-span-12">
                                <CustomAutocomplete
                                    label={t('BLOCKS.START_TIME')}
                                    value={data.start_time}
                                    options={timeOptions}
                                    onChange={(val) =>
                                        setData('start_time', val)
                                    }
                                    isTime
                                    error={errors.start_time}
                                />
                                <CustomAutocomplete
                                    label={t('BLOCKS.END_TIME')}
                                    value={data.end_time}
                                    options={timeOptions}
                                    onChange={(val) => setData('end_time', val)}
                                    isTime
                                    error={errors.end_time}
                                />
                            </div>
                        )}

                        <div
                            className={`${isPeriod ? 'md:col-span-4' : 'md:col-span-12'} transition-all`}
                        >
                            <button
                                disabled={processing}
                                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-rose-600 active:scale-95 disabled:opacity-50"
                            >
                                {processing ? (
                                    '...'
                                ) : (
                                    <>
                                        {t('BLOCKS.SUBMIT_BUTTON')}
                                        <svg
                                            className="h-4 w-4 transition-transform group-hover:rotate-90"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
