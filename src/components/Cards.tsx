"use client";

import { motion } from "framer-motion";
import { ExternalLink, Zap } from "lucide-react";

interface ScriptCardProps {
    name: string;
    game: string;
    description: string;
    sourceLink: string;
    author?: {
        username: string;
        avatar_url: string;
    };
    views?: number;
    tags?: string[];
    onClick?: () => void;
}

export function ScriptCard({ name, game, description, sourceLink, author, views = 0, tags = [], onClick }: ScriptCardProps) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group transition-all duration-300 hover:border-accent-blue/50 h-full cursor-pointer"
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-hacker text-accent-blue uppercase tracking-widest">{game}</span>
                    <h3 className="text-xl font-bold group-hover:text-accent-blue transition-colors line-clamp-1">{name}</h3>
                </div>
                {author && (
                    <div className="flex items-center gap-2" title={`Uploaded by ${author.username}`}>
                        {author.avatar_url ? (
                            <img src={author.avatar_url} alt={author.username} className="w-8 h-8 rounded-full border border-white/10" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue border border-white/10">
                                {author.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5 text-white/50">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <p className="text-sm text-white/60 font-sans leading-relaxed flex-grow line-clamp-3">
                {description}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                    <span className="flex items-center gap-1">
                        👁️ {views.toLocaleString()}
                    </span>
                    {/* Placeholder for likes until implemented in parent */}
                    {/* <span className="flex items-center gap-1">❤️ 0</span> */}
                </div>
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-xs font-hacker uppercase tracking-widest group-hover:bg-accent-blue group-hover:text-white transition-all duration-300"
                >
                    View Script
                </div>
            </div>
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
