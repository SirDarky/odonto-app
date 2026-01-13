import { useTrans } from '@/Hooks/useTrans';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Fingerprint, Mail, Phone, User, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PatientProfile {
    id: number;
    name: string;
    phone: string;
    cpf: string;
    email: string | null;
}

interface Props {
    patientId: number;
}

export default function PatientProfileView({ patientId }: Props) {
    const { t } = useTrans();
    const [loading, setLoading] = useState(true);
    const [patientInfo, setPatientInfo] = useState<PatientProfile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get<PatientProfile>(
                    route('patients.show', patientId),
                );
                setPatientInfo(response.data);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [patientId]);

    if (loading)
        return (
            <div className="animate-pulse py-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t('CANCELLED_MODAL.LOADING_PROFILE')}
            </div>
        );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-row items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] border-4 border-white bg-slate-100 text-slate-300 shadow-xl">
                    <User size={48} />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase italic leading-none text-slate-800">
                        {patientInfo?.name}
                    </h3>
                    <span className="mt-2 inline-block rounded-full bg-rose-50 px-4 py-1 text-[10px] font-black uppercase text-rose-500">
                        {t('CANCELLED_MODAL.BADGE')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProfileCard
                    icon={<Phone size={12} />}
                    label={t('AUTH.PHONE')}
                    value={patientInfo?.phone}
                />
                <ProfileCard
                    icon={<Fingerprint size={12} />}
                    label={t('PUBLIC_PROFILE.LABEL_CPF')}
                    value={patientInfo?.cpf}
                />
                <div className="md:col-span-2">
                    <ProfileCard
                        icon={<Mail size={12} />}
                        label={t('PROFILE.LABEL_EMAIL')}
                        value={patientInfo?.email || '---'}
                    />
                </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-rose-600 active:scale-[0.98]">
                <UserCheck size={14} />
                {t('CANCELLED_MODAL.OPEN_CHART')}
            </button>
        </motion.div>
    );
}

function ProfileCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
}) {
    return (
        <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-rose-500">
                {icon}
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    {label}
                </p>
            </div>
            <p className="text-sm font-bold text-slate-700">{value}</p>
        </div>
    );
}
