"use client";

import { Crown, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full glass-darker p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative z-10 text-center"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
          <Crown className="w-10 h-10 text-black" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight italic">
          About Our <span className="text-gradient">Sponsor</span>
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-12">
          <p>
            Money SpeakZ - Trading is a dedicated community for trading enthusiasts.
          </p>
          <div className="glass p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col items-center gap-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
            <p className="text-white font-bold text-center">
              Our sponsor will NOT take any money or anything from you.
            </p>
            <p className="text-center text-gray-400">
              If you are interested, just join and ask. Everything is 100% FREE.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a 
            href="https://t.me/+1jNdxuBbkuBiN2M1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-black text-lg rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(23,165,137,0.4)]"
          >
            Join the Community <ArrowRight className="w-5 h-5" />
          </a>
          <Link 
            href="/" 
            className="w-full sm:w-auto px-8 py-4 glass border border-white/10 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
