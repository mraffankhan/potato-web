"use client";

import { Trophy, AlertCircle, CalendarClock, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function TournamentsPage() {
    const [activeTab, setActiveTab] = useState('ongoing');

    const tabs = [
        { id: 'ongoing', label: 'Ongoing', icon: <Clock size={16} /> },
        { id: 'upcoming', label: 'Upcoming', icon: <CalendarClock size={16} /> },
        { id: 'completed', label: 'Completed', icon: <CheckCircle size={16} /> }
    ];

    return (
        <div className="min-h-[calc(100vh-6rem)] pb-32 px-4 bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 text-white">
                            <Trophy size={32} className="text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                            Tournaments
                        </h1>
                        <p className="text-gray-400 text-lg mt-2 font-medium max-w-xl">
                            Compete in premier events, track your brackets, and view match history.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-fit mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all relative ${
                                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="tourneyTab"
                                    className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.icon}</span>
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="glass border border-white/10 rounded-[2rem] p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <AlertCircle size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 italic tracking-tight">No {tabs.find(t => t.id === activeTab)?.label} Tournaments Available</h3>
                    <p className="text-gray-400 max-w-md">There are currently no events matching this filter. Check back later or explore other tabs.</p>
                </div>
            </div>
        </div>
    );
}
