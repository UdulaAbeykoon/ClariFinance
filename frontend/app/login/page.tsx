"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/courses');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff] relative overflow-hidden font-sans p-6">
            {/* Background Aesthetic */}
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

            <main className="w-full max-w-[420px] bg-[#fbfdff]/90 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,58,138,0.12)] p-10 flex flex-col items-center animate-fade-in-up relative z-10 box-border text-center">

                {/* Logo top center */}
                <div className="flex justify-center items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push("/")}>
                    <Image src="/assets/ClariFi.png" alt="ClariFi" width={42} height={42} className="object-contain" />
                    <span className="font-bold text-2xl text-[#3b475c] tracking-tight">ClariFi</span>
                </div>

                <h1 className="text-[28px] leading-tight font-bold text-[#475569] tracking-tight mb-3">Sign in to your account</h1>
                <p className="text-[#64748b] text-[15px] mb-8 font-medium tracking-wide">Build real finance skills and advance your career.</p>

                {error && (
                    <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 font-medium text-left">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-[90%] bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white font-medium py-[15px] px-4 rounded-[1.75rem] shadow-[0_8px_25px_-4px_rgba(59,130,246,0.6)] hover:shadow-[0_12px_30px_-4px_rgba(59,130,246,0.7)] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2.5 relative overflow-hidden group border border-[#93c5fd]/40"
                >
                    {/* Inner shine effect */}
                    <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:transition-all group-hover:duration-1000 group-hover:left-[200%] transform -skew-x-12 z-0"></div>

                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[20px] h-[20px] bg-white rounded-full p-[2px] z-10 shadow-sm" />
                    <span className="text-[16px] font-medium z-10 tracking-wide">Continue with Google</span>
                </button>

                <div className="flex items-center w-full my-8 px-4 opacity-70">
                    <div className="flex-1 border-t border-[#cbd5e1]"></div>
                    <span className="px-4 text-[13px] text-[#64748b] font-medium tracking-wide">or</span>
                    <div className="flex-1 border-t border-[#cbd5e1]"></div>
                </div>

                <form onSubmit={handleEmailSignIn} className="w-full space-y-4 flex flex-col items-center">
                    <div className="w-full">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[50px] px-5 rounded-xl border border-slate-200 bg-[#fefefe] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-800 placeholder:text-slate-400/80 font-medium text-[15px]"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <div className="relative w-full">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[50px] pl-5 pr-[130px] rounded-xl border border-slate-200 bg-[#fefefe] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] transition-all text-slate-800 placeholder:text-slate-400/80 font-medium text-[15px]"
                                placeholder="Password"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <a href="#" className="text-[14px] text-[#3b82f6] hover:underline font-medium">Forgot password?</a>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[70%] h-[48px] mt-6 rounded-[1.5rem] font-medium tracking-wide text-white transition-all bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.6)] hover:-translate-y-[1px] disabled:opacity-50 flex items-center justify-center shadow-md border border-[#93c5fd]/30"
                    >
                        {loading ? <LogIn className="animate-pulse" size={20} /> : 'Sign In'}
                    </button>

                    <div className="mt-8 text-[15px] text-center w-full">
                        <span className="text-[#64748b] font-medium">Don't have an account? </span>
                        <button type="button" onClick={() => router.push('/signup')} className="text-[#3b82f6] font-medium hover:underline transition-colors">Sign up</button>
                    </div>
                </form>
            </main>
        </div>
    );
}
