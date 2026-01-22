import { useTrans } from '@/Hooks/useTrans';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    Eraser,
    Loader2,
    PenTool,
    Search,
} from 'lucide-react';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

type QuestionType = 'boolean' | 'text' | 'textarea' | 'checkbox' | 'radio';

interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options: string[] | null;
    is_required: boolean;
}

interface Answer {
    question: string;
    answer: string | string[];
    type: QuestionType;
}

interface FormState {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    answers: Answer[];
    signature: string;
}

interface Props {
    dentist: { name: string; slug: string; specialty?: string };
    questions: Question[];
}

const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Create({ dentist, questions }: Props) {
    const { t } = useTrans();
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [step, setStep] = useState<
        'identification' | 'questions' | 'signature'
    >('identification');
    const [isSearching, setIsSearching] = useState(false);

    const clearSignature = () => sigCanvas.current?.clear();

    const { data, setData, post, processing, errors } = useForm<FormState>({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        answers: [],
        signature: '',
    });

    const searchPatient = async (cpfValue: string): Promise<void> => {
        const cleanCpf = cpfValue.replace(/\D/g, '');
        if (cleanCpf.length !== 11) return;
        setIsSearching(true);
        try {
            const response = await axios.get(route('patients.searchPublic'), {
                params: { cpf: cleanCpf },
            });
            if (response.data) {
                setData((prev) => ({
                    ...prev,
                    name: response.data.name || prev.name,
                    email: response.data.email || prev.email,
                    phone: response.data.phone || prev.phone,
                }));
            }
        } catch (error) {
            console.log(t('PUBLIC_ANAMNESIS.ERRORS.PATIENT_NOT_FOUND'), error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const cleanCpf = data.cpf.replace(/\D/g, '');
        if (cleanCpf.length === 11) searchPatient(data.cpf);
    }, [data.cpf]);

    const handleAnswerChange = (
        questionText: string,
        type: QuestionType,
        value: string | string[],
    ) => {
        const existingIndex = data.answers.findIndex(
            (a) => a.question === questionText,
        );
        const newAnswers = [...data.answers];
        if (existingIndex >= 0) {
            newAnswers[existingIndex].answer = value;
        } else {
            newAnswers.push({ question: questionText, answer: value, type });
        }
        setData('answers', newAnswers);
    };

    const toggleCheckboxAnswer = (questionText: string, option: string) => {
        const existing = data.answers.find((a) => a.question === questionText);
        const currentValues = Array.isArray(existing?.answer)
            ? (existing?.answer as string[])
            : [];
        const newValues = currentValues.includes(option)
            ? currentValues.filter((v) => v !== option)
            : [...currentValues, option];
        handleAnswerChange(questionText, 'checkbox', newValues);
    };

    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, '').slice(0, 11);
        return numbers
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const isFormComplete = (): boolean => {
        return questions
            .filter((q) => q.is_required)
            .every((q) => {
                const ans = data.answers.find((a) => a.question === q.text);
                if (!ans) return false;
                return Array.isArray(ans.answer)
                    ? ans.answer.length > 0
                    : ans.answer.trim() !== '';
            });
    };

    const handleSubmit = (): void => {
        const canvas = sigCanvas.current?.getCanvas();
        if (!canvas || sigCanvas.current?.isEmpty()) {
            alert(t('PUBLIC_ANAMNESIS.SIGNATURE.ALERT_EMPTY'));
            return;
        }
        const signatureBase64 = canvas.toDataURL('image/png');
        post(route('public.anamnesis.store', dentist.slug), {
            onBefore: () => {
                data.signature = signatureBase64;
                data.cpf = data.cpf.replace(/\D/g, '');
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FBFDFF] pb-20 selection:bg-blue-100">
            <Head
                title={t('PUBLIC_ANAMNESIS.HEAD_TITLE', {
                    name: dentist.name,
                })}
            />

            <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-200">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
                                {t('PUBLIC_ANAMNESIS.HEADER.TITLE')}
                            </h1>
                            <p className="mt-1 text-[10px] font-bold uppercase italic leading-none text-blue-600">
                                {dentist.name}
                            </p>
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase text-slate-300">
                        {t('PUBLIC_ANAMNESIS.HEADER.STEP_COUNTER', {
                            current:
                                step === 'identification'
                                    ? 1
                                    : step === 'questions'
                                      ? 2
                                      : 3,
                            total: 3,
                        })}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-10">
                <AnimatePresence mode="wait">
                    {step === 'identification' && (
                        <motion.div
                            key="id"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                                {t('PUBLIC_ANAMNESIS.IDENTIFICATION.TITLE')}
                            </h2>
                            <div className="grid gap-4">
                                <div className="group relative">
                                    <FloatingInput
                                        label={t(
                                            'PUBLIC_ANAMNESIS.IDENTIFICATION.LABEL_CPF',
                                        )}
                                        value={data.cpf}
                                        onChange={(e) =>
                                            setData(
                                                'cpf',
                                                formatCPF(e.target.value),
                                            )
                                        }
                                        error={errors.cpf}
                                        placeholder={t(
                                            'PUBLIC_ANAMNESIS.IDENTIFICATION.PLACEHOLDER_CPF',
                                        )}
                                    />
                                    <div className="absolute right-4 top-[34px]">
                                        {isSearching ? (
                                            <Loader2
                                                className="animate-spin text-blue-500"
                                                size={20}
                                            />
                                        ) : (
                                            <Search
                                                className="text-slate-300"
                                                size={20}
                                            />
                                        )}
                                    </div>
                                </div>
                                <FloatingInput
                                    label={t(
                                        'PUBLIC_ANAMNESIS.IDENTIFICATION.LABEL_NAME',
                                    )}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    error={errors.name}
                                />
                                <FloatingInput
                                    label={t(
                                        'PUBLIC_ANAMNESIS.IDENTIFICATION.LABEL_EMAIL',
                                    )}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    error={errors.email}
                                />
                                <FloatingInput
                                    label={t(
                                        'PUBLIC_ANAMNESIS.IDENTIFICATION.LABEL_PHONE',
                                    )}
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData(
                                            'phone',
                                            formatPhone(e.target.value),
                                        )
                                    }
                                    error={errors.phone}
                                    placeholder={t(
                                        'PUBLIC_ANAMNESIS.IDENTIFICATION.PLACEHOLDER_PHONE',
                                    )}
                                />
                            </div>
                            <button
                                onClick={() => setStep('questions')}
                                disabled={
                                    !data.name ||
                                    data.cpf.length < 14 ||
                                    !isValidEmail(data.email) ||
                                    data.phone.length < 14 ||
                                    isSearching
                                }
                                className="w-full rounded-[2rem] bg-slate-900 py-5 font-black text-white shadow-xl transition-all hover:bg-black disabled:opacity-30"
                            >
                                {t(
                                    'PUBLIC_ANAMNESIS.IDENTIFICATION.BUTTON_NEXT',
                                )}
                            </button>
                        </motion.div>
                    )}

                    {step === 'questions' && (
                        <motion.div
                            key="q"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid gap-6">
                                {questions.map((q) => (
                                    <div
                                        key={q.id}
                                        className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
                                    >
                                        <label className="mb-6 block text-xl font-bold uppercase italic leading-tight tracking-tighter text-slate-800">
                                            {q.text}{' '}
                                            {q.is_required && (
                                                <span className="font-black text-rose-500">
                                                    *
                                                </span>
                                            )}
                                        </label>

                                        {q.type === 'boolean' && (
                                            <div className="flex gap-4">
                                                {[
                                                    t(
                                                        'PUBLIC_ANAMNESIS.QUESTIONS.BOOLEAN_YES',
                                                    ),
                                                    t(
                                                        'PUBLIC_ANAMNESIS.QUESTIONS.BOOLEAN_NO',
                                                    ),
                                                ].map((opt) => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() =>
                                                            handleAnswerChange(
                                                                q.text,
                                                                q.type,
                                                                opt,
                                                            )
                                                        }
                                                        className={`flex-1 rounded-[1.5rem] border-2 py-5 font-black uppercase tracking-widest transition-all ${data.answers.find((a) => a.question === q.text)?.answer === opt ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {(q.type === 'text' ||
                                            q.type === 'textarea') && (
                                            <input
                                                className="w-full rounded-2xl border-none bg-slate-50 p-5 font-medium ring-1 ring-slate-100 transition-all focus:ring-2 focus:ring-blue-500"
                                                value={
                                                    (data.answers.find(
                                                        (a) =>
                                                            a.question ===
                                                            q.text,
                                                    )?.answer as string) || ''
                                                }
                                                onChange={(e) =>
                                                    handleAnswerChange(
                                                        q.text,
                                                        q.type,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'PUBLIC_ANAMNESIS.QUESTIONS.INPUT_PLACEHOLDER',
                                                )}
                                            />
                                        )}

                                        {q.type === 'radio' && q.options && (
                                            <div className="grid gap-3">
                                                {q.options.map((opt) => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() =>
                                                            handleAnswerChange(
                                                                q.text,
                                                                q.type,
                                                                opt,
                                                            )
                                                        }
                                                        className={`w-full rounded-2xl border-2 p-5 text-left font-bold transition-all ${data.answers.find((a) => a.question === q.text)?.answer === opt ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'checkbox' && q.options && (
                                            <div className="grid gap-3">
                                                {q.options.map((opt) => {
                                                    const isChecked =
                                                        Array.isArray(
                                                            data.answers.find(
                                                                (a) =>
                                                                    a.question ===
                                                                    q.text,
                                                            )?.answer,
                                                        ) &&
                                                        (
                                                            data.answers.find(
                                                                (a) =>
                                                                    a.question ===
                                                                    q.text,
                                                            )
                                                                ?.answer as string[]
                                                        ).includes(opt);
                                                    return (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCheckboxAnswer(
                                                                    q.text,
                                                                    opt,
                                                                )
                                                            }
                                                            className={`w-full rounded-2xl border-2 p-5 text-left font-bold transition-all ${isChecked ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep('signature')}
                                disabled={!isFormComplete()}
                                className="w-full rounded-[2rem] bg-blue-600 py-5 font-black uppercase tracking-widest text-white shadow-xl transition-all disabled:opacity-30"
                            >
                                {t('PUBLIC_ANAMNESIS.QUESTIONS.BUTTON_REVIEW')}{' '}
                                <ChevronRight
                                    size={20}
                                    className="ml-1 inline"
                                />
                            </button>
                        </motion.div>
                    )}

                    {step === 'signature' && (
                        <motion.div
                            key="sig"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 text-center"
                        >
                            <div className="space-y-2">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <PenTool size={32} />
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                                    {t('PUBLIC_ANAMNESIS.SIGNATURE.TITLE')}
                                </h2>
                                <p className="text-sm font-medium italic text-slate-500">
                                    {t(
                                        'PUBLIC_ANAMNESIS.SIGNATURE.DESCRIPTION',
                                    )}
                                </p>
                            </div>
                            <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white shadow-inner">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="#1e293b"
                                    canvasProps={{
                                        className:
                                            'w-full h-64 cursor-crosshair',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={clearSignature}
                                    className="absolute bottom-4 right-4 rounded-xl bg-slate-100 p-3 text-slate-400 shadow-sm transition-colors hover:text-rose-500"
                                >
                                    <Eraser size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full rounded-[2rem] bg-emerald-500 py-5 font-black text-white shadow-xl transition-all hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {processing
                                    ? t(
                                          'PUBLIC_ANAMNESIS.SIGNATURE.BUTTON_PROCESSING',
                                      )
                                    : t(
                                          'PUBLIC_ANAMNESIS.SIGNATURE.BUTTON_SUBMIT',
                                      )}{' '}
                                <CheckCircle2
                                    size={22}
                                    className="ml-1 inline"
                                />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

function FloatingInput({ label, error, ...props }: FloatingInputProps) {
    return (
        <div className="flex flex-col gap-1.5 text-left">
            <label className="ml-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                {label}
            </label>
            <input
                {...props}
                className="rounded-2xl border-none bg-white p-4 font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-blue-500"
            />
            {error && (
                <span className="ml-4 text-[10px] font-bold text-rose-500">
                    {error}
                </span>
            )}
        </div>
    );
}
