"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, FileText, Send, Mic, Paperclip, User, StickyNote, Trash2, Plus } from "lucide-react";
import axios from "axios";
import type { PdfNote } from "./PdfViewer";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

interface RightSidebarProps {
    courseId: string;
    notes?: PdfNote[];
    onDeleteNote?: (noteId: string) => void;
    onNoteClick?: (note: PdfNote) => void;
    onAddNote?: (note: PdfNote) => void;
    externalQuery?: string | null;
}

export default function RightSidebar({ courseId, notes = [], onDeleteNote, onNoteClick, onAddNote, externalQuery }: RightSidebarProps) {
    const [activeTab, setActiveTab] = useState<"claire-ai" | "notepad">("claire-ai");
    const [isComposing, setIsComposing] = useState(false);
    const [composeText, setComposeText] = useState("");

    // -- Chat State --
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", role: "ai", content: "Hello! I'm Claire, your learning assistant. Ask me anything about this course." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (activeTab === "claire-ai") {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab]);

    // Auto-switch to notepad tab when a new note is added
    const prevNotesLength = useRef(notes.length);
    useEffect(() => {
        if (notes.length > prevNotesLength.current) {
            setActiveTab("notepad");
        }
        prevNotesLength.current = notes.length;
    }, [notes.length]);

    // Handle external queries (e.g. from Clarify button)
    const lastExternalQuery = useRef<string | null>(null);
    useEffect(() => {
        if (externalQuery && externalQuery !== lastExternalQuery.current) {
            lastExternalQuery.current = externalQuery;
            setActiveTab("claire-ai");
            // Strip uniqueness suffix
            const rawText = externalQuery.replace(/__\d+$/, "");
            // Send the clarify query
            const clarifyMessage = `Please explain this concept:\n\n"${rawText}"`;
            const userMessage: Message = { id: Date.now().toString(), role: "user", content: clarifyMessage };
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

            axios.post(`${API_BASE}/chat`, {
                query: clarifyMessage,
                course_id: courseId
            }).then((response) => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: response.data.answer
                };
                setMessages(prev => [...prev, aiMessage]);
            }).catch((error) => {
                console.error(error);
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "Sorry, I encountered an error connecting to the server."
                };
                setMessages(prev => [...prev, errorMessage]);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [externalQuery, courseId]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const response = await axios.post(`${API_BASE}/chat`, {
                query: userMessage.content,
                course_id: courseId
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: response.data.answer
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Sorry, I encountered an error connecting to the server."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex bg-slate-950 p-2 gap-2 border-b border-slate-800">
                <button
                    onClick={() => setActiveTab("notepad")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative ${activeTab === "notepad"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Notepad
                    {notes.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {notes.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("claire-ai")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "claire-ai"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                >
                    <Bot className="w-4 h-4" />
                    Claire AI
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-900"> {/* min-h-0 crucial for flex child scrolling */}

                {activeTab === "notepad" && (
                    <div className="flex-1 flex flex-col h-full">
                        {/* Add Note button / compose area */}
                        <div className="p-3 border-b border-slate-800">
                            {!isComposing ? (
                                <button
                                    onClick={() => setIsComposing(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Note
                                </button>
                            ) : (
                                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                                    <textarea
                                        autoFocus
                                        value={composeText}
                                        onChange={(e) => setComposeText(e.target.value)}
                                        placeholder="Write a note..."
                                        className="w-full h-20 bg-transparent text-slate-200 text-sm p-0 resize-none focus:outline-none placeholder-slate-500"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                if (composeText.trim()) {
                                                    onAddNote?.({
                                                        id: Date.now().toString(),
                                                        highlightedText: "",
                                                        noteText: composeText.trim(),
                                                        pageNumber: 0,
                                                        timestamp: Date.now(),
                                                    });
                                                    setComposeText("");
                                                    setIsComposing(false);
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => { setIsComposing(false); setComposeText(""); }}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (composeText.trim()) {
                                                    onAddNote?.({
                                                        id: Date.now().toString(),
                                                        highlightedText: "",
                                                        noteText: composeText.trim(),
                                                        pageNumber: 0,
                                                        timestamp: Date.now(),
                                                    });
                                                    setComposeText("");
                                                    setIsComposing(false);
                                                }
                                            }}
                                            disabled={!composeText.trim()}
                                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notes list */}
                        <div className="flex-1 overflow-y-auto">
                            {notes.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-16">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                                        <StickyNote className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">No notes yet</h3>
                                    <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
                                        Highlight text in the PDF or click Add Note above.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-3">
                                    {notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 hover:bg-slate-800 transition-colors group cursor-pointer"
                                            onClick={() => note.highlightedText ? onNoteClick?.(note) : undefined}
                                        >
                                            {/* Highlighted text reference (only if it has one) */}
                                            {note.highlightedText && (
                                                <div className="flex items-start gap-2 mb-2">
                                                    <div className="w-1 h-full min-h-[20px] bg-blue-500/80 rounded-full shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-blue-400/90 italic line-clamp-2 leading-relaxed">
                                                        &ldquo;{note.highlightedText}&rdquo;
                                                    </p>
                                                </div>
                                            )}

                                            {/* Note content */}
                                            <p className="text-sm text-slate-300 leading-relaxed mb-2 pl-3">
                                                {note.noteText}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pl-3">
                                                <span className="text-[10px] text-slate-500 font-medium">
                                                    {note.pageNumber > 0 ? `Page ${note.pageNumber} · ` : ""}{formatTime(note.timestamp)}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteNote?.(note.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                                                    title="Delete note"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "claire-ai" && (
                    <div className="flex flex-col h-full">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-blue-600" : "bg-slate-700"
                                        }`}>
                                        {msg.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
                                    </div>
                                    <div className={`p-3 text-sm rounded-2xl max-w-[85%] whitespace-pre-wrap ${msg.role === "ai"
                                        ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                                        : "bg-blue-600 text-white rounded-tr-none"
                                        }`}>
                                        {msg.content.replace(/\*/g, "")}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="p-3 text-sm rounded-2xl bg-slate-800 text-slate-400 rounded-tl-none border border-slate-700">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900">
                            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl focus-within:border-blue-500 transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask a question..."
                                    className="flex-1 bg-transparent border-none text-white text-sm placeholder-slate-500 focus:ring-0 px-3 py-3"
                                    disabled={isLoading}
                                />
                                <div className="flex items-center pr-2 gap-1">
                                    <button disabled={!input.trim()} onClick={sendMessage} className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors">
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
