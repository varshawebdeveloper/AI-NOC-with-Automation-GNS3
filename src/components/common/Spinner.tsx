import React from 'react';
import { cn } from '../../utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'teal' | 'white';
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const colorClasses = {
  primary: 'text-primary-600',
  teal: 'text-teal-600',
  white: 'text-white',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  color = 'primary',
}) => (
  <svg
    className={cn('animate-spin', sizeClasses[size], colorClasses[color], className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <Spinner size="lg" />
    <p className="text-sm text-text-muted">{message}</p>
  </div>
);
