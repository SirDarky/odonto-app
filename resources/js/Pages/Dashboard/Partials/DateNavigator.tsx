import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
    selectedDate: string;
    onChangeDate: (days: number) => void;
}

export default function DateNavigator({ selectedDate, onChangeDate }: Props) {
    const dateObj = useMemo(
        () => new Date(selectedDate + 'T00:00:00'),
        [selectedDate],
    );

    const dateFormatted = dateObj.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const dayOfWeek = dateObj.toLocaleDateString(undefined, {
        weekday: 'long',
    });

    return (
        <div className="flex items-center justify-between border-b border-slate-50 bg-white p-6">
            <button
                onClick={() => onChangeDate(-1)}
                className="rounded-xl p-2 transition-colors hover:bg-slate-50"
            >
                <ChevronLeft className="h-5 w-5 text-slate-400" />
            </button>

            <div className="text-center">
                <h2 className="text-sm font-black uppercase leading-tight text-slate-800">
                    {dateFormatted}
                </h2>
                <p className="text-[11px] font-bold capitalize text-rose-500">
                    {dayOfWeek}
                </p>
            </div>

            <button
                onClick={() => onChangeDate(1)}
                className="rounded-xl p-2 transition-colors hover:bg-slate-50"
            >
                <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
        </div>
    );
}
