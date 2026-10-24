import React from 'react';
import { NavTabId } from '../types';

interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tabId: NavTabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'semantic-chat' as NavTabId,
      label: 'Chat',
      icon: 'chat_spark',
    },
    {
      id: 'pr-context' as NavTabId,
      label: 'PR Context',
      icon: 'difference',
    },
    {
      id: 'data-sources' as NavTabId,
      label: 'Sources',
      icon: 'schema',
    },
    {
      id: 'overview' as NavTabId,
      label: 'Overview',
      icon: 'dashboard',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-sm">
      <div className="flex justify-around items-center h-16 px-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-12 transition-all cursor-pointer select-none ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:scale-105'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="text-[10px] font-mono tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
