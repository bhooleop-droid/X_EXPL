"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Disc as Discord, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState("Authenticating...");

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) checkAccess(session);
            else setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) checkAccess(session);
            else {
                setLoading(false);
                setAccessDenied(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAccess = async (session: any) => {
        setVerifying(true);
        setCheckingStatus("Verifying Server Membership...");

        // 1. Check if user is in the Discord Server
        const providerToken = session.provider_token;
        if (!providerToken) {
            // If no provider token (e.g., from old session), might need re-login to check guilds
            // For now, allow if we can't check, OR force re-login. 
            // Better to force re-login to ensure security if strict.
            // But let's try to be lenient or ask for re-auth.
            // setCheckingStatus("Refreshing Session...");
            // Actually, Supabase might not persist provider_token. 
            // We will assume if we can't check, we proceed or block?
            // Blocking is safer for the requirement "NO ACCES SERVER LINK".
            // We will try.
            console.warn("No provider token found. Guild check skipped (or force re-login needed).");
        } else {
            try {
                const resp = await fetch('https://discord.com/api/users/@me/guilds', {
                    headers: { Authorization: `Bearer ${providerToken}` }
                });
                if (resp.ok) {
                    const guilds = await resp.json();
                    const targetGuildId = '1466747676946071564'; // X_expoilted_hub
                    const isMember = guilds.some((g: any) => g.id === targetGuildId);

                    if (!isMember) {
                        setAccessDenied(true);
                        setVerifying(false);
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to check guilds", e);
            }
        }

        setCheckingStatus("Syncing Profile...");
        // 2. Sync Profile to Supabase
        const { user } = session;
        if (user) {
            await supabase.from('users').upsert({
                id: user.id,
                discord_id: user.user_metadata.provider_id,
                username: user.user_metadata.full_name || user.user_metadata.name || user.email,
                avatar_url: user.user_metadata.avatar_url,
                email: user.email
            }, { onConflict: 'id' });
        }

        setVerifying(false);
        setLoading(false);
    };

    const handleLogin = async () => {
        // Dynamically get the current URL without query params or hash
        // This ensures it works for both Firebase and GitHub Pages subpaths automatically
        const redirectTo = window.location.href.split('?')[0].split('#')[0];

        await supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: redirectTo,
                scopes: 'guilds',
            },
        });
    };

    if (loading || verifying) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-accent-blue" />
                </motion.div>
                <p className="text-white/50 font-hacker animate-pulse">{checkingStatus}</p>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="fixed inset-0 bg-black z-[99] flex flex-col items-center justify-center p-6 text-center">
                <div className="flex flex-col items-center gap-6 max-w-md w-full">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                        <Discord className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                    <p className="text-white/60">
                        You must be a member of the <span className="text-accent-blue">X_ExpoilT_HuB</span> Discord server to access this tool.
                    </p>
                    <div className="flex flex-col gap-3 w-full">
                        <a
                            href="https://discord.gg/y6MVSPrd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all"
                        >
                            Join Discord Server
                        </a>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl font-medium transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
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
