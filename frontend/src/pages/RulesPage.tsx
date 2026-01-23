import React, { useState } from 'react';
import { ChevronDown, Users, Pickaxe, AlertCircle } from 'lucide-react';

export default function RulesPage() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const ruleCategories = [
    {
      id: 0,
      title: 'Community Rules',
      icon: Users,
      color: '#4ecdc4',
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
      color: '#95e1d3',
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
    <div className="rules-page">
      {/* Animated Background */}
      <div className="bg-animation"></div>
      <div className="bg-grid"></div>

      {/* Main Content */}
      <div className="rules-wrapper">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-glow">Server Rules</span>
            </h1>
            <p className="hero-subtitle">
              Maintain integrity, respect, and fun for everyone in HAVEN SMP
            </p>
          </div>
          <div className="hero-accent"></div>
        </div>

        {/* Alert Banner */}
        <div className="alert-banner">
          <AlertCircle size={20} />
          <span>Violations may result in warnings, mutes, bans, or permanent removal</span>
        </div>

        {/* Rules Container */}
        <div className="rules-container">
          {ruleCategories.map((category) => {
            const IconComponent = category.icon;
            const isExpanded = expandedCategory === category.id;

            return (
              <div
                key={category.id}
                className={`rule-card ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="rule-card-header"
                  onClick={() => toggleCategory(category.id)}
                  style={{ '--accent-color': category.color } as React.CSSProperties}
                >
                  <div className="header-left">
                    <div className="icon-wrapper" style={{ backgroundColor: `${category.color}15` }}>
                      <IconComponent size={24} style={{ color: category.color }} />
                    </div>
                    <div className="header-text">
                      <h2 className="category-title">{category.title}</h2>
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`chevron ${isExpanded ? 'rotated' : ''}`}
                    style={{ color: category.color }}
                  />
                </button>

                {isExpanded && (
                  <div className="rule-card-content">
                    {category.sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="rule-section">
                        <h3 className="section-subtitle">{section.subtitle}</h3>
                        <div className="rules-list">
                          {section.rules.map((rule, ruleIdx) => (
                            <div key={ruleIdx} className="rule-item">
                              <p className="rule-text">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="rules-footer">
          <div className="footer-content">
            <h3>Questions?</h3>
            <p>Ask a staff member in-game or join our Discord</p>
            <a href="https://discord.gg/MmUgh5YFvM" target="_blank" rel="noopener noreferrer" className="discord-link">
              Join Our Discord Server
            </a>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .rules-page {
          background-color: var(--bg-dark);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 50%, rgba(78, 205, 196, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .bg-grid {
          display: none;
        }

        .rules-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        /* Hero Section */
        .hero-section {
          margin-bottom: 50px;
          position: relative;
        }

        .hero-content {
          text-align: center;
          animation: fadeInDown 0.8s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 15px;
          letter-spacing: -2px;
        }

        .title-glow {
          background: linear-gradient(135deg, #4ecdc4, #95e1d3, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.6)); }
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #b0bec5;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .hero-accent {
          height: 3px;
          width: 60px;
          background: linear-gradient(#272a3d1a 0%,#272a3d66 100%);
          margin: 20px auto;
          border-radius: 2px;
        }

        /* Alert Banner */
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 160, 77, 0.1));
          border: 1.5px solid rgba(255, 107, 107, 0.3);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 40px;
          color: #ffa94d;
          font-weight: 500;
          backdrop-filter: blur(10px);
          animation: slideInUp 0.6s ease-out 0.2s both;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Rules Container */
        .rules-container {
          display: grid;
          gap: 16px;
          margin-bottom: 50px;
        }

        .rule-card {
          background: linear-gradient(135deg, #374957, #37474f);
          border: 1.5px solid rgba(78, 205, 196, 0.1);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .rule-card:nth-child(1) { animation-delay: 0.1s; }
        .rule-card:nth-child(2) { animation-delay: 0.15s; }

        .rule-card:hover {
          border-color: #22acb1;
          box-shadow: 0 12px 40px rgba(78, 205, 196, 0.15);
          transform: translateY(-4px);
        }

        .rule-card.expanded {
          border-color: #212734;
          box-shadow: 0 12px 40px rgba(78, 205, 196, 0.2);
        }

        /* Card Header */
        .rule-card-header {
          width: 100%;
          background: linear-gradient(#272a3d1a 0%,#272a3d66 100%);
          border: none;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .rule-card-header:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
          flex: 1;
        }

        .icon-wrapper {
          min-width: 48px;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .rule-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .header-text {
          flex: 1;
        }

        .category-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ecf0f1;
          margin: 0;
        }

        .chevron {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        /* Card Content */
        .rule-card-content {
          padding: 0 24px 24px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rule-section {
          margin-bottom: 24px;
        }

        .rule-section:last-child {
          margin-bottom: 0;
        }

        .section-subtitle {
          font-size: 1rem;
          font-weight: 700;
          color: #4ecdc4;
          margin-bottom: 12px;
          text-transform: capitalize;
        }

        .rules-list {
          display: grid;
          gap: 8px;
        }

        .rule-item {
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .rule-item:hover {
          background: rgba(255, 255, 255, 0.05);
          padding-left: 18px;
        }

        .rule-text {
          color: #ecf0f1;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Footer */
        .rules-footer {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.05), rgba(149, 225, 211, 0.05));
          border: 1.5px solid rgba(78, 205, 196, 0.2);
          border-radius: 14px;
          padding: 40px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .footer-content h3 {
          font-size: 1.4rem;
          color: #4ecdc4;
          margin-bottom: 8px;
        }

        .footer-content p {
          color: #b0bec5;
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        .discord-link {
          display: inline-block;
          background: linear-gradient(135deg, #4ecdc4, #95e1d3);
          color: #2d3436;
          padding: 12px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }

        .discord-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .rules-wrapper {
            padding: 40px 16px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 0.95rem;
          }

          .rule-card-header {
            padding: 18px;
          }

          .category-title {
            font-size: 1.2rem;
          }

          .rule-item {
            padding: 8px 12px;
          }

          .rules-footer {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
