export default function PdfViewer() {
    return (
        <div className="bg-white text-slate-800 rounded-xl shadow-lg p-8 min-h-[400px] flex flex-col items-center border border-slate-200">
            <h2 className="text-2xl font-bold mb-2">Financial Modelling 101</h2>
            <p className="text-slate-500 mb-8 font-medium">By: Billy Wang @ Caprae Capital</p>

            <div className="w-full max-w-lg space-y-4 opacity-50">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-32 bg-slate-100 rounded w-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
                    PDF Content Placeholder
                </div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>
    );
}
