import { useTrans } from '@/Hooks/useTrans';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

export type QuestionType =
    | 'boolean'
    | 'text'
    | 'textarea'
    | 'checkbox'
    | 'radio';

export interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options: string[] | null;
    is_required: boolean;
    is_active: boolean;
    order: number;
}

interface SortableItemProps {
    q: Question;
    onToggle: (question: Question) => void;
    onDelete: (id: number) => void;
    onEdit: (question: Question) => void;
}

export function SortableQuestionItem({
    q,
    onToggle,
    onDelete,
    onEdit,
}: SortableItemProps) {
    const { t } = useTrans();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: q.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
    };

    // Mapeamento de labels traduzidos para o Badge
    const typeLabels: Record<QuestionType, string> = {
        boolean: t('ANAMNESIS_SETTINGS.FORM.TYPES.BOOLEAN'),
        text: t('ANAMNESIS_SETTINGS.FORM.TYPES.TEXT'),
        textarea: t('ANAMNESIS_SETTINGS.FORM.TYPES.TEXTAREA'),
        checkbox: t('ANAMNESIS_SETTINGS.FORM.TYPES.CHECKBOX'),
        radio: t('ANAMNESIS_SETTINGS.FORM.TYPES.RADIO'),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-5 rounded-[2rem] border border-slate-50 bg-white p-6 shadow-sm transition-all ${
                isDragging
                    ? 'scale-[1.02] opacity-90 shadow-2xl ring-2 ring-blue-100'
                    : 'hover:shadow-md'
            } ${!q.is_active ? 'opacity-50 grayscale' : ''}`}
        >
            {/* Handle de Arrasto */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab p-2 text-slate-200 hover:text-blue-400 active:cursor-grabbing"
            >
                <GripVertical size={20} />
            </div>

            {/* Conteúdo da Pergunta */}
            <div className="flex-1">
                <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-600">
                    {typeLabels[q.type] || q.type}
                </span>
                <h3 className="mt-1 font-bold tracking-tight text-slate-800">
                    {q.text}
                </h3>
                {q.options && q.options.length > 0 && (
                    <p className="mt-1 text-[10px] italic text-slate-400">
                        {t('ANAMNESIS_SETTINGS.LIST.OPTIONS_LABEL').replace(
                            ':list',
                            q.options.join(', '),
                        )}
                    </p>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
                {/* Botão Editar */}
                <button
                    type="button"
                    onClick={() => onEdit(q)}
                    className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                    title={t('ANAMNESIS_SETTINGS.LIST.EDIT_TOOLTIP')}
                >
                    <Edit3 size={18} />
                </button>

                {/* Switch de Status */}
                <button
                    type="button"
                    onClick={() => onToggle(q)}
                    className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        q.is_active
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                    }`}
                >
                    {q.is_active
                        ? t('ANAMNESIS_SETTINGS.LIST.STATUS_ACTIVE')
                        : t('ANAMNESIS_SETTINGS.LIST.STATUS_INACTIVE')}
                </button>

                {/* Botão Deletar */}
                <button
                    type="button"
                    onClick={() => onDelete(q.id)}
                    className="p-2 text-slate-300 transition-colors hover:text-rose-500"
                    title={t('ANAMNESIS_SETTINGS.LIST.DELETE_TOOLTIP')}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
