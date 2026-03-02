"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";

interface LandingNavbarProps {
    user: any;
    username: string;
}

export default function LandingNavbar({ user, username }: LandingNavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Trigger when scrolled past 90% of the viewport height
            if (window.scrollY > window.innerHeight * 0.9) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        // Call once to set initial state
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-6 left-0 w-full z-50 pointer-events-none flex justify-center">
            <nav
                className={`pointer-events-auto rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative flex items-center justify-between
          ${isScrolled
                        ? "w-[130px] h-[48px] translate-x-[calc(50vw-65px-24px)] md:translate-x-[calc(50vw-65px-32px)] bg-blue-600 border border-transparent shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 overflow-hidden"
                        : "w-[90%] max-w-5xl h-[64px] translate-x-0 bg-white/80 backdrop-blur-md border border-slate-100 shadow-lg"
                    }
        `}
            >
                {/* Full version content (fades out and shifts up) */}
                <div
                    className={`absolute left-0 top-0 w-full h-[64px] flex items-center justify-between px-6 transition-all duration-500
            ${isScrolled ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
                >
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/ClariFi.png"
                            alt="ClariFi Logo"
                            width={28}
                            height={28}
                            className="object-contain"
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
                            href={user ? "/courses" : "/onboarding"}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-transform hover:-translate-y-0.5 shadow-md shadow-blue-600/20 whitespace-nowrap"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Small version (Get Started button only, fades in) */}
                <div
                    className={`absolute left-0 top-0 w-full h-full transition-all duration-500 delay-100
            ${!isScrolled ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
                >
                    <Link
                        href={user ? "/courses" : "/onboarding"}
                        className="w-full h-full flex items-center justify-center text-white text-[15px] font-semibold tracking-wide whitespace-nowrap"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>
        </div>
    );
}
