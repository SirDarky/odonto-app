import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Plus, Umbrella } from 'lucide-react';
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

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        end_date: '',
        full_day: true,
        start_time: '',
        end_time: '',
    });

    useEffect(() => {
        if (!isPeriod) setData('end_date', '');
        else setData({ ...data, full_day: true, start_time: '', end_time: '' });
    }, [isPeriod]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('schedule.blocks.store'), {
            onSuccess: () => {
                reset();
                setIsPeriod(false);
                addToast(t('BLOCKS.SUCCESS_ADD'), ToastType.SUCCESS);
            },
            onError: (err) =>
                addToast(Object.values(err)[0] as string, ToastType.ERROR),
        });
    };

    return (
        <div className="mb-12">
            <div className="rounded-[2.5rem] border border-rose-100/50 bg-white p-1 shadow-2xl shadow-rose-500/5">
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-[2.2rem] border border-slate-50 bg-white p-8 md:p-10"
                >
                    <div className="flex w-fit gap-2 rounded-2xl bg-slate-50 p-1.5 ring-1 ring-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsPeriod(false)}
                            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${!isPeriod ? 'bg-white text-rose-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Calendar className="h-3 w-3" />{' '}
                            {t('BLOCKS.SINGLE_DAY')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPeriod(true)}
                            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isPeriod ? 'bg-white text-rose-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Umbrella className="h-3 w-3" />{' '}
                            {t('BLOCKS.PERIOD_VACATION')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
                        <div
                            className={
                                isPeriod ? 'md:col-span-4' : 'md:col-span-6'
                            }
                        >
                            <label
                                className={`mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.3em] ${errors.date ? 'text-rose-500' : 'text-slate-400'}`}
                            >
                                {isPeriod
                                    ? t('BLOCKS.START_DATE')
                                    : t('BLOCKS.DATE')}
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                className="h-14 w-full rounded-2xl border-none bg-slate-50 px-5 font-bold text-slate-700 transition-all focus:ring-4 focus:ring-rose-500/5"
                            />
                        </div>

                        <AnimatePresence>
                            {isPeriod && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="md:col-span-4"
                                >
                                    <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        {t('BLOCKS.END_DATE')}
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        min={data.date}
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        className="h-14 w-full rounded-2xl border-none bg-slate-50 px-5 font-bold text-slate-700 transition-all focus:ring-4 focus:ring-rose-500/5"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isPeriod && (
                            <div className="flex h-14 items-center pl-2 md:col-span-6">
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
                                    <div className="peer h-7 w-14 rounded-full bg-slate-100 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-rose-500 peer-checked:after:translate-x-full" />
                                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-900">
                                        {t('BLOCKS.FULL_DAY')}
                                    </span>
                                </label>
                            </div>
                        )}

                        <div
                            className={
                                isPeriod ? 'md:col-span-4' : 'md:col-span-12'
                            }
                        >
                            <motion.button
                                whileHover={{ scale: 1.01, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={processing}
                                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-rose-600 disabled:opacity-50"
                            >
                                {processing ? (
                                    '...'
                                ) : (
                                    <>
                                        {t('BLOCKS.SUBMIT_BUTTON')}{' '}
                                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                    </>
                                )}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {!isPeriod && !data.full_day && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-2 gap-4 pt-4 md:col-span-12"
                                >
                                    <CustomAutocomplete
                                        label={t('BLOCKS.START_TIME')}
                                        value={data.start_time}
                                        options={timeOptions}
                                        onChange={(v) =>
                                            setData('start_time', String(v))
                                        }
                                        isTime
                                    />

                                    <CustomAutocomplete
                                        label={t('BLOCKS.END_TIME')}
                                        value={data.end_time}
                                        options={timeOptions}
                                        onChange={(v) =>
                                            setData('end_time', String(v))
                                        }
                                        isTime
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
            </div>
        </div>
    );
}
