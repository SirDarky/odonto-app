import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { AppointmentStatus, DashboardAction } from '@/types/Enums';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
    Check,
    Clock,
    LayoutDashboard,
    Calendar as LucideCalendar,
    Share2,
    UserX,
    X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import CancelledHistoryModal from './Dashboard/Partials/CancelledHistoryModal';
import CreateAppointmentModal from './Dashboard/Partials/CreateAppointmentModal';
import DateNavigator from './Dashboard/Partials/DateNavigator';
import PatientProfileView from './Dashboard/Partials/PatientProfileView';
import PendingAppointmentItem from './Dashboard/Partials/PendingAppointmentItem';
import RescheduleModal from './Dashboard/Partials/RescheduleModal';
import StatCard from './Dashboard/Partials/StatCard';
import TimelineItem from './Dashboard/Partials/TimelineItem';

export interface Appointment {
    id: number;
    patient_id: number;
    patient_name: string;
    procedure: string;
    status: AppointmentStatus;
}

export interface TimelineSlot {
    time: string;
    is_blocked: boolean;
    appointment: Appointment | null;
}

interface Stats {
    pending_week: number;
    confirmed_week: number;
    cancelled_week: number;
    available_slots: number;
}

export interface PendingAppointment {
    id: number;
    patient_id: number;
    patient_name: string;
    date: string;
    time: string;
    status: AppointmentStatus;
}

interface Props {
    timeline: TimelineSlot[];
    selectedDate: string;
    stats: Stats;
    allPending: PendingAppointment[];
    workingDays: number[];
}

interface RescheduleData {
    id: number;
    patient_name: string;
    time: string;
    date: string;
}

