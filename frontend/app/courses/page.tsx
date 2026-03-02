"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import UserDropdown from "@/components/UserDropdown";
import { getCourseProgress } from "@/lib/courseProgress";
import {
    BarChart2,
    BookOpen,
    TrendingUp,
    DollarSign,
    Layers,
    Handshake,
    TrendingDown,
    ChevronRight,
    Clock,
    FileText,
} from "lucide-react";

interface Course {
    id: string;
    title: string;
    description: string;
}

type CourseMeta = {
    tag: string;
    tagColor: string;
    tagText: string;
    accent: string;
    accentLight: string;
    bgGradient: string;
    expandedBg: string;
    Icon: React.ElementType;
    iconColor: string;
    featured: boolean;
    lessons: number;
    duration: string;
    progress: number;
    difficulty: string;
};

const COURSE_META: Record<string, CourseMeta> = {
    c1: {
        tag: "Modelling",
        tagColor: "#dbeafe",
        tagText: "#1d4ed8",
        accent: "#2563eb",
        accentLight: "#3b82f6",
        bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        expandedBg: "#ffffff",
        Icon: BarChart2,
        iconColor: "#2563eb",
        featured: true,
        lessons: 12,
        duration: "6h 30m",
        progress: 0,
        difficulty: "Intermediate",
    },
    c2: {
        tag: "Accounting",
        tagColor: "#e0f2fe",
        tagText: "#0369a1",
        accent: "#0284c7",
        accentLight: "#0ea5e9",
        bgGradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        expandedBg: "#ffffff",
        Icon: BookOpen,
        iconColor: "#0284c7",
        featured: true,
        lessons: 15,
        duration: "8h 15m",
        progress: 0,
        difficulty: "Beginner",
    },
    c3: {
        tag: "Valuation",
        tagColor: "#e0e7ff",
        tagText: "#4338ca",
        accent: "#4f46e5",
        accentLight: "#6366f1",
        bgGradient: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        expandedBg: "#ffffff",
        Icon: TrendingUp,
        iconColor: "#4f46e5",
        featured: false,
        lessons: 10,
        duration: "5h 45m",
        progress: 0,
        difficulty: "Intermediate",
    },
    c4: {
        tag: "Valuation",
        tagColor: "#dbeafe",
        tagText: "#1e40af",
        accent: "#0369a1",
        accentLight: "#0284c7",
        bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        expandedBg: "#ffffff",
        Icon: DollarSign,
        iconColor: "#0369a1",
        featured: false,
        lessons: 8,
        duration: "4h 20m",
        progress: 0,
        difficulty: "Advanced",
    },
    c5: {
        tag: "DCF Analysis",
        tagColor: "#dbeafe",
        tagText: "#1e40af",
        accent: "#1e40af",
        accentLight: "#3b82f6",
        bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        expandedBg: "#ffffff",
        Icon: TrendingDown,
        iconColor: "#1e40af",
        featured: false,
        lessons: 14,
        duration: "7h 50m",
        progress: 0,
        difficulty: "Advanced",
    },
    c6: {
        tag: "LBO",
        tagColor: "#e0e7ff",
        tagText: "#4338ca",
        accent: "#6366f1",
        accentLight: "#818cf8",
        bgGradient: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        expandedBg: "#ffffff",
        Icon: Layers,
        iconColor: "#6366f1",
        featured: false,
        lessons: 11,
        duration: "6h 10m",
        progress: 0,
        difficulty: "Advanced",
    },
    c7: {
        tag: "M&A",
        tagColor: "#e0f2fe",
        tagText: "#0369a1",
        accent: "#0ea5e9",
        accentLight: "#38bdf8",
        bgGradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        expandedBg: "#ffffff",
        Icon: Handshake,
        iconColor: "#0ea5e9",
        featured: false,
        lessons: 9,
        duration: "5h 00m",
        progress: 0,
        difficulty: "Intermediate",
    },
};

const DEFAULT_META: CourseMeta = {
    tag: "Finance",
    tagColor: "#f1f5f9",
    tagText: "#475569",
    accent: "#64748b",
    accentLight: "#94a3b8",
    bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    expandedBg: "#ffffff",
    Icon: BookOpen,
    iconColor: "#64748b",
    featured: false,
    lessons: 8,
    duration: "4h 00m",
    progress: 0,  // default fallback
    difficulty: "Beginner",
};

