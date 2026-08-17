import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { Badge } from '../common/Badge';
import { cn } from '../../utils';
import { ROUTES } from '../../constants/theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopNavProps {
  breadcrumbs?: BreadcrumbItem[];
}

export const TopNav: React.FC<TopNavProps> = ({ breadcrumbs = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'AU';

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-20">
      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search devices, alerts..."
            className="pl-8 pr-3 py-1.5 text-xs bg-surface-secondary border border-border rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <button
            id="notifications-btn"
            onClick={() => { setShowNotifs((v) => !v); setShowProfile(false); }}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 bg-critical-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-border rounded-card shadow-card-lg z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Notifications</span>
                <Badge variant="severity" severity="critical" dot>3 new</Badge>
              </div>
              <div className="divide-y divide-border">
                {[
                  { msg: 'Core-Router-01 CPU at 95%', time: '2m ago', type: 'critical' as const },
                  { msg: 'FW-Primary traffic spike', time: '8m ago', type: 'warning' as const },
                  { msg: 'Server-DB-02 disk at 90%', time: '15m ago', type: 'critical' as const },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-surface-secondary cursor-pointer flex gap-3">
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                      n.type === 'critical' ? 'bg-critical-600' : 'bg-warning-500'
                    )} />
                    <div>
                      <p className="text-xs text-text-primary font-medium">{n.msg}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-border">
                <button className="text-xs text-primary-600 hover:underline font-medium">
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            id="profile-menu-btn"
            onClick={() => { setShowProfile((v) => !v); setShowNotifs(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-teal-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-text-primary leading-tight">{user?.name}</p>
              <p className="text-[10px] text-text-muted leading-tight capitalize">{user?.role}</p>
            </div>
            <ChevronDown className={cn('h-3 w-3 text-text-muted transition-transform', showProfile && 'rotate-180')} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-border rounded-card shadow-card-lg z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs font-semibold text-text-primary">{user?.name}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">
                  <User className="h-3.5 w-3.5" />
                  Profile
                </button>
                <button
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs text-critical-600 hover:bg-critical-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
