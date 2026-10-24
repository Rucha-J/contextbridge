import React from 'react';
import { NavTabId } from '../types';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navTabs: { id: NavTabId; label: string; icon: string; badge?: string }[] = [
    { id: 'pr-context', label: 'PR Context', icon: 'difference' },
    { id: 'semantic-chat', label: 'Semantic Chat', icon: 'chat_spark' },
    { id: 'data-sources', label: 'Data Sources', icon: 'schema', badge: '4' },
    { id: 'overview', label: 'Pipeline Overview', icon: 'dashboard' },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-16 lg:w-56 bg-white border-r border-slate-200 h-screen sticky top-0 z-40 select-none flex-shrink-0">
      {/* Brand Top */}
      <div className="flex flex-col">
        <div className="h-14 flex items-center px-3.5 lg:px-4 border-b border-slate-200 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
            CB
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight text-slate-900 leading-none truncate">
              ContextBridge
            </span>
            <span className="text-[10px] font-mono text-indigo-600 font-semibold uppercase tracking-wider truncate mt-0.5">
              Precision L2
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 lg:p-3 flex flex-col gap-1">
          {navTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={tab.label}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="hidden lg:inline truncate flex-1 text-left">
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Info */}
      <div className="p-2 lg:p-3 border-t border-slate-200 flex flex-col gap-2">
        <div className="hidden lg:flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Synced
          </span>
          <span>v2.4.0</span>
        </div>
        <div className="flex items-center gap-2.5 px-1 py-1 rounded-lg hover:bg-slate-100 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-200 ring-1 ring-slate-300 flex items-center justify-center text-slate-600 text-xs font-semibold overflow-hidden flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] text-slate-500">account_circle</span>
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-800 truncate">Rucha Core</span>
            <span className="text-[10px] text-slate-400 truncate">Staff Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
