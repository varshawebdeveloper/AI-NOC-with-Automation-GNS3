import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/theme';

const SessionReadyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-teal-600 shadow-card-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Check */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-success-600" />
          </div>
        </div>

        {/* Text */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Session Ready, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Your AI-NOC session is active. You're logged in as{' '}
            <span className="font-semibold text-primary-600 capitalize">{user?.role}</span>.
          </p>
        </div>

        {/* Status indicators */}
        <div className="bg-white rounded-card border border-border p-4 shadow-card text-left space-y-3">
          {[
            { label: 'Authentication', status: 'Verified' },
            { label: 'Network Monitor', status: 'Active' },
            { label: 'Alert Engine', status: 'Running' },
            { label: 'AI Health Score', status: 'Calculating' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{item.label}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success-600 animate-pulse-slow" />
                <span className="text-xs font-medium text-success-600">{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="w-full"
          id="enter-dashboard-btn"
        >
          Enter Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SessionReadyPage;
