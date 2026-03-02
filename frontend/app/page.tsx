import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, User, Power } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import UserDropdown from "@/components/UserDropdown";
import LandingNavbar from "@/components/LandingNavbar";
import LandingSections from "@/components/LandingSections";
import FallingMoney from "@/components/FallingMoney";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Supabase unreachable – continue as logged-out
  }

  // Try to get username if it exists in metadata, otherwise fallback to email
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Floating Navbar */}
      <LandingNavbar user={user} username={username} />

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Falling Money Background */}
        <FallingMoney />

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
            href={user ? "/courses" : "/onboarding"}
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
          <div className="flex justify-center items-center gap-12">
            <div className="h-10 w-32 relative">
              <Image src="/assets/smithcom.png" alt="Queen's Smith School of Business" fill className="object-contain grayscale" />
            </div>
            <div className="h-10 w-32 relative">
              <Image src="/assets/ivey.png" alt="Ivey Business School" fill className="object-contain grayscale" />
            </div>
            <div className="h-10 w-32 relative">
              <Image src="/assets/uoft.png" alt="University of Toronto" fill className="object-contain grayscale scale-[3.4]" />
            </div>
          </div>
        </div>
      </main>

      {/* Scroll Sections */}
      <LandingSections />

    </div>
  );
}
