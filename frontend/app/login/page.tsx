'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
        }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        if (view === 'sign-in') {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                setError(error.message)
                setLoading(false)
            } else {
                router.push('/courses')
                router.refresh()
            }
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match")
                setLoading(false)
                return
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
            })
            if (error) {
                setError(error.message)
                setLoading(false)
            } else {
                setMessage('Success! Check your email for the confirmation link.')
                setLoading(false)
                // Optional: Switch to sign-in view or keep message visible
            }
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/loginbackground.png')" }}
        >
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <h1 className="text-3xl font-bold text-black mb-2 relative z-10">
                    {view === 'sign-in' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-slate-700 mb-8 font-medium relative z-10">
                    {view === 'sign-in'
                        ? 'Sign in to access premium finance courses.'
                        : 'Sign up to start your Wall Street journey.'}
                </p>

                {error && (
                    <div className="bg-red-50/80 backdrop-blur-sm text-red-600 p-3 rounded-lg mb-4 text-sm relative z-10 border border-red-100">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50/80 backdrop-blur-sm text-green-600 p-3 rounded-lg mb-4 text-sm relative z-10 border border-green-100">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4 mb-6 text-left relative z-10">
                    {view === 'sign-up' && (
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all placeholder:text-slate-400 text-black"
                                placeholder="WallStreetWolf"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all placeholder:text-slate-400 text-black"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all placeholder:text-slate-400 text-black pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {view === 'sign-up' && (
                        <div>
                            <label className="block text-sm font-semibold text-black mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all placeholder:text-slate-400 text-black pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-semibold py-2 px-4 rounded-xl hover:bg-zinc-800 focus:ring-2 focus:ring-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? 'Processing...' : (view === 'sign-in' ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="text-sm text-slate-800 mb-6 relative z-10 font-medium">
                    {view === 'sign-in' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setView(view === 'sign-in' ? 'sign-up' : 'sign-in')
                            setError(null)
                            setMessage(null)
                        }}
                        className="text-black font-bold hover:underline decoration-2"
                    >
                        {view === 'sign-in' ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                <div className="relative mb-6 z-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-slate-600 backdrop-blur-sm rounded">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="relative z-10 w-full flex items-center justify-center gap-3 bg-white/70 backdrop-blur-sm text-slate-900 font-semibold py-3 px-4 rounded-xl border border-white/50 hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>

                <p className="mt-8 text-xs text-slate-600 relative z-10 font-medium">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}
