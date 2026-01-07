import { createContext, useContext, useState, ReactNode } from 'react';
import { useTrans } from '@/Hooks/useTrans';

export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error'
}

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextData {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ToastMessage[]>([]);
    const { t } = useTrans();

    const addToast = (message: string, type: ToastType = ToastType.SUCCESS) => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 max-w-md w-full sm:w-auto">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`group relative overflow-hidden px-6 py-5 rounded-[2.2rem] shadow-2xl flex items-center space-x-4 border-2 backdrop-blur-xl animate-in fade-in slide-in-from-right-10 duration-500 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all ${m.type === ToastType.SUCCESS
                            ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-blue-500/10'
                            : 'bg-red-50/90 border-red-600 text-red-900 shadow-red-500/10'
                            }`}
                        onClick={() => removeToast(m.id)}
                    >
                        <div className={`shrink-0 p-3 rounded-2xl shadow-lg ${m.type === ToastType.SUCCESS
                            ? 'bg-blue-600 text-white shadow-blue-500/20'
                            : 'bg-red-600 text-white shadow-red-500/20'
                            }`}>
                            {m.type === ToastType.SUCCESS ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>

                        <div className="flex flex-col flex-1 pr-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1 leading-none ${m.type === ToastType.SUCCESS ? 'text-blue-700' : 'text-red-700'
                                }`}>
                                {m.type === ToastType.SUCCESS ? t('MESSAGES.SUCCESS') : t('MESSAGES.ERROR')}
                            </span>
                            <span className="font-bold text-sm tracking-tight leading-snug">
                                {m.message}
                            </span>
                        </div>

                        <button className="absolute top-4 right-4 p-1 rounded-full opacity-0 group-hover:opacity-100 bg-black/5 hover:bg-black/10 transition-all">
                            <svg className="w-3.5 h-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);