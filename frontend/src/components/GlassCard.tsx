import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl
        border border-white/5
        bg-deep-slate/80 backdrop-blur-md
        minecraft-card-shadow
        transition-all duration-300
        flex flex-col
        ${hoverEffect ? 'hover:bg-deep-slate/90 hover:border-brand-blue/30 hover:shadow-brand-blue/10 hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Glossy top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {/* Subtle corner glow */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-blue/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />
      
      {children}
    </div>
  );
};

export default GlassCard;
