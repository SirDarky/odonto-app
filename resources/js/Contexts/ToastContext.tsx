import { ToastType } from '@/Components/Toast';
import { createContext, useContext, useState, ReactNode } from 'react';

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

    const addToast = (message: string, type: ToastType = ToastType.SUCCESS) => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-10 md:right-10 z-[100] flex flex-col gap-3 max-w-full md:max-w-md">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        onClick={() => removeToast(m.id)}
                        className={`rounded-[1.5rem] md:rounded-[2.2rem] px-4 py-3 md:px-6 md:py-5 shadow-2xl flex items-center space-x-4 border animate-in fade-in slide-in-from-right-10 cursor-pointer transition-all hover:scale-105 ${m.type === ToastType.SUCCESS
                            ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30'
                            : 'bg-red-500 text-white border-red-400 shadow-red-500/30'
                            }`}
                    >
                        <div className="bg-white/20 p-2 rounded-xl">
                            {m.type === ToastType.SUCCESS ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            )}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{m.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);