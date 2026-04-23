import React, { useMemo, useState, useEffect } from 'react';
import { CalendarDays, BarChart3, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { GoogleAuthProvider, signInWithPopup as authSignInWithPopup, deleteUser, getAdditionalUserInfo } from 'firebase/auth';
import { auth, firebaseEnabled } from '../lib/firebase';

type SecretNavigate = (section: 'home' | 'stack' | 'projects' | 'secret' | 'dashboard' | 'view_link') => void;

interface SecretPageProps {
    onNavigate?: SecretNavigate;
}

const SecretPage = ({ onNavigate }: SecretPageProps) => {
    const [isDark, setIsDark] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const previewCards = useMemo(() => ([
        {
            title: 'Inbox',
            description: 'Portfolio messages, direct outreach, and structured contact submissions in one place.',
            Icon: Mail
        },
        {
            title: 'Meetings',
            description: 'Requested time slots, meeting reasons, contact details, and scheduling context.',
            Icon: CalendarDays
        },
        {
            title: 'Analytics',
            description: 'Project clicks, social interactions, and section-level engagement signals.',
            Icon: BarChart3
        },
        {
            title: 'Private Controls',
            description: 'Availability status, profile settings, and future live content management.',
            Icon: ShieldCheck
        }
    ]), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!firebaseEnabled || !auth) {
                setError('Firebase is not connected yet.');
                return;
            }

            const result = await authSignInWithPopup(auth, provider);
            const details = getAdditionalUserInfo(result);

            if (details?.isNewUser) {
                await deleteUser(result.user);
                setError('This dashboard only allows approved access.');
                return;
            }

            onNavigate?.('dashboard');
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string };
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled.');
            } else {
                setError(firebaseError.message || 'An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen px-5 py-24">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.3fr]">
                <div className="glass-panel p-8 rounded-[32px] flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="relative h-24 w-24 overflow-hidden rounded-full"
                            style={{
                                boxShadow: isDark ? '0 18px 40px rgba(0, 0, 0, 0.4)' : '0 18px 40px rgba(0, 0, 0, 0.12)',
                                border: `3px solid ${isDark ? '#ffffff18' : '#ffffff90'}`
                            }}
                        >
                            {personalInfo.heroImageUrl ? (
                                <img
                                    src={personalInfo.heroImageUrl}
                                    alt={personalInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900/50">
                                    <User size={32} className="text-zinc-500/40" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-blue-500">
                                <Lock size={12} />
                                Private Access
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-primary">
                                {personalInfo.firstName}&apos;s Admin Space
                            </h2>
                            <p className="text-sm leading-7 text-sec">
                                A protected space for live portfolio data, meeting requests, inbox items, and view analytics.
                            </p>
                        </div>
                    </div>

                    {!firebaseEnabled && (
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-7 text-amber-200">
                            Firebase isn&apos;t connected yet. The preview on the right shows exactly what the private area will manage once the project config is active.
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading || !firebaseEnabled}
                            className={`btn btn-primary w-full flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                            {loading ? 'Authorizing...' : firebaseEnabled ? 'Open Private Dashboard' : 'Firebase Required'}
                        </button>

                        <p className="text-xs text-center text-sec opacity-60">
                            Protected with Google sign-in and Firebase-backed private data.
                        </p>
                    </form>
                </div>

                <div className="glass-panel rounded-[32px] p-8">
                    <div className="space-y-3 mb-6">
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-500/85">
                            What Lives Inside
                        </p>
                        <h3 className="text-3xl font-black tracking-tight text-primary">
                            Secret section data preview
                        </h3>
                        <p className="text-sm leading-7 text-sec">
                            This is the information architecture for Mahmoud&apos;s private dashboard once Firebase sync is live.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {previewCards.map(({ title, description, Icon }) => (
                            <div key={title} className="rounded-[26px] border border-black/5 bg-white/40 p-5 dark:border-white/8 dark:bg-white/4">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                                    <Icon size={22} />
                                </div>
                                <h4 className="text-xl font-black tracking-tight text-primary">{title}</h4>
                                <p className="mt-3 text-sm leading-7 text-sec">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretPage;
