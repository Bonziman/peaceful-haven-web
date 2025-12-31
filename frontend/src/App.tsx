import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home, Store, TrendingUp, Users, Server } from 'lucide-react';
import HomePage from './pages/HomePage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          {/* Navigation */}
          <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Peaceful Haven</span>
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <NavLink to="/" icon={<Home className="w-5 h-5" />}>
                    Home
                  </NavLink>
                  <NavLink to="/shops" icon={<Store className="w-5 h-5" />}>
                    Shops
                  </NavLink>
                  <NavLink to="/leaderboard" icon={<TrendingUp className="w-5 h-5" />}>
                    Leaderboard
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-400">
                © 2025 Peaceful Haven. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavLink({ to, icon, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default App;
