"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Building, TrendingUp, Briefcase, PieChart, Compass,
    ArrowRight, Clock, Check, Frown, Meh, Smile, Target,
    Calendar, CalendarDays, BookOpen, GraduationCap, ChevronLeft, Loader2
} from "lucide-react";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

// Helper to get an icon based on the option name
const getIconForOption = (option: string) => {
    switch (option) {
        case "Investment Banking": return <Building size={20} />;
        case "Sales & Trading": return <TrendingUp size={20} />;
        case "Private Equity": return <Briefcase size={20} />;
        case "Asset Management": return <PieChart size={20} />;
        case "Other / Still exploring": return <Compass size={20} />;

        case "Not confident at all": return <Frown size={20} />;
        case "Somewhat prepared": return <Meh size={20} />;
        case "Confident": return <Smile size={20} />;
        case "Very confident": return <Target size={20} />;

        case "Within 7 days": return <Clock size={20} />;
        case "2-4 weeks": return <Calendar size={20} />;
        case "Over a month": return <CalendarDays size={20} />;
        case "Just preparing early": return <BookOpen size={20} />;

        case "15 minutes":
        case "30 minutes":
        case "45+ minutes":
            return <Clock size={20} />;

        case "1st year":
        case "2nd year":
        case "3rd year":
        case "4th year+":
            return <GraduationCap size={20} />;

        default: return null;
    }
};

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState<StepIndex>(0);
    const [selections, setSelections] = useState({
        role: [] as string[],
        confidence: "",
        interview: "",
        minutes: "",
        name: "",
        year: ""
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isGenerating) {
            const interval = 120; // 120ms tick rate

            const timer = setInterval(() => {
                setProgress((prev) => {
                    let next = prev;

                    if (prev < 40) {
                        // Phase 1: Smooth and fast initially
                        next += Math.random() * 5 + 3;
                    } else if (prev < 70) {
                        // Phase 2: Sometimes stalls, sometimes linear
                        const isStalled = Math.random() > 0.7; // 30% chance to stall
                        if (!isStalled) {
                            next += Math.random() * 4 + 1;
                        } else {
                            next += Math.random() * 0.5; // Very tiny progress
                        }
                    } else if (prev < 80) {
                        // Phase 3: Very choppy and slow piece (the heavy lifting)
                        const isStalled = Math.random() > 0.4; // 60% chance to stall!
                        if (!isStalled) {
                            next += Math.random() * 8 + 2; // Jump when it does move
                        } else {
                            next += Math.random() * 0.3; // Barely tick up
                        }
                    } else if (prev < 95) {
                        // Phase 4: Slower stretch
                        const isStalled = Math.random() > 0.3; // 70% chance to stall
                        if (!isStalled) {
                            next += Math.random() * 2 + 0.5;
                        } else {
                            next += Math.random() * 0.2;
                        }
                    } else {
                        // Phase 5: Final stretch, excruciatingly slow
                        const isStalled = Math.random() > 0.15; // 85% chance to stall
                        if (!isStalled) {
                            next += Math.random() * 1.5 + 0.1;
                        } else {
                            next += Math.random() * 0.1; // Barely moves
                        }
                    }

                    if (next >= 100) {
                        clearInterval(timer);
                        setTimeout(() => {
                            router.push("/signup");
                        }, 800); // 800ms pause at exactly 100%
                        return 100;
                    }
                    return next;
                });
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isGenerating, router]);

    const handleNext = () => {
        if (step < 5) {
            setStep((prev) => (prev + 1) as StepIndex);
        } else {
            // End of onboarding, trigger fake "Generation" loading screen
            setIsGenerating(true);
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep((prev) => (prev - 1) as StepIndex);
        }
    };

    const handleSelect = (field: string, value: string) => {
        setSelections((prev) => {
            const current = (prev as any)[field];
            if (Array.isArray(current)) {
                // Remove if exists
                if (current.includes(value)) {
                    return { ...prev, [field]: current.filter((v: string) => v !== value) };
                } else {
                    return { ...prev, [field]: [...current, value] };
                }
            } else {
                return { ...prev, [field]: value };
            }
        });
    };

    const isNextDisabled = () => {
        switch (step) {
            case 0: return selections.role.length === 0;
            case 1: return !selections.confidence;
            case 2: return !selections.interview;
            case 3: return !selections.minutes;
            case 4: return !selections.name.trim();
            case 5: return !selections.year;
            default: return true;
        }
    };

    const stepsContent = [
        {
            title: "What role(s) are you targeting?",
            description: "We'll tailor your lessons and practice to match your goals.",
            field: "role",
            options: [
                "Investment Banking",
                "Sales & Trading",
                "Private Equity",
                "Asset Management",
                "Other / Still exploring"
            ]
        },
        {
            title: "How confident do you feel right now?",
            description: "Be honest! This helps us set the right pace for your learning plan.",
            field: "confidence",
            options: [
                "Not confident at all",
                "Somewhat prepared",
                "Confident",
                "Very confident"
            ]
        },
        {
            title: "When is your next interview?",
            description: "We'll build a schedule that guarantees you're ready by interview day.",
            field: "interview",
            options: [
                "Within 7 days",
                "2-4 weeks",
                "Over a month",
                "Just preparing early"
            ]
        },
        {
            title: "How many minutes per day can you commit?",
            description: "Consistency is key. Even 15 focused minutes can make a massive difference.",
            field: "minutes",
            options: [
                "15 minutes",
                "30 minutes",
                "45+ minutes"
            ]
        },
        {
            title: "What's your name?",
            description: "Let's make this personalized. What should we call you?",
            field: "name",
            options: [] // Special case for text input
        },
        {
            title: "What is your current year?",
            description: "This helps us understand your academic timeline and recruitment windows.",
            field: "year",
            options: [
                "1st year",
                "2nd year",
                "3rd year",
                "4th year+"
            ]
        }
    ];

    const currentStep = stepsContent[step];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fbff] relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />

            {/* Global Header Logo */}
            <header className="absolute top-8 left-8 lg:top-12 lg:left-16 flex justify-start z-20">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <Image src="/assets/ClariFi.png" alt="ClariFi" width={42} height={42} className="object-contain" />
                    <span className="font-bold text-2xl text-slate-800 tracking-tight">ClariFi</span>
                </div>
            </header>

            {/* Central Content Container */}
            <div className="w-full max-w-[1100px] flex items-center justify-between gap-12 lg:gap-20 px-6 sm:px-12 z-10 pt-16">

                {/* Left Column (Marketing Text & Chart) */}
                <div className="hidden lg:flex flex-col flex-1 items-start w-full animate-fade-in-up">
                    <h1 className="text-5xl font-semibold text-slate-800 tracking-tight leading-[1.15] mb-6">
                        Build real <br />
                        <span className="text-[#1d4ed8]">finance skills.</span>
                    </h1>
                    <p className="text-[17px] text-slate-600 mb-10 max-w-[340px] leading-relaxed">
                        Personalized lessons & practice <br /> for your target career path.
                    </p>

                    {/* Blue chart visual */}
                    <div className="relative w-full max-w-[340px] opacity-90 mix-blend-multiply">
                        <div className="w-full h-48 bg-gradient-to-tr from-blue-100 to-blue-50/50 rounded-2xl border border-blue-200/60 relative overflow-hidden flex items-end justify-between p-6 shadow-sm">
                            <div className="w-[30%] bg-[#5c8aff] h-[35%] rounded-sm relative z-0" />
                            <div className="w-[30%] bg-[#3654ff] h-[65%] rounded-sm relative z-0" />
                            <div className="w-[30%] bg-[#1b34ba] h-[95%] rounded-sm relative z-0" />

                            {/* Overlay line graph */}
                            <svg className="absolute inset-0 w-full h-full p-6 text-[#1d4ed8]" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M 0 100 L 25 70 L 45 80 L 85 20 L 100 15" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                <polygon points="85,20 100,15 95,35" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Column (Form Card) */}
                <div className="flex-1 flex w-full max-w-[480px]">
                    <main className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-10 animate-fade-in-up">

                        {isGenerating ? (
                            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-in-up">
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center relative z-10">
                                        <Loader2 size={32} className="text-[#1d4ed8] animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                                </div>

                                <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">
                                    Creating Your<br />Personalized Guides
                                </h2>
                                <p className="text-sm text-slate-500 mb-10 max-w-[250px]">
                                    We are compiling the perfect curriculum for your goals...
                                </p>

                                {/* Loading Bar */}
                                <div className="w-full max-w-[280px]">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                                        <span>Progress</span>
                                        <span className="text-[#1d4ed8]">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] rounded-full shadow-[0_0_10px_rgba(29,78,216,0.5)] transition-all duration-200 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Progress indicator */}
                                <div className="flex items-center gap-4 mb-10 text-sm font-semibold text-slate-700">
                                    <div className="flex items-center gap-1">
                                        {step > 0 ? (
                                            <button
                                                onClick={handlePrev}
                                                className="p-1 -ml-2 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                                                aria-label="Go to previous step"
                                            >
                                                <ChevronLeft size={16} strokeWidth={3} />
                                            </button>
                                        ) : (
                                            <div className="w-[24px] -ml-2" />
                                        )}
                                        <span>Step {step + 1} of 6</span>
                                    </div>
                                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#1d4ed8] transition-all duration-500 ease-out"
                                            style={{ width: `${((step + 1) / 6) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full flex flex-col items-start mb-8 text-left">
                                    {/* Title - Notice: font-medium instead of font-bold */}
                                    <h2 className="text-2xl font-medium text-slate-900 mb-2 tracking-tight">
                                        {currentStep.title}
                                    </h2>
                                    {currentStep.description && (
                                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                            {currentStep.description}
                                        </p>
                                    )}

                                    <div className="w-full flex flex-col gap-3">
                                        {currentStep.field === "name" ? (
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                value={selections.name}
                                                onChange={(e) => handleSelect("name", e.target.value)}
                                                className="w-full h-14 px-5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1d4ed8] transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-sm"
                                                onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
                                            />
                                        ) : (
                                            currentStep.options.map((option) => {
                                                // @ts-ignore
                                                const currentValue = selections[currentStep.field];
                                                const isMulti = Array.isArray(currentValue);
                                                const isSelected = isMulti ? currentValue.includes(option) : currentValue === option;

                                                return (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleSelect(currentStep.field, option)}
                                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer text-left focus:outline-none ${isSelected
                                                            ? "border-[#1d4ed8] bg-blue-50/50 shadow-[0_2px_10px_-4px_rgba(29,78,216,0.3)] ring-1 ring-[#1d4ed8]"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Optional Icon wrapper */}
                                                            <div className={`transition-colors ${isSelected ? 'text-[#1d4ed8]' : 'text-slate-400'}`}>
                                                                {getIconForOption(option)}
                                                            </div>
                                                            <span className={`font-medium text-[15px] ${isSelected ? "text-[#0f172a]" : "text-slate-700"}`}>
                                                                {option}
                                                            </span>
                                                        </div>

                                                        {/* Checkmark area */}
                                                        <div
                                                            className={`min-w-[20px] h-[20px] flex items-center justify-center transition-all ${isMulti ? "rounded-[6px]" : "rounded-full"
                                                                } ${isSelected
                                                                    ? "bg-[#1d4ed8] border border-[#1d4ed8]"
                                                                    : "border border-slate-300 bg-white"
                                                                }`}
                                                        >
                                                            {isSelected && (
                                                                <Check size={12} className="text-white" strokeWidth={3} />
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Next Button Section */}
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={handleNext}
                                        disabled={isNextDisabled()}
                                        className={`w-full h-14 rounded-full font-medium text-white transition-all flex items-center justify-center gap-2 ${isNextDisabled()
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] hover:shadow-[0_8px_25px_-8px_rgba(29,78,216,0.3)] hover:-translate-y-[1px] active:translate-y-[1px]"
                                            }`}
                                    >
                                        {step === 5 ? "Finish Onboarding" : "Personalize My Plan"}
                                        <ArrowRight size={18} className={isNextDisabled() ? "opacity-50" : ""} />
                                    </button>

                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <Clock size={12} />
                                        <span>Takes 30 seconds</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
