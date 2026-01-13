import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useTrans } from '@/Hooks/useTrans';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CalendarDays,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useMemo, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const { t } = useTrans();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const initials = useMemo(() => {
        return (
            user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || '??'
        );
    }, [user?.name]);

    return (
        <div className="min-h-screen bg-[#FDFBFC] selection:bg-rose-100">
            <nav className="sticky top-0 z-[100] border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex">
                            {/* Logo com Hover Glow */}
                            <div className="flex shrink-0 items-center">
                                <Link
                                    href="/"
                                    className="group relative transition-transform hover:scale-105"
                                >
                                    <div className="absolute -inset-2 rounded-full bg-rose-500/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                                    <ApplicationLogo className="relative h-10 w-auto fill-current text-rose-600" />
                                </Link>
                            </div>

                            {/* Links Principais (Desktop) */}
                            <div className="hidden items-center space-x-2 sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="flex items-center gap-2 rounded-2xl px-5 py-2.5 transition-all hover:bg-slate-50"
                                >
                                    <LayoutDashboard
                                        size={18}
                                        className={
                                            route().current('dashboard')
                                                ? 'text-rose-500'
                                                : 'text-slate-400'
                                        }
                                    />
                                    <span className="text-sm font-bold tracking-tight">
                                        Dashboard
                                    </span>
                                </NavLink>

                                <NavLink
                                    href={route('schedule.index')}
                                    active={
                                        route().current('schedule.index') ||
                                        route().current(
                                            'schedule.settings.index',
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-2xl px-5 py-2.5 transition-all hover:bg-slate-50"
                                >
                                    <CalendarDays
                                        size={18}
                                        className={
                                            route().current('schedule.index')
                                                ? 'text-rose-500'
                                                : 'text-slate-400'
                                        }
                                    />
                                    <span className="text-sm font-bold tracking-tight">
                                        {t('SCHEDULE.CENTER')}
                                    </span>
                                </NavLink>
                            </div>
                        </div>

                        {/* Profile Badge & Dropdown (Desktop) */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="group flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-1.5 pe-5 transition-all hover:border-rose-200 hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.15)] focus:outline-none">
                                            {/* Slot de Imagem/Avatar */}
                                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-rose-100 transition-transform group-hover:scale-105">
                                                {user?.avatar_path ? (
                                                    <img
                                                        src={user.avatar_path}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                                                        <span className="text-xs font-black tracking-tighter">
                                                            {initials}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Indicador de Status Online Discreto */}
                                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                            </div>

                                            <div className="hidden flex-col text-start md:flex">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-[13px] font-black uppercase leading-none tracking-wide text-slate-800">
                                                        {user?.name || '...'}
                                                    </p>
                                                    <ShieldCheck
                                                        size={12}
                                                        className="text-blue-500"
                                                    />
                                                </div>
                                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-rose-500/80">
                                                    {t('PROFILE.TITLE')}
                                                </p>
                                            </div>

                                            <ChevronDown
                                                size={16}
                                                className="ms-1 hidden text-slate-300 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-rose-400 md:block"
                                            />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-2 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden min-w-[240px]">
                                        {/* Header do Dropdown */}
                                        <div className="mb-2 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
                                            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                Conta Ativa
                                            </p>
                                            <p className="truncate text-xs font-bold text-slate-700">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="group flex items-center gap-3 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-rose-100">
                                                <Settings size={15} />
                                            </div>
                                            {t('PROFILE.TITLE')}
                                        </Dropdown.Link>

                                        <div className="mx-5 my-2 border-t border-slate-100" />

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="group flex w-full items-center gap-3 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-rose-500 transition-colors hover:bg-rose-50"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100">
                                                <LogOut size={15} />
                                            </div>
                                            {t('AUTH.LOGOUT')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger Mobile Ultra-Smooth */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev,
                                    )
                                }
                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-600 focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Mobile com Animação */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-100 bg-white sm:hidden"
                        >
                            <div className="space-y-1 px-4 pb-6 pt-4">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="rounded-2xl"
                                >
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('schedule.index')}
                                    active={route().current('schedule.index')}
                                    className="rounded-2xl"
                                >
                                    {t('SCHEDULE.CENTER')}
                                </ResponsiveNavLink>
                            </div>

                            <div className="border-t border-slate-100 bg-slate-50/50 px-6 pb-6 pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
                                        <span className="font-black">
                                            {initials}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black uppercase tracking-wide text-slate-800">
                                            {user?.name}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-slate-600"
                                    >
                                        <Settings size={14} />{' '}
                                        {t('PROFILE.TITLE')}
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="flex items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600"
                                    >
                                        <LogOut size={14} /> {t('AUTH.LOGOUT')}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Header com Design Minimalista */}
            {header && (
                <header className="relative overflow-hidden bg-white py-12">
                    <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-rose-50 blur-[80px]" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Conteúdo Principal com Animação de Entrada */}
            <main className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-7xl duration-1000 ease-out">
                {children}
            </main>

            {/* Background Decorativo Estático (Vibe Boa) */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute right-[10%] top-[5%] h-[600px] w-[600px] rounded-full bg-rose-50/40 blur-[120px]" />
                <div className="absolute bottom-[5%] left-[5%] h-[500px] w-[500px] rounded-full bg-blue-50/30 blur-[100px]" />
            </div>
        </div>
    );
}
