import React from 'react';
import { Activity, Shield, Cpu, Wifi } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../constants/theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const features = [
  { icon: <Activity className="h-4 w-4" />, text: 'Real-time network monitoring' },
  { icon: <Shield className="h-4 w-4" />, text: 'AI-powered threat detection' },
  { icon: <Cpu className="h-4 w-4" />, text: 'Automated incident response' },
  { icon: <Wifi className="h-4 w-4" />, text: 'GNS3 topology integration' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left – Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 p-12 text-white relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -right-16 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">{APP_NAME}</span>
              <p className="text-white/60 text-xs">Enterprise Platform</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Intelligent Network<br />
            <span className="text-teal-300">Operations Center</span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            AI-powered network monitoring, automated incident response, and
            real-time topology visualization for enterprise networks.
          </p>

          {/* Features list */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 text-teal-300 flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-white/80 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-white/60 text-xs">System Status: All Operational</span>
          </div>
          <p className="text-white/40 text-xs">{APP_TAGLINE} · Phase 1</p>
        </div>
      </div>

      {/* Right – Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-secondary">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-teal-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-text-primary">{APP_NAME}</span>
          </div>

          <div className="bg-white rounded-card shadow-card-lg border border-border p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary">{title}</h2>
              {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
