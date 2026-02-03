import React, { useState } from 'react';
import { Copy, Check, Server, Shield, Globe, Users, ShoppingBag, MessageCircle, Map as MapIcon, Calendar, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

// --- Components ---

const ItemSlot = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`w-14 h-14 bg-black/40 border-2 border-white/10 rounded-lg shadow-inner flex items-center justify-center relative ${className}`}>
        {/* Inner shadow/bevel effect */}
        <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none"></div>
        <div className="relative z-10 text-white drop-shadow-md transform transition-transform hover:scale-110 duration-200">
            {children}
        </div>
    </div>
);

const ServerAddressCard = ({ type, address, icon }: { type: string; address: string; icon: React.ReactNode }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <button 
            onClick={handleCopy}
            className="group relative text-left w-full sm:w-auto animate-float hover:animation-pause"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative flex items-center gap-4 bg-deep-slate px-6 py-4 rounded-xl border border-white/10 hover:bg-slate-900 transition-colors">
                <ItemSlot className="bg-brand-blue/10 border-brand-blue/20">
                    {icon}
                </ItemSlot>
                <div>
                    <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-0.5 flex items-center gap-2">
                        {type}
                        {copied && <span className="text-brand-teal animate-fade-in-up text-[10px]">COPIED!</span>}
                    </div>
                    <div className="text-lg font-mono text-white font-bold tracking-tight">{address}</div>
                </div>
                <div className="ml-4 pl-4 border-l border-white/10 text-slate-500 group-hover:text-white transition-colors">
                    {copied ? <Check className="w-5 h-5 text-brand-teal" /> : <Copy className="w-5 h-5" />}
                </div>
            </div>
        </button>
    );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight relative inline-block">
            {title}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent rounded-full opacity-70"></div>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {subtitle}
        </p>
    </div>
);

