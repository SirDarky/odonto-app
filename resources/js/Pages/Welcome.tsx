import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import {
    Bot,
    CheckCircle2,
    ChevronRight,
    Mail,
    MessageSquare,
    ShieldCheck,
    Star,
    TrendingUp,
    Zap,
} from 'lucide-react';
import fluxa from '../images/fluxa-nome.svg';
import logo from '../images/logo.svg';

export default function Welcome({ auth }: PageProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' as const },
        },
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Fluxa - Gestão Odontológica de Alta Performance" />

            {/* Navbar Glassmorphism */}
            <nav className="fixed top-0 z-[100] w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        {/* Seu Componente de Logo Customizado */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-slate-100 bg-white p-2 shadow-lg shadow-blue-500/10">
                            <img
                                src={logo}
                                alt="Fluxa Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <img
                            src={fluxa}
                            alt="Fluxa"
                            className="w-24 object-contain md:w-28"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-black uppercase tracking-widest text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hidden text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-600 sm:block"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-2xl bg-blue-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95"
                                >
                                    Começar agora
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section - Clean & Blue */}
            <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-48 text-center">
                <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-blue-50/50 blur-[120px]" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-5xl"
                >
                    <motion.div
                        variants={itemVariants}
                        className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.2rem] border border-white bg-white p-5 shadow-2xl shadow-blue-500/10 transition-transform hover:scale-105"
                    >
                        <img
                            src={logo}
                            alt="Fluxa Logo"
                            className="h-full w-full object-contain"
                        />
                    </motion.div>

                    <motion.span
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600"
                    >
                        <Zap size={12} /> Tecnologia para Dentistas de Elite
                    </motion.span>

                    <motion.h1
                        variants={itemVariants}
                        className="mt-10 text-6xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-8xl"
                    >
                        A agenda que <br />
                        <span className="italic text-blue-600">
                            fatura por você.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-10 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 sm:text-xl"
                    >
                        Elimine o caos do seu WhatsApp. Recupere sua liberdade
                        com a plataforma de agendamento que transforma conversas
                        em consultas confirmadas.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
                    >
                        <Link
                            href={route('register')}
                            className="group flex w-full items-center justify-center gap-3 rounded-3xl bg-slate-900 px-10 py-6 text-lg font-black text-white shadow-2xl shadow-slate-900/20 transition-all hover:bg-blue-600 sm:w-auto"
                        >
                            Assumir controle da minha agenda
                            <ChevronRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-1 text-blue-600">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill="currentColor"
                                    />
                                ))}
                                <span className="ms-2 text-sm font-black text-slate-900">
                                    4.9/5
                                </span>
                            </div>
                            <p className="text-start text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Referência para +200 Dentistas
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats - Blue Variant */}
            <section className="relative overflow-hidden bg-blue-600 px-6 py-24 text-white">
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 lg:flex-row">
                    <div className="max-w-xl text-start">
                        <h2 className="text-4xl font-black italic leading-none sm:text-6xl">
                            PARE DE PERDER <br />
                            PACIENTES.
                        </h2>
                        <p className="mt-6 text-xl font-bold leading-relaxed text-blue-50">
                            A demora no atendimento humano custa caro. <br />
                            <br />O Fluxa oferece agendamento instantâneo 24h,
                            garantindo que o seu paciente não procure o
                            concorrente enquanto você está em cirurgia.
                        </p>
                    </div>
                    <div className="w-full max-w-md rounded-[3rem] bg-white p-10 shadow-2xl">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between text-slate-900">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Recuperação de Lucro
                                </span>
                                <TrendingUp className="text-blue-600" />
                            </div>
                            <div className="text-center">
                                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                                    Prejuízo Anual de Consultórios Sem Gestão
                                </p>
                                <div className="text-5xl font-black tracking-tighter text-slate-900">
                                    R$ 34.600,00
                                </div>
                            </div>
                            <div className="h-px bg-slate-100" />
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <CheckCircle2
                                        className="text-blue-600"
                                        size={18}
                                    />{' '}
                                    Confirmação Automática via E-mail
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <CheckCircle2
                                        className="text-blue-600"
                                        size={18}
                                    />{' '}
                                    Link exclusivo na sua Bio do Instagram
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <CheckCircle2
                                        className="text-blue-600"
                                        size={18}
                                    />{' '}
                                    Redução drástica de horários vagos
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Provas Sociais */}
            <section className="px-6 py-32">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 sm:text-5xl">
                            Depoimentos Verificados
                        </h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                name: 'Dr. Marcus Vinicius',
                                role: 'Cirurgião Dentista',
                                text: 'O Fluxa elevou o nível de profissionalismo do meu consultório. O link de agendamento é o que meus pacientes mais elogiam.',
                                initial: 'MV',
                            },
                            {
                                name: 'Dra. Beatriz Moraes',
                                role: 'Ortodontista',
                                text: 'Minha taxa de conversão do Instagram aumentou 60% desde que coloquei o link do Fluxa na minha bio.',
                                initial: 'BM',
                            },
                            {
                                name: 'Dr. Ricardo Santos',
                                role: 'Periodontista',
                                text: 'Consigo gerenciar toda minha grade de horários pelo celular entre uma cirurgia e outra. Impecável.',
                                initial: 'RS',
                            },
                        ].map((testimonial, i) => (
                            <div
                                key={i}
                                className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl"
                            >
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-100">
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-800">
                                            {testimonial.name}
                                            <ShieldCheck
                                                size={14}
                                                className="text-blue-500"
                                                fill="currentColor"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-medium italic leading-relaxed text-slate-500">
                                    "{testimonial.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roadmap 2026 */}
            <section className="border-y border-slate-100 bg-slate-50 px-6 py-32">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center gap-16 lg:flex-row">
                        <div className="flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                                ROADMAP DE INOVAÇÃO
                            </span>
                            <h2 className="mt-4 text-4xl font-black uppercase italic leading-none tracking-tighter text-slate-900 sm:text-6xl">
                                O Próximo <br /> Nível Digital
                            </h2>
                        </div>
                        <div className="grid w-full flex-1 gap-4">
                            {[
                                {
                                    icon: <Bot />,
                                    title: 'IA de Triagem',
                                    desc: 'Triagem inteligente que entende a necessidade do paciente antes dele chegar.',
                                    date: 'T1 2026',
                                },
                                {
                                    icon: <MessageSquare />,
                                    title: 'WhatsApp 2.0',
                                    desc: 'Integração nativa para lembretes e reagendamentos por um clique.',
                                    date: 'T2 2026',
                                },
                                {
                                    icon: <Mail />,
                                    title: 'Fluxo de Retorno',
                                    desc: 'Automação de e-mails para pacientes que não comparecem há meses.',
                                    date: 'T3 2026',
                                },
                            ].map((step, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:border-blue-600"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <h4 className="text-sm font-black uppercase tracking-wide text-slate-800">
                                                {step.title}
                                            </h4>
                                            <span className="rounded bg-slate-900 px-2 py-1 text-[9px] font-black text-white">
                                                {step.date}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-400">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-6 py-40 text-center">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-10 text-5xl font-black uppercase italic leading-none tracking-tighter text-slate-900 sm:text-8xl">
                        Sua marca merece <br />
                        <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                            o alto padrão.
                        </span>
                    </h2>
                    <Link
                        href={route('register')}
                        className="inline-block rounded-[2rem] bg-blue-600 px-16 py-8 text-2xl font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95"
                    >
                        Criar Minha Agenda Grátis
                    </Link>
                    <p className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Teste completo por 14 dias. Sem fidelidade.
                    </p>
                </div>
            </section>

            <footer className="border-t border-slate-50 py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={fluxa}
                        alt="Fluxa"
                        className="w-20 opacity-30"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Onde a precisão encontra o consultório moderno.
                    </p>
                </div>
            </footer>
        </div>
    );
}