const STORAGE_KEY = "clarifi-last-course";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<string>("c1");
    const [username, setUsername] = useState<string | null>(null);

    // On mount, restore last-viewed course from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setSelectedId(saved);
        } catch { }
    }, []);

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const supabase = createClient();
                const { data } = await supabase.auth.getUser();
                const user = data?.user;
                if (user) {
                    setUsername(user.user_metadata?.username || user.email?.split("@")[0] || "User");
                }
            } catch { }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const response = await axios.get(
                    `${API_BASE}/courses?t=${new Date().getTime()}`
                );
                setCourses(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load courses. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleSelectCourse = (id: string) => {
        setSelectedId(id);
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch { }
    };

    const featuredCourses = courses.filter(
        (c) => (COURSE_META[c.id] || DEFAULT_META).featured
    );
    const regularCourses = courses.filter(
        (c) => !(COURSE_META[c.id] || DEFAULT_META).featured
    );

    const expandedCourse = courses.find((c) => c.id === selectedId);
    const expandedMeta = expandedCourse
        ? COURSE_META[expandedCourse.id] || DEFAULT_META
        : null;

    // Read live progress from localStorage (not from the stale COURSE_META)
    const liveProgress = expandedCourse ? getCourseProgress(expandedCourse.id) : 0;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                body { background: #f8fafc !important; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.92) translateY(12px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.25; }
                    50% { opacity: 0.45; }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes progressFill {
                    from { width: 0; }
                }

                .courses-grid-wrapper {
                    display: flex;
                    gap: 32px;
                    align-items: flex-start;
                    min-height: 600px;
                }

                .courses-grid-left {
                    flex: 0.55;
                    min-width: 0;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .expanded-panel {
                    flex: 0.45;
                    min-width: 340px;
                    max-width: 460px;
                    animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    position: sticky;
                    top: 100px;
                }

                .course-tile {
                    position: relative;
                    border-radius: 18px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0,0,0,0.06);
                    text-decoration: none !important;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
                }
                .course-tile:hover {
                    transform: translateY(-4px) scale(1.02);
                    border-color: rgba(0,0,0,0.08);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06);
                }
                .course-tile.is-active {
                    border-color: rgba(59,130,246,0.35);
                    box-shadow: 0 0 0 2px rgba(59,130,246,0.12), 0 12px 40px rgba(0,0,0,0.1);
                    transform: translateY(-4px) scale(1.02);
                }

                .tile-icon-area {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .tile-icon-circle {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                }
                .tile-icon-circle img {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                }
                .tile-icon-circle.small {
                    width: 60px;
                    height: 60px;
                }
                .tile-icon-circle.small img {
                    width: 32px;
                    height: 32px;
                }

                .tile-content {
                    padding: 16px 20px 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                }

                .tile-tag {
                    display: inline-block;
                    font-size: 9px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 20px;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    width: fit-content;
                    margin-bottom: 10px;
                }

                .tile-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.3;
                    margin: 0 0 6px;
                }

                .tile-desc {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Featured tiles */
                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                    margin-bottom: 18px;
                }
                .featured-grid .tile-icon-area {
                    height: 170px;
                }
                .featured-grid .tile-title {
                    font-size: 18px;
                }

                /* Regular tiles */
                .regular-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                }
                .regular-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                .regular-grid .tile-icon-area {
                    height: 130px;
                }

                /* Expanded detail panel */
                .expanded-card {
                    border-radius: 22px;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.08);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);
                    background: #ffffff;
                }

                .expanded-hero {
                    position: relative;
                    height: 240px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .expanded-hero-glow {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    filter: blur(50px);
                    opacity: 0.25;
                    animation: pulseGlow 3s ease-in-out infinite;
                }

                .expanded-hero-icon-circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    box-shadow: 0 8px 28px rgba(0,0,0,0.15);
                }
                .expanded-hero-icon-circle img {
                    width: 56px;
                    height: 56px;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                }

                .expanded-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.85);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    z-index: 5;
                    color: #64748b;
                }
                .expanded-close:hover {
                    background: #ffffff;
                    color: #0f172a;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .expanded-body {
                    padding: 28px;
                }

                .expanded-tag {
                    display: inline-block;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 4px 12px;
                    border-radius: 20px;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }

                .expanded-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.25;
                    margin: 0 0 12px;
                    letter-spacing: -0.3px;
                }

                .expanded-desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.75;
                    margin: 0 0 24px;
                }

                .expanded-meta-row {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .expanded-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 13px;
                    color: #64748b;
                }
                .expanded-meta-item svg {
                    opacity: 0.8;
                }

                .progress-section {
                    margin-bottom: 28px;
                }
                .progress-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .progress-label span:first-child {
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .progress-label span:last-child {
                    font-size: 13px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .progress-bar-track {
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    border-radius: 10px;
                    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: progressFill 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .progress-bar-fill::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s ease-in-out infinite;
                }

                .open-course-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 14px 24px;
                    border-radius: 14px;
                    font-size: 14px;
                    font-weight: 700;
                    color: #fff;
                    text-decoration: none;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    letter-spacing: 0.3px;
                    border: none;
                    cursor: pointer;
                }
                .open-course-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
                    filter: brightness(1.08);
                }

                .difficulty-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 10px;
                    border-radius: 6px;
                    background: #f1f5f9;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                }

                @media (max-width: 900px) {
                    .courses-grid-wrapper {
                        flex-direction: column;
                    }
                    .courses-grid-left {
                        flex: 1;
                    }
                    .expanded-panel {
                        max-width: 100%;
                        min-width: 0;
                        position: relative;
                        top: 0;
                    }
                    .featured-grid {
                        grid-template-columns: 1fr;
                    }
                    .regular-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .regular-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: "#f8fafc",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    padding: "52px 28px 96px",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                    {/* ── Header ── */}
                    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 40, marginTop: 8 }}>
                        <div style={{ flex: 0.55, minWidth: 0 }}>
                            <h1
                                style={{
                                    fontSize: "clamp(28px, 4vw, 38px)",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    letterSpacing: "-0.8px",
                                    lineHeight: 1.2,
                                    marginBottom: 8,
                                }}
                            >
                                My Finance Courses
                            </h1>
                        </div>
                        <div style={{ flex: 0.45, minWidth: 340, maxWidth: 460, display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
                            {username && (
                                <UserDropdown username={username} />
                            )}
                        </div>
                    </div>

                    {/* ── Loading ── */}
                    {loading && (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    border: "3px solid #e2e8f0",
                                    borderTop: "3px solid #3b82f6",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                    margin: "0 auto 16px",
                                }}
                            />
                            <p style={{ fontSize: 14 }}>Loading courses...</p>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {error && (
                        <div
                            style={{
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: 14,
                                padding: "22px 28px",
                                color: "#991b1b",
                                textAlign: "center",
                                fontSize: 14,
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* ── Courses ── */}
                    {!loading && !error && (
                        <div className="courses-grid-wrapper">

                            {/* LEFT: Card Grid */}
                            <div className="courses-grid-left">

                                {/* Featured row – 2 large cards */}
                                {featuredCourses.length > 0 && (
                                    <div className="featured-grid">
                                        {featuredCourses.map((course) => {
                                            const meta = COURSE_META[course.id] || DEFAULT_META;
                                            const isActive = selectedId === course.id;
                                            const courseIndex = courses.indexOf(course);
                                            return (
                                                <div
                                                    key={course.id}
                                                    className={`course-tile ${isActive ? "is-active" : ""}`}
                                                    onClick={() => handleSelectCourse(course.id)}
                                                >
                                                    <div
                                                        className="tile-icon-area"
                                                        style={{ background: meta.bgGradient }}
                                                    >
                                                        <div
                                                            className="tile-icon-circle"
                                                            style={{ background: meta.accent }}
                                                        >
                                                            <img
                                                                src={`/icons/course-${courseIndex + 1}.png`}
                                                                alt={course.title}
                                                            />
                                                        </div>
                                                        <span
                                                            className="tile-tag"
                                                            style={{
                                                                position: "absolute",
                                                                top: 14,
                                                                right: 14,
                                                                background: meta.tagColor,
                                                                color: meta.tagText,
                                                            }}
                                                        >
                                                            {meta.tag}
                                                        </span>
                                                    </div>
                                                    <div className="tile-content">
                                                        <h2 className="tile-title">{course.title}</h2>
                                                        <p className="tile-desc">{course.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Regular grid */}
                                {regularCourses.length > 0 && (
                                    <div className="regular-grid">
                                        {regularCourses.map((course) => {
                                            const meta = COURSE_META[course.id] || DEFAULT_META;
                                            const isActive = selectedId === course.id;
                                            const courseIndex = courses.indexOf(course);
                                            return (
                                                <div
                                                    key={course.id}
                                                    className={`course-tile ${isActive ? "is-active" : ""}`}
                                                    style={course.id === "c7" ? { gridColumn: "span 2" } : undefined}
                                                    onClick={() => handleSelectCourse(course.id)}
                                                >
                                                    <div
                                                        className="tile-icon-area"
                                                        style={{ background: meta.bgGradient }}
                                                    >
                                                        <div
                                                            className="tile-icon-circle small"
                                                            style={{ background: meta.accent }}
                                                        >
                                                            <img
                                                                src={`/icons/course-${courseIndex + 1}.png`}
                                                                alt={course.title}
                                                            />
                                                        </div>
                                                        <span
                                                            className="tile-tag"
                                                            style={{
                                                                position: "absolute",
                                                                top: 12,
                                                                right: 12,
                                                                background: meta.tagColor,
                                                                color: meta.tagText,
                                                            }}
                                                        >
                                                            {meta.tag}
                                                        </span>
                                                    </div>
                                                    <div className="tile-content">
                                                        <h2 className="tile-title" style={{ fontSize: 15 }}>
                                                            {course.title}
                                                        </h2>
                                                        <p className="tile-desc">{course.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT: Always-visible Detail Panel */}
                            {expandedCourse && expandedMeta && (
                                <div className="expanded-panel">
                                    <div className="expanded-card">
                                        {/* Hero area */}
                                        <div
                                            className="expanded-hero"
                                            style={{ background: expandedMeta.bgGradient }}
                                        >
                                            <div
                                                className="expanded-hero-glow"
                                                style={{ background: expandedMeta.accent }}
                                            />
                                            <div
                                                className="expanded-hero-icon-circle"
                                                style={{ background: expandedMeta.accent }}
                                            >
                                                <img
                                                    src={`/icons/course-${courses.indexOf(expandedCourse) + 1}.png`}
                                                    alt={expandedCourse.title}
                                                />
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="expanded-body">
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                                <span
                                                    className="expanded-tag"
                                                    style={{
                                                        background: expandedMeta.tagColor,
                                                        color: expandedMeta.tagText,
                                                        margin: 0,
                                                    }}
                                                >
                                                    {expandedMeta.tag}
                                                </span>
                                                <span className="difficulty-badge">
                                                    {expandedMeta.difficulty}
                                                </span>
                                            </div>

                                            <h2 className="expanded-title">{expandedCourse.title}</h2>
                                            <p className="expanded-desc">{expandedCourse.description}</p>

                                            {/* Meta info */}
                                            <div className="expanded-meta-row">
                                                <div className="expanded-meta-item">
                                                    <FileText size={15} color={expandedMeta.accent} />
                                                    <span>{expandedMeta.lessons} Lessons</span>
                                                </div>
                                                <div className="expanded-meta-item">
                                                    <Clock size={15} color={expandedMeta.accent} />
                                                    <span>{expandedMeta.duration}</span>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="progress-section">
                                                <div className="progress-label">
                                                    <span>Progress</span>
                                                    <span>{liveProgress}%</span>
                                                </div>
                                                <div className="progress-bar-track">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${liveProgress}%`,
                                                            background: `linear-gradient(90deg, ${expandedMeta.accent}, ${expandedMeta.accentLight})`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Open Course button */}
                                            <Link
                                                href={`/chat/${expandedCourse.id}`}
                                                className="open-course-btn"
                                                style={{
                                                    background: `linear-gradient(135deg, ${expandedMeta.accent}, ${expandedMeta.accentLight})`,
                                                }}
                                            >
                                                {liveProgress > 0 ? "Continue Course" : "Open Course"}
                                                <ChevronRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
