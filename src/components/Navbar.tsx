"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { name: "Home", href: "#home" },
    { name: "Scripts", href: "#scripts" },
    { name: "Executors", href: "#executors" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/10" : "py-8 bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-3">
                    <Terminal className="w-8 h-8 text-accent-blue" />
                    <span className="font-hacker text-xl font-bold tracking-tighter text-glow-blue">
                        X_ExpoilT_HuB
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-hacker uppercase tracking-widest text-white/70 hover:text-accent-blue hover:text-glow-blue transition-all duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#scripts"
                        className="px-6 py-2 bg-accent-blue/20 border border-accent-blue/50 rounded-full text-xs font-hacker uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    >
                        Get Started
                    </a>
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
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-xl font-hacker uppercase tracking-widest text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
