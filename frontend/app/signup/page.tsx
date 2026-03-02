"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Mail } from 'lucide-react';

export default function SignupPage() {
    const [view, setView] = useState<'main' | 'email'>('main');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    username: username,
                }
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setMessage('Success! Check your email for the confirmation link.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff] relative overflow-hidden font-sans p-6">
            {/* Background Aesthetic (matching onboarding) */}
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

            <main className="w-full max-w-[420px] bg-[#fbfdff]/90 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,58,138,0.12)] p-10 flex flex-col items-center animate-fade-in-up relative z-10 box-border text-center">

                {/* Logo top center */}
                <div className="flex justify-center items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push("/")}>
                    <Image src="/assets/ClariFi.png" alt="ClariFi" width={42} height={42} className="object-contain" />
                    <span className="font-bold text-2xl text-[#3b475c] tracking-tight">ClariFi</span>
                </div>

                {view === 'main' ? (
                    <>
                        <h1 className="text-[28px] leading-tight font-bold text-[#475569] tracking-tight mb-3">Create your account</h1>
                        <p className="text-[#64748b] text-[15px] mb-10 font-medium tracking-wide">Build real finance skills and advance your career.</p>

                        {error && (
                            <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white font-medium py-[15px] px-4 rounded-[1.75rem] shadow-[0_8px_25px_-4px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_30px_-4px_rgba(59,130,246,0.7)] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2.5 relative overflow-hidden group border border-[#93c5fd]/40"
                        >
                            {/* Inner shine effect */}
                            <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:transition-all group-hover:duration-1000 group-hover:left-[200%] transform -skew-x-12 z-0"></div>

                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[20px] h-[20px] bg-white rounded-full p-[2px] z-10 shadow-sm" />
                            <span className="text-[17px] font-medium z-10 tracking-wide">Sign up with Google</span>
                        </button>

                        <p className="text-[13px] text-[#64748b] mt-5 mb-8 font-medium">
                            No password to remember. Takes 10 seconds
                        </p>

                        <div className="flex items-center w-full mb-8 px-4 opacity-70">
                            <div className="flex-1 border-t border-[#cbd5e1]"></div>
                            <span className="px-4 text-[13px] text-[#64748b] font-medium tracking-wide">or</span>
                            <div className="flex-1 border-t border-[#cbd5e1]"></div>
                        </div>

                        <button
                            onClick={() => setView('email')}
                            className="w-full bg-transparent text-[#64748b] border border-[#e2e8f0] font-medium py-[14px] px-4 rounded-[1.75rem] hover:bg-[#f8fafc] hover:text-[#475569] transition-all tracking-wide shadow-sm"
                        >
                            Continue with Email Instead
                        </button>

                        <p className="mt-8 text-[13px] text-[#94a3b8] leading-relaxed font-medium px-2">
                            By signing up. you agree to our <a href="#" className="text-[#60a5fa] hover:text-[#3b82f6] hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-[#60a5fa] hover:text-[#3b82f6] hover:underline transition-colors">Privacy Policy</a>
                        </p>

                        <div className="mt-5 text-[14px]">
                            <span className="text-[#64748b] font-medium">Already have an account? </span>
                            <button onClick={() => router.push('/login')} className="text-[#3b82f6] font-semibold hover:underline transition-colors">Log in</button>
                        </div>
                    </>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <button
                            onClick={() => setView('main')}
                            className="self-start text-[14px] text-slate-500 hover:text-slate-800 mb-6 font-medium flex items-center gap-1 transition-colors"
                        >
                            ← Back
                        </button>

                        <h2 className="text-[26px] font-bold text-[#475569] mb-8 self-start tracking-tight">Email Sign up</h2>

                        {error && (
                            <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 font-medium text-left">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="w-full bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100 font-medium text-left">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleEmailSignUp} className="w-full space-y-4 text-left">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#64748b] mb-1.5 ml-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-900 placeholder:text-slate-300 font-medium shadow-sm text-[15px]"
                                    placeholder="QuantKing"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-[#64748b] mb-1.5 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-900 placeholder:text-slate-300 font-medium shadow-sm text-[15px]"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-[#64748b] mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-900 placeholder:text-slate-300 font-medium shadow-sm pr-10 text-[15px]"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-[#64748b] mb-1.5 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-900 placeholder:text-slate-300 font-medium shadow-sm pr-10 text-[15px]"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[52px] mt-8 rounded-[1.25rem] font-medium tracking-wide text-white transition-all bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.6)] hover:-translate-y-[1px] disabled:opacity-50 flex items-center justify-center shadow-md border border-[#93c5fd]/30"
                            >
                                {loading ? <Mail className="animate-pulse" size={20} /> : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
