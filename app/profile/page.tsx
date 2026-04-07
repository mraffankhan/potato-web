"use client";

import { User, LogIn, LogOut, Loader2, FileText, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { User as AuthUser } from "@/lib/session";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    const handleLogin = () => {
        window.location.href = '/api/auth/discord';
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-black">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] pb-32 px-4 flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-md w-full glass backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group"
            >
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                
                <div className="text-center mb-10">
                    {user ? (
                        <div className="flex flex-col items-center">
                            <img 
                                src={user.avatar || "/default-avatar.png"} 
                                alt={user.global_name || user.username} 
                                className="w-28 h-28 rounded-full border-[4px] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6 object-cover"
                            />
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                                {user.global_name || user.username}
                            </h1>
                            <p className="text-gray-400 mt-1 font-medium">Logged in via Discord</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6 border border-white/10">
                                <User size={40} className="text-gray-500" />
                            </div>
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 mt-2 font-medium">
                                Connect your Discord account to manage your profile and operations.
                            </p>
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <Link href="/privacy" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl glass border border-white/5 hover:border-white/20 transition-all text-gray-400 hover:text-white">
                                <ShieldAlert size={24} />
                                <span className="text-sm font-bold">Privacy Policy</span>
                            </Link>
                            <Link href="/terms" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl glass border border-white/5 hover:border-white/20 transition-all text-gray-400 hover:text-white">
                                <FileText size={24} />
                                <span className="text-sm font-bold">Terms of Service</span>
                            </Link>
                        </div>
                        
                        <div className="h-px w-full bg-white/5 my-6" />

                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold uppercase tracking-widest text-sm rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleLogin}
                            className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:scale-105 active:scale-95 group uppercase tracking-wider text-sm"
                        >
                            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                            <span>Login with Discord</span>
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                            By logging in, you agree to our Terms of Service & Privacy Policy.
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
