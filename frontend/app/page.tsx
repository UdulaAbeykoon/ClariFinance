import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import UserDropdown from "@/components/UserDropdown";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try to get username if it exists in metadata, otherwise fallback to email
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-100 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/ClariFi.png"
            alt="ClariFi Logo"
            width={32}
            height={32}
            className="object-contain" // Adjusted for potential sizing
          />
          <span className="font-bold text-xl text-blue-600 tracking-tight">ClariFi</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <UserDropdown username={username} />
          ) : (
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Sign In
            </Link>
          )}

          <Link
            href={user ? "/courses" : "/login"}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-md shadow-blue-600/20"
          >
            {user ? 'Get Started' : 'Get Started'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Floating Background Elements (Decorations) */}
        <div className="absolute top-20 left-10 opacity-20 animate-bounce delay-700 pointer-events-none">
          {/* Placeholder for money icon if available, or just verify one of the assets */}
          {/* <Image src="/assets/money.png" width={40} height={40} alt="Money" /> */}
        </div>

        {/* Main Text Container - Centered in screen, but text aligned left internally */}
        <div className="relative z-10 animate-fade-in-up flex flex-col items-start text-left mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 tracking-tight pl-1">
            How To
          </h2>
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-600 tracking-tighter leading-[1.1] mb-8">
              BREAK INTO WALL STREET
            </h1>
            {/* Bull Icon Positioned absolute relative to text */}
            <div className="absolute -top-8 right-4 md:left-203 md:-top-11 w-12 h-12 md:w-20 md:h-20 animate-fade-in-up delay-200">
              <Image
                src="/assets/bulltop.png"
                alt="Bull"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 animate-fade-in-up delay-300">
          <Link
            href={user ? "/courses" : "/login"}
            className="hero-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
            <div className="text" style={{ fontSize: '1rem' }}>
              Get Started
            </div>
          </Link>
        </div>

        {/* Social Proof / Trusted By */}
        <div className="mt-12 w-full max-w-2xl animate-fade-in-up delay-500">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted by students from:</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using available assets */}
            <div className="h-8 w-24 relative">
              <Image src="/assets/smithcom.png" alt="Smith" fill className="object-contain" />
            </div>
            <div className="h-10 w-24 relative">
              <Image src="/assets/ivey.png" alt="Ivey" fill className="object-contain" />
            </div>
            {/* Duplicating or placeholder for others since we only have 2 uni logos in listing */}
            <div className="h-8 w-24 relative">
              <Image src="/assets/smithcom.png" alt="U of T" fill className="object-contain" />
            </div>
            <div className="h-10 w-24 relative">
              <Image src="/assets/ivey.png" alt="Sauder" fill className="object-contain" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
