import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { useToast } from '@/Contexts/ToastContext';
import { ToastType } from '@/Components/Toast';
import CustomInput, { TypeCustomInput } from '@/Components/CustomInput';
import logo from '../../images/logo.svg';
import fluxa from '../../images/fluxa-nome.svg';

export default function Register() {
    const { t } = useTrans();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
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
            const step1Fields = ['name', 'email', 'password', 'password_confirmation'];
            const hasEmpty = step1Fields.some(field => !data[field as keyof typeof data]);

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
            const hasEmpty = step2Fields.some(field => !data[field as keyof typeof data]);

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
                addToast(firstError || t('ERRORS.REGISTER_FAILED'), ToastType.ERROR);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex flex-col justify-center items-center p-4 md:p-6">
            <Head title={t('AUTH.CREATE_ACCOUNT')} />

            <div className="mb-6 md:mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[1.5rem] md:rounded-[1.8rem] mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/10 border border-white p-3 md:p-4">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <img src={fluxa} alt="Fluxa" className="w-24 md:w-32 object-contain mx-auto" />

                <div className="flex items-center justify-center space-x-2 mt-4 md:mt-6">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`} />
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`} />
                </div>
            </div>

            <div className="w-full max-w-md bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-blue-500/5 border border-white/50 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <form onSubmit={submit} className="relative z-10 space-y-4 md:space-y-5">

                    {step === 1 && (
                        <div className="space-y-4 md:space-y-5 animate-in slide-in-from-left-4 duration-500">
                            <h2 className="text-lg md:text-xl font-black text-gray-800 tracking-tight uppercase px-1">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    onChange={(val) => setData('password_confirmation', val)}
                                    error={errors.password_confirmation}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 md:space-y-5 animate-in slide-in-from-right-4 duration-500">
                            <h2 className="text-lg md:text-xl font-black text-gray-800 tracking-tight uppercase px-1">
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
                                    onChange={(val) => setData('cro_state', val.toUpperCase())}
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

                    <div className="pt-2 md:pt-4 flex flex-col gap-3 md:gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 md:h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-[1.5rem] md:rounded-[1.8rem] shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {step === 1 ? t('AUTH.NEXT') : (processing ? '...' : t('AUTH.FINISH'))}
                        </button>

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors py-2"
                            >
                                {t('AUTH.BACK')}
                            </button>
                        )}
                    </div>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <Link
                        href={route('login')}
                        className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        {t('AUTH.ALREADY_REGISTERED')}
                    </Link>
                </div>
            </div>
        </div>
    );
}