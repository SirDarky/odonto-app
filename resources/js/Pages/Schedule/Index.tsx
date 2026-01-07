import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import PremiumCard from './Partials/PremiumCard';

export default function Index() {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative min-h-screen bg-[#FBFDFF] flex flex-col items-center pb-24 selection:bg-blue-100 overflow-hidden">
                <header className="relative w-full max-w-4xl px-6 pt-8 pb-8 text-center animate-in fade-in zoom-in-95 slide-in-from-top-6 duration-1000 ease-out">
                    <div className="inline-block bg-white border border-slate-200/60 px-5 py-2 rounded-full mb-8 shadow-sm transition-transform hover:scale-105 duration-500">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-blue-500 uppercase">
                            {t('SCHEDULE.CENTER')}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight mb-6 italic">
                        {t('SETTINGS.HERO_TITLE_1')} <br />
                        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent not-italic">
                            {t('SETTINGS.HERO_TITLE_2')}
                        </span>
                    </h1>
                </header>

                <main className="relative w-full max-w-7xl px-8 z-10">
                    <div className="flex flex-wrap justify-center gap-10 items-stretch">

                        <div className="flex animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-[400ms] fill-mode-both ease-out-back">
                            <PremiumCard
                                color="indigo"
                                href={route('schedule.settings.settings')}
                                title={t('SCHEDULE.GRID')}
                                description={t('SCHEDULE.GRID_DESC')}
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            />
                        </div>

                        <div className="flex animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-[600ms] fill-mode-both ease-out-back">
                            <PremiumCard
                                color="emerald"
                                href={route('schedule.blocks.index')}
                                title={t('SCHEDULE.BLOCKS')}
                                description={t('SCHEDULE.BLOCKS_DESC')}
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                            />
                        </div>

                        <div className="flex animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-[800ms] fill-mode-both ease-out-back">
                            <PremiumCard
                                color="amber"
                                href="#"
                                title={t('SETTINGS.TITLE')}
                                description={t('SETTINGS.TIPS_DESC')}
                                icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            />
                        </div>

                    </div>
                </main>

                <div className="w-full max-w-3xl px-8 mt-6 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500 fill-mode-both">
                    <div className="bg-blue-50/50 border border-blue-100/50 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                                {t('SETTINGS.TIPS_TITLE')}
                            </h4>
                            <p className="text-xs text-blue-900/60 font-medium leading-relaxed">
                                {t('SETTINGS.TIPS_DESC')}
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="mt-10 opacity-40 animate-in fade-in duration-[1500ms] delay-[1400ms] fill-mode-both">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-slate-400">
                        Fluxa Intelligence Suite • 2026
                    </p>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}