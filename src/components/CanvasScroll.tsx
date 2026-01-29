"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

interface CanvasScrollProps {
    folderPath: string;
    frameCount: number;
    className?: string;
}

export default function CanvasScroll({
    folderPath,
    frameCount,
    className = "",
}: CanvasScrollProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use framer-motion's useScroll to track progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Map progress to frame index
    const frameIndex = useTransform(smoothProgress, [0, 1], [1, frameCount]);

    // Preload images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Assuming 4-digit padded names like 0001.jpg
            const frameNum = i.toString().padStart(4, "0");
            img.src = `${folderPath}${frameNum}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    // All images loaded
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [folderPath, frameCount]);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const render = () => {
            const index = Math.floor(frameIndex.get());
            const img = images[index - 1] || images[0];

            if (img && img.complete) {
                // Clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Calculate aspect ratio fit (cover)
                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;

                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (canvasRatio > imgRatio) {
                    drawHeight = canvas.width / imgRatio;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgRatio;
                    offsetX = (canvas.width - drawWidth) / 2;
                }

                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        // Listen to frameIndex updates
        const unsubscribe = frameIndex.on("change", render);

        // Initial render
        render();

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className={`relative w-full h-[500vh] ${className}`}>
            <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
