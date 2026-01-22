import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ModeCardProps {
    title: string;
    desc: string;
    icon: ReactNode;
    color?: 'blue' | 'emerald';
    onClick: () => void;
}

export function ModeCard({
    title,
    desc,
    icon,
    color = 'blue',
    onClick,
}: ModeCardProps) {
    const colorConfigs = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            onClick={onClick}
            className="group cursor-pointer rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-2xl"
        >
            <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors group-hover:text-white ${colorConfigs[color]}`}
            >
                {icon}
            </div>
            <h4 className="mb-2 text-sm font-black uppercase tracking-widest text-slate-900">
                {title}
            </h4>
            <p className="text-[11px] font-medium leading-relaxed text-slate-400">
                {desc}
            </p>
        </motion.div>
    );
}
