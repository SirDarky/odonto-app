import { usePage } from '@inertiajs/react';

export function useTrans() {
    const { translations } = usePage<any>().props;

    const t = (key: string) => {
        return key.split('.').reduce((obj, i) => obj?.[i], translations) || key;
    };

    return { t };
}