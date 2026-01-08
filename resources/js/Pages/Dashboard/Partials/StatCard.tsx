import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: number;
    icon: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
