"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Home } from "lucide-react";
import axios from "axios";
import CourseNode from "@/components/CourseNode";
import { createClient } from "@/utils/supabase/client";

interface Course {
    id: string;
    title: string;
    description: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("User");

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User";
                setUsername(name);
            }
        };

        const fetchCourses = async () => {
            try {
                // Cache busting to ensure we get all 7 courses
                const response = await axios.get(`http://localhost:8000/courses?t=${new Date().getTime()}`);
                setCourses(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load courses. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen text-white selection:bg-indigo-500 selection:text-white overflow-hidden flex flex-col relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/loginbackground.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Header */}
            <div className="relative z-10 w-full px-6 py-8 flex-shrink-0 flex flex-col items-center text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group">
                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xl tracking-tight text-slate-900">{username} Dashboard</span>
                </Link>

                <h1 className="text-4xl font-bold mb-2 text-slate-900">My Learning Path</h1>
                <p className="text-slate-700 text-lg">Master finance one node at a time.</p>
            </div>

            {/* Main Content - Single Screen Snake Path */}
            <div className="relative z-10 flex-1 flex items-center justify-center w-full px-6 pb-12">
                {loading ? (
                    <div className="w-full flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                        <p>Loading your path...</p>
                    </div>
                ) : error ? (
                    <div className="w-full flex justify-center">
                        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                            {error}
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full max-w-5xl aspect-[1000/600] mx-auto flex items-center justify-center">
                        {/* SVG Path Background */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 600">
                            <path
                                d={(() => {
                                    // Row 1: Left to Right
                                    // Row 2: Right to Left
                                    // Coords:
                                    // 0: 100, 150
                                    // 1: 360, 150
                                    // 2: 620, 150
                                    // 3: 880, 150
                                    // -- Drop down --
                                    // 4: 880, 450
                                    // 5: 620, 450
                                    // 6: 360, 450
                                    // Goal: 100, 450

                                    const r1y = 150;
                                    const r2y = 450;

                                    let path = `M 100 ${r1y}`; // Start
                                    path += ` C 230 ${r1y}, 230 ${r1y}, 360 ${r1y}`; // 0 -> 1
                                    path += ` C 490 ${r1y}, 490 ${r1y}, 620 ${r1y}`; // 1 -> 2
                                    path += ` C 750 ${r1y}, 750 ${r1y}, 880 ${r1y}`; // 2 -> 3

                                    // Curve down from 3 to 4
                                    // Control points to make a nice "S" or "C" turn
                                    path += ` C 980 ${r1y}, 980 ${r2y}, 880 ${r2y}`; // 3 -> 4 (Wide right turn)

                                    path += ` C 750 ${r2y}, 750 ${r2y}, 620 ${r2y}`; // 4 -> 5
                                    path += ` C 490 ${r2y}, 490 ${r2y}, 360 ${r2y}`; // 5 -> 6
                                    path += ` C 230 ${r2y}, 230 ${r2y}, 100 ${r2y}`; // 6 -> Goal

                                    return path;
                                })()}
                                fill="none"
                                stroke="#475569"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Nodes */}
                        {courses.map((course, index) => {
                            let x = 0;
                            let y = 0;

                            if (index <= 3) {
                                // Top Row
                                x = 100 + index * 260; // 100, 360, 620, 880
                                y = 150;
                            } else {
                                // Bottom Row (Right to Left)
                                const offset = index - 4;
                                x = 880 - offset * 260;
                                y = 450;
                            }

                            const leftPct = (x / 1000) * 100;
                            const topPct = (y / 600) * 100;

                            return (
                                <div
                                    key={course.id}
                                    className="absolute z-10 transition-transform duration-500 hover:scale-105"
                                    style={{
                                        left: `${leftPct}%`,
                                        top: `${topPct}%`,
                                        width: '18%',   // Responsive width (approx 180/1000)
                                        height: '24%',  // Responsive height (approx 144/600)
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <CourseNode
                                        course={course}
                                        index={index}
                                        isLast={index === courses.length - 1}
                                        isLocked={false}
                                    />
                                </div>
                            );
                        })}

                        {/* Goal Node - Position: 100, 450 */}
                        <div
                            className="absolute z-10 flex flex-col items-center"
                            style={{
                                left: '10%', // 100/1000
                                top: '75%', // 450/600
                                width: '10%',
                                height: '16%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className="w-full h-full aspect-square rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <span className="text-4xl filter drop-shadow-lg">🏆</span>
                            </div>
                            <div className="mt-2 font-bold text-slate-500 text-xs tracking-wider bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                GOAL
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
