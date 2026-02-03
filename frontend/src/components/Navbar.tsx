import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, ShoppingBag, Users, Shield, Heart, Copy, Check, Info, Globe, Server } from 'lucide-react';
import Button from './Button';
import GlassCard from './GlassCard';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = async (text: string, type: 'java' | 'bedrock') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'java') {
        setCopiedJava(true);
        setTimeout(() => setCopiedJava(false), 2000);
      } else {
        setCopiedBedrock(true);
        setTimeout(() => setCopiedBedrock(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-brand-black/80 backdrop-blur-lg border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
             <Link to="/" className="flex items-center gap-2">
               <img src="/images/logo.png" alt="Haven SMP" className="h-8 md:h-12 w-auto" />
             </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
               <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/about" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
               <Users className="w-4 h-4" /> About Us
            </Link>
            <Link to="/trades" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
               <ShoppingBag className="w-4 h-4" /> Shop
            </Link>
            <Link to="/rules" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
               <Shield className="w-4 h-4" /> Rules
            </Link>
            <Link to="/donate" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium">
               <Heart className="w-4 h-4 text-brand-orange" /> Support Us
            </Link>
          </div>

          {/* CTA / Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Button size="sm" className="hidden md:inline-flex" variant="primary" onClick={() => setShowJoinModal(true)}>
              Join Server
            </Button>
            
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-brand-black/95 backdrop-blur-xl border-b border-white/5 p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-5">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
               <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
               <Users className="w-4 h-4" /> About Us
            </Link>
            <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
               <ShoppingBag className="w-4 h-4" /> Shop
            </Link>
            <Link to="/rules" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
               <Shield className="w-4 h-4" /> Rules
            </Link>
            <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
               <Heart className="w-4 h-4 text-brand-orange" /> Support Us
            </Link>
            <div className="pt-4 mt-2 border-t border-white/5">
              <Button className="w-full" size="lg" onClick={() => { setMobileMenuOpen(false); setShowJoinModal(true); }}>Join Server</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowJoinModal(false)}></div>
          
          <GlassCard className="relative w-full max-w-xl border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
                    <Server className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Connect to Haven SMP</h2>
                </div>
                <button onClick={() => setShowJoinModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Java Address */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-cyan/10 rounded-lg flex items-center justify-center text-brand-cyan">
                      <div className="text-xs font-bold">JAVA</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Server Address</div>
                      <div className="text-lg font-mono font-bold text-white">play.peacefulhaven.lol</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('play.peacefulhaven.lol', 'java')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    {copiedJava ? <Check className="w-5 h-5 text-brand-teal" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Bedrock Address */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bedrock IP & Port</div>
                      <div className="text-lg font-mono font-bold text-white">brock.peacefulhaven.lol:19132</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('brock.peacefulhaven.lol:19132', 'bedrock')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    {copiedBedrock ? <Check className="w-5 h-5 text-brand-teal" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 rounded-[2rem] bg-brand-orange/5 border border-brand-orange/20 space-y-3">
                <div className="flex items-center gap-2 text-brand-orange">
                  <Info className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-widest">Important Step</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Upon joining the server, you must run the command <strong className="text-white bg-white/10 px-2 py-0.5 rounded">/rules</strong> in-game. Please read them carefully and accept them to gain full access to the world.
                </p>
              </div>

              <div className="flex justify-center">
                 <Button size="lg" className="w-full" onClick={() => setShowJoinModal(false)}>Got it, let's go!</Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default Navbar;
