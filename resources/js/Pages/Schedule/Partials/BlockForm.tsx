import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useToast } from '@/Contexts/ToastContext';
import { ToastType } from '@/Components/Toast';
import CustomAutocomplete from '@/Components/CustomAutocomplete';
import { FormEvent, useEffect, useState } from 'react';

const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4).toString().padStart(2, '0');
    const minutes = ((i % 4) * 15).toString().padStart(2, '0');
    return { label: `${hours}:${minutes}`, value: `${hours}:${minutes}` };
});

export default function BlockForm() {
    const { t } = useTrans();
    const { addToast } = useToast();

    const [isPeriod, setIsPeriod] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
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
            setData((prev) => ({ ...prev, full_day: true, start_time: '', end_time: '' }));
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
            addToast("Para períodos, a data final deve ser posterior à inicial.", ToastType.ERROR);
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
            onError: (err) => addToast(Object.values(err)[0] as string || t('MESSAGES.ERROR'), ToastType.ERROR)
        });
    };

    return (
        <div className="mb-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="bg-white p-1 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(225,29,72,0.05)] border border-rose-100/50">
                <form onSubmit={submit} className="bg-white border border-slate-50 p-8 md:p-10 rounded-[2.2rem] space-y-8">

                    <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl w-fit">
                        <button
                            type="button"
                            onClick={() => setIsPeriod(false)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isPeriod ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Dia Único
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPeriod(true)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPeriod ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Vários Dias / Férias
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end text-left">

                        <div className={isPeriod ? "md:col-span-4" : "md:col-span-6"}>
                            <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ml-1 block transition-colors ${errors.date ? 'text-rose-500' : 'text-slate-400'}`}>
                                {isPeriod ? t('BLOCKS.START_DATE') : 'Data do Bloqueio'}
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => setData('date', e.target.value)}
                                className={`w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-4 text-slate-700 font-medium px-5 transition-all ${errors.date ? 'ring-2 ring-rose-500/20' : 'focus:ring-rose-500/5'}`}
                            />
                        </div>

                        {isPeriod && (
                            <div className="md:col-span-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ml-1 block text-slate-400`}>
                                    {t('BLOCKS.END_DATE')}
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    min={data.date || new Date().toISOString().split('T')[0]}
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-rose-500/5 text-slate-700 font-medium px-5"
                                />
                            </div>
                        )}

                        {!isPeriod && (
                            <div className="md:col-span-6 flex items-center h-14">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input type="checkbox" checked={data.full_day} onChange={e => setData('full_day', e.target.checked)} className="sr-only peer" />
                                    <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-rose-500 shadow-inner"></div>
                                    <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">
                                        {t('BLOCKS.FULL_DAY')}
                                    </span>
                                </label>
                            </div>
                        )}

                        {!isPeriod && !data.full_day && (
                            <div className="md:col-span-12 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <CustomAutocomplete label={t('BLOCKS.START_TIME')} value={data.start_time} options={timeOptions} onChange={val => setData('start_time', val)} isTime error={errors.start_time} />
                                <CustomAutocomplete label={t('BLOCKS.END_TIME')} value={data.end_time} options={timeOptions} onChange={val => setData('end_time', val)} isTime error={errors.end_time} />
                            </div>
                        )}

                        <div className={`${isPeriod ? 'md:col-span-4' : 'md:col-span-12'} transition-all`}>
                            <button disabled={processing} className="w-full h-14 bg-slate-900 hover:bg-rose-600 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50">
                                {processing ? '...' : <>{t('BLOCKS.SUBMIT_BUTTON')}<svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}