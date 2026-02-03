// frontend/src/pages/RulesPage.tsx

import { useState } from 'react';
import { ChevronDown, Users, Pickaxe, AlertCircle, Shield, MessageCircle, Info } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

export default function RulesPage() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const ruleCategories = [
    {
      id: 0,
      title: 'Community Rules',
      icon: Users,
      color: '#ED8936', // brand-orange
      sections: [
        {
          subtitle: 'Respect each other',
          rules: [
            'No bullying, mocking, or diminishing others.',
            'No discrimination of any shape or form.',
            'No impersonation.',
            'Some trolling is allowed, but always respect requests to stop.',
          ],
        },
        {
          subtitle: 'Chat rules',
          rules: [
            'No spamming.',
            'No religious debates.',
            'No heated arguments of any kind. If it stops being respectful, take it to DMs.',
            'No overly inappropriate conversations. If it makes someone uncomfortable, stop.',
            'When opening a ticket or suggestion thread, provide as much detail as possible. "X is not working" won\'t get us very far.',
          ],
        },
        {
          subtitle: 'Punishments',
          rules: [
            'Do not argue with staff immediately after being given a punishment or an order.',
            'If you feel like a punishment is unfair, open a ticket, and the staff team will produce a final ruling, through a staff poll if necessary.',
            'If a player has broken the rules in a way that affects you, do not try getting revenge or retaliating yourself. Report to staff immediately instead.',
          ],
        },
      ],
    },
    {
      id: 1,
      title: 'Minecraft Rules',
      icon: Pickaxe,
      color: '#2B6CB0', // brand-blue
      sections: [
        {
          subtitle: 'Griefing',
          rules: [
            'No theft of items.',
            'No destruction of property (whether it be blocks, entities or items).',
            'No obnoxious building right next to someone\'s base.',
            'If you wish to start using a previously existing structure as yours, ask staff if it has been abandoned.',
          ],
        },
        {
          subtitle: 'Cheating',
          rules: [
            'No cheats in general (flight, xray, freecam, block placing cheats, etc).',
            'No exploiting bugs. Please report all bugs immediately.',
            'Xaero\'s minimap, worldmap, fullbright, litematica, MiniHUD are expressly allowed.',
            'No auto fishing farms, or other farms that use macros, autoclickers, etc.',
          ],
        },
        {
          subtitle: 'Server performance',
          rules: [
            'Medium to large redstone contraptions must have an off switch.',
            'Chunk loading more than a few chunks is not allowed.',
            'Keep entity counts in farms reasonable.',
          ],
        },
        {
          subtitle: 'PvP',
          rules: [
            'PvP is a consensual activity exclusively.',
            'Teleport killing and trapping are not allowed unless explicitly agreed upon beforehand.',
            'Looting graves without explicit permission is a violation of the first griefing rule.',
          ],
        },
        {
          subtitle: 'Other world rules',
          rules: [
            'No excessive land claiming.',
            'Do not leave pillars, floating trees, etc. behind.',
            'Any structure built at spawn is automatically for public use.',
          ],
        },
      ],
    },
  ];

  const toggleCategory = (id: number) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-slate-100 font-sans selection:bg-brand-orange/30 overflow-x-hidden">
      {/* Ambient Background Noise */}
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none opacity-40"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-orange/10 to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-24">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">
            <Shield className="w-3.5 h-3.5" /> The Handbook
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-teal text-glow">Rules</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Maintain integrity, respect, and fun for everyone in <strong className="text-white">Peaceful Haven</strong>
          </p>
        </header>

        {/* Alert Banner */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 mb-12 animate-fade-in-up shadow-lg shadow-red-500/5">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="text-sm font-medium">
            Violations may result in warnings, mutes, bans, or permanent removal. We value our community peace above all else.
          </p>
        </div>

        {/* Rules Container */}
        <div className="space-y-6">
          {ruleCategories.map((category) => {
            const IconComponent = category.icon;
            const isExpanded = expandedCategory === category.id;

            return (
              <GlassCard 
                key={category.id} 
                className={`overflow-visible border-white/5 ${isExpanded ? 'ring-1 ring-white/10' : ''}`}
                hoverEffect={!isExpanded}
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between group transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-white/10' : 'bg-white/5 group-hover:scale-110'}`} style={{ color: category.color }}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">{category.title}</h2>
                      <p className="text-sm text-slate-500 font-medium tracking-wide">
                        {category.sections.length} Major Sections
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-white/5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-8 space-y-10 animate-fade-in-up">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    
                    {category.sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 rounded-full bg-brand-orange/50"></div>
                          <h3 className="text-xl font-bold text-white tracking-tight">{section.subtitle}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {section.rules.map((rule, ruleIdx) => (
                            <div 
                              key={ruleIdx} 
                              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group/rule"
                            >
                              <div className="mt-1 flex-shrink-0">
                                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover/rule:bg-green-500 group-hover/rule:text-white transition-colors">
                                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                </div>
                              </div>
                              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                {rule}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Footer */}
        <section className="mt-20">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 blur-xl"></div>
            <div className="absolute inset-0 bg-deep-slate/80 backdrop-blur-xl border border-white/10 rounded-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mx-auto mb-6">
                <Info className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Still have questions?</h2>
              <p className="text-lg text-slate-300 max-w-xl mx-auto">
                Ask a staff member in-game or join our Discord for faster support and community discussions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  icon={<MessageCircle className="w-5 h-5" />} 
                  className="bg-brand-blue hover:bg-blue-600 border-none"
                  onClick={() => window.open('https://discord.peacefulhaven.lol/', '_blank')}
                >
                  Join Discord Server
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
