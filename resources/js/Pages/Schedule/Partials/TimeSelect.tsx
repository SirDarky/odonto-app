import { useEffect, useRef, useState } from 'react';

interface Props {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    error?: string;
}

export default function TimeSelect({
    label,
    value,
    onChange,
    options,
    error,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter((time) => time.includes(searchTerm));

    return (
        <div
            className="relative flex flex-col md:col-span-3"
            ref={containerRef}
        >
            <label className="mb-2 ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                {label}
            </label>

            <div className="relative">
                <input
                    type="text"
                    className={`h-12 w-full rounded-xl border-gray-200 bg-white px-4 pr-12 font-mono text-gray-700 shadow-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : ''}`}
                    placeholder="00:00"
                    value={isOpen ? searchTerm : value}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm('');
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Ícone de Relógio */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l border-gray-100 pl-3 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* Lista de Sugestões */}
                {isOpen && (
                    <div className="scrollbar-hide absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    className="w-full px-4 py-2 text-left font-mono text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
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
                            <div className="px-4 py-2 text-xs text-gray-400">
                                Nenhum horário encontrado
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <span className="mt-1 text-[10px] font-semibold text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}
