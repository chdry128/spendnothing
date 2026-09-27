import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, dismissToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="fixed top-28 left-4 right-4 z-50 max-w-md mx-auto pointer-events-none transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#2f312f] text-[#f2f1ee] px-4 py-2.5 rounded-lg shadow-tactile-lg border border-[#1a1c1a] flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3] flex-shrink-0" />
          <span className="text-xs font-medium truncate">
            {toast.message}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 bg-white/10 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider text-[#4edea3] uppercase">
          <ShieldCheck className="w-3 h-3 text-[#4edea3]" />
          <span>{toast.subMessage || '+$0.00 REAL'}</span>
        </div>
      </div>
    </div>
  );
};
