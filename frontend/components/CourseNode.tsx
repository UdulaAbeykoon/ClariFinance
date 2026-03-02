"use client";

import Link from "next/link";
import { Lock, Star } from "lucide-react";

interface Course {
    id: string;
    title: string;
    description: string;
}

interface CourseNodeProps {
    course: Course;
    index: number;
    isLast: boolean;
    isActive?: boolean;
    isLocked?: boolean;
}

export default function CourseNode({ course, index, isLast, isActive = true, isLocked = false }: CourseNodeProps) {
    // Determine style based on row position
    // Indices 0-3 (Top Row) -> Blue Glass Theme
    // Indices 4-6 (Bottom Row) -> Dark Glass Theme
    const isTopRow = index <= 3;

    // "Liquid Glass" base styles: semi-transparent, blur, light borders, subtle shadows
    const baseClasses = isTopRow
        ? "bg-blue-500/30 border-blue-400/30 hover:bg-blue-500/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        : "bg-black/40 border-white/10 hover:bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]";

    return (
        <div className="relative flex flex-col items-center group w-full h-full">
            {/* Tooltip / Label - positioned above */}
            <div className="absolute -top-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                <div className="bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-center w-48">
                    <h3 className="font-medium text-sm mb-1">{course.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{course.description}</p>
                    {/* Tiny triangle pointer */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800/90 border-r border-b border-slate-700 rotate-45"></div>
                </div>
            </div>

            {/* The Glass Node */}
            <Link
                href={isLocked ? "#" : `/chat/${course.id}`}
                className={`
                    w-full h-full rounded-2xl flex flex-col items-center justify-center p-2 text-center
                    backdrop-blur-md border outline-none
                    transition-all duration-300 hover:scale-105 hover:backdrop-blur-xl
                    ${isLocked
                        ? "bg-slate-800/50 border-slate-700/50 cursor-not-allowed opacity-60"
                        : `${baseClasses} cursor-pointer`
                    }
                `}
            >
                {/* Icon */}
                <div className="mb-2 w-12 h-12 relative opacity-90 group-hover:opacity-100 transition-opacity">
                    <img
                        src={`/icons/course-${index + 1}.png`}
                        alt={course.title}
                        className="object-contain w-full h-full drop-shadow-sm"
                    />
                </div>

                <span className="text-white font-medium text-[10px] md:text-sm leading-tight drop-shadow-sm px-1 uppercase tracking-wider">
                    {course.title}
                </span>
            </Link>

            {/* Level label below */}
            <div className="mt-3 font-medium text-blue-100/80 text-[10px] tracking-widest uppercase mb-1">
                Module {index + 1}
            </div>
        </div>
    );
}
