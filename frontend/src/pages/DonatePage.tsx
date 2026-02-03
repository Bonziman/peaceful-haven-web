// frontend/src/pages/DonatePage.tsx
import { ShieldAlert, Heart, Zap, Sparkles, Gem, ExternalLink } from 'lucide-react';
import { RANKS, getStartingPrice } from '../data/ranks';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

export default function DonatePage() {
  return (
    <div className="relative min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-brand-orange/30 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-orange/10 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* --- Hero Section --- */}
        <header className="text-center mb-16 space-y-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-brand-orange/5 blur-[120px] -z-10"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">
            <Heart className="w-3.5 h-3.5" /> Support the Community
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Fuel the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-teal text-glow">Haven.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every donation directly supports our <strong className="text-white">hosting, maintenance, and growth.</strong> Help us keep Haven SMP 100% independent.
          </p>
        </header>

        {/* --- Warning Banner --- */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2rem] bg-brand-orange/5 border border-brand-orange/20 text-brand-orange shadow-lg shadow-brand-orange/5 backdrop-blur-md">
            <div className="p-4 bg-brand-orange/10 rounded-2xl">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white tracking-tight">Zero Pay-to-Win Policy</h3>
              <p className="text-brand-orange/80 leading-relaxed text-sm">
                Ranks offer <strong className="text-white">zero competitive advantage</strong>. All perks are 100% cosmetic or social.
              </p>
            </div>
          </div>
        </div>

        {/* --- Ranks Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 auto-rows-fr">
  {RANKS.map((rank) => {
    const startPrice = getStartingPrice(rank);
    return (
      <GlassCard key={rank.id} className="flex flex-col border-white/5 group hover:border-brand-blue/30 transition-all p-8 relative overflow-hidden">
        {/* Visual Accent Gradient */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-blue/10 blur-[80px] group-hover:bg-brand-blue/20 transition-colors"></div>
        
        <div className="relative flex flex-col h-full">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{rank.subtitle}</span>
              <h3 className="text-3xl font-black text-white tracking-tight leading-none" style={{ color: rank.color }}>
                {rank.title}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5 shrink-0">
              {rank.accent_emoji}
            </div>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-slate-400 text-sm font-medium">Starting from</span>
            <span className="text-4xl font-black text-white tracking-tighter">€{startPrice.price}</span>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ {startPrice.duration.toLowerCase()}</span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {rank.description}
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8"></div>

          {/* Perks List (Grows to fill space) */}
          <ul className="space-y-4 flex-1">
            {rank.key_features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <Sparkles className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {rank.monthly_rewards.map((reward, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-blue font-medium">
                <Zap className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{reward}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button (Always at bottom) */}
          <Button 
            onClick={() => window.open(rank.base_url, '_blank')}
            className="w-full justify-center group/btn py-6 text-lg mt-8" 
            icon={<ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
          >
            Select Rank
          </Button>
        </div>
      </GlassCard>
    );
  })}
</div>

        {/* --- Mechanics Explained --- */}
        <section className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-blue/5 blur-[120px] -z-10"></div>

          <GlassCard className="max-w-5xl mx-auto p-12 md:p-16 border-white/5 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3 space-y-6 text-center md:text-left">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-3xl flex items-center justify-center text-brand-blue mx-auto md:mx-0">
                  <Gem className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Rank Mechanics</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  How our cosmetic system and rank persistence works.
                </p>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 gap-8 border-l border-white/5 md:pl-12">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-brand-orange rounded-full"></div>
                    Cosmetic Keys
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Keys grant access to cosmetic chests. Unlocked items are yours for <strong className="text-white">3 months</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-brand-blue rounded-full"></div>
                    Active Rank Requirement
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You must have an <strong className="text-white">active rank</strong> to use cosmetics. If your rank expires, items are temporarily locked until renewal.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        <footer className="text-center pt-32 pb-12">
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
            Thank you for supporting <span className="text-white">Haven SMP</span>.
          </p>
        </footer>
      </div>
    </div>
  );
}
