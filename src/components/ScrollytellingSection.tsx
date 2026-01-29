"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CanvasScroll from "./CanvasScroll";

interface ScrollytellingSectionProps {
    id: string;
    folderPath: string;
    frameCount: number;
    title: string;
    subtitle?: string;
    children: ReactNode;
    accentColor?: "blue" | "purple";
}

export default function ScrollytellingSection({
    id,
    folderPath,
    frameCount,
    title,
    subtitle,
    children,
    accentColor = "blue",
}: ScrollytellingSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Title text fades in and out during the scroll
    // Phase 1: Animation (0 to 0.8 progress)
    // Phase 2: Content (0.8 to 1.0 progress) -> though content usually comes after.

    // Wait, the CanvasScroll is h-[500vh]. I should make the title appear in the middle of that.
    const titleOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.85], [0, 1, 1, 0]);
    const titleScale = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.85], [1.1, 1, 1, 0.9]);

    const glowClass = accentColor === "blue" ? "text-glow-blue" : "text-glow-purple";

    return (
        <section id={id} ref={containerRef} className="relative">
            {/* Animation Phase */}
            <div className="relative h-[500vh]">
                <CanvasScroll folderPath={folderPath} frameCount={frameCount} />

                {/* Centered Overlay Text during Animation */}
                <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-6 text-center">
                    <motion.div
                        style={{ opacity: titleOpacity, scale: titleScale }}
                        className="flex flex-col items-center gap-4"
                    >
                        <h2 className={`hacker-title ${glowClass}`}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-xl md:text-2xl font-sans font-light tracking-widest text-white/70 max-w-2xl">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Content Phase - Revealed after animation */}
            <div className="relative z-20 bg-dark-bg py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </section>
    );
}
