import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

// 1. Tipagem recursiva para o dicionário de traduções
type TranslationValue = string | { [key: string]: TranslationValue };

interface SharedProps extends PageProps {
    translations: Record<string, TranslationValue>;
}

// 2. Interface da função atualizada para aceitar parâmetros dinâmicos
export type TransFunction = (
    key: string,
    params?: Record<string, string | number>,
) => string;

export function useTrans() {
    const { props } = usePage<SharedProps>();
    const { translations } = props;

    const t: TransFunction = (key, params) => {
        // Busca a chave no objeto de traduções
        const result = key
            .split('.')
            .reduce<TranslationValue | undefined>((obj, i) => {
                if (obj && typeof obj === 'object' && i in obj) {
                    return obj[i];
                }
                return undefined;
            }, translations);

        let translation = typeof result === 'string' ? result : key;

        // 3. Se houver parâmetros, substitui ":chave" pelo valor real
        if (params && typeof result === 'string') {
            Object.entries(params).forEach(([paramKey, value]) => {
                translation = translation.replace(
                    `:${paramKey}`,
                    String(value),
                );
            });
        }

        return translation;
    };

    return { t };
}
