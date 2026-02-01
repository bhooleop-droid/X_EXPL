"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, User, Edit2, Save, MapPin, Calendar, Heart } from "lucide-react";
import { ScriptCard } from "@/components/Cards";
import ScriptDetailModal from "@/components/ScriptDetailModal";
import Navbar from "@/components/Navbar";

interface UserProfile {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
    created_at: string;
    discord_id: string;
}

function ProfileContent() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("user_id");

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [scripts, setScripts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [bioInput, setBioInput] = useState("");
    const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            fetchProfile();
        } else {
            // Fallback: if no user_id, try to load own profile
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    window.location.search = `?user_id=${user.id}`;
                } else {
                    setLoading(false);
                }
            });
        }
    }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;
            setProfile(profileData);
            setBioInput(profileData.bio || "");

            // Fetch Scripts
            const { data: scriptsData, error: scriptsError } = await supabase
                .from('scripts')
                .select('*, users(username, avatar_url)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (scriptsError) throw scriptsError;
            setScripts(scriptsData || []);

        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBio = async () => {
        if (!userId) return;
        const { error } = await supabase
            .from('users')
            .update({ bio: bioInput })
            .eq('id', userId);

        if (!error) {
            setProfile(prev => prev ? { ...prev, bio: bioInput } : null);
            setIsEditing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#020205] text-white pt-24 px-4 text-center">
                <Navbar />
                <h1 className="text-2xl font-bold mb-4">User not found</h1>
                <p className="text-white/50">The user you are looking for does not exist.</p>
            </div>
        );
    }

    const isOwner = currentUser?.id === profile.id;

    return (
        <div className="min-h-screen bg-[#020205] text-white">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20">
                {/* Profile Header */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 border border-white/5 bg-[#0a0a12]">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className="w-32 h-32 rounded-full border-4 border-accent-blue/20"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-accent-blue/10 flex items-center justify-center border-4 border-accent-blue/20">
                                <User className="w-12 h-12 text-accent-blue" />
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold">{profile.username}</h1>
                                    <p className="text-white/40 font-mono text-xs mt-1">ID: {profile.discord_id || "N/A"}</p>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => isEditing ? handleSaveBio() : setIsEditing(true)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-xs font-hacker uppercase tracking-widest transition-colors"
                                    >
                                        {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                        {isEditing ? "Save Profile" : "Edit Profile"}
                                    </button>
                                )}
                            </div>

                            {/* Bio Section */}
                            <div className="relative">
                                {isEditing ? (
                                    <textarea
                                        value={bioInput}
                                        onChange={(e) => setBioInput(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-accent-blue/50"
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-white/60 leading-relaxed max-w-2xl">
                                        {profile.bio || "No bio yet."}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                                <div className="text-center md:text-left">
                                    <div className="text-xl font-bold">{scripts.length}</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Scripts</div>
                                </div>
                                {/* Add more stats like Total Views later */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scripts Grid */}
                <div className="max-w-6xl mx-auto space-y-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-8 h-1 bg-accent-blue rounded-full"></span>
                        User Scripts
                    </h2>

                    {scripts.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-white/30 font-hacker uppercase tracking-widest">No scripts uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scripts.map((script) => (
                                <ScriptCard
                                    key={script.id}
                                    name={script.title}
                                    game={script.game_name}
                                    description={`Uploaded on ${new Date(script.created_at).toLocaleDateString()}`}
                                    sourceLink="#"
                                    author={profile} // Since we know the author is the profile user
                                    views={script.views_count}
                                    tags={script.tags}
                                    onClick={() => setSelectedScriptId(script.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ScriptDetailModal
                isOpen={!!selectedScriptId}
                onClose={() => setSelectedScriptId(null)}
                scriptId={selectedScriptId || ""}
            />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020205] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>}>
            <ProfileContent />
        </Suspense>
    );
}
