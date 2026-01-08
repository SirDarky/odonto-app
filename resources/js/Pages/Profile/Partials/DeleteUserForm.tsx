import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useTrans } from '@/Hooks/useTrans';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

interface Props {
    className?: string;
}

export default function DeleteUserForm({ className = '' }: Props) {
    const { t } = useTrans();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-rose-50 p-2">
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-800">
                        {t('PROFILE.DELETE_TITLE')}
                    </h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t('PROFILE.DELETE_DESCRIPTION')}
                </p>
            </header>

            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <DangerButton
                    onClick={confirmUserDeletion}
                    className="rounded-[1.2rem] px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/10 transition-all"
                >
                    <Trash2 className="mr-2 inline-block h-4 w-4" />
                    {t('PROFILE.DELETE_BUTTON')}
                </DangerButton>
            </motion.div>

            <Modal
                show={confirmingUserDeletion}
                onClose={closeModal}
            >
                <form
                    onSubmit={deleteUser}
                    className="p-8"
                >
                    <div className="mb-6 flex items-center gap-4">
                        <div className="rounded-[1.2rem] bg-rose-100 p-3">
                            <ShieldAlert className="h-6 w-6 text-rose-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase italic leading-tight text-slate-800">
                                {t('PROFILE.DELETE_MODAL_TITLE')}
                            </h2>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {t('PROFILE.DELETE_MODAL_DESCRIPTION')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password"
                            value={t('PROFILE.LABEL_PASSWORD')}
                            className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="block w-full rounded-[1.2rem] border-slate-100 bg-slate-50 py-4 focus:border-rose-500 focus:ring-rose-500/20"
                            isFocused
                            placeholder="••••••••"
                        />

                        <InputError
                            message={errors.password}
                            className="px-1"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={closeModal}
                            className="rounded-xl border-none bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                        >
                            {t('PROFILE.CANCEL')}
                        </SecondaryButton>

                        <DangerButton
                            className="rounded-xl bg-rose-600 px-6 shadow-lg shadow-rose-600/20 active:scale-95"
                            disabled={processing}
                        >
                            {t('PROFILE.CONFIRM_DELETE')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
