import { ReactNode, ChangeEvent } from 'react';

interface Props {
    label: string;
    value: string | number;
    onChange: (val: string) => void;
    type?: TypeCustomInput;
    error?: string;
    placeholder?: string;
    className?: string;
    icon?: ReactNode;
}

export enum TypeCustomInput {
    TEXT = 'text',
    PASSWORD = 'password',
    EMAIL = 'email',
    TELEPHONE = 'tel'
}

export default function CustomInput({
    label,
    value,
    onChange,
    type = TypeCustomInput.TEXT,
    error,
    placeholder,
    className = "",
    icon
}: Props) {

    const maskPhone = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        if (type === TypeCustomInput.TELEPHONE) {
            val = maskPhone(val);
        }

        onChange(val);
    };

    return (
        <div className={`flex flex-col relative group ${className}`}>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1 transition-colors group-focus-within:text-blue-500">
                {label}
            </label>

            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`h-14 w-full bg-white border rounded-2xl shadow-sm transition-all outline-none px-5 text-gray-700 font-medium 
                        placeholder:text-gray-300 placeholder:font-normal
                        focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 
                        ${error ? 'border-red-400 ring-4 ring-red-500/10' : 'border-gray-100'} 
                        ${icon ? 'pr-12' : ''}`}
                />
                {icon && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-red-500 text-[10px] mt-1.5 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
}