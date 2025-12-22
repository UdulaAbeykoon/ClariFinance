"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, FileText, Send, Mic, Paperclip, User } from "lucide-react";
import axios from "axios";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

interface RightSidebarProps {
    courseId: string;
}

export default function RightSidebar({ courseId }: RightSidebarProps) {
    const [activeTab, setActiveTab] = useState<"clare-ai" | "notepad">("notepad");

    // -- Chat State --
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", role: "ai", content: "Hello! I'm your ClariFi financial assistant. Ask me anything about this course." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (activeTab === "clare-ai") {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/chat", {
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

    return (
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex bg-slate-950 p-2 gap-2 border-b border-slate-800">
                <button
                    onClick={() => setActiveTab("notepad")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "notepad"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Notepad
                </button>
                <button
                    onClick={() => setActiveTab("clare-ai")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "clare-ai"
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                >
                    <Bot className="w-4 h-4" />
                    Clare AI
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-900"> {/* min-h-0 crucial for flex child scrolling */}

                {activeTab === "notepad" && (
                    <div className="flex-1 flex flex-col p-4 h-full">
                        <textarea
                            className="w-full h-full bg-slate-800/50 text-slate-300 p-4 rounded-xl border border-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-600"
                            placeholder="Take notes here..."
                        ></textarea>
                    </div>
                )}

                {activeTab === "clare-ai" && (
                    <div className="flex flex-col h-full">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-indigo-600" : "bg-slate-700"
                                        }`}>
                                        {msg.role === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
                                    </div>
                                    <div className={`p-3 text-sm rounded-2xl max-w-[85%] ${msg.role === "ai"
                                            ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                                            : "bg-indigo-600 text-white rounded-tr-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
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
                            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl focus-within:border-indigo-500 transition-colors">
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
                                    <button disabled={!input.trim()} onClick={sendMessage} className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors">
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
