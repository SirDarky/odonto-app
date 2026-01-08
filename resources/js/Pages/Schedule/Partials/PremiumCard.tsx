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

export default function PremiumCard({
    href,
    title,
    description,
    icon,
    color,
}: PremiumCardProps) {
    const themes = {
        indigo: {
            bg: 'bg-indigo-50/50',
            icon: 'bg-indigo-100 text-indigo-600',
            light: 'group-hover:bg-indigo-600',
        },
        emerald: {
            bg: 'bg-emerald-50/50',
            icon: 'bg-emerald-100 text-emerald-600',
            light: 'group-hover:bg-emerald-600',
        },
        amber: {
            bg: 'bg-amber-50/50',
            icon: 'bg-amber-100 text-amber-600',
            light: 'group-hover:bg-amber-600',
        },
    };

    const { t } = useTrans();

    const currentTheme = themes[color];

    return (
        <div className="group relative flex min-w-[300px] max-w-[360px] flex-1 flex-col rounded-[2.5rem] border border-slate-100/80 bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-700 ease-in-out hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
            <Link
                href={href}
                className="absolute inset-0 z-30 rounded-[2.5rem]"
            />

            <div
                className={`mb-10 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${currentTheme.icon}`}
            >
                {icon}
            </div>

            <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-500 group-hover:text-blue-600">
                    {title}
                </h3>
                <p className="text-base font-light leading-relaxed text-slate-500 opacity-80 transition-opacity group-hover:opacity-100">
                    {description}
                </p>
            </div>

            <div className="relative z-10 mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 transition-colors group-hover:text-slate-900">
                    {t('SETTINGS.CONFIGURE')}
                </span>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-500 group-hover:text-white ${currentTheme.light}`}
                >
                    <svg
                        className="h-5 w-5 transform transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>

            <div
                className={`pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-0 transition-opacity duration-700 group-hover:opacity-[0.03] ${currentTheme.bg}`}
            />
        </div>
    );
}
