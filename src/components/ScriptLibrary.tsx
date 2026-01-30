"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ScriptCard } from "@/components/Cards";
import { Loader2, Search } from "lucide-react";

interface Script {
    id: string;
    title: string;
    game_name: string;
    code_content: string;
    created_at: string;
    user_id: string;
}

export default function ScriptLibrary() {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchScripts();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('public:scripts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scripts' }, (payload) => {
                setScripts((current) => [payload.new as Script, ...current]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchScripts = async () => {
        try {
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setScripts(data || []);
        } catch (error) {
            console.error("Error fetching scripts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredScripts = scripts.filter(script =>
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.game_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Verified Scripts</h2>
                    <p className="text-white/50">Manually checked for safety and performance.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search scripts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-hacker text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 w-full md:w-64"
                        />
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-hacker uppercase flex items-center justify-center">
                        Total: {scripts.length}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
                </div>
            ) : filteredScripts.length === 0 ? (
                <div className="text-center py-20 text-white/30 font-hacker uppercase tracking-widest">
                    {searchQuery ? "No matching scripts found" : "No scripts uploaded yet"}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredScripts.map((script) => (
                        <ScriptCard
                            key={script.id}
                            name={script.title}
                            game={script.game_name}
                            description="Verified user upload." // We could add a description field later
                            sourceLink="#" // We will need to decide how to handle the 'Link' or 'Code' view
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
