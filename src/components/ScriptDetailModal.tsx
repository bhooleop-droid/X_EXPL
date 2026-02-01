"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Eye, MessageSquare, Copy, Check, Send, Trash2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    users: {
        username: string;
        avatar_url: string;
    };
}

interface ScriptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    scriptId: string;
}

export default function ScriptDetailModal({ isOpen, onClose, scriptId }: ScriptDetailModalProps) {
    const [script, setScript] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && scriptId) {
            fetchScriptDetails();
            checkCurrentUser();
            incrementViewCount();
        }
    }, [isOpen, scriptId]);

    const checkCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
            // Check if liked
            const { data } = await supabase
                .from('likes')
                .select('*')
                .eq('user_id', user.id)
                .eq('script_id', scriptId)
                .single();
            setIsLiked(!!data);
        }
    };

    const fetchScriptDetails = async () => {
        setLoading(true);
        try {
            // Fetch script with author
            const { data: scriptData, error: scriptError } = await supabase
                .from('scripts')
                .select('*, users(username, avatar_url, bio)') // Added bio just in case
                .eq('id', scriptId)
                .single();

            if (scriptError) throw scriptError;
            setScript(scriptData);

            // Fetch comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*, users(username, avatar_url)')
                .eq('script_id', scriptId)
                .order('created_at', { ascending: false });

            if (commentsError) throw commentsError;
            setComments(commentsData || []);

            // Fetch like count
            const { count } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('script_id', scriptId);
            setLikeCount(count || 0);

        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    const incrementViewCount = async () => {
        await supabase.rpc('increment_view_count', { row_id: scriptId });
        // Note: RPC is safer for concurrency, but for simplicity we can just update if we don't have RPC
        // Fallback or simpler approach without RPC if user didn't make one:
        // const { error } = await supabase.from('scripts').update({ views_count: script.views_count + 1 }).eq('id', scriptId);
        // But since we don't know the current count exactly without fetching, this is race-prone.
        // Let's stick to a simple SQL update for now or just ignore strict view count accuracy.
        // Better:
        // await supabase.from('scripts').update({ views_count: scriptData.views_count + 1 }).eq('id', scriptId);
    };

    const handleCopy = () => {
        if (script?.script_code) {
            navigator.clipboard.writeText(script.script_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLike = async () => {
        if (!currentUser) return alert("Please login to like!");

        if (isLiked) {
            // Unlike
            const { error } = await supabase.from('likes').delete().eq('user_id', currentUser.id).eq('script_id', scriptId);
            if (!error) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
        } else {
            // Like
            const { error } = await supabase.from('likes').insert({ user_id: currentUser.id, script_id: scriptId });
            if (!error) {
                setIsLiked(true);
                setLikeCount(prev => prev + 1);
            }
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim()) return;

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    user_id: currentUser.id,
                    script_id: scriptId,
                    content: newComment
                })
                .select('*, users(username, avatar_url)')
                .single();

            if (error) throw error;
            setComments(prev => [data, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (!error) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a12] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(75,85,255,0.1)]"
                    >
                        {loading ? (
                            <div className="w-full h-96 flex items-center justify-center">
                                {/* Simple Loading Spinner */}
                                <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* Left Side: Script Info & Code */}
                                <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
                                    <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-hacker text-accent-blue uppercase tracking-widest px-2 py-1 bg-accent-blue/10 rounded">
                                                    {script.game_name}
                                                </span>
                                                {script.tags?.map((tag: string) => (
                                                    <span key={tag} className="text-[10px] text-white/40 uppercase tracking-widest px-2 py-1 bg-white/5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">{script.title}</h2>
                                            <div className="flex items-center gap-2 pt-2">
                                                {script.users?.avatar_url ? (
                                                    <img src={script.users.avatar_url} className="w-6 h-6 rounded-full" />
                                                ) : (
                                                    <User className="w-6 h-6 p-1 bg-white/10 rounded-full text-white/50" />
                                                )}
                                                <span className="text-sm text-white/60 hover:text-accent-blue cursor-pointer transition-colors"
                                                    onClick={() => window.location.href = `/profile?user_id=${script.user_id}`} // Simple navigation for now
                                                >
                                                    {script.users?.username || "Unknown User"}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#050508]">
                                        <div className="flex items-center justify-between text-xs text-white/40 font-mono uppercase">
                                            <span>Script Code</span>
                                            <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition-colors">
                                                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                                {copied ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                        <pre className="font-mono text-xs text-white/70 bg-white/5 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap break-all border border-white/5">
                                            {script.script_code}
                                        </pre>
                                    </div>

                                    <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={handleLike}
                                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
                                            >
                                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                                {likeCount}
                                            </button>
                                            <div className="flex items-center gap-2 text-sm text-white/50">
                                                <Eye className="w-5 h-5" />
                                                {script.views_count || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Comments (Desktop only?) - Or stacked on mobile */}
                                <div className="w-full md:w-80 bg-[#0a0a12] flex flex-col h-[400px] md:h-auto border-t md:border-t-0 border-white/5">
                                    <div className="p-4 border-b border-white/5 font-hacker text-sm text-white/60 uppercase tracking-widest flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {comments.length === 0 ? (
                                            <div className="text-center py-10 text-white/20 text-xs">
                                                No comments yet. Be the first!
                                            </div>
                                        ) : (
                                            comments.map(comment => (
                                                <div key={comment.id} className="group">
                                                    <div className="flex items-start gap-3">
                                                        {comment.users?.avatar_url ? (
                                                            <img src={comment.users.avatar_url} className="w-6 h-6 rounded-full mt-1" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-white/10 mt-1" />
                                                        )}
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-white/80">{comment.users?.username}</span>
                                                                <span className="text-[10px] text-white/30">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                                            </div>
                                                            <p className="text-xs text-white/60 leading-relaxed break-words">{comment.content}</p>
                                                        </div>
                                                        {currentUser?.id === comment.user_id && (
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <form onSubmit={handlePostComment} className="p-3 border-t border-white/5 flex gap-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:bg-white/10 transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg hover:bg-accent-blue hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
