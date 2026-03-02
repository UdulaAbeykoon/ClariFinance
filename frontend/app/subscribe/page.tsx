"use client";

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, CreditCard, Loader2 } from 'lucide-react';

export default function SubscribePage() {
    const [loading, setLoading] = useState(false);
    const [hasCheckedSession, setHasCheckedSession] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Quick check to ensure user is logged in
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else if (session.user.user_metadata?.has_subscription) {
                router.push('/courses');
            } else {
                setHasCheckedSession(true);
            }
        };
        checkAuth();
    }, [router, supabase]);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Checkout failed:", data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (!hasCheckedSession) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff]">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff] relative overflow-hidden font-sans p-6">
            {/* Background Aesthetic (matching onboarding/login) */}
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

            <main className="w-full max-w-[560px] bg-[#fbfdff]/90 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(30,58,138,0.12)] p-8 flex flex-col items-center animate-fade-in-up relative z-10 box-border text-center overflow-hidden">

                {/* Logo top center */}
                <div className="flex justify-center items-center gap-3 mb-5 cursor-pointer" onClick={() => router.push("/")}>
                    <Image src="/assets/ClariFi.png" alt="ClariFi" width={38} height={38} className="object-contain" />
                    <span className="font-bold text-2xl text-[#2a3a5e] tracking-tight">ClariFi</span>
                </div>

                <div className="mb-4">
                    <h1 className="text-[26px] md:text-[30px] leading-snug font-bold text-[#202b45] tracking-tight mb-2">
                        Upgrade to unlock your full potential
                    </h1>
                    <p className="text-[#64748b] text-[15px] font-medium tracking-wide max-w-[420px] mx-auto">
                        Get full access to premium lessons and exclusive features.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="w-full max-w-[460px] bg-[#fbfdff] rounded-[20px] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] mb-5 text-center relative mt-4 border border-[#e2e8f0]/60">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4c84ff] text-white text-[13px] tracking-wide font-bold px-5 py-1.5 rounded-full shadow-sm whitespace-nowrap z-10">
                        90% OFF
                    </div>

                    <div className="pt-7 pb-3 px-6">
                        <h2 className="text-6xl font-normal text-[#27324b] flex items-start justify-center gap-0.5 tracking-tight">
                            $5<span className="text-3xl text-[#27324b] mt-1">/mo</span>
                        </h2>
                        <p className="text-[#64748b] text-[16px] mt-2 font-medium">
                            Just <span className="line-through text-slate-400"> $50 </span> <span className="text-[#475569] font-medium">$5 per month</span>
                        </p>
                    </div>

                    <div className="w-[90%] mx-auto h-[1px] bg-slate-100/80 mb-5"></div>

                    <div className="space-y-3.5 px-10 pb-6 text-left">
                        {[
                            { text: "Unlimited Lessons & Practice" },
                            { text: <>Master Problem-Solving <span className="text-[14px] text-slate-600 font-normal">and Mental Math</span></> },
                            { text: <>Mock Interviews <span className="text-[14px] text-slate-600 font-normal">and Competitive Challenges</span></> },
                            { text: "Detailed Progress Tracking" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="mt-0.5 w-[20px] h-[20px] rounded-full bg-[#4c84ff] flex items-center justify-center shrink-0 shadow-sm border border-blue-400/20">
                                    <Check size={13} className="text-white" strokeWidth={3.5} />
                                </div>
                                <span className="text-[15px] font-medium text-[#3b475c] leading-tight">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-[80%] max-w-[360px] h-[50px] rounded-[1.5rem] font-semibold text-[15px] tracking-wide text-white transition-all bg-gradient-to-r from-[#2563eb] to-[#60a5fa] hover:shadow-[0_8px_25px_-4px_rgba(59,130,246,0.6)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 shadow-sm border border-[#93c5fd]/30 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:transition-all group-hover:duration-1000 group-hover:left-[200%] transform -skew-x-12 z-0"></div>

                    <span className="z-10 flex items-center gap-2">
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {loading ? 'Processing...' : 'Upgrade for $5/mo'}
                    </span>
                </button>

                <p className="mt-3 text-[12px] text-[#64748b] font-medium mb-4">
                    Secure checkout. Cancel anytime.
                </p>

                <p className="text-[12px] text-[#2a3a5e] font-medium max-w-[420px] mx-auto leading-[1.5]">
                    By subscribing, you agree to our <a href="#" className="text-[#2a3a5e] hover:text-[#3b82f6] transition-colors">Terms of Service</a>, <a href="#" className="text-[#2a3a5e] hover:text-[#3b82f6] transition-colors">Privacy Policy</a>, and <a href="#" className="text-[#2a3a5e] hover:text-[#3b82f6] transition-colors">Subscription Policy</a>.
                </p>

                <p className="mt-4 text-[12px] text-slate-400 cursor-pointer hover:underline" onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/login');
                    router.refresh();
                }}>
                    Sign out or change account
                </p>
            </main>
        </div>
    );
}
