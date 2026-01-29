"use client";

import Navbar from "@/components/Navbar";
import ScrollytellingSection from "@/components/ScrollytellingSection";
import { ScriptCard, ExecutorCard } from "@/components/Cards";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const SCRIPTS = [
  {
    name: "Infinite Yield",
    game: "Universal",
    description: "The most popular admin script with hundreds of commands for every game.",
    sourceLink: "https://github.com/EdgeIY/infiniteyield",
  },
  {
    name: "V.G Hub",
    game: "Multi-Game",
    description: "Feature-rich hub supporting over 100+ popular games with auto-farm and ESP.",
    sourceLink: "https://github.com/1201ncomp/V.G-Hub",
  },
  {
    name: "OwlHub",
    game: "FPS Games",
    description: "Unmatched performance for shooting games with silent aim and velocity tracking.",
    sourceLink: "https://github.com/CriShoux/OwlHub",
  },
  {
    name: "Ez Hub",
    game: "Blox Fruits",
    description: "Optimized for Blox Fruits with fastest auto-farm and quest completion.",
    sourceLink: "https://github.com/debug1111/EzHub",
  },
];

const EXECUTORS = [
  {
    name: "Delta",
    logo: "Δ",
    description: "Lightning-fast execution with a sleek mobile and desktop interface.",
    officialLink: "https://delta-executor.com",
  },
  {
    name: "Codex",
    logo: "CX",
    description: "The industry standard for stability and high script compatibility.",
    officialLink: "https://codex.lol",
  },
  {
    name: "Arceus X",
    logo: "AX",
    description: "Feature-packed executor with a powerful built-in script hub.",
    officialLink: "https://spdmteam.com",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <ScrollytellingSection
        id="home"
        folderPath="/vids/home_intro/"
        frameCount={145}
        title="X_ExpoilT_HuB"
        subtitle="Unleash the full potential of your gameplay with verified scripts."
        accentColor="blue"
      >
        <div className="flex flex-col items-center gap-12 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black">Ready to Begin?</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Explore our curated collection of high-performance scripts and industry-leading executors.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            <a
              href="#scripts"
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-accent-blue rounded-full font-hacker uppercase tracking-widest text-sm hover:bg-blue-600 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]"
            >
              Browse Scripts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#executors"
              className="flex items-center justify-center gap-3 px-10 py-5 glass-panel rounded-full font-hacker uppercase tracking-widest text-sm hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="mt-20 flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] font-hacker uppercase tracking-[0.3em]">Scroll Down</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </ScrollytellingSection>

      {/* Script Library Section */}
      <ScrollytellingSection
        id="scripts"
        folderPath="/vids/script_intro/"
        frameCount={145}
        title="Script Library"
        subtitle="The largest repository of verified scripts for your favorite games."
        accentColor="blue"
      >
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Verified Scripts</h2>
              <p className="text-white/50">Manually checked for safety and performance.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-hacker uppercase">Search: Ctrl+F</div>
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-hacker uppercase">Total: 432+</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SCRIPTS.map((script) => (
              <ScriptCard key={script.name} {...script} />
            ))}
          </div>

          <div className="pt-8 text-center">
            <button className="text-xs font-hacker uppercase tracking-widest text-white/40 hover:text-accent-blue transition-colors">
              + Load 24 More Scripts
            </button>
          </div>
        </div>
      </ScrollytellingSection>

      {/* Executors Section */}
      <ScrollytellingSection
        id="executors"
        folderPath="/vids/executor_intro/"
        frameCount={145}
        title="Executors"
        subtitle="The engine behind your scripts. Choose the best for your platform."
        accentColor="purple"
      >
        <div className="space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-glow-purple">Top Tier Performance</h2>
            <p className="text-white/50 text-lg">
              We only list executors that maintain consistent updates and provide superior security features for users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {EXECUTORS.map((executor) => (
              <ExecutorCard key={executor.name} {...executor} />
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[2rem] bg-gradient-to-br from-accent-blue/10 via-accent-purple/5 to-transparent border border-white/5 flex flex-col items-center gap-8 text-center">
            <div className="w-16 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full" />
            <h3 className="text-2xl font-bold">Stay Updated</h3>
            <p className="text-white/60 max-w-lg">
              Join our community to get instant notifications when scripts are updated or new executors are released.
            </p>
            <button className="px-12 py-4 bg-white text-black font-hacker text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-transform active:scale-95">
              Join Discord
            </button>
          </div>
        </div>
      </ScrollytellingSection>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-accent-blue/20 flex items-center justify-center">
                <span className="font-hacker text-accent-blue">X</span>
              </div>
              <span className="font-hacker text-lg font-bold">X_ExpoilT_HuB</span>
            </div>
            <p className="text-white/30 text-xs">© 2026 X_ExpoilT_HuB. For educational purposes only.</p>
          </div>

          <div className="flex gap-12 font-hacker text-[10px] uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
