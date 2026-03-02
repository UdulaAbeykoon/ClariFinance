"use client";

import { useEffect, useState } from "react";

interface MoneyEmoji {
    id: number;
    emoji: string;
    left: number;      // % from left
    delay: number;      // animation delay in s
    duration: number;   // fall duration in s
    size: number;       // font size in px
    rotation: number;   // initial rotation
    swayAmount: number; // horizontal sway
}

export default function FallingMoney() {
    const [emojis, setEmojis] = useState<MoneyEmoji[]>([]);

    useEffect(() => {
        const moneyEmojis = ["💸", "💵"];
        const generated: MoneyEmoji[] = [];
        const count = 25;

        for (let i = 0; i < count; i++) {
            // Spread evenly across full width with slight random offset
            const baseLeft = (i / count) * 100;
            const jitter = (Math.random() - 0.5) * (100 / count);
            generated.push({
                id: i,
                emoji: moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)],
                left: Math.max(0, Math.min(98, baseLeft + jitter)),
                delay: Math.random() * 8,
                duration: 6 + Math.random() * 8,
                size: 16 + Math.random() * 20,
                rotation: Math.random() * 360,
                swayAmount: -30 + Math.random() * 60,
            });
        }

        setEmojis(generated);
    }, []);

    return (
        <>
            <style>{`
                @keyframes moneyFall {
                    0% {
                        transform: translateY(-100%) rotate(var(--rot)) translateX(0px);
                        opacity: 0;
                    }
                    5% {
                        opacity: var(--peak-opacity);
                    }
                    50% {
                        translateX: var(--sway);
                    }
                    95% {
                        opacity: var(--peak-opacity);
                    }
                    100% {
                        transform: translateY(calc(100vh + 50px)) rotate(calc(var(--rot) + 360deg)) translateX(var(--sway));
                        opacity: 0;
                    }
                }
            `}</style>
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {emojis.map((e) => {
                    // Normalize size: 0 = smallest (16px), 1 = largest (36px)
                    const sizeNorm = (e.size - 16) / 20;
                    // Bigger = sharper, more saturated, more opaque (foreground)
                    // Smaller = blurry, desaturated, more transparent (background)
                    const blur = (1 - sizeNorm) * 2.5;        // 0–2.5px blur
                    const saturate = 0.3 + sizeNorm * 0.7;     // 0.3–1.0 saturation
                    const peakOpacity = 0.2 + sizeNorm * 0.25; // 0.2–0.45 opacity

                    return (
                        <div
                            key={e.id}
                            style={{
                                position: "absolute",
                                left: `${e.left}%`,
                                top: "-40px",
                                fontSize: `${e.size}px`,
                                // @ts-ignore
                                "--rot": `${e.rotation}deg`,
                                "--sway": `${e.swayAmount}px`,
                                "--peak-opacity": peakOpacity,
                                animation: `moneyFall ${e.duration}s ${e.delay}s linear infinite`,
                                opacity: 0,
                                filter: `blur(${blur}px) saturate(${saturate})`,
                            } as React.CSSProperties}
                        >
                            {e.emoji}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
