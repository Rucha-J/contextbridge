import React, { useState } from 'react';
import { DiffFile } from '../types';

interface DiffInspectorProps {
  files: DiffFile[];
}

export const DiffInspector: React.FC<DiffInspectorProps> = ({ files }) => {
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.id || '');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentFile = files.find((f) => f.id === selectedFileId) || files[0];

  return (
    <div
      className={`flex flex-col w-full rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl overflow-y-auto' : ''
      }`}
    >
      {/* File Tabs Header */}
      <div className="px-3 py-2 flex items-center justify-between bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {files.map((file) => {
            const isActive = file.id === currentFile?.id;
            return (
              <button
                type="button"
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition cursor-pointer select-none ${
                  isActive
                    ? 'bg-white border border-slate-300 text-slate-900 font-semibold shadow-2xs'
                    : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${file.statusColor}`}></span>
                <span>{file.filename}</span>
                <span className="text-[10px] font-mono text-slate-400 ml-1">{file.status}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="material-symbols-outlined text-[17px] text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-200/50"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
        </button>
      </div>

      {/* Semantic Rationale Tag */}
      <div className="mx-3 mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">hub</span>
            <span className="text-xs font-mono text-emerald-800 font-medium truncate">
              Cross-Service Links Detected (3)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase bg-emerald-200/70 border border-emerald-300 px-1.5 py-0.5 rounded">
            98% Match
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-800 text-[11px] font-mono shadow-2xs">
            <span className="font-semibold text-emerald-950">ADR-009 §4.2</span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] text-emerald-700 font-medium">Architecture</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-red-200 text-red-700 text-[11px] font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span className="font-semibold text-slate-800">Sentry: AUTH-892</span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] text-red-600 font-medium">Fixes 4.2k crashes</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 text-[11px] font-mono shadow-2xs">
            <span className="material-symbols-outlined text-[12px] text-indigo-600">menu_book</span>
            <span className="font-semibold text-slate-800">Notion: RFC-088</span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] text-slate-600">Design Spec</span>
          </span>
        </div>
      </div>

      {/* High-density Diff Snippet (GitHub Light Style) */}
      <div className="p-2 font-mono text-[12px] overflow-x-auto bg-slate-50 border border-slate-200 my-2 mx-3 rounded-lg">
        <div className="flex text-slate-400 select-none pb-1 mb-1 text-[10px] font-mono border-b border-slate-200/80">
          <span className="w-8 flex-shrink-0 text-right pr-2">LN</span>
          <span className="font-semibold text-slate-500">
            CODE DIFF ({currentFile?.language || 'Plain'})
          </span>
        </div>

        {currentFile?.lines.map((line, idx) => {
          if (line.type === 'deletion') {
            return (
              <div
                key={idx}
                className="flex items-center bg-red-50 text-red-700 border-l-2 border-red-500 hover:bg-red-100/60 py-0.5 -mx-1 px-1 font-mono"
              >
                <span className="w-8 flex-shrink-0 text-red-400 text-right pr-2 select-none">
                  {line.lineNumber}
                </span>
                <span className="text-red-600 font-bold w-4 select-none">-</span>
                <span className="truncate font-medium">{line.content}</span>
              </div>
            );
          }

          if (line.type === 'addition') {
            return (
              <div
                key={idx}
                className="flex items-center bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500 hover:bg-emerald-100/60 py-0.5 -mx-1 px-1 font-mono"
              >
                <span className="w-8 flex-shrink-0 text-emerald-500 text-right pr-2 select-none">
                  {line.lineNumber}
                </span>
                <span className="text-emerald-700 font-bold w-4 select-none">+</span>
                <span className="truncate font-medium">{line.content}</span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="flex items-center text-slate-700 hover:bg-slate-100/70 py-0.5 font-mono"
            >
              <span className="w-8 flex-shrink-0 text-slate-400 text-right pr-2 select-none">
                {line.lineNumber}
              </span>
              <span className="text-slate-300 w-4 select-none"> </span>
              <span className="text-slate-800">{line.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
