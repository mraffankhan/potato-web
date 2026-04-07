"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, Phone, UploadCloud, Shield, CheckCircle, ChevronRight, ChevronLeft, 
    Image as ImageIcon, Fingerprint, Crosshair, Award, Zap, AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function HalcyonRegistration() {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [registeredCount, setRegisteredCount] = useState<number>(0);
    const [loadingCount, setLoadingCount] = useState(true);
    const maxSlots = 48;
    const isFull = registeredCount >= maxSlots;

    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch('/api/tournaments/count');
                const data = await res.json();
                if (typeof data.count === 'number') {
                    setRegisteredCount(data.count);
                }
            } catch (err) {
                console.error("Failed to fetch count");
            } finally {
                setLoadingCount(false);
            }
        }
        fetchCount();
    }, []);

    const [formData, setFormData] = useState({
        teamName: "",
        mobileNumber: "",
        players: [
            { name: "", ign: "", uid: "", file: null as File | null, preview: "" },
            { name: "", ign: "", uid: "", file: null as File | null, preview: "" },
            { name: "", ign: "", uid: "", file: null as File | null, preview: "" },
            { name: "", ign: "", uid: "", file: null as File | null, preview: "" }
        ]
    });

    const generateTeamId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handlePlayerChange = (index: number, field: string, value: string) => {
        const newPlayers = [...formData.players];
        newPlayers[index] = { ...newPlayers[index], [field]: value };
        setFormData({ ...formData, players: newPlayers });
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1080;
                    
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(file);
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/webp', 0.6);
                };
                img.onerror = () => resolve(file);
            };
            reader.onerror = () => resolve(file);
        });
    };

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            
            // Set preview instantly
            setFormData(prev => {
                 const newPlayers = [...prev.players];
                 newPlayers[index] = { ...newPlayers[index], file: null, preview: previewUrl };
                 return { ...prev, players: newPlayers };
            });

            // Run compression asynchronously
            const compressedFile = await compressImage(file);
            setFormData(prev => {
                const latestPlayers = [...prev.players];
                latestPlayers[index] = { ...latestPlayers[index], file: compressedFile };
                return { ...prev, players: latestPlayers };
            });
        }
    };

    const validateStep = () => {
        if (step === 0) {
            return formData.teamName.trim() !== "" && formData.mobileNumber.trim() !== "";
        }
        if (step > 0 && step <= 4) {
            const p = formData.players[step - 1];
            return p.name.trim() !== "" && p.ign.trim() !== "" && p.uid.trim() !== "" && p.file !== null;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) setStep(s => Math.min(5, s + 1));
    };

    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const teamId = generateTeamId();
            const playerUrls = [];

            // 1. Upload Images
            for (let i = 0; i < 4; i++) {
                const player = formData.players[i];
                if (!player.file) throw new Error(`Missing college ID for player ${i + 1}`);

                const fileExt = player.file.name.split('.').pop();
                const fileName = `${teamId}_p${i + 1}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('halcyon_ids')
                    .upload(filePath, player.file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('halcyon_ids')
                    .getPublicUrl(filePath);

                playerUrls.push(data.publicUrl);
            }

            // 2. Insert Database Row
            const { error: dbError } = await supabase
                .from('halcyon_registrations')
                .insert({
                    team_id: teamId,
                    team_name: formData.teamName,
                    mobile_number: formData.mobileNumber,
                    p1_name: formData.players[0].name,
                    p1_ign: formData.players[0].ign,
                    p1_uid: formData.players[0].uid,
                    p1_college_id_url: playerUrls[0],
                    p2_name: formData.players[1].name,
                    p2_ign: formData.players[1].ign,
                    p2_uid: formData.players[1].uid,
                    p2_college_id_url: playerUrls[1],
                    p3_name: formData.players[2].name,
                    p3_ign: formData.players[2].ign,
                    p3_uid: formData.players[2].uid,
                    p3_college_id_url: playerUrls[2],
                    p4_name: formData.players[3].name,
                    p4_ign: formData.players[3].ign,
                    p4_uid: formData.players[3].uid,
                    p4_college_id_url: playerUrls[3],
                });

            if (dbError) throw dbError;

            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen py-24 px-4 bg-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border border-white/10 p-12 rounded-[3rem] text-center max-w-xl relative isolate"
                >
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-[0_0_30px_rgba(23,165,137,0.3)]">
                        <CheckCircle size={48} className="text-primary" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Registration Setup Complete</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Your team <span className="text-white font-bold">{formData.teamName}</span> has been successfully registered for Halcyon 2026.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/tournaments'}
                        className="px-8 py-4 bg-white text-black font-black uppercase text-sm rounded-xl hover:scale-105 transition-transform"
                    >
                        Return to Tournaments
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                     <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                         <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-bold uppercase tracking-widest inline-block shadow-[0_0_20px_rgba(23,165,137,0.2)]">Prize Pool: 5000 RS</span>
                         <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
                             <Users size={14} /> No Login Needed
                         </span>
                     </div>
                     <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-4 drop-shadow-lg text-gradient">HALCYON 2026</h1>
                     <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Complete your team details and upload valid College IDs to secure your spot.</p>
                     
                     <div className="mt-8 max-w-lg mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                          <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Registration Capacity</span>
                              <span className="text-xl font-black text-white">{loadingCount ? '...' : registeredCount} <span className="text-gray-500 text-sm">/ {maxSlots} Slots</span></span>
                          </div>
                          <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${loadingCount ? 0 : Math.min((registeredCount / maxSlots) * 100, 100)}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${isFull ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_15px_rgba(23,165,137,0.4)]'}`}
                              />
                          </div>
                          {isFull && !loadingCount && (
                              <p className="text-red-400 font-bold uppercase tracking-widest text-xs mt-3 flex items-center justify-center gap-1.5">
                                  <AlertCircle size={14} /> Registrations Full
                              </p>
                          )}
                     </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4 relative z-10">
                        {['Team Info', 'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Verify'].map((label, idx) => (
                            <div key={idx} className={`flex flex-col items-center gap-2 ${step >= idx ? 'text-primary' : 'text-gray-600'} transition-colors duration-500`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-all duration-500 ${step >= idx ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(23,165,137,0.3)]' : 'border-white/10 bg-white/5'}`}>
                                    {idx < 5 ? idx + 1 : <CheckCircle size={16} />}
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-white/5 relative rounded-full overflow-hidden -mt-[44px] mb-[44px] z-0 mx-5 sm:mx-10">
                         <div 
                             className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500" 
                             style={{ width: `${(step / 5) * 100}%` }}
                         />
                    </div>
                </div>

                <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative isolate shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] pointer-events-none -z-10" />

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div 
                                key="step0"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                        <Users className="text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic uppercase">Team Overview</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Team Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.teamName}
                                            onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                                            placeholder="e.g. Sentinels, Team Liquid"
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number (WhatsApp via Captain)</label>
                                        <input 
                                            type="text" 
                                            value={formData.mobileNumber}
                                            onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                                            placeholder="e.g. +91 9876543210"
                                            className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step > 0 && step <= 4 && (() => {
                            const pIndex = step - 1;
                            const p = formData.players[pIndex];
                            return (
                                <motion.div 
                                    key={`step${step}`}
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                            {pIndex === 0 ? <Award className="text-primary" /> : <Shield className="text-primary" />}
                                        </div>
                                        <h3 className="text-3xl font-black text-white italic uppercase">Player {step} {pIndex === 0 && <span className="text-primary text-xl ml-2">(Captain)</span>}</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={p.name}
                                                onChange={e => handlePlayerChange(pIndex, 'name', e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">In-Game Name (IGN)</label>
                                            <input 
                                                type="text" 
                                                value={p.ign}
                                                onChange={e => handlePlayerChange(pIndex, 'ign', e.target.value)}
                                                placeholder="e.g. TenZ"
                                                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Game UID</label>
                                            <input 
                                                type="text" 
                                                value={p.uid}
                                                onChange={e => handlePlayerChange(pIndex, 'uid', e.target.value)}
                                                placeholder="e.g. 1234567890"
                                                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2 mt-4">
                                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">College ID Snapshot</label>
                                            <label className="border-2 border-dashed border-white/20 hover:border-primary/50 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors bg-white/5 group relative overflow-hidden">
                                                {p.preview ? (
                                                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `url(${p.preview})` }} />
                                                ) : null}
                                                
                                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                                    {p.preview ? <CheckCircle className="text-emerald-400 w-8 h-8" /> : <UploadCloud className="text-gray-400 w-8 h-8" />}
                                                </div>
                                                <div className="text-center relative z-10">
                                                    <p className="text-white font-bold">{p.file ? p.file.name : 'Click to Upload College ID'}</p>
                                                    <p className="text-gray-500 text-sm mt-1">Accepts JPG, PNG, WEBP</p>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={e => handleFileChange(pIndex, e)} 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {step === 5 && (
                            <motion.div 
                                key="step5"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mx-auto mb-6">
                                    <Zap className="text-emerald-400 size-8" />
                                </div>
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Ready to Deploy?</h3>
                                <p className="text-gray-400 text-lg max-w-md mx-auto">Please ensure all details are correct. Registration cannot be modified once submitted to the network.</p>

                                {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 mt-6">
                                        {error}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                        <button 
                            onClick={prevStep}
                            disabled={step === 0 || isSubmitting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 0 || isSubmitting ? 'opacity-0 pointer-events-none' : 'bg-white/5 text-white hover:bg-white/10'}`}
                        >
                            <ChevronLeft size={18} /> Back
                        </button>

                        <button 
                            onClick={step === 5 ? handleSubmit : nextStep}
                            disabled={!validateStep() || isSubmitting || (isFull && step === 0)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-sm transition-all ${!validateStep() || (isFull && step === 0) ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (isFull && step === 0) ? (
                                "Capacity Full"
                            ) : step === 5 ? (
                                "Submit Registration"
                            ) : (
                                <>Next <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
