'use client';

import { useState, useEffect } from 'react';
import { toast as toastLib, Toast } from '@/lib/toast';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastLib.subscribe((newToast) => {
      if (newToast.title === '' && newToast.message === '') {
        // Remove toast
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      } else {
        // Add or update toast
        setToasts(prev => {
          const exists = prev.find(t => t.id === newToast.id);
          if (exists) {
            return prev.map(t => t.id === newToast.id ? newToast : t);
          }
          return [...prev, newToast];
        });
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getBgColor(t.type)} shadow-lg animate-in fade-in slide-in-from-right-4 duration-300`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(t.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${getTextColor(t.type)}`}>
              {t.title}
            </p>
            {t.message && (
              <p className={`text-sm mt-1 ${getTextColor(t.type)} opacity-90`}>
                {t.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className={`flex-shrink-0 ${getTextColor(t.type)} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
