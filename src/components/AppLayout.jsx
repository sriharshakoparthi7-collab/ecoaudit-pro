import { Outlet, Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { LayoutDashboard, Leaf } from 'lucide-react';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="no-print sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">Sustainability Wise</span>
          </Link>
          <div className="flex items-center gap-3">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}
            <button
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors border border-border rounded-md px-3 py-1.5"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>
    </div>
  );
}