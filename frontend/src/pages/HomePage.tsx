import { useQuery } from '@tanstack/react-query';
import { serverApi, tradeApi, playerApi } from '@/services/api';
import { Users, ShoppingBag, Clock, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { data: recentTrades } = useQuery({
    queryKey: ['recentTrades'],
    queryFn: () => tradeApi.getRecent(10),
  });

  const { data: topSellers } = useQuery({
    queryKey: ['topSellers'],
    queryFn: () => tradeApi.getTopSellers(5),
  });

  const { data: topPlaytime } = useQuery({
    queryKey: ['topPlaytime'],
    queryFn: () => playerApi.getTopPlaytime(5),
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="card text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Peaceful Haven</h1>
        <p className="text-gray-400 text-lg">
          A peaceful Minecraft community with player-driven economy
        </p>
        <div className="mt-6">
          <p className="text-2xl font-semibold text-primary-400">
            play.peacefulhaven.lol
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Recent Trades"
          value={recentTrades?.data.length || 0}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Top Sellers"
          value={topSellers?.data.length || 0}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-8 h-8" />}
          title="Active Players"
          value={topPlaytime?.data.length || 0}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Total Activity"
          value="Live"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
          <div className="space-y-3">
            {recentTrades?.data.slice(0, 5).map((trade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{trade.player_name}</p>
                  <p className="text-sm text-gray-400">
                    bought from {trade.shop_owner_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-400">
                    {trade.result_item_amount}x {trade.result_item_type.replace('minecraft:', '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Players */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Top Players by Playtime</h2>
          <div className="space-y-3">
            {topPlaytime?.data.map((player, index) => (
              <div
                key={player.uuid}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium">Player {player.uuid.substring(0, 8)}</p>
                </div>
                <p className="text-primary-400 font-medium">
                  {player.playtime_formatted}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="card">
      <div className={`${colorClasses[color]} mb-2`}>{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
