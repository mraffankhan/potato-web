"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Trophy, Swords, Ticket, Database, 
  UserPlus, Crown, Shield, Server, Box, Terminal,
  Zap, Globe, Layout, Share2, Layers, Sparkles, Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [stats, setStats] = useState<{
    commands: number | string;
    users: number | string;
    servers: number | string;
    uptime: string;
    loading: boolean;
    error: boolean;
  }>({
    commands: 0,
    users: 0,
    servers: 0,
    uptime: "99.9%",
    loading: true,
    error: false
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiResponse(null);
    
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      if (query.includes("how to use") || query.includes("setup")) {
        setAiResponse("To use Ravonixx, begin by connecting your platforms through the Developer Dashboard. We'll automatically provision environments from there. Type 'modules' to explore further.");
      } else if (query.includes("price") || query.includes("cost")) {
        setAiResponse("Ravonixx offers flexible scaling tailored to your operational needs. The base automation platform is completely free during the beta phase.");
      } else if (query.includes("tournament")) {
        setAiResponse("The Tournament Operations module supports immediate brackets generation for Double and Single Elimination algorithms. It automatically populates discord categories and voice channels.");
      } else {
        setAiResponse("I'm the Ravonixx AI Guide. I can help you understand our features, integrations, and setup processes. Try asking 'how to use' if you're a new user or ask about tournaments.");
      }
      setIsSearching(false);
    }, 1000);
  };

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats({
            commands: data.commands,
            users: data.users,
            servers: data.servers,
            uptime: data.uptime,
            loading: false,
            error: false
          });
        } else {
          setStats(prev => ({ ...prev, loading: false, error: true }));
        }
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setStats(prev => ({ ...prev, loading: false, error: true }));
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center py-12 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/5 text-sm font-semibold text-gray-400 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Platform is Live & Scaleable</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-12 sm:mb-16 tracking-tighter italic uppercase leading-[1.1] text-white"
          >
            EXPLORE THE <span className="text-gradient">RAVONIXX</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mb-16 relative z-20"
          >
            {/* AI Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative flex items-center bg-black/90 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-2xl p-2 md:p-3 pl-6 md:pl-8">
                 <Sparkles className="text-primary w-6 h-6 md:w-8 md:h-8 mr-4 animate-pulse" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Ask AI anything... (e.g. 'how to use')" 
                   className="w-full bg-transparent border-none outline-none text-white text-lg md:text-xl placeholder:text-gray-500 py-3 md:py-4"
                 />
                 <button 
                    type="submit" 
                    disabled={isSearching}
                    className="bg-white text-black p-4 md:px-8 md:py-4 rounded-full font-black ml-2 hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                 >
                   <span className="hidden md:inline">ASK AI</span>
                   {isSearching ? <div className="w-6 h-6 border-[3px] border-black border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                 </button>
               </div>
            </form>

            <AnimatePresence>
               {aiResponse && (
                 <motion.div 
                   initial={{ opacity: 0, y: -20, height: 0 }}
                   animate={{ opacity: 1, y: 0, height: "auto" }}
                   exit={{ opacity: 0, y: -20, height: 0 }}
                   className="mt-6 text-left origin-top overflow-hidden"
                 >
                    <div className="glass-darker p-8 rounded-[2rem] border border-primary/30 relative shadow-2xl">
                       <div className="absolute inset-0 bg-primary/5 rounded-[2rem] mix-blend-overlay pointer-events-none" />
                       <div className="flex items-start gap-5 relative z-10">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0 mt-1 shadow-[0_0_15px_rgba(23,165,137,0.5)]">
                             <Bot className="text-primary w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="text-white font-black text-xl mb-3 flex items-center gap-2">Ravonixx Assistant <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-black rounded-full uppercase leading-none">AI</span></h4>
                             <p className="text-gray-300 leading-relaxed text-lg md:text-xl font-medium">{aiResponse}</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>

          {/* Banner Graphic underneath Search */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="w-full relative mt-8 z-10 group max-w-6xl mx-auto"
          >
             <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
             <div className="relative rounded-[2.5rem] overflow-hidden glass border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <img src="/banner-buildyourfuture.png" alt="Build Your Future Banner" className="w-full h-auto object-cover transform scale-[1.02] group-hover:scale-100 transition-transform duration-700 ease-out" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden bg-black/40 backdrop-blur-xl border-y border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernStatCard 
              title="Total Users" 
              value={stats.error ? "N/A" : stats.loading ? "..." : stats.users.toLocaleString()} 
              icon={<UserPlus className="w-8 h-8" />}
              prefix={!stats.loading && !stats.error ? "+" : ""} 
              accent="from-blue-600 to-cyan-500"
            />
            <ModernStatCard 
              title="Communities" 
              value={stats.error ? "N/A" : stats.loading ? "..." : stats.servers.toLocaleString()} 
              icon={<Globe className="w-8 h-8" />}
              accent="from-purple-600 to-pink-500"
            />
            <ModernStatCard 
              title="Actions Logged" 
              value={stats.error ? "N/A" : stats.loading ? "..." : stats.commands.toLocaleString()} 
              icon={<Zap className="w-8 h-8" />}
              accent="from-primary to-emerald-500"
            />
            <ModernStatCard 
              title="System Uptime" 
              value={stats.uptime} 
              icon={<Server className="w-8 h-8" />}
              accent="from-rose-600 to-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">Engineered for<br /><span className="text-gradient">Performance</span></h2>
              <p className="text-gray-400 text-lg max-w-xl">Every module in the Ravonixx Ecosystem is built from the ground up for speed, scalability, and ease of use in highly competitive environments.</p>
            </div>
            <Link href="/docs" className="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/5 flex items-center gap-2 group border border-white/10 shrink-0">
              Explore Documentation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<Zap size={32} strokeWidth={1.5} />}
              title="Automation System"
              description="A seamless automation engine taking the manual effort out of repetitive community and esports tasks."
              color="primary"
              href="/services/automation"
            />
            <FeatureItem
              icon={<Shield size={32} strokeWidth={1.5} />}
              title="Real Staff Management"
              description="Advanced tools to assign roles, track staff activity, and manage your team efficiently."
              color="secondary"
              href="/services/staff-management"
            />
            <FeatureItem
              icon={<Trophy size={32} strokeWidth={1.5} />}
              title="Tournament Operations"
              description="Comprehensive operations for single-elimination, double-elimination, round-robin, and bracket automation."
              color="blue-500"
              href="/services/tournaments"
            />
            <FeatureItem
              icon={<Box size={32} strokeWidth={1.5} />}
              title="LAN Event Handling"
              description="Dedicated modules for tracking on-site activities, dynamic scheduling, and live LAN updates."
              color="emerald-500"
              href="/services/lan-events"
            />
            <FeatureItem
              icon={<Layers size={32} strokeWidth={1.5} />}
              title="Discord Setup & Control"
              description="Full-scale Discord server architecture, automated onboarding, and comprehensive role control workflows."
              color="amber-500"
              href="/services/discord"
            />
            <FeatureItem
              icon={<Globe size={32} strokeWidth={1.5} />}
              title="Global Scaling"
              description="Deployed across global edge locations to ensure high-performance infrastructure for your operations."
              color="rose-500"
            />
          </div>
        </div>
      </section>

      {/* Social / Trust Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Trusted by the best.</h3>
              <p className="text-gray-500">Powering events and organizations around the globe.</p>
            </div>
            <div className="flex flex-wrap items-center gap-12 opacity-30 grayscale brightness-200">
               {/* Placeholders for partner logos */}
               <Box size={40} />
               <Layout size={40} />
               <Share2 size={40} />
               <Zap size={40} />
               <Globe size={40} />
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6 sm:mb-8 italic leading-tight">Ready to <span className="text-gradient">Elevate</span> Your Operations?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Join thousands of organizations using Ravonixx to power their esports infrastructure and competitive play.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="#features" className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-white text-black font-black text-base sm:text-lg rounded-2xl hover:scale-105 transition-all text-center">Explore Services</Link>
             <Link href="mailto:support@ravonixx.xyz" className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 glass border border-white/10 text-white font-black text-base sm:text-lg rounded-2xl hover:bg-white/5 transition-all text-center">Contact Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModernStatCard({ title, value, prefix, icon, accent }: { title: string; value: string; prefix?: string; icon: React.ReactNode; accent: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[2rem] glass p-8 border border-white/10 hover:border-white/20 transition-all duration-300 isolate hover:-translate-y-2 shadow-xl"
    >
      <div className={`absolute -inset-1 opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500 bg-gradient-to-br ${accent} -z-10`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 mb-8 shadow-inner border border-white/10 text-white group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <div className="mt-auto">
          <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter italic drop-shadow-md">
            {prefix}{value}
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{title}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureItem({ icon, title, description, color, href }: { icon: React.ReactNode; title: string; description: string; color: string; href?: string }) {
  const content = (
    <>
      <div className={`mb-8 p-4 rounded-xl inline-flex text-white glass border border-white/10 group-hover:scale-110 group-hover:bg-white/5 transition-all`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 italic uppercase">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium mb-6">{description}</p>
      {href && (
        <div className="flex items-center text-sm font-bold text-white uppercase tracking-wider group-hover:underline">
          Learn More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
      
      {/* Subtle Background Accent */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-white/10 transition-colors" />
    </>
  );

  return href ? (
    <Link href={href} className="flex flex-col group p-10 rounded-3xl glass border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden h-full">
      {content}
    </Link>
  ) : (
    <div className="group p-10 rounded-3xl glass border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden">
      {content}
    </div>
  );
}
