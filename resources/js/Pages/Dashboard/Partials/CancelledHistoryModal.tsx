import { useTrans } from '@/Hooks/useTrans';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Clock,
    Fingerprint,
    Mail,
    Phone,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CancelledAppointment {
    id: number;
    patient_id: number;
    patient_name: string;
    formatted_date: string;
    time: string;
    cancelled_at: string;
}

interface PaginationData {
    data: CancelledAppointment[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PatientProfile {
    id: number;
    name: string;
    phone: string;
    cpf: string;
    email: string | null;
}

export default function CancelledHistoryModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { t } = useTrans();
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState<PaginationData | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
        null,
    );
    const [patientInfo, setPatientInfo] = useState<PatientProfile | null>(null);

    const fetchHistory = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get<PaginationData>(
                route('appointments.cancelled', { page }),
            );
            setHistoryData(response.data);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientProfile = async (id: number) => {
        setLoading(true);
        setSelectedPatientId(id);
        try {
            const response = await axios.get<PatientProfile>(
                route('patients.show', id),
            );
            setPatientInfo(response.data);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
            setSelectedPatientId(null);
            setPatientInfo(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative min-h-[500px] w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-50 p-8">
                    <div className="flex items-center gap-4">
                        {selectedPatientId && (
                            <button
                                onClick={() => setSelectedPatientId(null)}
                                className="rounded-full p-2 transition-colors hover:bg-slate-100"
                            >
                                <ArrowLeft
                                    size={20}
                                    className="text-slate-600"
                                />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-black uppercase italic text-slate-800">
                                {selectedPatientId
                                    ? t('CANCELLED_MODAL.PROFILE_TITLE')
                                    : t('CANCELLED_MODAL.HISTORY_TITLE')}
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {selectedPatientId
                                    ? t('CANCELLED_MODAL.PROFILE_SUBTITLE')
                                    : t('CANCELLED_MODAL.HISTORY_SUBTITLE')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 transition-colors hover:text-rose-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-8 pb-4">
                    <AnimatePresence mode="wait">
                        {!selectedPatientId ? (
                            <motion.div
                                key="list"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className="space-y-4"
                            >
                                {loading && !historyData ? (
                                    <div className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {t('CANCELLED_MODAL.LOADING')}
                                    </div>
                                ) : historyData?.data &&
                                  historyData.data.length > 0 ? (
                                    historyData.data.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                fetchPatientProfile(
                                                    item.patient_id,
                                                )
                                            }
                                            className="group flex cursor-pointer items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5 transition-all hover:border-rose-100 hover:shadow-xl hover:shadow-rose-500/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black uppercase text-slate-800">
                                                        {item.patient_name}
                                                    </h4>
                                                    <div className="mt-1 flex items-center gap-3 text-[9px] font-bold uppercase text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar
                                                                size={10}
                                                            />{' '}
                                                            {
                                                                item.formatted_date
                                                            }
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} />{' '}
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] font-black uppercase italic text-slate-300">
                                                    {item.cancelled_at}
                                                </span>
                                                <ChevronRight
                                                    size={16}
                                                    className="text-slate-200 group-hover:text-rose-500"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-xs font-black uppercase text-slate-300">
                                        {t('CANCELLED_MODAL.EMPTY')}
                                    </div>
                                )}

                                {historyData && historyData.last_page > 1 && (
                                    <div className="flex justify-center gap-2 pt-4">
                                        {Array.from(
                                            { length: historyData.last_page },
                                            (_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        fetchHistory(i + 1)
                                                    }
                                                    className={`h-8 w-8 rounded-full text-[10px] font-black transition-all ${
                                                        historyData.current_page ===
                                                        i + 1
                                                            ? 'bg-slate-900 text-white shadow-lg'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="profile"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                {loading && !patientInfo ? (
                                    <div className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {t('CANCELLED_MODAL.LOADING_PROFILE')}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-row items-center gap-6 text-center">
                                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border-4 border-white bg-slate-100 text-slate-300 shadow-xl">
                                                <User size={48} />
                                            </div>
                                            <h3 className="text-2xl font-black uppercase italic leading-none text-slate-800">
                                                {patientInfo?.name}
                                            </h3>
                                        </div>

                                        <span className="mt-3 rounded-full bg-rose-50 px-4 py-1 text-[10px] font-black uppercase text-rose-500">
                                            {t('CANCELLED_MODAL.BADGE')}
                                        </span>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-md">
                                                <div className="mb-2 flex items-center gap-2 text-rose-500">
                                                    <Phone size={12} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                                        {t('AUTH.PHONE')}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {patientInfo?.phone}
                                                </p>
                                            </div>
                                            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-md">
                                                <div className="mb-2 flex items-center gap-2 text-rose-500">
                                                    <Fingerprint size={12} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                                        {t(
                                                            'PUBLIC_PROFILE.LABEL_CPF',
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {patientInfo?.cpf}
                                                </p>
                                            </div>
                                            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-md md:col-span-2">
                                                <div className="mb-2 flex items-center gap-2 text-rose-500">
                                                    <Mail size={12} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                                        {t(
                                                            'PROFILE.LABEL_EMAIL',
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {patientInfo?.email ||
                                                        '---'}
                                                </p>
                                            </div>
                                        </div>

                                        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-rose-600 active:scale-[0.98]">
                                            <UserCheck size={14} />
                                            {t('CANCELLED_MODAL.OPEN_CHART')}
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
