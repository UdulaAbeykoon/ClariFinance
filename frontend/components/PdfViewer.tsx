"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { setCourseProgress } from "@/lib/courseProgress";
import { StickyNote, Sparkles } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PdfNote {
    id: string;
    highlightedText: string;
    noteText: string;
    pageNumber: number;
    timestamp: number;
}

interface PdfViewerProps {
    courseId: string;
    onProgressChange?: (progress: number) => void;
    onAddNote?: (note: PdfNote) => void;
    onClarify?: (text: string) => void;
}

export default function PdfViewer({ courseId, onProgressChange, onAddNote, onClarify }: PdfViewerProps) {
    const pdfUrl = `/guides/${courseId}.pdf`;
    const [numPages, setNumPages] = useState<number>(0);
    const maxViewedPage = useRef<number>(0);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const onProgressRef = useRef(onProgressChange);
    const containerRef = useRef<HTMLDivElement>(null);

    // Selection popup state
    const [selectionPopup, setSelectionPopup] = useState<{
        visible: boolean;
        x: number;
        y: number;
        text: string;
        pageNumber: number;
    }>({ visible: false, x: 0, y: 0, text: "", pageNumber: 1 });

    const [noteInput, setNoteInput] = useState<{ visible: boolean; text: string }>({
        visible: false,
        text: "",
    });

    // Keep callback ref up-to-date without triggering re-renders
    useEffect(() => {
        onProgressRef.current = onProgressChange;
    }, [onProgressChange]);

    function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
        setNumPages(n);
        maxViewedPage.current = 0;
    }

    // Create one IntersectionObserver that lives for the component's lifetime
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                let changed = false;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const pageNum = parseInt(
                            (entry.target as HTMLElement).dataset.page || "0",
                            10
                        );
                        if (pageNum > maxViewedPage.current) {
                            maxViewedPage.current = pageNum;
                            changed = true;
                        }
                    }
                });

                if (changed && numPages > 0) {
                    const calculatedProgress = numPages > 1
                        ? Math.round(((maxViewedPage.current - 1) / (numPages - 1)) * 100)
                        : 100;
                    const actualProgress = setCourseProgress(courseId, calculatedProgress);
                    onProgressRef.current?.(actualProgress);
                }
            },
            { threshold: 0.1 } // 10% visible = page is "viewed"
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, [numPages, courseId]);

    // Callback ref: observe each page div as it mounts
    const observePage = useCallback(
        (el: HTMLDivElement | null) => {
            if (el && observerRef.current) {
                observerRef.current.observe(el);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [numPages] // re-create callback when numPages changes (new observer)
    );

    // Handle text selection inside the PDF container
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseUp = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                return;
            }

            const selectedText = selection.toString().trim();
            if (selectedText.length < 2) return;

            // Find which page the selection is in
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Figure out which page div the selection belongs to
            let pageNumber = 1;
            const anchorNode = selection.anchorNode;
            if (anchorNode) {
                let el: HTMLElement | null = anchorNode instanceof HTMLElement ? anchorNode : anchorNode.parentElement;
                while (el && el !== container) {
                    if (el.dataset.page) {
                        pageNumber = parseInt(el.dataset.page, 10);
                        break;
                    }
                    el = el.parentElement;
                }
            }

            setSelectionPopup({
                visible: true,
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top - containerRect.top - 10,
                text: selectedText,
                pageNumber,
            });
            setNoteInput({ visible: false, text: "" });
        };

        const handleMouseDown = (e: MouseEvent) => {
            // Close popup when clicking outside of it
            const target = e.target as HTMLElement;
            if (!target.closest(".pdf-note-popup")) {
                setSelectionPopup((prev) => ({ ...prev, visible: false }));
                setNoteInput({ visible: false, text: "" });
            }
        };

        container.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            container.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    const handleAddNote = () => {
        if (!noteInput.text.trim()) return;

        const note: PdfNote = {
            id: Date.now().toString(),
            highlightedText: selectionPopup.text,
            noteText: noteInput.text.trim(),
            pageNumber: selectionPopup.pageNumber,
            timestamp: Date.now(),
        };

        onAddNote?.(note);
        setSelectionPopup((prev) => ({ ...prev, visible: false }));
        setNoteInput({ visible: false, text: "" });
        window.getSelection()?.removeAllRanges();
    };

    return (
        <>
            <style>{`
                .react-pdf__Page .annotationLayer a:hover,
                .react-pdf__Page .annotationLayer .linkAnnotation:hover > a,
                .react-pdf__Page .annotationLayer .linkAnnotation > a:hover {
                    background-color: rgba(59, 130, 246, 0.35) !important;
                    box-shadow: none !important;
                }
                .react-pdf__Page .annotationLayer .linkAnnotation > a {
                    background-color: transparent !important;
                }
                .pdf-note-popup {
                    position: absolute;
                    z-index: 50;
                    transform: translate(-50%, -100%);
                    animation: popupFadeIn 0.15s ease-out;
                }
                @keyframes popupFadeIn {
                    from { opacity: 0; transform: translate(-50%, -100%) scale(0.9); }
                    to   { opacity: 1; transform: translate(-50%, -100%) scale(1); }
                }
            `}</style>
            <div
                ref={containerRef}
                className="bg-white text-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 relative"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                        padding: "32px 0",
                        background: "#f1f5f9",
                    }}
                >
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                                Loading document...
                            </div>
                        }
                        error={
                            <div style={{ padding: 40, textAlign: "center", color: "#991b1b" }}>
                                Failed to load PDF. Please try again.
                            </div>
                        }
                    >
                        {Array.from({ length: numPages }, (_, i) => (
                            <div
                                key={`page_${i + 1}`}
                                ref={observePage}
                                data-page={i + 1}
                                style={{
                                    marginBottom: i < numPages - 1 ? 24 : 0,
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                }}
                            >
                                <Page
                                    pageNumber={i + 1}
                                    width={760}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </div>
                        ))}
                    </Document>
                </div>

                {/* Selection Popup */}
                {selectionPopup.visible && (
                    <div
                        className="pdf-note-popup"
                        style={{ left: selectionPopup.x, top: selectionPopup.y }}
                    >
                        {!noteInput.visible ? (
                            <div className="flex items-center gap-1 bg-slate-900 rounded-lg shadow-xl border border-slate-700 p-1">
                                <button
                                    onClick={() => setNoteInput({ visible: true, text: "" })}
                                    className="flex items-center gap-1.5 px-3 py-2 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                                >
                                    <StickyNote className="w-3.5 h-3.5" />
                                    Add Note
                                </button>
                                <div className="w-px h-5 bg-slate-700" />
                                <button
                                    onClick={() => {
                                        onClarify?.(selectionPopup.text);
                                        setSelectionPopup((prev) => ({ ...prev, visible: false }));
                                        window.getSelection()?.removeAllRanges();
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-blue-400 text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Clarify
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-3 w-72">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                    Highlighted text
                                </div>
                                <div className="text-xs text-slate-600 bg-yellow-50 border border-yellow-200 rounded-lg px-2.5 py-1.5 mb-3 line-clamp-2 italic">
                                    &ldquo;{selectionPopup.text.length > 80 ? selectionPopup.text.slice(0, 80) + "…" : selectionPopup.text}&rdquo;
                                </div>
                                <textarea
                                    autoFocus
                                    value={noteInput.text}
                                    onChange={(e) => setNoteInput((prev) => ({ ...prev, text: e.target.value }))}
                                    placeholder="Write your note..."
                                    className="w-full h-20 bg-slate-50 text-slate-800 text-sm p-2.5 rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-400"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectionPopup((prev) => ({ ...prev, visible: false }));
                                            setNoteInput({ visible: false, text: "" });
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!noteInput.text.trim()}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
