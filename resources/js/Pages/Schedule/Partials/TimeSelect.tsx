import { useState, useRef, useEffect } from 'react';

interface Props {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    error?: string;
}

export default function TimeSelect({ label, value, onChange, options, error }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(time =>
        time.includes(searchTerm)
    );

    return (
        <div className="md:col-span-3 flex flex-col relative" ref={containerRef}>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
                {label}
            </label>

            <div className="relative">
                <input
                    type="text"
                    className={`h-12 w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all bg-white px-4 pr-12 text-gray-700 outline-none font-mono ${error ? 'border-red-400' : ''}`}
                    placeholder="00:00"
                    value={isOpen ? searchTerm : value}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm('');
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Ícone de Relógio */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 border-l border-gray-100 pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Lista de Sugestões */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-white border border-gray-100 shadow-xl py-2 scrollbar-hide">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors font-mono text-gray-700"
                                    onClick={() => {
                                        onChange(time);
                                        setIsOpen(false);
                                        setSearchTerm(time);
                                    }}
                                >
                                    {time}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-xs text-gray-400">Nenhum horário encontrado</div>
                        )}
                    </div>
                )}
            </div>

            {error && <span className="text-red-500 text-[10px] mt-1 font-semibold">{error}</span>}
        </div>
    );
}