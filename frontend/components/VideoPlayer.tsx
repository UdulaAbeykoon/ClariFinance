export default function VideoPlayer() {
    return (
        <div className="w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center relative shadow-lg group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            {/* Mock Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50 rounded-b-xl overflow-hidden">
                <div className="h-full w-1/3 bg-indigo-500" />
            </div>
        </div>
    );
}
