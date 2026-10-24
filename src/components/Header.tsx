import React, { useState } from 'react';

interface HeaderProps {
  onSearchClick: () => void;
  onAddSourceClick: () => void;
  quota?: { used: number; total: number; status: string };
  sourceBranch?: string;
  targetBranch?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onAddSourceClick,
  quota,
  sourceBranch = 'feat/jwt-session-revocation',
  targetBranch = 'main',
}) => {
  const [repoMenuOpen, setRepoMenuOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('Acme Core / Main Repo');

  const repos = [
    'Acme Core / Main Repo',
    'Acme Auth / Session Service',
    'Acme Gateway / Proxy',
  ];

  const quotaPercent = quota ? Math.round((quota.used / quota.total) * 100) : 28;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 select-none">
      {/* DESKTOP FULL-WIDTH TOOLBAR (md and up) */}
      <div className="hidden md:flex items-center justify-between h-14 px-4 lg:px-8 w-full gap-4">
        {/* Left: Repo Switcher & Branch Target */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setRepoMenuOpen(!repoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200/70 text-slate-700 transition-all text-xs font-mono font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">fork_right</span>
              <span className="truncate max-w-[180px]">{selectedRepo}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
            </button>

            {repoMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
                {repos.map((repo) => (
                  <button
                    type="button"
                    key={repo}
                    onClick={() => {
                      setSelectedRepo(repo);
                      setRepoMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      selectedRepo === repo
                        ? 'text-indigo-600 font-semibold bg-indigo-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{repo}</span>
                    {selectedRepo === repo && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wide">LIVE L2</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden xl:block"></div>

          {/* Inline Active Branch indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <span className="material-symbols-outlined text-[14px] text-indigo-600">alt_route</span>
            <span className="font-semibold text-slate-800">{sourceBranch}</span>
            <span className="text-slate-400">➔</span>
            <span className="text-slate-600">{targetBranch}</span>
          </div>
        </div>

        {/* Right: Search, Quota, Source */}
        <div className="flex items-center gap-3">
          {/* Quota Progress */}
          {quota && (
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-slate-400">Index Quota</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${quotaPercent}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-slate-700 text-[11px]">
                  {(quota.used / 1000).toFixed(1)}k / {(quota.total / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          )}

          {/* ⌘K Search input */}
          <button
            type="button"
            onClick={onSearchClick}
            className="h-8 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg flex items-center gap-2 text-slate-600 transition text-xs cursor-pointer active:scale-95"
            title="Search AST (⌘K)"
          >
            <span className="material-symbols-outlined text-[15px] text-slate-500">search</span>
            <span className="text-slate-500 font-medium hidden lg:inline">Search codebase...</span>
            <span className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shadow-2xs">
              ⌘K
            </span>
          </button>

          {/* + Source button */}
          <button
            type="button"
            onClick={onAddSourceClick}
            className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Connect Source</span>
          </button>
        </div>
      </div>

      {/* MOBILE BAR (< md) */}
      <div className="md:hidden flex flex-col justify-between py-1 h-20 px-3">
        <div className="flex items-center justify-between gap-2 h-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
              CB
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
              ContextBridge
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSearchClick}
              className="h-7 px-2 bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1 text-slate-600 text-xs"
            >
              <span className="material-symbols-outlined text-[14px]">search</span>
              <span className="text-[10px] font-mono">⌘K</span>
            </button>
            <button
              type="button"
              onClick={onAddSourceClick}
              className="h-7 px-2 bg-indigo-600 text-white text-xs font-semibold rounded-md flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Source</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5 h-8">
          <span className="text-xs font-mono text-slate-700 truncate">{selectedRepo}</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="text-[9px] font-mono font-bold uppercase">LIVE L2</span>
          </div>
        </div>
      </div>
    </header>
  );
};
