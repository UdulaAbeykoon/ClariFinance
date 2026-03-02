"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import VideoPlayer from "@/components/VideoPlayer";
import PdfViewer from "@/components/PdfViewer";
import type { PdfNote } from "@/components/PdfViewer";
import { getCourseProgress } from "@/lib/courseProgress";

const NOTES_STORAGE_KEY = (courseId: string) => `clarifi-notes-${courseId}`;

export default function ChatPage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const pdfSectionRef = useRef<HTMLElement>(null);

    const COURSE_NAMES: Record<string, string> = {
        c1: "Financial Modelling",
        c2: "Accounting",
        c3: "Equity Value",
        c4: "Valuation",
        c5: "DCF",
        c6: "LBO Modelling",
        c7: "Merger Models",
    };

    const courseName = COURSE_NAMES[courseId] || "Course";

    const [progress, setProgress] = useState(0);
    const [notified, setNotified] = useState(false);
    const [notes, setNotes] = useState<PdfNote[]>(() => {
        // Lazy initializer won't work for route changes, so we also handle in useEffect
        if (typeof window === "undefined") return [];
        try {
            const saved = localStorage.getItem(NOTES_STORAGE_KEY(courseId));
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Reload notes when courseId changes (navigating between courses)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(NOTES_STORAGE_KEY(courseId));
            setNotes(saved ? JSON.parse(saved) : []);
        } catch {
            setNotes([]);
        }
    }, [courseId]);

    // Helper to save notes to localStorage
    const saveNotes = (updatedNotes: PdfNote[]) => {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY(courseId), JSON.stringify(updatedNotes));
        } catch { }
    };

    // Re-read saved progress whenever courseId changes
    useEffect(() => {
        setProgress(getCourseProgress(courseId));
    }, [courseId]);

    const handleProgressChange = useCallback((p: number) => {
        setProgress(p);
    }, []);

    const handleAddNote = useCallback((note: PdfNote) => {
        setNotes((prev) => {
            const updated = [note, ...prev];
            saveNotes(updated);
            return updated;
        });
    }, [courseId]);

    const handleDeleteNote = useCallback((noteId: string) => {
        setNotes((prev) => {
            const updated = prev.filter((n) => n.id !== noteId);
            saveNotes(updated);
            return updated;
        });
    }, [courseId]);

    const handleNoteClick = useCallback((note: PdfNote) => {
        // Scroll to the page in the PDF
        const pageEl = document.querySelector(`[data-page="${note.pageNumber}"]`);
        if (pageEl) {
            pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
            // Flash highlight effect
            pageEl.classList.add("ring-4", "ring-yellow-400/50", "rounded-lg");
            setTimeout(() => {
                pageEl.classList.remove("ring-4", "ring-yellow-400/50", "rounded-lg");
            }, 2000);
        }
    }, []);

    const [clarifyQuery, setClarifyQuery] = useState<string | null>(null);

    const handleClarify = useCallback((text: string) => {
        // Use timestamp to ensure each click is unique even for same text
        setClarifyQuery(text + "__" + Date.now());
    }, []);

    // Coming Soon Screen for Merger Models
    if (courseId === "c7") {
        return (
            <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-900 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute top-0 -left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 -right-10 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="z-10 text-center p-10 max-w-2xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-8 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                            Coming Soon
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            The <span className="font-semibold text-slate-800">Merger Models</span> module is currently under construction.
                            We're crafting an immersive experience to help you master M&A deal structuring.
                        </p>
                        <button
                            onClick={() => {
                                setNotified(true);
                                setTimeout(() => setNotified(false), 5000);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer text-slate-500 text-sm font-medium"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${notified ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${notified ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                            </span>
                            Notify me when available
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50 text-slate-900">
                <main className="p-8 max-w-5xl mx-auto w-full space-y-8">

                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{courseName}</h1>
                            <p className="text-sm text-slate-500">Course Guide</p>
                        </div>
                        {/* Progress bar */}
                        <div className="w-64">
                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                <span>Course Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <section>
                        <VideoPlayer courseId={courseId} />
                    </section>

                    {/* PDF / Content Section */}
                    <section ref={pdfSectionRef}>
                        <PdfViewer courseId={courseId} onProgressChange={handleProgressChange} onAddNote={handleAddNote} onClarify={handleClarify} />
                    </section>
                </main>
            </div>

            {/* Right Sidebar (AI & Notes) */}
            <RightSidebar
                courseId={courseId}
                notes={notes}
                onDeleteNote={handleDeleteNote}
                onNoteClick={handleNoteClick}
                onAddNote={handleAddNote}
                externalQuery={clarifyQuery}
            />
        </div>
    );
}

