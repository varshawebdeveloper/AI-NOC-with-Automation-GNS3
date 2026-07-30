import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  size = 'md',
}) => {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none',
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-white border border-border rounded-lg text-text-primary placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
          size === 'sm'
            ? 'pl-8 pr-3 py-1.5 text-xs'
            : 'pl-9 pr-3 py-2 text-sm'
        )}
      />
    </div>
  );
};
