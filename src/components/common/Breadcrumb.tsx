import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => (
  <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
    <Link
      to="/dashboard"
      className="text-text-muted hover:text-text-primary transition-colors"
    >
      <Home className="h-3.5 w-3.5" />
    </Link>
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        <ChevronRight className="h-3.5 w-3.5 text-border-strong flex-shrink-0" />
        {item.href && idx < items.length - 1 ? (
          <Link
            to={item.href}
            className="text-xs text-text-muted hover:text-text-primary transition-colors font-medium"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-xs text-text-primary font-semibold">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
