import { useTrans } from '@/Hooks/useTrans';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Phone } from 'lucide-react';

interface LocationProps {
    address?: string;
    mapsLink?: string;
    phone?: string;
}

export default function DoctorLocationInfo({
    address,
    mapsLink,
    phone,
}: LocationProps) {
    const { t } = useTrans();

    if (!address && !mapsLink && !phone) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 border-t border-slate-100 pt-8"
        >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {t('PUBLIC_PROFILE.LOCATION_TITLE')}
            </h3>

            <div className="space-y-4">
                {address && (
                    <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                                {t('PROFILE.LABEL_ADDRESS')}
                            </p>
                            <p className="text-sm font-bold leading-tight text-slate-700">
                                {address}
                            </p>
                        </div>
                    </div>
                )}

                {phone && (
                    <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                                {t('AUTH.PHONE')}
                            </p>
                            <p className="text-sm font-bold leading-tight text-slate-700">
                                {phone}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {mapsLink && (
                <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white transition-all hover:bg-rose-600 active:scale-95"
                >
                    <div className="flex items-center gap-3">
                        <ExternalLink
                            size={16}
                            className="text-rose-400 group-hover:text-white"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {t('PUBLIC_PROFILE.OPEN_MAPS')}
                        </span>
                    </div>
                    <ChevronRight
                        size={14}
                        className="opacity-50"
                    />
                </a>
            )}
        </motion.div>
    );
}

function ChevronRight({
    className,
    size,
}: {
    className?: string;
    size?: number;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
