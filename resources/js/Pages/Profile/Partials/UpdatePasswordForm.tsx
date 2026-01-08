import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTrans } from '@/Hooks/useTrans';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

interface Props {
    className?: string;
}

export default function UpdatePasswordForm({ className = '' }: Props) {
    const { t } = useTrans();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2">
                        <ShieldCheck className="h-4 w-4 text-slate-600" />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-800">
                        {t('PROFILE.PASSWORD_TITLE')}
                    </h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t('PROFILE.PASSWORD_DESCRIPTION')}
                </p>
            </header>

            <form
                onSubmit={updatePassword}
                className="space-y-6"
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="space-y-1">
                        <InputLabel
                            htmlFor="current_password"
                            value={t('PROFILE.LABEL_CURRENT_PASSWORD')}
                            className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                        />
                        <div className="group relative">
                            <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                            <TextInput
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) =>
                                    setData('current_password', e.target.value)
                                }
                                type="password"
                                className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                autoComplete="current-password"
                            />
                        </div>
                        <InputError
                            message={errors.current_password}
                            className="px-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="password"
                                value={t('PROFILE.LABEL_NEW_PASSWORD')}
                                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <div className="group relative">
                                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                                <TextInput
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    type="password"
                                    className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError
                                message={errors.password}
                                className="px-1"
                            />
                        </div>

                        <div className="space-y-1">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value={t('PROFILE.LABEL_CONFIRM_PASSWORD')}
                                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <div className="group relative">
                                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                                <TextInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    type="password"
                                    className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                    autoComplete="new-password"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="px-1"
                            />
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-6 pt-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PrimaryButton
                            disabled={processing}
                            className="rounded-[1.2rem] bg-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 disabled:opacity-50"
                        >
                            {t('PROFILE.SAVE')}
                        </PrimaryButton>
                    </motion.div>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-4"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            {t('PROFILE.SAVED')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
