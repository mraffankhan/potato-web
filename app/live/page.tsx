"use client";

import { Radio, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LivePage() {
    return (
        <div className="min-h-[calc(100vh-6rem)] pb-32 px-4 bg-black relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto w-full relative z-10 flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                        <Radio size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                            Live Events
                        </h1>
                    </div>
                </div>

                <div className="flex-grow glass border border-white/10 rounded-[2rem] p-8 md:p-16 flex flex-col items-center justify-center text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative"
                    >
                        <AlertCircle size={40} className="text-red-400" />
                    </motion.div>
                    <h3 className="text-2xl md:text-4xl font-black text-white mb-4 italic tracking-tight uppercase">No Ongoing Live Tournaments</h3>
                    <p className="text-gray-400 text-lg max-w-lg">There are currently no featured matches being broadcasted. Stay tuned to our announcements or check the upcoming events in the specific tournament pages.</p>
                </div>
            </div>
        </div>
    );
}
