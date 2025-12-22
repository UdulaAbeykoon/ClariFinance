"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Briefcase, ChevronLeft, ChevronRight, LayoutDashboard, Settings } from "lucide-react";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Header / Collapse Toggle */}
            <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                {!isCollapsed && (
                    <Link href="/courses" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium text-sm">Back to Courses</span>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 mt-6 px-2 space-y-2">
                <Link
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                >
                    <BookOpen className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Courses</span>}
                </Link>

                <Link
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                    <Briefcase className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Interview Prep</span>}
                </Link>

                <Link
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Progress</span>}
                </Link>
            </div>

            {/* Footer / Settings */}
            <div className="p-4 mt-auto">
                <Link
                    href="#"
                    className={`flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${isCollapsed ? "justify-center" : ""
                        }`}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Settings</span>}
                </Link>
            </div>
        </div>
    );
}
