import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils';
import type { AlertSeverity } from '../../types';

interface Toast {
  id: string;
  message: string;
  type: AlertSeverity;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: AlertSeverity, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: AlertSeverity = 'info', duration = 4000) => {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastConfig: Record<AlertSeverity, { icon: React.ReactNode; classes: string }> = {
  success: {
    icon: <CheckCircle className="h-4 w-4 text-success-600" />,
    classes: 'border-success-100 bg-success-50',
  },
  critical: {
    icon: <AlertCircle className="h-4 w-4 text-critical-600" />,
    classes: 'border-critical-100 bg-critical-50',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-warning-500" />,
    classes: 'border-warning-100 bg-warning-50',
  },
  info: {
    icon: <Info className="h-4 w-4 text-primary-600" />,
    classes: 'border-primary-100 bg-primary-50',
  },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const config = toastConfig[toast.type];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-card-md text-sm',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        config.classes
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <p className="flex-1 text-text-primary font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 max-w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
