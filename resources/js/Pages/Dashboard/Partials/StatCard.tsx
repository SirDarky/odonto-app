import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    className?: string;
}

export default function StatCard({
    label,
    value,
    icon,
    className = '',
}: StatCardProps) {
    return (
        <div
            className={`flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md ${className}`}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {label}
                </p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}
