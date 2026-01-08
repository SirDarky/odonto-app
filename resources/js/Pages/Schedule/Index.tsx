import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PremiumCard from './Partials/PremiumCard';

export default function Index() {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout>
            <Head title={t('SCHEDULE.PAGE_TITLE')} />

            <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#FBFDFF] pb-24 selection:bg-blue-100">
                <header className="animate-in fade-in zoom-in-95 slide-in-from-top-6 relative w-full max-w-4xl px-6 pb-8 pt-8 text-center duration-1000 ease-out">
                    <div className="mb-8 inline-block rounded-full border border-slate-200/60 bg-white px-5 py-2 shadow-sm transition-transform duration-500 hover:scale-105">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">
                            {t('SCHEDULE.CENTER')}
                        </span>
                    </div>

                    <h1 className="text-5xl font-black italic leading-tight tracking-tighter text-slate-900 md:text-3xl">
                        {t('SETTINGS.HERO_TITLE_1')} <br />
                        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text not-italic text-transparent">
                            {t('SETTINGS.HERO_TITLE_2')}
                        </span>
                    </h1>
                </header>

                <main className="relative z-10 w-full max-w-7xl px-8">
                    <div className="flex flex-wrap items-stretch justify-center gap-10">
                        <div className="animate-in fade-in slide-in-from-bottom-10 fill-mode-both ease-out-back flex delay-[400ms] duration-1000">
                            <PremiumCard
                                color="indigo"
                                // CORREÇÃO: schedule.settings.settings -> schedule.settings.index
                                href={route('schedule.settings.index')}
                                title={t('SCHEDULE.GRID')}
                                description={t('SCHEDULE.GRID_DESC')}
                                icon={
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-10 fill-mode-both ease-out-back flex delay-[600ms] duration-1000">
                            <PremiumCard
                                color="emerald"
                                // CORREÇÃO: schedule.blocks.blocks -> schedule.blocks.index
                                href={route('schedule.blocks.index')}
                                title={t('SCHEDULE.BLOCKS')}
                                description={t('SCHEDULE.BLOCKS_DESC')}
                                icon={
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-10 fill-mode-both ease-out-back flex delay-[800ms] duration-1000">
                            <PremiumCard
                                color="amber"
                                href="#"
                                title={t('SETTINGS.TITLE')}
                                description={t('SETTINGS.TIPS_DESC')}
                                icon={
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </main>

                <div className="animate-in fade-in slide-in-from-top-4 fill-mode-both mt-6 w-full max-w-3xl px-8 delay-500 duration-1000">
                    <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-blue-100/50 bg-blue-50/50 p-6 text-center md:flex-row md:text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="mb-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                {t('SETTINGS.TIPS_TITLE')}
                            </h4>
                            <p className="text-xs font-medium leading-relaxed text-blue-900/60">
                                {t('SETTINGS.TIPS_DESC')}
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="animate-in fade-in fill-mode-both mt-10 opacity-40 delay-[1400ms] duration-[1500ms]">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400">
                        Fluxa Intelligence Suite • 2026
                    </p>
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}
