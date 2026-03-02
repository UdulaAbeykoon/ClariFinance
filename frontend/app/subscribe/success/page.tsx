"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

function SubscribeSuccessContent() {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            router.push('/subscribe');
            return;
        }

        const verifySession = async () => {
            try {
                const res = await fetch('/api/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId })
                });

                if (res.ok) {
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/courses');
                        router.refresh();
                    }, 2500);
                } else {
                    setStatus('error');
                }
            } catch (err) {
                setStatus('error');
            }
        };

        verifySession();
    }, [sessionId, router]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff] relative overflow-hidden font-sans p-6 text-center">
            {/* Background Aesthetic */}
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />

            <main className="w-full max-w-[420px] bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-10 flex flex-col items-center animate-fade-in-up relative z-10">
                {status === 'verifying' && (
                    <>
                        <div className="w-[80px] h-[80px] bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Loader2 className="animate-spin text-blue-500" size={38} />
                        </div>
                        <h1 className="text-[24px] font-bold text-[#1e293b] mb-2 tracking-tight">Verifying Payment</h1>
                        <p className="text-[#64748b] text-[15px] font-medium tracking-wide">Hang tight while we confirm your subscription.</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="w-[80px] h-[80px] bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="text-green-500" size={42} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-[26px] font-bold text-[#1e293b] mb-2 tracking-tight">Payment Successful!</h1>
                        <p className="text-[#64748b] text-[15px] font-medium tracking-wide">Redirecting you to your courses...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="w-[80px] h-[80px] bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="text-red-500" size={42} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-[24px] font-bold text-[#1e293b] mb-2 tracking-tight">Verification Failed</h1>
                        <p className="text-[#64748b] text-[14px] font-medium tracking-wide mb-8">We couldn't verify your payment. Please contact support if you were charged.</p>

                        <button
                            onClick={() => router.push('/subscribe')}
                            className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors py-3.5 rounded-[1.5rem] font-medium tracking-wide text-[15px]"
                        >
                            Return to Upgrade
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}

export default function SubscribeSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff]"><Loader2 className="animate-spin text-blue-500" size={38} /></div>}>
            <SubscribeSuccessContent />
        </Suspense>
    );
}
