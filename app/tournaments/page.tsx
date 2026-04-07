"use client";

import { Trophy, AlertCircle, CalendarClock, Clock, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
                {activeTab === 'ongoing' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/tournaments/halcyon" className="group glass border border-white/10 hover:border-primary/50 rounded-[2rem] p-8 flex flex-col transition-all duration-300 relative overflow-hidden isolate shadow-xl hover:-translate-y-2">
                            <div className="absolute -inset-1 opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500 bg-gradient-to-br from-primary to-blue-600 -z-10" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary shadow-inner">
                                    <Shield size={28} />
                                </div>
                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black uppercase tracking-wider rounded-lg border border-primary/30">Registrations Open</span>
                            </div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">HALCYON 2026</h3>
                            <p className="text-gray-400 font-medium mb-6 line-clamp-2">Premier esports event with competitive brackets and a sprawling prize pool.</p>
                            
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Prize Pool</p>
                                    <p className="text-lg font-black text-emerald-400">5000 RS</p>
                                </div>
                                <div className="flex items-center text-sm font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                                    Register <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="glass border border-white/10 rounded-[2rem] p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <AlertCircle size={32} className="text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 italic tracking-tight">No {tabs.find(t => t.id === activeTab)?.label} Tournaments Available</h3>
                        <p className="text-gray-400 max-w-md">There are currently no events matching this filter. Check back later or explore other tabs.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
