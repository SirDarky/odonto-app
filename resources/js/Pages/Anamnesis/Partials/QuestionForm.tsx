import { useTrans } from '@/Hooks/useTrans'; // Ajuste conforme seu projeto
import { Trash2 } from 'lucide-react';
import React from 'react';
import { QuestionType } from './SortableQuestionItem';

interface FormState {
    text: string;
    type: QuestionType;
    options: string[];
    is_required: boolean;
    is_active: boolean;
}

interface Props {
    data: FormState;
    setData: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    onCancel: () => void;
    submitLabel: string;
}

export function QuestionForm({
    data,
    setData,
    onSubmit,
    processing,
    onCancel,
    submitLabel,
}: Props) {
    const { t } = useTrans();

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6"
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* ENUNCIADO / QUESTION TEXT */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase italic text-slate-400">
                        {t('ANAMNESIS_SETTINGS.FORM.LABEL_TEXT')}
                    </label>
                    <input
                        value={data.text}
                        onChange={(e) => setData('text', e.target.value)}
                        className="rounded-2xl border-none bg-slate-50 p-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* TIPO DE PERGUNTA / QUESTION TYPE */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase italic text-slate-400">
                        {t('ANAMNESIS_SETTINGS.FORM.LABEL_TYPE')}
                    </label>
                    <select
                        value={data.type}
                        onChange={(e) =>
                            setData('type', e.target.value as QuestionType)
                        }
                        className="rounded-2xl border-none bg-slate-50 p-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="boolean">
                            {t('ANAMNESIS_SETTINGS.FORM.TYPES.BOOLEAN')}
                        </option>
                        <option value="text">
                            {t('ANAMNESIS_SETTINGS.FORM.TYPES.TEXT')}
                        </option>
                        <option value="textarea">
                            {t('ANAMNESIS_SETTINGS.FORM.TYPES.TEXTAREA')}
                        </option>
                        <option value="checkbox">
                            {t('ANAMNESIS_SETTINGS.FORM.TYPES.CHECKBOX')}
                        </option>
                        <option value="radio">
                            {t('ANAMNESIS_SETTINGS.FORM.TYPES.RADIO')}
                        </option>
                    </select>
                </div>
            </div>

            {/* OPÇÕES DINÂMICAS (PARA CHECKBOX/RADIO) */}
            {(data.type === 'checkbox' || data.type === 'radio') && (
                <div className="space-y-3 rounded-[2rem] border border-dashed border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase italic text-slate-400">
                            {t('ANAMNESIS_SETTINGS.FORM.LABEL_OPTIONS')}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setData('options', [...data.options, ''])
                            }
                            className="text-xs font-bold text-blue-600 hover:underline"
                        >
                            {t('ANAMNESIS_SETTINGS.FORM.ADD_OPTION')}
                        </button>
                    </div>
                    {data.options.map((opt, idx) => (
                        <div
                            key={idx}
                            className="flex gap-2"
                        >
                            <input
                                value={opt}
                                onChange={(e) => {
                                    const newOptions = [...data.options];
                                    newOptions[idx] = e.target.value;
                                    setData('options', newOptions);
                                }}
                                className="flex-1 rounded-xl border-none bg-slate-50 p-2 text-sm ring-1 ring-slate-100"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'options',
                                        data.options.filter(
                                            (_, i) => i !== idx,
                                        ),
                                    )
                                }
                                className="text-slate-300 hover:text-rose-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* AÇÕES DO FORMULÁRIO */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs font-bold uppercase text-slate-400"
                >
                    {t('ANAMNESIS_SETTINGS.FORM.CANCEL')}
                </button>
                <button
                    disabled={processing}
                    className="rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
