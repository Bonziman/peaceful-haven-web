import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Youtube, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-brand-black border-t border-white/5 pt-12 pb-8 mt-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4 col-span-1 md:col-span-1">
                         <div className="flex items-center gap-2">
                             <img src="/images/logo.png" alt="Haven SMP Logo" className="h-10 w-auto opacity-90 rounded-lg" />
                         </div>
                         <p className="text-slate-400 text-sm leading-relaxed">
                             A vanilla survival community built on trust, economy, and longevity.
                         </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Server</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/" className="hover:text-brand-cyan transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-brand-cyan transition-colors">About Us</Link></li>
                            <li><Link to="/donate" className="hover:text-brand-cyan transition-colors">Shop</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="https://discord.peacefulhaven.lol/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">Discord</a></li>
                            <li><Link to="/rules" className="hover:text-brand-cyan transition-colors">Rules</Link></li>
                            <li><a href="#" className="hover:text-brand-cyan transition-colors">Vote</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="https://discord.peacefulhaven.lol/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-brand-blue hover:text-white transition-all text-slate-400">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-slate-400">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-cyan hover:text-white transition-all text-slate-400">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>&copy; {new Date().getFullYear()} Haven SMP. All rights reserved.</p>
                    <p>Not affiliated with Mojang Studios or Microsoft.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
