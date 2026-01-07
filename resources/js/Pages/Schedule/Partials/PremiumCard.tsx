import { useTrans } from '@/Hooks/useTrans';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PremiumCardProps {
    href: string;
    title: string;
    description: string;
    icon: ReactNode;
    color: 'indigo' | 'emerald' | 'amber';
}

export default function PremiumCard({ href, title, description, icon, color }: PremiumCardProps) {
    const themes = {
        indigo: {
            bg: "bg-indigo-50/50",
            icon: "bg-indigo-100 text-indigo-600",
            light: "group-hover:bg-indigo-600",
        },
        emerald: {
            bg: "bg-emerald-50/50",
            icon: "bg-emerald-100 text-emerald-600",
            light: "group-hover:bg-emerald-600",
        },
        amber: {
            bg: "bg-amber-50/50",
            icon: "bg-amber-100 text-amber-600",
            light: "group-hover:bg-amber-600",
        },
    };

    const { t } = useTrans();

    const currentTheme = themes[color];

    return (
        <div className="group relative flex flex-col flex-1 min-w-[300px] max-w-[360px] p-10 rounded-[2.5rem] bg-white border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-700 ease-in-out hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">

            <Link href={href} className="absolute inset-0 z-30 rounded-[2.5rem]" />

            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${currentTheme.icon}`}>
                {icon}
            </div>

            <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                    {title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">
                    {description}
                </p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-900 transition-colors">
                    {t('SETTINGS.CONFIGURE')}
                </span>

                <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-500 group-hover:text-white ${currentTheme.light}`}>
                    <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none ${currentTheme.bg}`} />
        </div>
    );
}