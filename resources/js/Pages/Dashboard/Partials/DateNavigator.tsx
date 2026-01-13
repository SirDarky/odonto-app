import { useTrans } from '@/Hooks/useTrans'; // Importando o hook
import { addDays, format, getDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Você pode injetar o locale dinamicamente se necessário
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Props {
    selectedDate: string;
    onChangeDate: (days: number) => void;
    onSetDate: (date: string) => void;
    workingDays: number[];
}

export default function DateNavigator({
    selectedDate,
    onChangeDate,
    onSetDate,
    workingDays,
}: Props) {
    const { t } = useTrans(); // Inicializando tradução
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const dateObj = useMemo(() => parseISO(selectedDate), [selectedDate]);

    const handleJumpDate = (direction: number) => {
        if (!workingDays?.length) {
            onChangeDate(direction);
            return;
        }
        let tempDate = dateObj;
        for (let i = 1; i <= 14; i++) {
            tempDate = addDays(tempDate, direction);
            if (workingDays.includes(getDay(tempDate))) {
                onSetDate(format(tempDate, 'yyyy-MM-dd'));
                return;
            }
        }
        onChangeDate(direction);
    };

    const modifiers = {
        working: (date: Date) => workingDays.includes(getDay(date)),
    };

    const modifiersStyles = {
        working: {
            fontWeight: 'bold',
            color: '#f43f5e',
        },
    };

    return (
        <div className="relative flex items-center justify-between border-b border-slate-50 bg-white p-6">
            <button
                onClick={() => handleJumpDate(-1)}
                className="rounded-xl p-2 transition-colors hover:bg-slate-50 active:scale-90"
            >
                <ChevronLeft className="h-5 w-5 text-slate-400" />
            </button>

            <div className="relative">
                <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="group flex flex-col items-center px-4 transition-transform active:scale-95"
                >
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase leading-tight text-slate-800 transition-colors group-hover:text-rose-500">
                        {/* Tradução dinâmica da data via date-fns */}
                        {format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
                        <CalendarIcon
                            size={14}
                            className="text-slate-300 group-hover:text-rose-400"
                        />
                    </h2>
                    <p className="text-[11px] font-bold capitalize text-rose-500 opacity-80">
                        {format(dateObj, 'eeee', { locale: ptBR })}
                    </p>
                </button>

                {isCalendarOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsCalendarOpen(false)}
                        />

                        <div className="animate-in fade-in zoom-in-95 absolute left-1/2 top-full z-[70] mt-4 -translate-x-1/2 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-2xl duration-200">
                            <DayPicker
                                mode="single"
                                selected={dateObj}
                                onSelect={(date) => {
                                    if (date) {
                                        onSetDate(format(date, 'yyyy-MM-dd'));
                                        setIsCalendarOpen(false);
                                    }
                                }}
                                locale={ptBR}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                className="m-0"
                                styles={{
                                    caption: {
                                        color: '#1e293b',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: '12px',
                                    },
                                    head_cell: {
                                        color: '#94a3b8',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                    },
                                    day_selected: {
                                        backgroundColor: '#f43f5e',
                                        color: 'white',
                                        borderRadius: '12px',
                                    },
                                    day: {
                                        borderRadius: '12px',
                                        transition: 'all 0.2s',
                                    },
                                }}
                            />
                            <div className="mt-2 border-t border-slate-50 pt-3 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                    {t('DATE_NAVIGATOR.LEGEND_PART1') ||
                                        'Dias em'}{' '}
                                    <span className="text-rose-500">
                                        {t('DATE_NAVIGATOR.LEGEND_COLOR') ||
                                            'Rosa'}
                                    </span>{' '}
                                    {t('DATE_NAVIGATOR.LEGEND_PART2') ||
                                        'são dias de atendimento'}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={() => handleJumpDate(1)}
                className="rounded-xl p-2 transition-colors hover:bg-slate-50 active:scale-90"
            >
                <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
        </div>
    );
}
