import React, { useState } from 'react';

interface BranchBannerProps {
  commitSha: string;
  sourceBranch: string;
  targetBranch: string;
  additions: number;
  deletions: number;
  fileCount: number;
  onCopyCommit: (sha: string) => void;
  onPushToGithub: () => void;
}

export const BranchBanner: React.FC<BranchBannerProps> = ({
  commitSha,
  sourceBranch,
  targetBranch,
  additions,
  deletions,
  fileCount,
  onCopyCommit,
  onPushToGithub,
}) => {
  const [isPushing, setIsPushing] = useState(false);

  const handlePush = () => {
    setIsPushing(true);
    onPushToGithub();
    setTimeout(() => {
      setIsPushing(false);
    }, 1500);
  };

  return (
    <div className="relative w-full rounded-xl bg-white border border-slate-200 p-3 shadow-xs overflow-hidden">
      {/* Status Pill & Commit SHA */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
            PR Synthesis Live
          </span>
        </div>

        <button
          onClick={() => onCopyCommit(commitSha)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono transition cursor-pointer active:scale-95"
          title="Click to copy commit SHA"
        >
          <span className="material-symbols-outlined text-[13px] text-indigo-600">commit</span>
          <span className="font-semibold text-slate-800">{commitSha}</span>
        </button>
      </div>

      {/* Branch Flow Selector */}
      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg mb-2">
        <div className="flex items-center gap-1 min-w-0 flex-1 px-2 py-1 rounded bg-white border border-slate-200 text-slate-900 truncate shadow-2xs">
          <span className="material-symbols-outlined text-[14px] text-indigo-600">alt_route</span>
          <span className="text-xs font-mono truncate font-medium text-slate-800">
            {sourceBranch}
          </span>
        </div>
        <span className="material-symbols-outlined text-[14px] text-slate-400 flex-shrink-0">
          arrow_forward
        </span>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0">
          <span className="material-symbols-outlined text-[14px] text-emerald-600">source_notes</span>
          <span className="text-xs font-mono font-semibold text-slate-700">{targetBranch}</span>
        </div>
      </div>

      {/* Metrics & Push CTA */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            <span className="text-emerald-600 font-bold">+{additions}</span>
            <span className="text-slate-300">/</span>
            <span className="text-red-600 font-bold">-{deletions}</span>
            <span className="text-slate-400 text-[10px] ml-0.5">· {fileCount} files</span>
          </span>
        </div>

        <button
          onClick={handlePush}
          disabled={isPushing}
          className="relative group px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-all disabled:opacity-75"
        >
          {isPushing ? (
            <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
          ) : (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          <span>{isPushing ? 'Pushing...' : 'Push to GitHub'}</span>
        </button>
      </div>
    </div>
  );
};
