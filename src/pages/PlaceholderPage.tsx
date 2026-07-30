import React from 'react';
import { Construction } from 'lucide-react';
import { AppLayout } from '../layouts/AppLayout';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  breadcrumbs,
}) => (
  <AppLayout breadcrumbs={breadcrumbs}>
    <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center mb-4">
        <Construction className="h-7 w-7 text-text-muted" />
      </div>
      <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      <p className="text-sm text-text-muted mt-2 max-w-sm">
        {description ?? 'This module will be available in Phase 2. Stay tuned!'}
      </p>
      <div className="mt-6 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full">
        <span className="text-xs text-primary-600 font-medium">Coming in Phase 2</span>
      </div>
    </div>
  </AppLayout>
);
