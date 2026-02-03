// frontend/src/pages/AboutPage.tsx

import { Shield, Heart, Anchor, Users, Sword, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-brand-orange/30 overflow-x-hidden">
      {/* Ambient Background Noise */}
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-orange/10 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-24">
        {/* --- Hero Section --- */}
        <header className="text-center mb-24 space-y-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-brand-orange/5 blur-[120px] -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">
            <Anchor className="w-3.5 h-3.5" /> Our Origin Story
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Freedom by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-teal text-glow">Design.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Haven SMP wasn't built to be a <span className="text-white font-medium italic underline decoration-brand-orange/40 underline-offset-8">business</span>. <br className="hidden md:block"/>
            It was built as an escape from one.
          </p>
        </header>

        {/* --- The Story Sections --- */}
        <div className="space-y-32">
          
          {/* Section 1: The Breaking Point */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block p-3 bg-red-500/10 rounded-2xl text-red-400 shadow-lg shadow-red-500/5">
                <Sword className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Tired of the <br/>
                <span className="text-red-400">Dictatorship.</span>
              </h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  We used to be part of a large community, but something was wrong. The owners acted like dictators, silencing feedback and ignoring the people who made the server what it was.
                </p>
                <p>
                  They promised "No P2W" while selling advantages behind the scenes. They promised "Vanilla" while cluttering the game with plugins. When we spoke up, we were met with bans instead of dialogue.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-orange/20 blur-3xl rounded-full animate-pulse"></div>
              <GlassCard className="p-2 border-white/5 rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                 <img src="/images/meh-server.jpg" alt="Old Community" className="rounded-xl w-full h-auto grayscale opacity-80" />
              </GlassCard>
            </div>
          </div>

          {/* Section 2: The Foundation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-brand-blue/20 blur-3xl rounded-full"></div>
              <GlassCard className="p-2 border-white/5 -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                 <img src="/images/hero2.png" alt="Haven SMP Launch" className="rounded-xl w-full h-auto" />
              </GlassCard>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-block p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                <Star className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                A Fresh Start: <br/>
                <span className="text-brand-blue">Haven SMP.</span>
              </h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  I decided enough was enough. Alongside <strong className="text-white">Easter</strong> and a close group of friends who were all tired of the same toxicity, we set out to build a better place.
                </p>
                <p>
                  Originally called Peaceful Haven, we evolved into <strong className="text-white">Haven SMP</strong>: a name that reflects our own unique identity, separate from the servers of our past. 
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-brand-orange font-black text-xl mb-1">Founders</div>
                  <div className="text-slate-400 text-sm">Aymane & Easter</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-brand-blue font-black text-xl mb-1">Mission</div>
                  <div className="text-slate-400 text-sm">Pure Community</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: The Promise */}
          <section className="relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-blue/5 blur-[120px] -z-10"></div>
             <div className="max-w-4xl mx-auto text-center space-y-12">
                <SectionHeading 
                   title="Our Promise to You" 
                   subtitle="We built Haven SMP on the values that were missing from our old home." 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                   <PromiseCard 
                      icon={Heart} 
                      title="Community over Profit" 
                      desc="No fake P2W promises. No hidden agendas. The server exists for the players, not the owner's pockets."
                   />
                   <PromiseCard 
                      icon={Shield} 
                      title="Total Transparency" 
                      desc="Feedback is not a bannable offense here. It's our fuel. We listen, we adapt, and we grow together."
                   />
                   <PromiseCard 
                      icon={Users} 
                      title="Group of Friends" 
                      desc="We started as a group of friends exiled for speaking up. We'll always treat you like a person, not a statistic."
                   />
                   <PromiseCard 
                      icon={Anchor} 
                      title="True Vanilla" 
                      desc="No clutter. No confusing lobby. Just the pure Minecraft experience you fell in love with."
                   />
                </div>
             </div>
          </section>

          {/* --- Gallery Section --- */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white tracking-tight">Snapshot of our World</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { src: "/images/hero1.png", alt: "Haven View" },
                { src: "/images/hero3.png", alt: "Haven Trials Event" },
                { src: "/images/beeeees.png", alt: "Beeeees" },
                { src: "/images/nether iceways.png", alt: "Nether Iceways" },
                { src: "/images/sage fishing.png", alt: "Sage Fishing" },
                { src: "/images/sages carl's tavern.png", alt: "Carl's Tavern" },
                { src: "/images/maid wardens.png", alt: "Maid Wardens" },
                { src: "/images/image3.png", alt: "Random Image" },
                { src: "/images/image5.png", alt: "Random Image" },
              ].map((img, i) => (
                <div key={i} className="group overflow-hidden rounded-3xl border border-white/10 aspect-video relative">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm font-medium">{img.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Final CTA --- */}
          <section className="text-center space-y-8 pt-12">
             <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Become part of the story.</h2>
             <div className="flex justify-center gap-4">
                <Button 
                   size="lg" 
                   className="px-12 py-6 text-xl"
                   onClick={() => window.open('https://discord.peacefulhaven.lol/', '_blank')}
                >
                   Join the Group
                </Button>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Helper Components
const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
);

const PromiseCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
   <GlassCard className="p-8 border-white/5 group hover:border-brand-blue/30 transition-all text-left">
      <div className="p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:bg-brand-blue/10 transition-colors">
         <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
   </GlassCard>
);
