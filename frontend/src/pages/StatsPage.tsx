// frontend/src/pages/StatsPage.tsx

import React, { useState, useEffect } from 'react';
import { statsApi, type StatsDashboard, type StatLeaderboard, type TopPlayer } from '../services'; // Import the new types
import { Link } from 'react-router-dom';

// --- Utility: Format a large number (e.g., 10000 -> 10,000) ---
const formatValue = (value: number): string => value.toLocaleString();

// --- Component 1: Single Leaderboard Card ---
const LeaderboardCard: React.FC<{ stat: StatLeaderboard }> = ({ stat }) => (
    <div style={{
        backgroundColor: '#2A2A2A',
        border: '1px solid var(--color-primary)',
        borderRadius: '8px',
        padding: '15px',
        margin: '0 0 20px 0',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        minWidth: '300px',
    }}>
        <h3 style={{ 
            color: 'var(--color-accent)', 
            margin: '0 0 10px 0', 
            fontSize: '1.2em', 
            borderBottom: '1px solid #333',
            paddingBottom: '5px'
        }}>
            Top {stat.stat_label}
        </h3>
        
        {stat.top_players.map((player) => (
            <div key={player.uuid} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '5px 0',
                borderBottom: '1px dotted #333'
            }}>
                {/* Rank and Player Name */}
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    #{player.rank} {player.player_name}
                </span>
                
                {/* Value */}
                <span style={{ color: 'var(--color-text-light)', fontSize: '1em' }}>
                    {formatValue(player.value)}
                </span>
            </div>
        ))}
        <p style={{ textAlign: 'right', margin: '10px 0 0 0', fontSize: '0.8em' }}>
            <Link to={`/stats/leaderboard/${stat.stat_id}`} style={{ color: 'var(--color-primary)' }}>
                View Full
            </Link>
        </p>
    </div>
);

// --- Component 2: Awards Overview (Simple List of available stats) ---
const AwardsOverview: React.FC<{ awards: { id: string; label: string }[] }> = ({ awards }) => (
    <div style={{
        backgroundColor: '#2A2A2A',
        border: '1px solid var(--color-accent)',
        borderRadius: '8px',
        padding: '20px',
        height: '100%',
    }}>
        <h3 style={{ 
            color: 'var(--color-primary)', 
            margin: '0 0 15px 0', 
            fontSize: '1.4em', 
            borderBottom: '1px solid #333',
            paddingBottom: '5px',
            textAlign: 'center'
        }}>
            Awards Overview
        </h3>
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Two columns for the awards list
            gap: '10px',
            maxHeight: '600px', // Restrict height and enable scroll
            overflowY: 'auto',
            paddingRight: '10px'
        }}>
            {awards.map(award => (
                <span key={award.id} style={{ 
                    color: 'var(--color-text-light)', 
                    fontSize: '0.9em', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    🏅 {award.label}
                </span>
            ))}
        </div>
    </div>
);


const StatsPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<StatsDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await statsApi.getDashboard();
                setDashboardData(response.data);
            } catch (err) {
                console.error("Stats API failed:", err);
                setDashboardData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Statistical Data...</div>;
    if (!dashboardData) return <div style={{ padding: '40px', color: '#ff6b6b', textAlign: 'center' }}>Failed to load server statistics.</div>;

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1600px', 
            margin: '0 auto', 
            backgroundColor: 'var(--color-bg-dark)' 
        }}>
            <h1 style={{ 
                color: 'var(--color-accent)', 
                textAlign: 'center', 
                fontSize: '3em', 
                marginBottom: '10px',
                letterSpacing: '3px',
                borderBottom: '2px solid var(--color-primary)',
                paddingBottom: '10px'
            }}>
                SERVER STATISTICS
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-subtle)', marginBottom: '40px' }}>
                Total Cached Players: {formatValue(dashboardData.summary.total_players_cached)} | Total Stats Tracked: {dashboardData.summary.total_stats_available}
            </p>

            {/* Main Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr', // 75% for leaderboards, 25% for awards
                gap: '40px'
            }}>
                
                {/* 1. Leaderboards Section (3fr) */}
                <div>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px', fontSize: '1.8em' }}>Top Leaderboards</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Auto-fill grid
                        gap: '30px'
                    }}>
                        {dashboardData.leaderboards.map(stat => (
                            <LeaderboardCard key={stat.stat_id} stat={stat} />
                        ))}
                    </div>
                </div>

                {/* 2. Awards/Summary Section (1fr) */}
                <div>
                    <AwardsOverview awards={dashboardData.awards_overview} />
                </div>
            </div>
            
        </div>
    );
};

export default StatsPage;
