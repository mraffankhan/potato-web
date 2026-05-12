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
      <section className="relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start pt-12 md:pt-20 pb-12 overflow-hidden w-full">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-10 tracking-tighter italic uppercase leading-[1.1] text-white"
          >
            EXPLORE THE <span className="text-gradient">RAVONIXX</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mb-10 sm:mb-16 relative z-20 px-2 sm:px-0"
          >
            {/* Sponsor Banner */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
              <div className="glass-darker p-4 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-primary/30 relative shadow-2xl overflow-hidden w-full mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl sm:rounded-[2rem] mix-blend-overlay pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-6 uppercase tracking-wider flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                    <div className="flex gap-2 sm:hidden mb-1"><Crown className="text-yellow-500 w-6 h-6" /><Crown className="text-yellow-500 w-6 h-6" /></div>
                    <Crown className="text-yellow-500 w-8 h-8 hidden sm:block" /> 
                    <span className="leading-tight">Our Sponsor:<br className="sm:hidden"/><span className="text-gradient">Money SpeakZ - Trading</span></span>
                    <Crown className="text-yellow-500 w-8 h-8 hidden sm:block" />
                  </h3>
                  
                  <a href="https://t.me/+1jNdxuBbkuBiN2M1" target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/20 hover:border-primary/50 transition-all duration-500 mb-6 sm:mb-8 group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <img src="/sponsor.png" alt="Money SpeakZ Trading Sponsor" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </a>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                    <a href="https://t.me/+1jNdxuBbkuBiN2M1" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-black text-base sm:text-lg rounded-2xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(23,165,137,0.4)]">
                      Click Here to Join <ArrowRight className="w-5 h-5" />
                    </a>
                    <Link href="/sponsor" className="w-full sm:w-auto px-6 py-4 glass border border-white/10 text-white font-black text-base sm:text-lg rounded-2xl hover:bg-white/5 transition-all text-center">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
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
