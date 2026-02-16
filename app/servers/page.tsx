"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Server, Crown, ShieldCheck, Settings2 } from "lucide-react";
import Link from "next/link";

interface Guild {
    id: string;
    name: string;
    icon: string | null;
    role: string;
    has_bot: boolean;
    is_premium: boolean;
    prefix: string;
}

export default function ServersPage() {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        let loaded = false;

        const loadGuilds = async (session: any) => {
            if (!isMounted || loaded) return;
            loaded = true;
            setUser(session.user);

            const accessToken = session.provider_token || localStorage.getItem('discord_access_token');

            if (!accessToken) {
                if (isMounted) {
                    setError("Discord access token expired. Please log out and log in again.");
                    setLoading(false);
                }
                return;
            }

            if (session.provider_token) {
                localStorage.setItem('discord_access_token', session.provider_token);
            }

            // Fetch with retry for rate limits
            const fetchWithRetry = async (retries = 2): Promise<void> => {
                try {
                    const response = await fetch("/api/discord/guilds", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (isMounted) setGuilds(data.filter((g: Guild) => g.has_bot));
                    } else if (response.status === 429 && retries > 0) {
                        // Rate limited — wait and retry
                        const body = await response.json().catch(() => ({}));
                        const delay = (body.details?.retry_after || 1) * 1000 + 500;
                        await new Promise(r => setTimeout(r, delay));
                        return fetchWithRetry(retries - 1);
                    } else if (response.status === 401) {
                        localStorage.removeItem('discord_access_token');
                        if (isMounted) setError("Discord session expired. Please log out and log in again.");
                    } else {
                        if (isMounted) setError("Failed to fetch servers. Try logging in again.");
                    }
                } catch (err) {
                    if (isMounted) setError("Network error. Please try again.");
                }
            };

            await fetchWithRetry();
            if (isMounted) setLoading(false);
        };

        // Use getSession only — no duplicate from onAuthStateChange
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            if (session) {
                loadGuilds(session);
            } else {
                // Wait briefly for session to restore from cookies
                setTimeout(() => {
                    if (!isMounted) return;
                    supabase.auth.getSession().then(({ data: { session: retry } }) => {
                        if (!isMounted) return;
                        if (retry) {
                            loadGuilds(retry);
                        } else {
                            router.push("/");
                        }
                    });
                }, 1000);
            }
        });

        return () => { isMounted = false; };
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
                <Loader2 size={48} className="text-primary animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Loading your servers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4 px-4">
                <Shield size={48} className="text-red-400" />
                <p className="text-red-400 text-center max-w-md">{error}</p>
                <button
                    onClick={async () => {
                        localStorage.removeItem('discord_access_token');
                        await supabase.auth.signOut();
                        router.push("/");
                    }}
                    className="px-6 py-2 bg-primary hover:bg-primary/80 text-black font-bold rounded-lg transition-all"
                >
                    Log In Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Server className="text-primary" size={28} />
                            My <span className="text-primary">Servers</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Servers where Argon is active and you have admin permissions
                        </p>
                    </div>
                    <span className="text-gray-400 text-sm hidden sm:block">
                        Logged in as <span className="text-white font-bold">{user?.user_metadata?.full_name}</span>
                    </span>
                </div>

                {/* Guild Grid */}
                {guilds.length === 0 ? (
                    <div className="text-center py-20 bg-primary/5 rounded-2xl border border-primary/20">
                        <Shield size={64} className="mx-auto text-primary/50 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Servers Found</h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Argon is not in any of your admin servers. Add the bot to a server first.
                        </p>
                        <a
                            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1470031097357140063"}&permissions=8&integration_type=0&scope=applications.commands+bot`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 px-6 py-3 bg-primary hover:bg-primary/80 text-black font-bold rounded-lg transition-all"
                        >
                            Add Argon to a Server
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {guilds.map((guild, index) => (
                            <div
                                key={guild.id}
                                className="bg-primary/5 border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 group relative overflow-hidden animate-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Premium badge */}
                                {guild.is_premium && (
                                    <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-yellow-500/30 flex items-center gap-1">
                                        <Crown size={12} />
                                        <span>PREMIUM</span>
                                    </div>
                                )}

                                {/* Server Info */}
                                <div className="flex items-center gap-4 mb-4">
                                    {guild.icon ? (
                                        <img
                                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                            alt={guild.name}
                                            className="w-16 h-16 rounded-full border-2 border-primary/30 group-hover:border-primary/80 transition-colors"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/30">
                                            {guild.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate" title={guild.name}>
                                            {guild.name}
                                        </h3>
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${guild.role === 'Owner'
                                                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                                                : 'text-primary/80 bg-primary/10 border-primary/20'
                                                }`}>
                                                {guild.role === 'Owner' && <Crown size={10} className="inline mr-1 -mt-0.5" />}
                                                {guild.role === 'Admin' && <ShieldCheck size={10} className="inline mr-1 -mt-0.5" />}
                                                {guild.role}
                                            </span>
                                            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Manage Button */}
                                <Link
                                    href={`/servers/${guild.id}`}
                                    className="flex w-full bg-primary hover:bg-primary/80 text-black font-bold py-2.5 rounded-lg text-sm transition-all items-center justify-center gap-2 hover:shadow-[0_0_15px_var(--color-primary-glow)] mt-4"
                                >
                                    <Settings2 size={16} />
                                    Manage
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
