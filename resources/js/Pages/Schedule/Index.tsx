import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { Clock, Lock, Settings, Zap } from 'lucide-react';
import PremiumCard from './Partials/PremiumCard';

export default function Index() {
    const { t } = useTrans();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24,
            },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#FBFDFF] pb-24 selection:bg-blue-100">
                <div className="pointer-events-none absolute top-0 h-[500px] w-full bg-gradient-to-b from-blue-50/50 to-transparent" />

                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 w-full max-w-4xl px-6 pb-8 pt-12 text-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="mb-8 inline-block rounded-full border border-slate-200/60 bg-white px-5 py-2 shadow-sm"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                            {t('SCHEDULE.CENTER')}
                        </span>
                    </motion.div>

                    <h1 className="text-4xl font-black italic leading-tight tracking-tighter text-slate-900 md:text-5xl">
                        {t('SETTINGS.HERO_TITLE_1')} <br />
                        <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text not-italic text-transparent">
                            {t('SETTINGS.HERO_TITLE_2')}
                        </span>
                    </h1>
                </motion.header>

                <motion.main
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-7xl px-8"
                >
                    <div className="flex flex-wrap items-stretch justify-center gap-8">
                        <motion.div
                            variants={itemVariants}
                            className="flex h-full"
                        >
                            <PremiumCard
                                color="emerald"
                                href={route('schedule.settings.index')}
                                title={t('SCHEDULE.GRID')}
                                description={t('SCHEDULE.GRID_DESC')}
                                icon={
                                    <Clock
                                        className="h-7 w-7"
                                        strokeWidth={1.5}
                                    />
                                }
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex h-full"
                        >
                            <PremiumCard
                                color="rose"
                                href={route('schedule.blocks.index')}
                                title={t('SCHEDULE.BLOCKS')}
                                description={t('SCHEDULE.BLOCKS_DESC')}
                                icon={
                                    <Lock
                                        className="h-7 w-7"
                                        strokeWidth={1.5}
                                    />
                                }
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex h-full"
                        >
                            <PremiumCard
                                color="indigo"
                                href="#"
                                title={t('SETTINGS.TITLE')}
                                description={t('SETTINGS.TIPS_DESC')}
                                icon={
                                    <Settings
                                        className="h-7 w-7"
                                        strokeWidth={1.5}
                                    />
                                }
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="mx-auto mt-12 w-full max-w-3xl"
                    >
                        <div className="flex flex-col items-center gap-5 rounded-[2.5rem] border border-blue-100/50 bg-white p-8 text-center shadow-sm transition-all hover:border-blue-200/60 hover:shadow-md md:flex-row md:text-left">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
                                <Zap
                                    className="h-7 w-7"
                                    fill="currentColor"
                                />
                            </div>
                            <div>
                                <h4 className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                                    {t('SETTINGS.TIPS_TITLE')}
                                </h4>
                                <p className="text-[13px] font-medium leading-relaxed text-slate-500">
                                    {t('SETTINGS.TIPS_DESC')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.main>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-16 text-center"
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">
                        Fluxa Intelligence Suite • 2026
                    </p>
                </motion.footer>
            </div>
        </AuthenticatedLayout>
    );
}
