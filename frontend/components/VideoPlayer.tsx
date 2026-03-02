interface VideoPlayerProps {
    courseId?: string;
}

export default function VideoPlayer({ courseId }: VideoPlayerProps) {
    const youtubeMap: Record<string, string> = {
        "c1": "6kpQPxkAjw8",
        "c2": "mwfgxp62j7s",
        "c3": "5zba1fZc3zA",
        "c4": "wrqGGqbjCSk",
        "c5": "NOcjBq86tNk",
        "c6": "idMorcTjKQk",
    };

    const youtubeId = courseId ? youtubeMap[courseId] : undefined;

    if (youtubeId) {
        return (
            <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700 relative pointer-events-auto">
                {/* 
                  YouTube deprecated `showinfo=0`. The ONLY way to entirely hide the title/share 
                  overlay is to physically enlarge and clip off the top 60px of the iframe via CSS.
                */}
                <div className="absolute top-[-60px] left-0 right-0 bottom-0 pointer-events-auto">
                    <iframe
                        className="w-full h-full object-cover"
                        style={{ height: "calc(100% + 60px)" }}
                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&controls=1`}
                        title="ClariFi Course Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        );
    }

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
                <div className="h-full w-1/3 bg-blue-500" />
            </div>
        </div>
    );
}
