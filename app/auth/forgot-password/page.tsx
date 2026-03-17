"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (!email) {
            setError("Email address is required");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to send reset link");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                    <div className="mb-10 text-center">
                        <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-8">
                            <ArrowLeft size={14} /> Back to Sign In
                        </Link>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Recover <span className="text-gradient">Access</span></h1>
                        <p className="text-gray-400 font-medium pt-2">Enter your email and we'll send a reset link.</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
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

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
                            >
                                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border border-green-500/30">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white uppercase italic">Check your inbox</h3>
                                <p className="text-gray-400 font-medium">We've sent reset instructions to <span className="text-white">{email}</span>. Please check your spam folder if you don't see it.</p>
                            </div>
                            <button 
                                onClick={() => setSuccess(false)}
                                className="text-sm font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-all"
                            >
                                Didn't receive it? Try again
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
