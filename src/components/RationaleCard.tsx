import React, { useState } from 'react';
import { PRData, ChecklistItem } from '../types';

interface RationaleCardProps {
  prData: PRData;
  onCopyTitle: (title: string) => void;
  onCopyMarkdown: (markdown: string) => void;
  onRegenerate: () => void;
  onExportJira: () => void;
  isRegenerating?: boolean;
}

export const RationaleCard: React.FC<RationaleCardProps> = ({
  prData,
  onCopyTitle,
  onCopyMarkdown,
  onRegenerate,
  onExportJira,
  isRegenerating = false,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(prData.checklist);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;

  const generateMarkdown = (): string => {
    return `# ${prData.title}

## Why (Context & Decision Log)
${prData.whyContext}

## Impact & Benchmarks
${prData.metrics.map((m) => `- **${m.label}**: ${m.currentValue} (${m.changeNote})`).join('\n')}
${prData.benchmarkBulletPoints.map((b) => `- ${b}`).join('\n')}

## Cross-Service References
${prData.references.map((r) => `- [${r.title}] ${r.subtitle} ${r.badge ? `(${r.badge})` : ''}`).join('\n')}

## Migration Checklist
${checklist.map((c) => `- [${c.completed ? 'x' : ' '}] ${c.label} ${c.badge ? `(${c.badge})` : ''}`).join('\n')}
`;
  };

  return (
    <div className="flex flex-col w-full rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[17px] text-indigo-600">auto_awesome</span>
          <span className="text-sm font-semibold text-slate-900">PR Rationale &amp; Spec</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
          <span className="text-[10px] font-mono uppercase font-bold">{prData.model}</span>
          <span className="text-indigo-300">·</span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">
            {prData.confidence}% Conf
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Generated PR Title */}
        <div className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Generated Commit &amp; PR Title
          </span>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[13px] font-mono text-slate-900 font-semibold truncate">
              {prData.title}
            </span>
            <button
              onClick={() => onCopyTitle(prData.title)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex-shrink-0 transition active:scale-95"
              title="Copy PR Title"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
        </div>

        {/* Section 1: Why */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="text-xs font-mono text-indigo-600 font-bold">##</span>
            <h3 className="text-sm font-bold text-slate-900">Why (Context &amp; Decision Log)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In alignment with{' '}
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[11px] font-semibold">
              ADR-009
            </span>{' '}
            and approved architectural direction in{' '}
            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-mono text-[11px] font-semibold inline-flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px] text-indigo-600">
                description
              </span>
              Notion RFC-088
            </span>
            , this change completes Phase 2 of our telemetry and credential store separation. It
            directly addresses the Redis pool exhaustion incident documented in{' '}
            <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono text-[11px] font-semibold inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Sentry AUTH-892
            </span>
            . Legacy single-instance Redis keys (
            <code className="text-[11px] font-mono text-emerald-700 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded font-semibold">
              session:*
            </code>
            ) are deprecated in favor of partitioned pipelines across the new Valkey cluster.
          </p>
        </div>

        {/* Section 2: Impact & Benchmarks */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="text-xs font-mono text-indigo-600 font-bold">##</span>
            <h3 className="text-sm font-bold text-slate-900">Impact &amp; Benchmarks</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 my-1">
            {prData.metrics.map((metric, index) => (
              <div
                key={index}
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span
                    className={`text-[16px] font-bold ${
                      metric.changeType === 'positive'
                        ? 'text-emerald-600'
                        : metric.changeType === 'neutral'
                        ? 'text-indigo-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {metric.currentValue}
                  </span>
                  {metric.previousValue && (
                    <span className="text-[11px] font-mono text-slate-400 line-through">
                      {metric.previousValue}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                  {metric.changeNote}
                </span>
              </div>
            ))}
          </div>
          <ul className="flex flex-col gap-1.5 text-xs text-slate-600 list-none pt-1">
            {prData.benchmarkBulletPoints.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 flex-shrink-0">
                  check_circle
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Cross-Service References */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-900">
            <span className="text-xs font-mono text-indigo-600 font-bold">##</span>
            <h3 className="text-sm font-bold text-slate-900">
              Cross-Service References &amp; Citations
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {prData.references.map((ref) => (
              <a
                key={ref.id}
                href={ref.url || '#'}
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 transition group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {ref.type === 'sentry' ? (
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                  ) : ref.type === 'pr' ? (
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 flex-shrink-0">
                      merge
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-indigo-600 flex-shrink-0">
                      {ref.type === 'notion' ? 'article' : 'check_box'}
                    </span>
                  )}
                  <span className="text-xs font-mono font-semibold text-slate-900 truncate">
                    {ref.title}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[12px] text-slate-600 truncate">{ref.subtitle}</span>
                </div>
                <span className="material-symbols-outlined text-[15px] text-slate-400 group-hover:text-indigo-600 flex-shrink-0">
                  open_in_new
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Section 4: Interactive Migration Checklist */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-900">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-indigo-600 font-bold">##</span>
              <h3 className="text-sm font-bold text-slate-900">Migration Checklist</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              {completedCount} of {checklist.length} completed
            </span>
          </div>

          <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 cursor-pointer select-none group py-0.5"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklist(item.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition cursor-pointer"
                />
                <span
                  className={`text-xs text-slate-800 font-medium transition ${
                    item.completed
                      ? 'line-through opacity-60 group-hover:opacity-100'
                      : 'group-hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span
                      className={`ml-1 text-[11px] font-mono ${
                        item.badgeClass ||
                        'text-emerald-700 bg-white border border-slate-200 px-1 rounded'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={() => onCopyMarkdown(generateMarkdown())}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 active:scale-95 transition-all"
            id="copy-markdown-btn"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600 mb-0.5">
              markdown
            </span>
            <span className="text-[10px] font-mono font-bold uppercase">Copy MD</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 active:scale-95 transition-all disabled:opacity-75"
            id="regen-btn"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-emerald-600 mb-0.5 ${
                isRegenerating ? 'animate-spin' : ''
              }`}
            >
              autorenew
            </span>
            <span className="text-[10px] font-mono font-bold uppercase">
              {isRegenerating ? 'Synthesizing...' : 'Regenerate'}
            </span>
          </button>

          <button
            onClick={onExportJira}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600 mb-0.5">
              share
            </span>
            <span className="text-[10px] font-mono font-bold uppercase">Export Jira</span>
          </button>
        </div>
      </div>
    </div>
  );
};
