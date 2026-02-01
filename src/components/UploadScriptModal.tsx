"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Code, Monitor, Type, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UploadScriptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UploadScriptModal({ isOpen, onClose }: UploadScriptModalProps) {
    const [title, setTitle] = useState("");
    const [gameName, setGameName] = useState("");
    const [scriptCode, setScriptCode] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Ensure user exists in public.users to satisfy FK constraint
            const { error: userError } = await supabase.from('users').upsert({
                id: user.id,
                discord_id: user.user_metadata.provider_id,
                username: user.user_metadata.full_name || user.user_metadata.name || user.email,
                avatar_url: user.user_metadata.avatar_url,
                email: user.email
            }, { onConflict: 'id' });

            if (userError) {
                console.error("User profile sync error:", userError);
                throw new Error(`Profile Sync Failed: ${userError.message}`);
            }

            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

            const { error } = await supabase.from("scripts").insert({
                user_id: user.id,
                title,
                game_name: gameName,
                script_code: scriptCode,
                tags: tagsArray,
            });

            if (error) throw error;

            setStatus("success");
            setMessage("Script uploaded successfully!");
            setTimeout(() => {
                onClose();
                setStatus("idle");
                setMessage("");
                setTagsInput("");
                setTitle("");
                setGameName("");
                setScriptCode("");
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setMessage(err.message || "Failed to upload script");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a12] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(75,85,255,0.1)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-hacker text-white">Upload Script</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-hacker text-white/60 uppercase tracking-widest">
                                    <Type className="w-3 h-3" /> Script Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Blox Fruits Auto Farm"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-hacker text-white/60 uppercase tracking-widest">
                                    <Type className="w-3 h-3" /> Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="e.g. PVP, Farming, Auto"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-hacker text-white/60 uppercase tracking-widest">
                                    <Monitor className="w-3 h-3" /> Game Name
                                </label>
                                <input
                                    type="text"
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                    placeholder="e.g. Roblox"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-hacker text-white/60 uppercase tracking-widest">
                                    <Code className="w-3 h-3" /> Script Code
                                </label>
                                <textarea
                                    value={scriptCode}
                                    onChange={(e) => setScriptCode(e.target.value)}
                                    placeholder="paste your lua code here..."
                                    required
                                    rows={6}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 focus:bg-white/10 transition-all resize-none"
                                />
                            </div>

                            {/* Status Messages */}
                            <AnimatePresence mode="wait">
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {message}
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-accent-blue hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-hacker uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(75,85,255,0.3)] hover:shadow-[0_0_30px_rgba(75,85,255,0.5)]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Publish Script
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
