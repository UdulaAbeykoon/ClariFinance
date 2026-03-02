"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────
   Scroll‑in animation hook (IntersectionObserver)
   ──────────────────────────────────────────────── */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("revealed");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ────────────────────────────────────
   Section 1 – Concepts that click
   ──────────────────────────────────── */
function ConceptsSection() {
    const ref = useReveal();
    return (
        <section className="landing-section section-concepts" ref={ref}>
            <div className="section-inner">
                {/* Left – stacked visual cards */}
                <div className="concepts-visuals">
                    <div className="concept-card concept-card-back">
                        <div className="concept-chart">
                            {/* Simple SVG line chart */}
                            <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polyline
                                    points="10,80 40,60 70,70 100,30 130,45 160,20 190,10"
                                    stroke="#3654ff"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polyline
                                    points="10,80 40,60 70,70 100,30 130,45 160,20 190,10"
                                    stroke="none"
                                    fill="url(#chartGrad)"
                                    opacity="0.15"
                                />
                                <defs>
                                    <linearGradient id="chartGrad" x1="100" y1="10" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#3654ff" />
                                        <stop offset="1" stopColor="#3654ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="chart-label">Revenue Growth</span>
                        </div>
                    </div>
                    <div className="concept-card concept-card-mid">
                        <div className="concept-code">
                            <div className="code-header">
                                <span className="dot red" />
                                <span className="dot yellow" />
                                <span className="dot green" />
                                <span className="code-title">DCF Model</span>
                            </div>
                            <pre className="code-body">
                                {`FCF  = EBIT × (1 - t) + D&A
       - CapEx - ΔNWC

Enterprise Value
  = Σ FCFₜ / (1+WACC)ᵗ
  + Terminal Value`}
                            </pre>
                        </div>
                    </div>
                    <div className="concept-card concept-card-front">
                        <div className="concept-matrix">
                            <span className="matrix-title">Multiply (EV × Multiple)</span>
                            <div className="matrix-grid">
                                <div className="matrix-cell header">EV/EBITDA</div>
                                <div className="matrix-cell header">8×</div>
                                <div className="matrix-cell header">10×</div>
                                <div className="matrix-cell">EBITDA</div>
                                <div className="matrix-cell accent">$40M</div>
                                <div className="matrix-cell accent">$50M</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right – text */}
                <div className="section-text">
                    <h2 className="section-heading">
                        Concepts<br />that <span className="blue">click</span>
                    </h2>
                    <p className="section-description">
                        Structured, interactive lessons make advanced financial concepts easy to grasp. Real-time intelligent feedback keeps you on track, while your AI financial assistant provides instant, on-demand clarification whenever you need it.
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────
   Section 2 – Personalized learning
   ──────────────────────────────────── */
const topics = [
    { name: "Financial\nStatements", color: "#ff6b6b", done: true },
    { name: "Valuation\nMethods", color: "#ffa94d", done: true },
    { name: "DCF\nAnalysis", color: "#3654ff", done: true },
    { name: "LBO\nModelling", color: "#845ef7", done: false },
    { name: "Accounting\nBasics", color: "#20c997", done: true },
    { name: "Excel\nModelling", color: "#3654ff", done: true },
    { name: "M&A\nProcess", color: "#ff6b6b", done: false },
    { name: "Comparable\nAnalysis", color: "#ffa94d", done: true },
    { name: "Debt &\nEquity", color: "#845ef7", done: true },
    { name: "Enterprise\nValue", color: "#20c997", done: true },
    { name: "Revenue\nModelling", color: "#3654ff", done: false },
    { name: "Pitch\nBooks", color: "#ff6b6b", done: false },
    { name: "WACC", color: "#ffa94d", done: true },
    { name: "Merger\nModel", color: "#845ef7", done: false },
    { name: "Terminal\nValue", color: "#20c997", done: true },
];

function PersonalizedSection() {
    const ref = useReveal();
    return (
        <section className="landing-section section-personalized" ref={ref}>
            <div className="section-inner reverse">
                {/* Left – text */}
                <div className="section-text">
                    <h2 className="section-heading">
                        Personalized<br /><span className="blue">learning</span>
                    </h2>
                    <p className="section-description">
                        ClariFi tracks the concepts you&apos;ve mastered, designs practice
                        sets based on your progress, and adapts to your pace.
                    </p>
                </div>

                {/* Right – topic cloud */}
                <div className="topic-cloud">
                    {topics.map((t, i) => (
                        <div
                            key={i}
                            className={`topic-chip ${t.done ? "done" : ""}`}
                            style={{ "--chip-color": t.color } as React.CSSProperties}
                        >
                            <span className="chip-bar" />
                            <span className="chip-label">{t.name}</span>
                            {t.done && (
                                <span className="chip-check">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7l3 3 5-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────
   Section 3 – Guided lessons
   ──────────────────────────────────── */
function GuidedSection() {
    const ref = useReveal();
    return (
        <section className="landing-section section-guided" ref={ref}>
            <div className="section-inner">
                {/* Left – text */}
                <div className="section-text">
                    <h2 className="section-heading">
                        Guided<br /><span className="blue">lessons</span>
                    </h2>
                    <p className="section-description">
                        See your improvement in real time and develop stronger financial
                        problem-solving skills step by step.
                    </p>
                </div>
                {/* Right – Animated winding path */}
                <div className="guided-visual path-visual">
                    <svg className="winding-path" viewBox="0 0 520 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="pathGrad" x1="0" y1="0" x2="500" y2="300" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#3654ff" />
                                <stop offset="50%" stopColor="#5c7cfa" />
                                <stop offset="100%" stopColor="#20c997" />
                            </linearGradient>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1 L 10 5 L 0 9 z" fill="#20c997" />
                            </marker>
                            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Base shadow/glow track */}
                        <path d="M 30 80 C 250 80 150 250 320 250 C 400 250 420 180 470 180" stroke="rgba(54,84,255,0.15)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Animated winding colored path */}
                        <path className="path-line" d="M 30 80 C 250 80 150 250 320 250 C 400 250 420 180 470 180" stroke="url(#pathGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Moving dashed line overlay */}
                        <path className="path-animated-dash" d="M 30 80 C 250 80 150 250 320 250 C 400 250 420 180 470 180" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 20" opacity="0.6" />

                        {/* Nodes (checkpoints) along the path */}
                        <g transform="translate(30, 80)">
                            <g className="path-node path-node-1">
                                <circle cx="0" cy="0" r="14" fill="#fff" stroke="#3654ff" strokeWidth="4" />
                                <path d="M -4 -0.5 L -1 2.5 L 5 -3.5" stroke="#3654ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </g>

                        <g transform="translate(196, 161)">
                            <g className="path-node path-node-2">
                                <circle cx="0" cy="0" r="14" fill="#fff" stroke="#5c7cfa" strokeWidth="4" />
                                <path d="M -4 -0.5 L -1 2.5 L 5 -3.5" stroke="#5c7cfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </g>

                        <g transform="translate(320, 250)">
                            <g className="path-node path-node-3">
                                <circle cx="0" cy="0" r="14" fill="#fff" stroke="#489ff6" strokeWidth="4" />
                                <path d="M -4 -0.5 L -1 2.5 L 5 -3.5" stroke="#489ff6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </g>

                        <g transform="translate(470, 180)">
                            <g className="path-node pulse path-node-4">
                                <circle cx="0" cy="0" r="16" fill="#fff" stroke="#20c997" strokeWidth="4" filter="url(#glow)" />
                                <circle cx="0" cy="0" r="6" fill="#20c997" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────
   Section 4 – Stay motivated
   ──────────────────────────────────── */
function MotivatedSection() {
    const ref = useReveal();
    const days = ["M", "T", "W"];
    return (
        <section className="landing-section section-motivated" ref={ref}>
            <div className="section-inner reverse">
                {/* Left – text */}
                <div className="section-text">
                    <h2 className="section-heading">
                        Stay<br /><span className="blue">motivated</span>
                    </h2>
                    <p className="section-description">
                        Finish every day smarter with engaging lessons, competitive features,
                        and daily encouragement.
                    </p>
                </div>

                {/* Right – streak visual */}
                <div className="streak-visual">

                    <div className="streak-days">
                        {days.map((d, i) => (
                            <div key={d} className="flex flex-col items-center gap-[10px] group" style={{ "--day-i": i } as React.CSSProperties}>
                                <div
                                    className="w-[60px] rounded-[50px] flex items-start justify-center pt-[12px] transition-transform duration-300 group-hover:-translate-y-[5px]"
                                    style={{
                                        height: 'calc(60px + var(--day-i, 0) * 16px)',
                                        background: 'linear-gradient(180deg, #dce6ff 0%, #b3caff 50%, rgba(179, 202, 255, 0.4) 100%)'
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1a2e" className="mt-[2px]">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" />
                                    </svg>
                                </div>
                                <span className="text-[0.9rem] font-bold text-[#555]">{d}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────
   Export combined component
   ──────────────────────────────────── */
export default function LandingSections() {
    return (
        <>
            <ConceptsSection />
            <GuidedSection />
            <MotivatedSection />
        </>
    );
}
