"use client";

import { Gift, HomeIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RewardsPage() {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-xl w-full glass border border-white/10 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_0_60px_rgba(234,179,8,0.15)]"
            >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20 text-white">
                    <Gift size={40} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                    Rewards Hub
                </h1>
                
                <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-sm tracking-widest uppercase mb-6 border border-yellow-500/30">
                    Coming Soon
                </div>

                <p className="text-gray-400 text-lg mb-10">
                    We are crafting an exclusive rewards experience. Soon you will be able to redeem your tournament points for premium prizes and platform perks.
                </p>

                <Link 
                    href="/"
                    className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-200 text-black font-black uppercase italic rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
                >
                    <HomeIcon size={20} />
                    Return to Home
                </Link>
            </motion.div>
        </div>
    );
}
