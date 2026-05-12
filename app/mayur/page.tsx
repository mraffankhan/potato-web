"use client";

import { motion, Variants } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, Trophy, Crown, Target, ChevronRight, Briefcase, User, Code, Layout } from "lucide-react";
import Link from "next/link";

export default function MayurPortfolio() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 selection:bg-primary/30 font-sans">
      
      {/* Background Subtle Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        
        {/* Top Navigation / Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 lg:mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-semibold text-gray-300">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Platform
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Fixed Profile Info */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-6 relative group bg-neutral-900 shrink-0"
            >
              <img 
                src="/mayur-profile.jpeg" 
                alt="Prabuddh Mayur" 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                Prabuddh Mayur
              </motion.h1>
              <motion.h2 variants={itemVariants} className="text-primary font-bold text-lg mb-6">
                Esports Entrepreneur & Operations Director
              </motion.h2>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <SocialLink href="mailto:prabuddhmayur07@gmail.com" icon={<Mail className="w-5 h-5" />} />
                <SocialLink href="https://www.linkedin.com/in/prabuddh-mayur-463564335" icon={<Linkedin className="w-5 h-5" />} />
                <SocialLink href="https://github.com/prabuddhmayur153349-dot" icon={<Github className="w-5 h-5" />} />
                <SocialLink href="https://www.instagram.com/prabuddh_mayur" icon={<Instagram className="w-5 h-5" />} />
              </motion.div>

              <motion.div variants={itemVariants} className="w-full h-[1px] bg-white/10 mb-8" />

              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Project Management</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Team Leadership</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Layout className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Event Orchestration</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Professional Content */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="w-full lg:w-2/3 flex flex-col gap-10 lg:gap-16 lg:pt-4"
          >
            
            {/* Professional Summary */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                Professional Summary
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                I am a driven esports entrepreneur and operations director with a proven track record of building and managing competitive gaming organizations. By combining strategic planning with hands-on tournament management, I have developed strong proficiencies in team leadership, digital event coordination, and organizational scaling. My work involves orchestrating large-scale digital events, scouting top-tier talent, and fostering communities that bridge the gap between casual gaming and professional esports.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Through my initiatives, I strive to cultivate environments where competitive integrity and technological innovation meet, ensuring broadcast-quality execution for every project I oversee.
              </p>
            </motion.section>

            <motion.div variants={itemVariants} className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />

            {/* Leadership & Initiatives */}
            <motion.section variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Leadership & Initiatives
              </h3>

              <div className="space-y-6">
                {/* Role 1 */}
                <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                        <Crown className="w-5 h-5 text-yellow-500" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Ravonixx Esports</h4>
                    </div>
                    <span className="text-yellow-500 font-bold text-sm tracking-wider uppercase">Founder & Owner</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Spearheaded the creation and strategic vision of a comprehensive esports organization. Directed all facets of the business including brand development, team logistics, community growth, and competitive strategy. Successfully established a robust infrastructure to support multiple competitive rosters.
                  </p>
                </div>

                {/* Role 2 */}
                <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Trophy className="w-5 h-5 text-blue-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">TZ Esports & NX9 Esports</h4>
                    </div>
                    <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">Tournament Director</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Orchestrated seamless bracket operations and managed technical communications for high-stakes competitive tournaments. Ensured fair play, resolved disputes in real-time, and maintained broadcast-quality execution to deliver premium experiences for both players and audiences.
                  </p>
                </div>

                {/* Role 3 */}
                <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Target className="w-5 h-5 text-rose-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Free Fire Max Esports</h4>
                    </div>
                    <span className="text-rose-400 font-bold text-sm tracking-wider uppercase">Official Scout</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Tasked with identifying and recruiting high-potential talent within the battle royale ecosystem. Analyzed gameplay metrics, evaluated team dynamics, and scouted top-tier competitive players to build championship-contending rosters.
                  </p>
                </div>
              </div>
            </motion.section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 hover:scale-110 transition-all duration-300 shadow-lg"
    >
      {icon}
    </a>
  );
}
