"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import VideoPlayer from "@/components/VideoPlayer";
import PdfViewer from "@/components/PdfViewer";

export default function ChatPage() {
    const params = useParams();
    const courseId = params.courseId as string;

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
                            {/* Optional Breadcrumbs/Title if needed */}
                            <h1 className="text-2xl font-bold text-slate-800">Financial Modelling</h1>
                            <p className="text-sm text-slate-500">Module 1.2: Discounted Cash Flow (DCF)</p>
                        </div>
                        {/* Progress bar placeholder */}
                        <div className="w-64">
                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                <span>Course Progress</span>
                                <span>35%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[35%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Video Section */}
                    <section>
                        <VideoPlayer />
                    </section>

                    {/* PDF / Content Section */}
                    <section>
                        <PdfViewer />
                    </section>
                </main>
            </div>

            {/* Right Sidebar (AI & Notes) */}
            <RightSidebar courseId={courseId} />
        </div>
    );
}
