import { useTrans } from '@/Hooks/useTrans'; // Ajuste o path conforme seu projeto
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    ClipboardCheck,
    LayoutTemplate,
    Plus,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

import Modal from '@/Components/Modal';
import { ANAMNESIS_TEMPLATES } from '@/Constants/anamnesisTemplates';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ModeCard } from './Partials/ModeCard';
import { QuestionForm } from './Partials/QuestionForm';
import {
    Question,
    QuestionType,
    SortableQuestionItem,
} from './Partials/SortableQuestionItem';

interface FormState {
    text: string;
    type: QuestionType;
    options: string[];
    is_required: boolean;
    is_active: boolean;
}

export default function Index({ questions }: { questions: Question[] }) {
    const { t } = useTrans();
    const [view, setView] = useState<'list' | 'choosing_method'>('list');
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null,
    );
    const [isCreating, setIsCreating] = useState(false);
    const [templateToImport, setTemplateToImport] = useState<
        (typeof ANAMNESIS_TEMPLATES)[0] | null
    >(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const createForm = useForm<FormState>({
        text: '',
        type: 'boolean',
        options: [],
        is_required: true,
        is_active: true,
    });

    const editForm = useForm<FormState>({
        text: '',
        type: 'boolean',
        options: [],
        is_required: true,
        is_active: true,
    });

    const handleReplaceTemplate = (
        template: (typeof ANAMNESIS_TEMPLATES)[0],
    ) => {
        router.post(
            route('settings.anamnesis.replace-template'),
            { questions: template.questions },
            {
                onSuccess: () => {
                    setTemplateToImport(null);
                    setView('list');
                },
                preserveScroll: true,
            },
        );
    };

    const handleEditClick = (q: Question) => {
        setEditingQuestion(q);
        editForm.setData({
            text: q.text,
            type: q.type,
            options: q.options || [],
            is_required: q.is_required,
            is_active: q.is_active,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over.id);
            const newOrder = arrayMove(questions, oldIndex, newIndex);
            router.post(
                route('settings.anamnesis.reorder'),
                { ids: newOrder.map((q) => q.id) },
                { preserveScroll: true },
            );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={
                    t('ANAMNESIS_SETTINGS.TITLE') +
                    ' ' +
                    t('ANAMNESIS_SETTINGS.SUBTITLE')
                }
            />

            {/* MODAL DE CONFIRMAÇÃO DE SUBSTITUIÇÃO */}
            <Modal
                show={!!templateToImport}
                onClose={() => setTemplateToImport(null)}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="mb-2 text-xl font-black uppercase italic text-slate-900">
                        {t('ANAMNESIS_SETTINGS.CONFIRM_MODAL.TITLE')}{' '}
                        <span className="text-amber-500">
                            {t(
                                'ANAMNESIS_SETTINGS.CONFIRM_MODAL.TITLE_HIGHLIGHT',
                            )}
                        </span>
                    </h2>
                    <p className="mb-8 text-sm text-slate-500">
                        {t(
                            'ANAMNESIS_SETTINGS.CONFIRM_MODAL.DESCRIPTION',
                        ).replace(
                            ':template',
                            templateToImport?.title || '',
                        )}{' '}
                        <span className="font-bold text-rose-500">
                            {t(
                                'ANAMNESIS_SETTINGS.CONFIRM_MODAL.DESCRIPTION_HIGHLIGHT',
                            )}
                        </span>
                        .
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setTemplateToImport(null)}
                            className="flex-1 rounded-2xl bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-200"
                        >
                            {t('ANAMNESIS_SETTINGS.CONFIRM_MODAL.CANCEL')}
                        </button>
                        <button
                            onClick={() =>
                                templateToImport &&
                                handleReplaceTemplate(templateToImport)
                            }
                            className="flex-1 rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black"
                        >
                            {t('ANAMNESIS_SETTINGS.CONFIRM_MODAL.CONFIRM')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL EDITAR */}
            <Modal
                show={!!editingQuestion}
                onClose={() => setEditingQuestion(null)}
            >
                <div className="p-8">
                    <h2 className="mb-6 text-2xl font-black uppercase italic text-slate-900">
                        {t('ANAMNESIS_SETTINGS.EDIT_MODAL.TITLE')}{' '}
                        <span className="text-blue-600">
                            {t('ANAMNESIS_SETTINGS.EDIT_MODAL.TITLE_HIGHLIGHT')}
                        </span>
                    </h2>
                    <QuestionForm
                        data={editForm.data}
                        setData={editForm.setData}
                        processing={editForm.processing}
                        onCancel={() => setEditingQuestion(null)}
                        submitLabel={t('ANAMNESIS_SETTINGS.FORM.SUBMIT_UPDATE')}
                        onSubmit={(e) => {
                            e.preventDefault();
                            editForm.put(
                                route(
                                    'settings.anamnesis.update',
                                    editingQuestion?.id,
                                ),
                                { onSuccess: () => setEditingQuestion(null) },
                            );
                        }}
                    />
                </div>
            </Modal>

            <div className="min-h-screen bg-[#FBFDFF] px-6 pb-20 pt-10">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-12 flex items-center justify-between">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <ClipboardCheck
                                    className="text-blue-600"
                                    size={24}
                                />
                                <span className="text-[10px] font-black uppercase italic tracking-[0.3em] text-blue-600">
                                    {t('ANAMNESIS_SETTINGS.BRAND')}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black italic tracking-tighter text-slate-900">
                                {t('ANAMNESIS_SETTINGS.TITLE')}{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text not-italic text-transparent">
                                    {t('ANAMNESIS_SETTINGS.SUBTITLE')}
                                </span>
                            </h1>
                        </motion.div>
                        {view === 'list' && (
                            <button
                                onClick={() => setView('choosing_method')}
                                className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white shadow-xl transition-all hover:bg-black"
                            >
                                <Plus size={20} />{' '}
                                {t('ANAMNESIS_SETTINGS.ADD_BUTTON')}
                            </button>
                        )}
                    </header>

                    <AnimatePresence mode="wait">
                        {view === 'choosing_method' ? (
                            <motion.div
                                key="choosing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative grid gap-6 md:grid-cols-3"
                            >
                                <button
                                    onClick={() => setView('list')}
                                    className="absolute -top-10 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600"
                                >
                                    <ArrowLeft size={16} />{' '}
                                    {t('ANAMNESIS_SETTINGS.BACK_BUTTON')}
                                </button>
                                <ModeCard
                                    title={t(
                                        'ANAMNESIS_SETTINGS.MODES.CREATE_CUSTOM',
                                    )}
                                    desc={t(
                                        'ANAMNESIS_SETTINGS.MODES.CREATE_CUSTOM_DESC',
                                    )}
                                    icon={<Plus size={28} />}
                                    onClick={() => {
                                        setIsCreating(true);
                                        setView('list');
                                    }}
                                />
                                {ANAMNESIS_TEMPLATES.map((t_item) => (
                                    <ModeCard
                                        key={t_item.id}
                                        title={t_item.title}
                                        desc={t(
                                            'ANAMNESIS_SETTINGS.MODES.TEMPLATE_DESC',
                                        ).replace(':name', t_item.title)}
                                        icon={<LayoutTemplate size={28} />}
                                        color="emerald"
                                        onClick={() => {
                                            if (questions.length > 0)
                                                setTemplateToImport(t_item);
                                            else handleReplaceTemplate(t_item);
                                        }}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {isCreating && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mb-10 overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-xl"
                                    >
                                        <QuestionForm
                                            data={createForm.data}
                                            setData={createForm.setData}
                                            processing={createForm.processing}
                                            onCancel={() =>
                                                setIsCreating(false)
                                            }
                                            submitLabel={t(
                                                'ANAMNESIS_SETTINGS.FORM.SUBMIT_CREATE',
                                            )}
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                createForm.post(
                                                    route(
                                                        'settings.anamnesis.store',
                                                    ),
                                                    {
                                                        onSuccess: () => {
                                                            setIsCreating(
                                                                false,
                                                            );
                                                            createForm.reset();
                                                        },
                                                    },
                                                );
                                            }}
                                        />
                                    </motion.div>
                                )}

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={questions.map((q) => q.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="grid gap-4">
                                            {questions.length === 0 &&
                                            !isCreating ? (
                                                <EmptyState />
                                            ) : (
                                                questions.map((q) => (
                                                    <SortableQuestionItem
                                                        key={q.id}
                                                        q={q}
                                                        onToggle={(question) =>
                                                            router.put(
                                                                route(
                                                                    'settings.anamnesis.update',
                                                                    question.id,
                                                                ),
                                                                {
                                                                    ...question,
                                                                    is_active:
                                                                        !question.is_active,
                                                                },
                                                            )
                                                        }
                                                        onEdit={handleEditClick}
                                                        onDelete={(id) => {
                                                            if (
                                                                confirm(
                                                                    t(
                                                                        'ANAMNESIS_SETTINGS.LIST.DELETE_CONFIRM',
                                                                    ),
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        'settings.anamnesis.destroy',
                                                                        id,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function EmptyState() {
    const { t } = useTrans();
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center opacity-40">
            <div className="mb-4 rounded-full bg-slate-50 p-6 text-slate-200">
                <Sparkles size={48} />
            </div>
            <h3 className="text-lg font-bold italic text-slate-800">
                {t('ANAMNESIS_SETTINGS.LIST.EMPTY_TITLE')}
            </h3>
            <p className="text-sm text-slate-400">
                {t('ANAMNESIS_SETTINGS.LIST.EMPTY_DESC')}
            </p>
        </div>
    );
}
