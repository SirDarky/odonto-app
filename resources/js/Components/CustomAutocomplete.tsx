import { useTrans } from '@/Hooks/useTrans';
import { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface Props {
    label: string;
    value: string | number;
    options: Option[];
    onChange: (val: any) => void;
    error?: string;
    placeholder?: string;
    isTime?: boolean;
}

export default function CustomAutocomplete({ label, value, options, onChange, error, placeholder, isTime }: Props) {
    const { t } = useTrans();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const selectedLabel = selectedOption?.label || '';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTimeInput = (val: string) => {
        const digits = val.replace(/\D/g, '').substring(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.substring(0, 2)}:${digits.substring(2, 4)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (isTime) val = formatTimeInput(val);
        setSearchTerm(val);
    };

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className={`flex flex-col relative group transition-all duration-300 ${isOpen ? 'z-[100]' : 'z-10'}`}
            ref={containerRef}
        >
            <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ml-1 transition-all duration-300 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}>
                {label}
            </label>

            <div className="relative">
                <input
                    type="text"
                    className={`
                        h-14 w-full bg-white border transition-all duration-500 outline-none px-5 pr-12 text-slate-700 rounded-2xl
                        ${isOpen ? 'border-blue-500 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)]' : 'border-slate-100 shadow-sm'}
                        ${error ? 'border-red-400 ring-4 ring-red-50' : 'focus:ring-4 focus:ring-blue-500/5'}
                        ${isTime ? 'font-mono text-lg tracking-tighter' : 'text-sm font-medium'}
                    `}
                    placeholder={placeholder}
                    value={isOpen ? searchTerm : selectedLabel}
                    onFocus={() => { setIsOpen(true); setSearchTerm(''); }}
                    onChange={handleInputChange}
                />

                <div className={`absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ${isOpen ? 'text-blue-500 rotate-180' : 'text-slate-300'}`}>
                    {isTime ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                </div>

                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-64 overflow-y-auto rounded-3xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 animate-in fade-in slide-in-from-top-2 duration-300 ease-out z-[110]">
                        <div className="flex flex-col gap-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`
                                            w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold
                                            ${value === opt.value
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:pl-6'}
                                        `}
                                        onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    >
                                        <div className="flex items-center justify-between">
                                            {opt.label}
                                            {value === opt.value && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-5 py-8 text-center">
                                    <span className="text-xs text-slate-400 italic font-light">{t('SCHEDULE.NO_DATA')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="flex items-center gap-1 mt-2 ml-1 animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</span>
                </div>
            )}
        </div>
    );
}