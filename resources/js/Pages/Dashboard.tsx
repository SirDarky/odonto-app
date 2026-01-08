import { useToast } from '@/Contexts/ToastContext';
import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AppointmentStatus, DashboardAction } from '@/types/Enums';
import { Head, router } from '@inertiajs/react';
import { Check, Clock, Calendar as LucideCalendar } from 'lucide-react';
import { useCallback, useState } from 'react';
import CreateAppointmentModal from './Dashboard/Partials/CreateAppointmentModal';
import DateNavigator from './Dashboard/Partials/DateNavigator';
import StatCard from './Dashboard/Partials/StatCard';
import TimelineItem from './Dashboard/Partials/TimelineItem';

export interface Appointment {
    id: number;
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
    pending_today: number;
    confirmed_today: number;
    available_slots: number;
}
interface Props {
    timeline: TimelineSlot[];
    selectedDate: string;
    stats: Stats;
}

export default function Dashboard({ timeline, selectedDate, stats }: Props) {
    const { t } = useTrans();
    const { addToast } = useToast();

    // Estado do Modal
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        time: string;
    }>({
        isOpen: false,
        time: '',
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

    const openCreateModal = useCallback((time: string) => {
        setModalState({ isOpen: true, time });
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

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#FDFBFC] p-4 pb-20 md:p-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
                    <aside className="w-full lg:w-[400px]">
                        <div className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
                            <DateNavigator
                                selectedDate={selectedDate}
                                onChangeDate={changeDate}
                            />

                            <div className="custom-scrollbar max-h-[600px] space-y-3 overflow-y-auto p-4 md:max-h-[calc(100vh-250px)]">
                                {timeline.map((slot, idx) => (
                                    <TimelineItem
                                        key={`${selectedDate}-${idx}`}
                                        slot={slot}
                                        t={t}
                                        onAction={handleAction}
                                        onSelect={openCreateModal} // Integrado
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="flex flex-1 flex-col gap-6">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl md:p-12">
                            <div className="relative z-10 max-w-md">
                                <h1 className="text-2xl font-black md:text-4xl">
                                    {t('DASHBOARD.GREETING')}, Dr.
                                </h1>
                                <p className="mt-4 text-sm font-medium text-slate-400">
                                    {t('DASHBOARD.SUMMARY_TEXT', {
                                        count: stats.pending_today,
                                    })}
                                </p>
                            </div>
                            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-rose-500/10 opacity-50 blur-3xl" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <StatCard
                                label={t('DASHBOARD.PENDING')}
                                value={stats.pending_today}
                                icon={<Clock className="text-amber-500" />}
                            />
                            <StatCard
                                label={t('DASHBOARD.CONFIRMED')}
                                value={stats.confirmed_today}
                                icon={<Check className="text-emerald-500" />}
                            />
                            <StatCard
                                label={t('DASHBOARD.FREE_SLOTS')}
                                value={stats.available_slots}
                                icon={
                                    <LucideCalendar className="text-rose-500" />
                                }
                            />
                        </div>
                    </main>
                </div>
            </div>

            <CreateAppointmentModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, time: '' })}
                selectedTime={modalState.time}
                selectedDate={selectedDate}
            />
        </AuthenticatedLayout>
    );
}
