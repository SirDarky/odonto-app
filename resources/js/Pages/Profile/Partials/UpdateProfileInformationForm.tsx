import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import MapSelector from '@/Components/MapSelector';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTrans } from '@/Hooks/useTrans';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
    AlignLeft,
    Camera,
    CheckCircle2,
    Copy,
    Globe,
    GraduationCap,
    LinkIcon,
    Lock,
    Map as MapIcon,
    MapPin,
    Sparkles,
    Unlock,
    User,
    X,
} from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
    className?: string;
}

export default function UpdateProfileInformation({ className = '' }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const { t } = useTrans();

    const fileInput = useRef<HTMLInputElement>(null);
    const [isSlugEditable, setIsSlugEditable] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [preview, setPreview] = useState<string | null>(
        user.avatar_path ? `/storage/${user.avatar_path}` : null,
    );

    const prefixRef = useRef<HTMLDivElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(82);

    useEffect(() => {
        if (prefixRef.current) {
            setPrefixWidth(prefixRef.current.offsetWidth + 32);
        }
    }, [t]);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'PATCH',
            name: user.name,
            email: user.email,
            slug: user.slug || '',
            specialty: user.specialty || '',
            bio: user.bio || '',
            google_maps_link: user.google_maps_link || '',
            address: user.address || '',
            avatar: null as File | null,
        });

    // Extrai coordenadas da URL salva no banco para posicionar o marcador ao abrir
    const initialCoords = useMemo(() => {
        if (!data.google_maps_link) return undefined;

        // Regex para capturar latitude e longitude de links tipo google.com/maps?q=lat,lng
        const regex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = data.google_maps_link.match(regex);

        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])] as [
                number,
                number,
            ];
        }
        return undefined;
    }, [data.google_maps_link]);

    const handleLocationSelected = (lat: number, lng: number) => {
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        setData('google_maps_link', mapsLink);
    };

    const copyToClipboard = () => {
        const fullUrl = `${window.location.origin}/${data.slug}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(fullUrl)
                .then(() => {
                    setHasCopied(true);
                    setTimeout(() => setHasCopied(false), 2000);
                })
                .catch(() => {
                    fallbackCopyTextToClipboard(fullUrl);
                });
        } else {
            fallbackCopyTextToClipboard(fullUrl);
        }
    };

    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setHasCopied(true);
                setTimeout(() => setHasCopied(false), 2000);
            }
        } catch (err) {
            console.error('Falha crítica ao copiar link:', err);
        }
        document.body.removeChild(textArea);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <section className={`${className} relative overflow-hidden`}>
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/5 blur-3xl" />

            <header className="relative mb-10">
                <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-rose-100/50 p-2">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
                        {t('PROFILE.INFO_TITLE')}
                    </h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t('PROFILE.INFO_DESCRIPTION')}
                </p>
            </header>

            <form
                onSubmit={submit}
                className="relative space-y-10"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* AVATAR SECTION */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-6 sm:flex-row"
                    >
                        <div className="group relative">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="h-32 w-32 overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-200">
                                        <User className="h-12 w-12" />
                                    </div>
                                )}
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="absolute -bottom-2 -right-2 rounded-2xl bg-slate-900 p-3 text-white shadow-xl transition-colors hover:bg-rose-500"
                            >
                                <Camera className="h-5 w-5" />
                            </motion.button>
                            <input
                                type="file"
                                ref={fileInput}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">
                                {t('PROFILE.AVATAR_TITLE')}
                            </h3>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                {t('PROFILE.AVATAR_HINT')}
                            </p>
                            <AnimatePresence>
                                {data.avatar && (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        type="button"
                                        onClick={() => {
                                            setData('avatar', null);
                                            setPreview(
                                                user.avatar_path
                                                    ? `/storage/${user.avatar_path}`
                                                    : null,
                                            );
                                        }}
                                        className="group flex items-center gap-1.5 text-[9px] font-black uppercase text-rose-500 hover:text-rose-600"
                                    >
                                        <X className="h-3 w-3 transition-transform group-hover:rotate-90" />{' '}
                                        {t('PROFILE.AVATAR_REMOVE')}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* NAME & EMAIL */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                        >
                            <InputLabel
                                htmlFor="name"
                                value={t('PROFILE.LABEL_NAME')}
                                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <div className="group relative">
                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                                <TextInput
                                    id="name"
                                    className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="px-1"
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="space-y-2"
                        >
                            <InputLabel
                                htmlFor="email"
                                value={t('PROFILE.LABEL_EMAIL')}
                                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="px-1"
                            />
                        </motion.div>
                    </div>

                    {/* SLUG SECTION */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between px-1">
                            <InputLabel
                                htmlFor="slug"
                                value={t('PROFILE.LABEL_SLUG')}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-500 transition-colors hover:text-blue-600"
                                >
                                    {hasCopied ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3" />{' '}
                                            {t('PROFILE.LINK_COPIED')}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />{' '}
                                            {t('PROFILE.COPY_LINK')}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsSlugEditable(!isSlugEditable)
                                    }
                                    className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${isSlugEditable ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {isSlugEditable ? (
                                        <Unlock className="h-3 w-3" />
                                    ) : (
                                        <Lock className="h-3 w-3" />
                                    )}{' '}
                                    {t('PROFILE.EDIT_SLUG')}
                                </button>
                            </div>
                        </div>
                        <div className="group relative flex items-center">
                            <div
                                ref={prefixRef}
                                className={`absolute left-5 z-10 text-[11px] font-black uppercase tracking-tighter transition-colors ${isSlugEditable ? 'text-rose-500' : 'text-slate-300'}`}
                            >
                                {t('LINK_APP')}
                            </div>
                            <TextInput
                                id="slug"
                                disabled={!isSlugEditable}
                                style={{ paddingLeft: `${prefixWidth}px` }}
                                className={`block w-full rounded-[1.2rem] py-4 pr-12 font-black tracking-tight shadow-sm transition-all ${isSlugEditable ? 'border-rose-200 bg-white text-slate-700 focus:border-rose-500 focus:ring-rose-500/20' : 'cursor-not-allowed border-slate-50 bg-slate-50/50 text-slate-400'}`}
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                            />
                            <Globe
                                className={`absolute right-5 h-4 w-4 transition-colors ${isSlugEditable ? 'text-rose-500' : 'text-slate-200'}`}
                            />
                        </div>
                        <InputError
                            message={errors.slug}
                            className="px-1"
                        />
                    </motion.div>

                    {/* SPECIALTY & BIO */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                    >
                        <InputLabel
                            htmlFor="specialty"
                            value={t('PROFILE.LABEL_SPECIALTY')}
                            className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                        />
                        <div className="group relative">
                            <GraduationCap className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                            <TextInput
                                id="specialty"
                                className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-12 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                value={data.specialty}
                                onChange={(e) =>
                                    setData('specialty', e.target.value)
                                }
                            />
                        </div>
                        <InputError
                            message={errors.specialty}
                            className="px-1"
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                    >
                        <InputLabel
                            htmlFor="bio"
                            value={t('PROFILE.LABEL_BIO')}
                            className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                        />
                        <div className="group relative">
                            <AlignLeft className="absolute left-4 top-5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                            <textarea
                                id="bio"
                                className="block min-h-[140px] w-full rounded-[1.5rem] border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-medium leading-relaxed shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                            />
                        </div>
                        <InputError
                            message={errors.bio}
                            className="px-1"
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    >
                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="address"
                                value={t('PROFILE.LABEL_ADDRESS')}
                                className="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
                            />
                            <div className="group relative">
                                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                                <TextInput
                                    id="address"
                                    className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Ex: Av. Paulista, 1000 - São Paulo"
                                />
                            </div>
                            <InputError
                                message={errors.address}
                                className="px-1"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <InputLabel
                                    htmlFor="google_maps_link"
                                    value={t('PROFILE.LABEL_MAPS_LINK')}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowMap(!showMap)}
                                    className="flex items-center gap-1 text-[9px] font-black uppercase text-rose-500 transition-colors hover:text-rose-600"
                                >
                                    <MapIcon size={10} />{' '}
                                    {showMap
                                        ? t('PROFILE.CLOSE_MAP')
                                        : t('PROFILE.SELECT_ON_MAP')}
                                </button>
                            </div>
                            <div className="group relative">
                                <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                                <TextInput
                                    id="google_maps_link"
                                    className="block w-full rounded-[1.2rem] border-slate-100 bg-white py-4 pl-11 shadow-sm transition-all focus:border-rose-500 focus:ring-rose-500/20"
                                    value={data.google_maps_link}
                                    onChange={(e) =>
                                        setData(
                                            'google_maps_link',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.google_maps_link}
                                className="px-1"
                            />
                        </div>

                        {/* MAP SELECTOR PANEL */}
                        <AnimatePresence>
                            {showMap && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden md:col-span-2"
                                >
                                    <div className="mb-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500">
                                            <Sparkles
                                                size={12}
                                                className="text-rose-500"
                                            />
                                            {t('PROFILE.MAP_INSTRUCTION')}
                                        </p>
                                        <MapSelector
                                            onLocationSelect={
                                                handleLocationSelected
                                            }
                                            initialPos={initialCoords}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-6 pt-6"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PrimaryButton
                            disabled={processing}
                            className="rounded-[1.2rem] bg-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all hover:bg-slate-800 disabled:opacity-50"
                        >
                            {t('PROFILE.SAVE')}
                        </PrimaryButton>
                    </motion.div>

                    <AnimatePresence>
                        {recentlySuccessful && (
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"
                            >
                                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
                                {t('PROFILE.SAVED')}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </form>
        </section>
    );
}
