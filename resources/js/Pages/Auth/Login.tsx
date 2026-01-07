import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { useToast } from '@/Contexts/ToastContext';
import { ToastType } from '@/Components/Toast';
import CustomInput, { TypeCustomInput } from '@/Components/CustomInput';
import logo from '../../images/logo.svg';
import fluxa from '../../images/fluxa-nome.svg';

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
                    ToastType.ERROR
                );
            }
        });
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex flex-col justify-center items-center p-4 md:p-6">
            <Head title={t('AUTH.LOGIN')} />

            <div className="mb-6 md:mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[1.8rem] md:rounded-[2.2rem] mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/10 border border-white p-4 md:p-5 transition-transform hover:scale-105">
                    <img
                        src={logo}
                        alt="Fluxa Logo"
                        className="w-full h-full object-contain ml-1"
                    />
                </div>

                <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
                    <img
                        src={fluxa}
                        alt="Fluxa Logo"
                        className="w-32 md:w-40 object-contain mx-auto"
                    />
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium tracking-tight mt-1 px-4">
                    {t('AUTH.WELCOME_BACK')}
                </p>
            </div>

            <div className="w-full max-w-md bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-blue-500/5 border border-white/50 relative overflow-hidden">

                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-600 animate-in zoom-in-95">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="relative z-10 space-y-5 md:space-y-6">
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
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors py-1"
                                >
                                    {t('AUTH.FORGOT_PASSWORD')}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center px-2">
                        <label className="flex items-center group cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                            />
                            <span className="ms-3 text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                                {t('AUTH.REMEMBER_ME')}
                            </span>
                        </label>
                    </div>

                    <div className="pt-2 md:pt-4">
                        <button
                            disabled={processing}
                            className="w-full h-14 md:h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-[1.5rem] md:rounded-[1.8rem] shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? '...' : t('AUTH.LOGIN_BUTTON')}
                        </button>
                    </div>
                </form>

                <div className="mt-8 md:mt-10 text-center relative z-10">
                    <Link
                        href={route('register')}
                        className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest py-2 inline-block"
                    >
                        {t('AUTH.NO_ACCOUNT')}
                    </Link>
                </div>
            </div>
        </div>
    );
}