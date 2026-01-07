import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import BlockForm from './Partials/BlockForm';
import BlockList from './Partials/BlockList';

interface Block {
    id: number;
    date: string;
    full_day: boolean;
    start_time: string | null;
    end_time: string | null;
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout>
            <Head title={t('BLOCKS.TITLE')} />

            <div className="relative min-h-screen bg-[#FDFBFC] pb-24 selection:bg-rose-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/40 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

                <div className="relative max-w-5xl mx-auto px-6 py-6">
                    <BlockForm />
                    <BlockList blocks={blocks} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}