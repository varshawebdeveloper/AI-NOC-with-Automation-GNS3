import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Bell,
  Monitor,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils';
import { ROUTES } from '../../constants/theme';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',         href: ROUTES.DASHBOARD, icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { label: 'Network Topology',  href: ROUTES.TOPOLOGY,  icon: <Network className="h-[18px] w-[18px]" /> },
  { label: 'Alerts',            href: ROUTES.ALERTS,    icon: <Bell className="h-[18px] w-[18px]" />, badge: 12 },
  { label: 'Devices',           href: ROUTES.DEVICES,   icon: <Monitor className="h-[18px] w-[18px]" /> },
  { label: 'Analytics',         href: ROUTES.ANALYTICS, icon: <BarChart3 className="h-[18px] w-[18px]" /> },
  { label: 'Reports',           href: ROUTES.REPORTS,   icon: <FileText className="h-[18px] w-[18px]" /> },
  { label: 'Settings',          href: ROUTES.SETTINGS,  icon: <Settings className="h-[18px] w-[18px]" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-border transition-all duration-300 ease-in-out flex-shrink-0',
        'h-screen sticky top-0 z-30',
        collapsed ? 'w-[68px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 px-4 h-16 border-b border-border flex-shrink-0',
        collapsed && 'justify-center px-0'
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-teal-600 flex-shrink-0">
          <Activity className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-sm text-text-primary tracking-tight">AI-NOC</span>
            <div className="flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 text-teal-600" />
              <span className="text-[10px] text-text-muted font-medium leading-none">Enterprise</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href));
          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-lg transition-all duration-150 group relative',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-primary-50 text-primary-600 font-semibold border-l-[3px] border-primary-600'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary font-medium',
                isActive && !collapsed && 'pl-[9px]',
                isActive && collapsed && 'border-l-0 bg-primary-50 text-primary-600'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-critical-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 bg-critical-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle button */}
      <div className="border-t border-border p-2 flex-shrink-0">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors text-xs gap-2',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
