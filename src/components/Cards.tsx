"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap } from "lucide-react";

interface ScriptCardProps {
    name: string;
    game: string;
    description: string;
    sourceLink: string;
}

export function ScriptCard({ name, game, description, sourceLink }: ScriptCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group transition-all duration-300 hover:border-accent-blue/50"
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-hacker text-accent-blue uppercase tracking-widest">{game}</span>
                    <h3 className="text-xl font-bold group-hover:text-accent-blue transition-colors">{name}</h3>
                </div>
                <Zap className="w-5 h-5 text-accent-blue opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-white/60 font-sans leading-relaxed flex-grow">
                {description}
            </p>
            <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-xs font-hacker uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-black"
            >
                View Source <ExternalLink className="w-3 h-3" />
            </a>
        </motion.div>
    );
}

interface ExecutorCardProps {
    name: string;
    logo: string;
    description: string;
    officialLink: string;
}

export function ExecutorCard({ name, logo, description, officialLink }: ExecutorCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center gap-6 group transition-all duration-300 hover:border-accent-purple/50"
        >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center border border-white/10 group-hover:border-accent-purple/50 transition-colors">
                <span className="text-4xl font-hacker text-white/80">{logo}</span>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black tracking-tight group-hover:text-accent-purple transition-colors">{name}</h3>
                <p className="text-sm text-white/50 font-sans max-w-xs">
                    {description}
                </p>
            </div>
            <a
                href={officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 text-sm font-hacker uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-black"
            >
                Official Website
            </a>
        </motion.div>
    );
}