export default function Dashboard({
    timeline,
    selectedDate,
    stats,
    allPending,
    workingDays,
}: Props) {
    const { t } = useTrans();
    const { addToast } = useToast();
    const { auth } = usePage<PageProps>().props;

    const [isCancelledModalOpen, setIsCancelledModalOpen] = useState(false);
    const [selectedPatientProfileId, setSelectedPatientProfileId] = useState<
        number | null
    >(null);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        time: string;
    }>({
        isOpen: false,
        time: '',
    });

    const [rescheduleData, setRescheduleData] = useState<{
        isOpen: boolean;
        appointment: RescheduleData | null;
    }>({
        isOpen: false,
        appointment: null,
    });

    const handleAction = useCallback(
        (id: number, action: DashboardAction) => {
            router.patch(
                route(`appointments.${action}`, id),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () =>
                        addToast(t(`MESSAGES.SUCCESS_${action.toUpperCase()}`)),
                },
            );
        },
        [addToast, t],
    );

    const setSpecificDate = useCallback((newDate: string) => {
        router.get(
            route('dashboard'),
            { date: newDate },
            { preserveState: true },
        );
    }, []);

    const openCreateModal = useCallback((time: string) => {
        setModalState({ isOpen: true, time });
    }, []);

    const openRescheduleModal = useCallback((data: RescheduleData) => {
        setRescheduleData({ isOpen: true, appointment: data });
    }, []);

    const changeDate = useCallback(
        (days: number) => {
            const date = new Date(selectedDate + 'T00:00:00');
            date.setDate(date.getDate() + days);
            router.get(
                route('dashboard'),
                { date: date.toISOString().split('T')[0] },
                { preserveState: true },
            );
        },
        [selectedDate],
    );

    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                addToast(t('DASHBOARD.LINK_COPIED') || 'Link copiado!');
            }
        } catch (err) {
            console.error('Falha crítica ao copiar link:', err);
        }
        document.body.removeChild(textArea);
    };

    const handleCopyShareLink = () => {
        const slug = auth.user.slug;
        if (!slug) {
            addToast('Erro: Slug do dentista não encontrado.');
            return;
        }

        const shareUrl = `${window.location.origin}/${slug}?date=${selectedDate}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(shareUrl)
                .then(() => {
                    addToast(t('DASHBOARD.LINK_COPIED') || 'Link copiado!');
                })
                .catch(() => {
                    fallbackCopyTextToClipboard(shareUrl);
                });
        } else {
            fallbackCopyTextToClipboard(shareUrl);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#FDFBFC] p-4 pb-20 selection:bg-rose-100 md:p-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
                    <aside className="w-full lg:w-[400px]">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
                        >
                            <DateNavigator
                                selectedDate={selectedDate}
                                onChangeDate={changeDate}
                                onSetDate={setSpecificDate}
                                workingDays={workingDays}
                            />

                            <div className="px-6 pb-2">
                                <button
                                    onClick={handleCopyShareLink}
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-50 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm transition-all hover:bg-rose-500 hover:text-white active:scale-95"
                                >
                                    <Share2
                                        size={14}
                                        className="transition-transform group-hover:rotate-12"
                                    />
                                    {t('DASHBOARD.SHARE_DAY_LINK') ||
                                        `Copiar link do dia`}
                                </button>
                            </div>

                            <div className="custom-scrollbar relative max-h-[600px] overflow-y-auto overflow-x-hidden p-6 md:max-h-[calc(100vh-250px)]">
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={selectedDate}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {timeline.map((slot, idx) => (
                                            <TimelineItem
                                                key={`${selectedDate}-${idx}`}
                                                slot={slot}
                                                t={t}
                                                selectedDate={selectedDate}
                                                onAction={handleAction}
                                                onSelect={openCreateModal}
                                                onReschedule={
                                                    openRescheduleModal
                                                }
                                                onViewProfile={(id) =>
                                                    setSelectedPatientProfileId(
                                                        id,
                                                    )
                                                }
                                            />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </aside>

                    <motion.main
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-1 flex-col gap-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl md:p-14"
                        >
                            <div className="relative z-10 max-w-md">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-rose-400" />
                                </motion.div>
                                <h1 className="text-3xl font-black italic md:text-5xl">
                                    {t('DASHBOARD.GREETING')}, Dr.
                                </h1>
                                <p className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-400">
                                    {t('DASHBOARD.SUMMARY_TEXT', {
                                        count: allPending.length,
                                    })}
                                </p>
                            </div>
                            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-rose-500/10 blur-[80px]" />
                            <div className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[80px]" />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <StatCard
                                label={t('DASHBOARD.PENDING_WEEK')}
                                value={stats.pending_week}
                                icon={<Clock className="text-amber-500" />}
                            />
                            <StatCard
                                label={t('DASHBOARD.CONFIRMED_WEEK')}
                                value={stats.confirmed_week}
                                icon={<Check className="text-emerald-500" />}
                            />
                            <StatCard
                                label={t('DASHBOARD.FREE_SLOTS')}
                                value={stats.available_slots}
                                icon={
                                    <LucideCalendar className="text-blue-500" />
                                }
                            />
                            <button
                                onClick={() => setIsCancelledModalOpen(true)}
                                className="group text-left outline-none"
                            >
                                <StatCard
                                    label={t('DASHBOARD.CANCELLED_WEEK')}
                                    value={stats.cancelled_week}
                                    icon={<UserX className="text-rose-500" />}
                                    className="border-dashed transition-all group-hover:border-rose-200 group-hover:bg-rose-50/10"
                                />
                            </button>
                        </motion.div>

                        <motion.section
                            variants={itemVariants}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    {t('DASHBOARD.GLOBAL_PENDING_TITLE')} (
                                    {allPending.length})
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {allPending.length > 0 ? (
                                        allPending.map((app) => (
                                            <PendingAppointmentItem
                                                key={app.id}
                                                appointment={app}
                                                onAction={handleAction}
                                                onViewProfile={(id) =>
                                                    setSelectedPatientProfileId(
                                                        id,
                                                    )
                                                }
                                            />
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/30 p-12 text-center transition-colors hover:border-slate-200"
                                        >
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                                                {t(
                                                    'DASHBOARD.NO_PENDING_FOUND',
                                                )}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.section>
                    </motion.main>
                </div>
            </div>

            <CreateAppointmentModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, time: '' })}
                selectedTime={modalState.time}
                selectedDate={selectedDate}
            />

            <RescheduleModal
                isOpen={rescheduleData.isOpen}
                appointment={rescheduleData.appointment}
                onClose={() =>
                    setRescheduleData({ isOpen: false, appointment: null })
                }
            />

            <CancelledHistoryModal
                isOpen={isCancelledModalOpen}
                onClose={() => setIsCancelledModalOpen(false)}
            />

            <AnimatePresence>
                {selectedPatientProfileId && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setSelectedPatientProfileId(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-xl overflow-hidden rounded-[3rem] bg-white p-10 shadow-2xl"
                        >
                            <button
                                onClick={() =>
                                    setSelectedPatientProfileId(null)
                                }
                                className="absolute right-8 top-8 p-2 text-slate-400 transition-colors hover:text-rose-500"
                            >
                                <X size={24} />
                            </button>
                            <PatientProfileView
                                patientId={selectedPatientProfileId}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