const HomePage: React.FC = () => {
    const [status] = useState({ online: true, players: 12, max: 100 });

    return (
        <div className="relative min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-brand-orange/30">
            {/* Ambient Background Noise */}
            <div className="fixed inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
            
            {/* Dynamic Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-blue/10 to-transparent z-0 pointer-events-none"></div>

            {/* --- HERO SECTION --- */}
            <section className="relative flex items-center justify-center min-h-[95vh] px-4 pt-20 pb-16 overflow-hidden z-10">
                {/* Glow Orbs */}
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center z-10 space-y-10">
                    <div className="inline-flex animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <StatusBadge online={status.online} playerCount={status.players} maxPlayers={status.max} />
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white animate-fade-in-up drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
                        A <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-teal text-glow">Haven</span> World,
                        <br />
                        <span className="relative">
                            Built to Last.
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-orange opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-300 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        No claims. No grief. Just pure <strong className="text-white">Vanilla Survival</strong> with a community that cares.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <ServerAddressCard 
                            type="Java Edition" 
                            address="play.peacefulhaven.lol" 
                            icon={<Server className="w-6 h-6 text-brand-cyan" />}
                        />
                        <ServerAddressCard 
                            type="Bedrock Edition" 
                            address="brock.peacefulhaven.lol" 
                            icon={<Globe className="w-6 h-6 text-brand-orange" />}
                        />
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="px-4 py-32 relative z-10 bg-gradient-to-b from-transparent to-brand-black/50">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading 
                        title="Why Haven SMP?" 
                        subtitle="We believe in the original Minecraft experience: just you, your friends, and a world of infinite possibilities."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <GlassCard className="p-8 space-y-8" hoverEffect>
                            <div className="flex justify-between items-start">
                                <ItemSlot className="bg-brand-blue/20 border-brand-blue/30">
                                   <Globe className="w-7 h-7 text-brand-blue" />
                                </ItemSlot>
                            </div>
                            <div className="mt-8 space-y-4">
                                <h3 className="text-2xl font-bold text-white group-hover:text-brand-blue transition-colors">Cross-Play Ready</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Whether on PC, Console, or Mobile, play together seamlessly. One world, one community, no barriers.
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 space-y-8" hoverEffect>
                            <div className="flex justify-between items-start">
                                <ItemSlot className="bg-brand-orange/20 border-brand-orange/30">
                                   <Shield className="w-7 h-7 text-brand-orange" />
                                </ItemSlot>
                            </div>
                            <div className="mt-8 space-y-4">
                                <h3 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors">Protected & Safe</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Trust-based gameplay with powerful CoreProtect logging. Staff can rollback any grief instantly. Your builds are safe.
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 space-y-8" hoverEffect>
                            <div className="flex justify-between items-start">
                                <ItemSlot className="bg-brand-teal/20 border-brand-teal/30">
                                   <ShoppingBag className="w-7 h-7 text-brand-teal" />
                                </ItemSlot>
                            </div>
                            <div className="mt-8 space-y-4">
                                <h3 className="text-2xl font-bold text-white group-hover:text-brand-teal transition-colors">Player Economy</h3>
                                <p className="text-slate-400 leading-relaxed">
                                     A thriving trade-based economy centered around player shops.
                                </p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* --- COMMUNITY SECTION --- */}
            <section className="px-4 py-24 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-brand-blue/5 skew-y-3 transform origin-top-left -z-10"></div>
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-bold tracking-wider uppercase mb-2">
                                The Vibe
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                A Community, <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Not Just a Server.</span>
                            </h2>
                            <p className="text-xl text-slate-300 leading-relaxed">
                                Haven SMP isn't about grinding to be the richest. It's about logging in after a long day and relaxing with friends in a world that feels like home.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { icon: Users, title: "Active Discord", desc: "Voice chats, movie nights, and showcases.", color: "text-brand-orange" },
                                { icon: Calendar, title: "Weekly Events", desc: "Boat races, build battles, and PVP arenas.", color: "text-brand-teal" },
                                { icon: MapIcon, title: "Online Map", desc: "View the world and find friends in real-time.", color: "text-brand-cyan" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                                    <div className={`p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform ${item.color} shadow-lg`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                        <p className="text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button 
                                variant="outline" 
                                size="lg" 
                                icon={<MessageCircle className="w-5 h-5"/>} 
                                className="border-2 hover:bg-brand-blue hover:border-brand-blue hover:text-white transition-all"
                                onClick={() => window.open('https://discord.peacefulhaven.lol/', '_blank')}
                            >
                                Join our Discord
                            </Button>
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-brand-cyan rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                        <GlassCard className="p-3 bg-slate-900/50 backdrop-blur-sm border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="rounded-xl overflow-hidden aspect-video bg-slate-800 relative group">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-[url('/images/hero1.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </section>

             {/* --- RULES / HANDBOOK SECTION --- */}
             <section className="px-4 py-32 bg-deep-slate z-10 relative">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                 
                <div className="max-w-6xl mx-auto">
                    <SectionHeading 
                        title="The Handbook" 
                        subtitle="Simple rules, better gameplay. Don't be a jerk, and you'll fit right in." 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "No Griefing", desc: "We roll back damage instantly. Griefers are banned permanently.", icon: Shield },
                            { title: "No Stealing", desc: "Chests are open, but taking items that aren't yours is forbidden.", icon: ShoppingBag },
                            { title: "Respect Everyone", desc: "Zero tolerance for hate speech or harassment. Be kind.", icon: Users },
                            { title: "No Cheating", desc: "X-ray, fly hacks, and auto-clickers result in an immediate ban.", icon: Server }
                        ].map((rule, idx) => (
                            <div key={idx} className="flex items-start gap-6 p-6 rounded-2xl bg-obsidian border border-white/5 hover:border-brand-orange/30 transition-colors group">
                                <div className="mt-1">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        {rule.title}
                                    </h4>
                                    <p className="text-slate-400 leading-relaxed">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="px-4 py-24 z-10 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-24 text-center group">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-cyan opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-700"></div>
                        <div className="absolute inset-0 bg-deep-slate/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem]"></div>
                        
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">
                                Ready to Start?
                            </h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                The world is waiting. Join over <span className="text-brand-orange font-bold">100+</span> active players and build something amazing today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                                <Button 
                                    size="lg" 
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText('play.peacefulhaven.lol');
                                            alert('Java Address Copied!');
                                        } catch (err) {
                                            console.error('Failed to copy: ', err);
                                        }
                                    }} 
                                    className="text-lg px-10 py-6 bg-brand-orange hover:bg-orange-500 shadow-xl shadow-brand-orange/20 hover:scale-105 transition-transform"
                                >
                                    Copy IP Address
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="secondary" 
                                    className="text-lg px-10 py-6 hover:bg-white/10 hover:text-white border-2 border-transparent hover:border-white/20"
                                    onClick={() => window.location.href = '/donate'}
                                >
                                    Visit Store <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
