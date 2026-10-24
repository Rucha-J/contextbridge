import React from 'react';

interface QuotaBarProps {
  used: number;
  total: number;
  status: string;
}

export const QuotaBar: React.FC<QuotaBarProps> = ({ used, total, status }) => {
  const percentage = Math.min(100, Math.max(0, (used / total) * 100));

  return (
    <div className="fixed bottom-16 inset-x-0 z-40 px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg px-3 py-1.5 shadow-md flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                Index Quota
              </span>
              <span className="text-xs font-mono text-slate-800 font-semibold">
                {used.toLocaleString()} / {(total / 1000).toFixed(0)}k tokens
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex-shrink-0">
          <span className="material-symbols-outlined text-[14px]">sync</span>
          <span className="text-[10px] font-mono font-bold uppercase">{status}</span>
        </div>
      </div>
    </div>
  );
};
