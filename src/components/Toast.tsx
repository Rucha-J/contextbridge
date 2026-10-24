import React from 'react';

interface ToastProps {
  show: boolean;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  return (
    <div
      className={`fixed top-32 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white rounded-full shadow-lg flex items-center gap-2 z-50 pointer-events-none transition-all duration-200 ${
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
      }`}
    >
      <span className="material-symbols-outlined text-[18px] text-emerald-400">check</span>
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};
