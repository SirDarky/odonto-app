import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import BlockForm from './Partials/BlockForm';
import BlockList from './Partials/BlockList';

export interface Block {
    id: number;
    date: string;
    full_day: boolean;
    start_time: string | null;
    end_time: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBlocks {
    data: Block[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    blocks: PaginatedBlocks;
}

export default function Blocks({ blocks }: Props) {
    const { t } = useTrans();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('BLOCKS.TITLE')} />

            <div className="relative min-h-screen overflow-hidden bg-[#FDFBFC] pb-24 selection:bg-rose-100">
                <div className="pointer-events-none absolute right-0 top-0 -mr-64 -mt-64 h-[500px] w-[500px] rounded-full bg-rose-50/40 blur-[120px]" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative mx-auto max-w-5xl px-6 py-6"
                >
                    <motion.div
                        variants={{
                            hidden: { y: -20, opacity: 0 },
                            visible: { y: 0, opacity: 1 },
                        }}
                    >
                        <BlockForm />
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 },
                        }}
                    >
                        <BlockList blocks={blocks} />
                    </motion.div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
