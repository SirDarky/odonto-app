import CustomInput, { TypeCustomInput } from '@/Components/CustomInput';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import fluxa from '../../images/fluxa-nome.svg';
import logo from '../../images/logo.svg';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { t } = useTrans();
    const { addToast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            addToast(t('ERRORS.REQUIRED'), ToastType.ERROR);
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (err) => {
                const firstError = Object.values(err)[0];

                addToast(
                    (firstError as string) || t('ERRORS.LOGIN_FAILED'),
                    ToastType.ERROR,
                );
            },
        });
    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 md:p-6">
            <Head title={t('AUTH.LOGIN')} />

            <div className="animate-in fade-in slide-in-from-top-4 mb-6 text-center duration-700 md:mb-8">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-white bg-white p-4 shadow-2xl shadow-blue-500/10 transition-transform hover:scale-105 md:h-24 md:w-24 md:rounded-[2.2rem] md:p-5">
                    <img
                        src={logo}
                        alt="Fluxa Logo"
                        className="ml-1 h-full w-full object-contain"
                    />
                </div>

                <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-800">
                    <img
                        src={fluxa}
                        alt="Fluxa Logo"
                        className="mx-auto w-32 object-contain md:w-40"
                    />
                </h1>
                <p className="mt-1 px-4 text-sm font-medium tracking-tight text-gray-400 md:text-base">
                    {t('AUTH.WELCOME_BACK')}
                </p>
            </div>

            <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/50 bg-white p-6 shadow-2xl shadow-blue-500/5 md:rounded-[3.5rem] md:p-12">
                <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

                {status && (
                    <div className="animate-in zoom-in-95 mb-6 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-600">
                        {status}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="relative z-10 space-y-5 md:space-y-6"
                >
                    <CustomInput
                        label={t('AUTH.EMAIL')}
                        type={TypeCustomInput.EMAIL}
                        value={data.email}
                        onChange={(val) => setData('email', val)}
                        error={errors.email}
                        placeholder="exemplo@email.com"
                    />

                    <div className="space-y-1">
                        <CustomInput
                            label={t('AUTH.PASSWORD')}
                            type={TypeCustomInput.PASSWORD}
                            value={data.password}
                            onChange={(val) => setData('password', val)}
                            error={errors.password}
                            placeholder="••••••••"
                        />
                        {canResetPassword && (
                            <div className="flex justify-end pr-2">
                                <Link
                                    href={route('password.request')}
                                    className="py-1 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-blue-600"
                                >
                                    {t('AUTH.FORGOT_PASSWORD')}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center px-2">
                        <label className="group flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-5 w-5 cursor-pointer rounded-lg border-gray-200 text-blue-600 transition-all focus:ring-blue-500/20"
                            />
                            <span className="ms-3 text-sm font-bold text-gray-400 transition-colors group-hover:text-gray-600">
                                {t('AUTH.REMEMBER_ME')}
                            </span>
                        </label>
                    </div>

                    <div className="pt-2 md:pt-4">
                        <button
                            disabled={processing}
                            className="h-14 w-full rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 md:h-16 md:rounded-[1.8rem] md:text-xs"
                        >
                            {processing ? '...' : t('AUTH.LOGIN_BUTTON')}
                        </button>
                    </div>
                </form>

                <div className="relative z-10 mt-8 text-center md:mt-10">
                    <Link
                        href={route('register')}
                        className="inline-block py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-blue-600 md:text-xs"
                    >
                        {t('AUTH.NO_ACCOUNT')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
