"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, Loader2, Trophy, ChevronDown, LayoutDashboard, User as UserIcon, Book, Code, Zap, LogOut, Instagram, Mail, Home, Radio, Gift } from "lucide-react";
import { User } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const bottomNavItems = [
        { name: "Home", href: "/", icon: <Home size={22} /> },
        { name: "Tournaments", href: "/tournaments", icon: <Trophy size={22} /> },
        { name: "Live", href: "/live", icon: <Radio size={22} /> },
        { name: "Rewards", href: "/rewards", icon: <Gift size={22} /> },
        { name: "Profile", href: "/profile", icon: <UserIcon size={22} /> }
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleAuth = async () => {
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
            } catch (error) {
                console.error("Failed to fetch user session", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        handleAuth();
    }, []);

    const handleLogin = () => {
        window.location.href = '/api/auth/discord';
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? "bg-black/95 md:bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden glass flex items-center justify-center group-hover:border-primary/50 transition-colors">
                            <img src="/R_logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase italic">Ravonixx</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="w-10 h-10 flex items-center justify-center">
                                <Loader2 size={20} className="text-primary animate-spin" />
                            </div>
                        ) : user ? (
                            <div className="relative">
                                <Link href="/profile" className="flex items-center gap-3 md:pl-2 md:pr-4 md:py-1.5 p-0.5 rounded-full glass hover:bg-white/10 transition-all shadow-sm active:scale-95">
                                    <img
                                        src={user.avatar || "/default-avatar.png"}
                                        alt="User"
                                        className="w-9 h-9 md:w-7 md:h-7 rounded-full object-cover border border-white/20"
                                    />
                                    <span className="hidden md:block text-sm font-bold text-white max-w-[100px] truncate">
                                        {user.global_name || user.username}
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogin} 
                                className="px-5 py-2 md:px-6 md:py-2.5 text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-full transition-all shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                                </svg>
                                <span className="hidden md:inline">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>
            <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-3 py-3 md:py-4 flex items-center justify-around md:justify-center md:gap-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden md:min-w-fit">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="bottom-nav-indicator"
                                    className="absolute inset-0 bg-primary/20 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <div className={`${isActive ? "text-primary" : "text-gray-400"} flex-shrink-0 relative z-10`}>
                                {item.icon}
                            </div>
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "auto", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="text-sm font-bold overflow-hidden whitespace-nowrap relative z-10"
                                    >
                                        <span className="block pr-1">{item.name}</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
