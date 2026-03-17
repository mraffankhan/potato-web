"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // Basic validation
        if (!name || !email || !password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => window.location.href = "/auth/login", 2000);
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed. Try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="glass p-8 md:p-12 rounded-[32px] border border-white/5 relative overflow-hidden">
                    {/* Background Blur */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/10 blur-[100px] -ml-24 -mt-24 pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/2 space-y-8">
                            <div>
                                <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                                    <div className="w-9 h-9 rounded-xl glass flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <img src="/R_logo.png" alt="Logo" className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-black italic uppercase text-white tracking-widest">Argon</span>
                                </Link>
                                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4">Master Your <span className="text-gradient">Gaming</span> Empire.</h1>
                                <p className="text-gray-400 font-medium leading-relaxed">Join the elite rank of tournament organizers and community leaders.</p>
                            </div>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                    <ShieldCheck size={20} className="text-primary" /> SECURE INFRASTRUCTURE
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                    <ShieldCheck size={20} className="text-secondary" /> 24/7 AUTOMATION
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300 font-bold uppercase tracking-wider">
                                    <ShieldCheck size={20} className="text-accent" /> GLOBAL ACCESS
                                </li>
                            </ul>
                        </div>

                        <div className="md:w-1/2">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-start gap-2"
                                    >
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Account created! Redirecting to login...</span>
                                    </motion.div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-1">Min. 8 characters</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading || success}
                                    className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 group"
                                >
                                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Join Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                                
                                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] pt-4">
                                    Already a member? <Link href="/auth/login" className="text-white hover:text-primary transition-colors">Login Here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
