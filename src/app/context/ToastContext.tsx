'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ToastVariant = 'info' | 'success' | 'error';

type ToastAction = {
  label: string;
  onClick: () => void;
};

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
  duration?: number;
}

interface ToastContextType {
  showToast: (t: {
    message: string;
    variant?: ToastVariant;
    action?: ToastAction;
    duration?: number;
  }) => number;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType>(null!);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      variant = 'info',
      action,
      duration = 3500,
    }: {
      message: string;
      variant?: ToastVariant;
      action?: ToastAction;
      duration?: number;
    }) => {
      const id = idRef.current++;
      const toast: ToastItem = { id, message, variant, action, duration };
      setToasts((prev) => [...prev, toast]);
      if (duration && duration > 0) {
        setTimeout(() => hideToast(id), duration);
      }
      return id;
    },
    [hideToast],
  );

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Viewport */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-sm bg-white px-4 py-3 min-w-[280px] max-w-[360px] ${
              t.variant === 'success'
                ? 'border-green-200'
                : t.variant === 'error'
                  ? 'border-red-200'
                  : 'border-blue-200'
            }`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`mt-1 h-2 w-2 rounded-full ${t.variant === 'success' ? 'bg-green-500' : t.variant === 'error' ? 'bg-red-500' : 'bg-blue-600'}`}
            />
            <div className="flex-1 text-sm text-[#1F2937]">{t.message}</div>
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick?.();
                  hideToast(t.id);
                }}
                className="text-sm font-medium text-[#2563EB] hover:underline"
              >
                {t.action.label}
              </button>
            )}
            <button
              onClick={() => hideToast(t.id)}
              aria-label="Fechar"
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
