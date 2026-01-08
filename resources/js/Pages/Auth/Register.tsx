import CustomInput, { TypeCustomInput } from '@/Components/CustomInput';
import { ToastType } from '@/Components/Toast';
import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import fluxa from '../../images/fluxa-nome.svg';
import logo from '../../images/logo.svg';

export default function Register() {
    const { t } = useTrans();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        cro: '',
        cro_state: '',
        phone: '',
    });

    const validateStep = () => {
        clearErrors();

        if (step === 1) {
            const step1Fields = [
                'name',
                'email',
                'password',
                'password_confirmation',
            ];
            const hasEmpty = step1Fields.some(
                (field) => !data[field as keyof typeof data],
            );

            if (hasEmpty) {
                addToast(t('ERRORS.REQUIRED'), ToastType.ERROR);
                return false;
            }

            if (data.password !== data.password_confirmation) {
                addToast(t('ERRORS.AFTER_START'), ToastType.ERROR);
                return false;
            }

            if (data.password.length < 8) {
                addToast(t('ERRORS.MIN_PASSWORD'), ToastType.ERROR);
                return false;
            }
        }

        if (step === 2) {
            const step2Fields = ['cro', 'cro_state', 'phone'];
            const hasEmpty = step2Fields.some(
                (field) => !data[field as keyof typeof data],
            );

            if (hasEmpty) {
                addToast(t('ERRORS.REQUIRED'), ToastType.ERROR);
                return false;
            }
        }

        return true;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        if (step < 2) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        post(route('register'), {
            onSuccess: () => addToast(t('SUCCESS.REGISTER'), ToastType.SUCCESS),
            onError: (err) => {
                const firstError = Object.values(err)[0];
                addToast(
                    firstError || t('ERRORS.REGISTER_FAILED'),
                    ToastType.ERROR,
                );
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 md:p-6">
            <Head title={t('AUTH.CREATE_ACCOUNT')} />

            <div className="animate-in fade-in slide-in-from-top-4 mb-6 text-center duration-700 md:mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white bg-white p-3 shadow-2xl shadow-blue-500/10 md:h-20 md:w-20 md:rounded-[1.8rem] md:p-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-full w-full object-contain"
                    />
                </div>
                <img
                    src={fluxa}
                    alt="Fluxa"
                    className="mx-auto w-24 object-contain md:w-32"
                />

                <div className="mt-4 flex items-center justify-center space-x-2 md:mt-6">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`}
                    />
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`}
                    />
                </div>
            </div>

            <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/50 bg-white p-6 shadow-2xl shadow-blue-500/5 md:rounded-[3.5rem] md:p-12">
                <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

                <form
                    onSubmit={submit}
                    className="relative z-10 space-y-4 md:space-y-5"
                >
                    {step === 1 && (
                        <div className="animate-in slide-in-from-left-4 space-y-4 duration-500 md:space-y-5">
                            <h2 className="px-1 text-lg font-black uppercase tracking-tight text-gray-800 md:text-xl">
                                {t('AUTH.PERSONAL_INFO')}
                            </h2>
                            <CustomInput
                                label={t('AUTH.NAME')}
                                value={data.name}
                                onChange={(val) => setData('name', val)}
                                error={errors.name}
                                placeholder="Dr. Nome Sobrenome"
                            />
                            <CustomInput
                                label={t('AUTH.EMAIL')}
                                type={TypeCustomInput.EMAIL}
                                value={data.email}
                                onChange={(val) => setData('email', val)}
                                error={errors.email}
                                placeholder="contato@fluxa.com"
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <CustomInput
                                    label={t('AUTH.PASSWORD')}
                                    type={TypeCustomInput.PASSWORD}
                                    value={data.password}
                                    onChange={(val) => setData('password', val)}
                                    error={errors.password}
                                    placeholder="••••••••"
                                />
                                <CustomInput
                                    label={t('AUTH.CONFIRM')}
                                    type={TypeCustomInput.PASSWORD}
                                    value={data.password_confirmation}
                                    onChange={(val) =>
                                        setData('password_confirmation', val)
                                    }
                                    error={errors.password_confirmation}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-4 space-y-4 duration-500 md:space-y-5">
                            <h2 className="px-1 text-lg font-black uppercase tracking-tight text-gray-800 md:text-xl">
                                {t('AUTH.PROFESSIONAL_INFO')}
                            </h2>
                            <div className="grid grid-cols-3 gap-3 md:gap-4">
                                <div className="col-span-2">
                                    <CustomInput
                                        label="CRO"
                                        value={data.cro}
                                        onChange={(val) => setData('cro', val)}
                                        error={errors.cro}
                                        placeholder="12345"
                                    />
                                </div>
                                <CustomInput
                                    label="UF"
                                    value={data.cro_state}
                                    onChange={(val) =>
                                        setData('cro_state', val.toUpperCase())
                                    }
                                    error={errors.cro_state}
                                    placeholder="SP"
                                />
                            </div>
                            <CustomInput
                                label={t('AUTH.PHONE')}
                                type={TypeCustomInput.TELEPHONE}
                                value={data.phone}
                                onChange={(val) => setData('phone', val)}
                                error={errors.phone}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2 md:gap-4 md:pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-14 w-full rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 md:h-16 md:rounded-[1.8rem] md:text-xs"
                        >
                            {step === 1
                                ? t('AUTH.NEXT')
                                : processing
                                  ? '...'
                                  : t('AUTH.FINISH')}
                        </button>

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-600 md:text-xs"
                            >
                                {t('AUTH.BACK')}
                            </button>
                        )}
                    </div>
                </form>

                <div className="relative z-10 mt-8 text-center">
                    <Link
                        href={route('login')}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-blue-600 md:text-xs"
                    >
                        {t('AUTH.ALREADY_REGISTERED')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
