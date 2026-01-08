import { useTrans } from '@/Hooks/useTrans';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit() {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout>
            <Head title={t('PROFILE.TITLE')} />

            <div className="min-h-screen bg-[#FDFBFC] py-12">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    {/* Seção de Identidade Profissional */}
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                        <UpdateProfileInformationForm />
                    </div>

                    {/* Seção de Segurança */}
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                        <UpdatePasswordForm />
                    </div>

                    {/* Seção de Perigo */}
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
