"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Disc as Discord, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-accent-blue" />
                </motion.div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="fixed inset-0 bg-black z-[99] overflow-hidden flex flex-col items-center justify-center p-6">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center gap-10 max-w-md w-full"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-glow-blue">
                            <Terminal className="w-10 h-10" />
                        </div>
                        <h1 className="hacker-title text-4xl text-center">X_ExpoilT_HuB</h1>
                        <p className="text-white/50 text-center font-sans">
                            Authentication required. Please sign in with Discord to access the script library and executors.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-4 py-5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-2xl font-hacker uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_0_30px_rgba(88,101,242,0.3)] hover:shadow-[0_0_50px_rgba(88,101,242,0.5)] active:scale-95 group"
                    >
                        <Discord className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Sign in with Discord
                    </button>

                    <div className="flex items-center gap-2 text-[10px] font-hacker text-white/20 uppercase tracking-[0.2em]">
                        <span className="w-8 h-[1px] bg-white/10" />
                        Secure Authentication
                        <span className="w-8 h-[1px] bg-white/10" />
                    </div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
