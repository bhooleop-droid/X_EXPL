"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV_LINKS = [
    { name: "Home", href: "/#home" },
    { name: "Scripts", href: "/#scripts" },
    { name: "Executors", href: "/#executors" },
];

import UploadScriptModal from "./UploadScriptModal";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/10" : "py-8 bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/#home" className="flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-accent-blue" />
                        <span className="font-hacker text-xl font-bold tracking-tighter text-glow-blue">
                            X_ExpoilT_HuB
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-hacker uppercase tracking-widest text-white/70 hover:text-accent-blue hover:text-glow-blue transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="text-sm font-hacker uppercase tracking-widest text-accent-cyan hover:text-white transition-all duration-200"
                        >
                            + Upload
                        </button>

                        {user && (
                            <Link
                                href={`/profile?user_id=${user.id}`}
                                className="text-sm font-hacker uppercase tracking-widest text-white/70 hover:text-accent-purple transition-all duration-200"
                            >
                                My Profile
                            </Link>
                        )}

                        <div className="h-6 w-[1px] bg-white/10 mx-2" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-hacker uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 transition-all duration-300"
                        >
                            <LogOut className="w-3 h-3" />
                            Log Out
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 flex flex-col items-center py-10 gap-8 z-40"
                        >
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl font-hacker uppercase tracking-widest text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsUploadModalOpen(true);
                                }}
                                className="text-xl font-hacker uppercase tracking-widest text-accent-cyan"
                            >
                                + Upload Script
                            </button>

                            {user && (
                                <Link
                                    href={`/profile?user_id=${user.id}`}
                                    className="text-xl font-hacker uppercase tracking-widest text-accent-purple"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 py-4 text-red-500 font-hacker uppercase tracking-[0.2em] text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <UploadScriptModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </>
    );
}
