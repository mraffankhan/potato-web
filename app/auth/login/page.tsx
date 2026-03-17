"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, Github, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // Basic validation
        if (!email || !password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => window.location.href = "/servers", 1500);
            } else {
                const data = await res.json();
                setError(data.message || "Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                    {/* Background Blur */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                <img src="/R_logo.png" alt="Logo" className="w-7 h-7" />
                            </div>
                            <span className="text-xl font-black italic uppercase text-white tracking-widest">Argon</span>
                        </Link>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Welcome Back</h1>
                        <p className="text-gray-400 font-medium">Elevate your experience with Argon.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
                            >
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-3"
                            >
                                <CheckCircle2 size={18} className="shrink-0" />
                                <span>Login successful! Redirecting...</span>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                                <Link href="/auth/forgot-password" title="Recover Password" className="text-xs font-bold text-gray-500 hover:text-white transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || success}
                            className="w-full py-4 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 group"
                        >
                            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-[#0a0a0a] px-4 text-gray-500 font-bold">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-3 rounded-2xl glass border border-white/5 text-sm font-bold text-white hover:bg-white/5 transition-all">
                                <MessageSquare size={18} className="text-indigo-400" /> Discord
                            </button>
                            <button className="flex items-center justify-center gap-3 py-3 rounded-2xl glass border border-white/5 text-sm font-bold text-white hover:bg-white/5 transition-all">
                                <Github size={18} /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-500 font-medium">
                        New to Argon? <Link href="/auth/signup" className="text-white font-bold hover:underline underline-offset-4 decoration-primary decoration-2">Create an account</Link>
                    </p>
                </div>
                
                <p className="mt-8 text-center text-xs text-gray-600 uppercase tracking-widest font-bold">
                    &copy; {new Date().getFullYear()} Argon Platform. Secure access.
                </p>
            </motion.div>
        </div>
    );
}
