import React, { useState, useEffect, useCallback } from 'react';
import { PRData, NavTabId } from './types';
import { initialPRData } from './data/mockPrData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BranchBanner } from './components/BranchBanner';
import { DiffInspector } from './components/DiffInspector';
import { RationaleCard } from './components/RationaleCard';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';

interface ContextBridgePRViewProps {
  initialData?: PRData;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  code?: string;
}

export const ContextBridgePRView: React.FC<ContextBridgePRViewProps> = ({
  initialData = initialPRData,
}) => {
  const [prData, setPrData] = useState<PRData>(initialData);
  const [activeTab, setActiveTab] = useState<NavTabId>('pr-context');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'user',
      text: 'Why did we pick Valkey cluster pipeline over single Redis instance?',
    },
    {
      id: 2,
      sender: 'ai',
      text: 'According to ADR-009 §4.2 and Sentry incident AUTH-892, our single Redis connection pool choked under 25k RPS during bulk token revocations. The Valkey pipeline multiplexes token invalidations across 3 partitioned shards with zero mutex lock contention, curtailing p99 latency from 4.2ms to 3.6ms.',
      code: 'valkey.RevokeSessionPipeline(ctx, s.cluster, uid)',
    },
  ]);

  const { toast, showToast } = useToast();

  // Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyCommit = useCallback(
    (sha: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(sha);
      }
      showToast(`Commit SHA ${sha} copied to clipboard!`);
    },
    [showToast]
  );

  const handlePushToGithub = useCallback(() => {
    showToast('Pushing branch to GitHub and opening PR draft...');
  }, [showToast]);

  const handleCopyTitle = useCallback(
    (title: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(title);
      }
      showToast('PR Title copied to clipboard!');
    },
    [showToast]
  );

  const handleCopyMarkdown = useCallback(
    (markdown: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(markdown);
      }
      showToast('Spec Markdown copied to clipboard!');
    },
    [showToast]
  );

  const handleRegenerate = useCallback(() => {
    setIsRegenerating(true);
    showToast('Synthesizing fresh rationale from latest AST...');
    setTimeout(() => {
      setIsRegenerating(false);
      setPrData((prev) => ({
        ...prev,
        confidence: Number((99.1 + Math.random() * 0.8).toFixed(1)),
      }));
      showToast('Rationale updated with latest AST analysis!');
    }, 1200);
  }, [showToast]);

  const handleExportJira = useCallback(() => {
    showToast('Exporting issue ticket to Jira...');
  }, [showToast]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Analyzed AST for "${userMsg.text}". All references in pkg/auth/session.go and config/valkey.yaml maintain strict backwards compatibility.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} />

      {/* ⌘K Command Palette */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">search</span>
              <input
                type="text"
                autoFocus
                placeholder="Search PR rationale, symbols, or issues..."
                className="w-full text-sm outline-hidden text-slate-800 placeholder-slate-400 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-xs font-mono text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                ESC
              </button>
            </div>
            <div className="p-3 text-xs text-slate-500 flex flex-col gap-1.5">
              <span className="font-semibold text-slate-700">Quick Searches:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  showToast('Opened Sentry AUTH-892 trace');
                }}
                className="text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between group transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="group-hover:text-indigo-600 font-medium text-slate-800">
                    Sentry: AUTH-892 pool exhaustion
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Crash Trace</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  showToast('Opened Notion RFC-088');
                }}
                className="text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between group transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-indigo-600">article</span>
                  <span className="group-hover:text-indigo-600 font-medium text-slate-800">
                    Notion: RFC-088 Valkey migration
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Design Spec</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structural Left Navigation Rail (Desktop) */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Fluid Full-Width Center Canvas */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Full-Width Edge-to-Edge Top Header */}
        <Header
          onSearchClick={() => setSearchModalOpen(true)}
          onAddSourceClick={() => {
            setActiveTab('data-sources');
            showToast('Opened Data Sources');
          }}
          quota={prData.quota}
          sourceBranch={prData.sourceBranch}
          targetBranch={prData.targetBranch}
        />

        {/* Workstation Viewport */}
        <main className="flex-1 p-4 lg:p-6 w-full pb-20 md:pb-6">

          {/* TAB 1: PR CONTEXT (Full-Width Split-Pane Workstation) */}
          {activeTab === 'pr-context' && (
            <div className="flex flex-col gap-5 w-full">
              {/* Branch Banner spanning 100% width */}
              <BranchBanner
                commitSha={prData.commitSha}
                sourceBranch={prData.sourceBranch}
                targetBranch={prData.targetBranch}
                additions={prData.additions}
                deletions={prData.deletions}
                fileCount={prData.fileCount}
                onCopyCommit={handleCopyCommit}
                onPushToGithub={handlePushToGithub}
              />

              {/* 2-Column Split-Pane Grid filling 100% screen width */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
                {/* Left (7 Columns): Wide Code Diff Inspector */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 w-full">
                  <DiffInspector files={prData.files} />
                </div>

                {/* Right (5 Columns): Sticky Rationale & Specification Inspector */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 w-full lg:sticky lg:top-20">
                  <RationaleCard
                    prData={prData}
                    onCopyTitle={handleCopyTitle}
                    onCopyMarkdown={handleCopyMarkdown}
                    onRegenerate={handleRegenerate}
                    onExportJira={handleExportJira}
                    isRegenerating={isRegenerating}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEMANTIC CHAT (Full-Width 2-Column Studio) */}
          {activeTab === 'semantic-chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
              {/* Left Context & Queries (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">chat_spark</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">AST Context Engine</h3>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">Active: Sonnet 3.5</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ask architectural queries, verify backward compatibility, or request migration scripts using the real-time repository AST graph.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Active Branch Context:</span>
                    <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-slate-800 text-[11px]">
                      feat/jwt-session-revocation
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-800">Suggested Queries:</span>
                  {[
                    'Explain Valkey pipeline concurrency',
                    'Generate rollback migration script',
                    'Check backward compatibility with legacy tokens',
                    'Evaluate sentinel quorum latency impact',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setChatInput(prompt)}
                      className="text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs font-medium transition cursor-pointer"
                    >
                      ⚡ {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Conversation View (lg:col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-[520px] justify-between">
                  <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[540px] pr-1">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white rounded-tr-xs'
                              : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          {msg.sender === 'ai' && (
                            <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                                ContextBridge AI · Sonnet 3.5
                              </span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                          {msg.code && (
                            <div className="mt-2.5 p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg flex items-center justify-between">
                              <code>{msg.code}</code>
                              <button
                                type="button"
                                onClick={() => {
                                  if (navigator.clipboard) navigator.clipboard.writeText(msg.code!);
                                  showToast('Code snippet copied!');
                                }}
                                className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSendChat}
                    className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask any architectural question about this PR or codebase..."
                      className="flex-1 text-xs px-2.5 py-1.5 outline-hidden text-slate-800 placeholder-slate-400 bg-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Send</span>
                      <span className="material-symbols-outlined text-[15px]">send</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SOURCES (Full-Width Multi-Column Grid) */}
          {activeTab === 'data-sources' && (
            <div className="flex flex-col gap-5 w-full">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Connected Telemetry &amp; Specs</h2>
                  <p className="text-xs text-slate-500">4 active telemetry pipelines feeding AST context into PR synthesis</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Synchronizing all telemetry sources...')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">sync</span>
                  <span>Sync All Pipelines</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {[
                  {
                    name: 'GitHub Enterprise',
                    sub: 'Acme Core / Main Repo',
                    status: 'Connected',
                    badge: '42.8k AST nodes',
                    icon: 'fork_right',
                    color: 'text-indigo-600',
                    desc: 'Live branch tracking and AST indexing with webhook listeners.',
                  },
                  {
                    name: 'Sentry Telemetry',
                    sub: 'AUTH-892 pool exhaustion stream',
                    status: 'Live Stream',
                    badge: '4.2k events',
                    icon: 'crisis_alert',
                    color: 'text-red-500',
                    desc: 'Real-time stack trace linking for active session store bugs.',
                  },
                  {
                    name: 'Notion Engineering Wiki',
                    sub: 'RFC-088 Valkey Cluster Spec',
                    status: 'Synchronized',
                    badge: 'v2.4 Approved',
                    icon: 'article',
                    color: 'text-indigo-600',
                    desc: 'Architectural decision records and benchmarks documentation.',
                  },
                  {
                    name: 'Linear Issue Tracker',
                    sub: 'ENG-489 Cluster Migration sprint',
                    status: 'Active Sprint',
                    badge: 'In Review',
                    icon: 'check_box',
                    color: 'text-emerald-600',
                    desc: 'Bi-directional issue sync with auto-closing PR link triggers.',
                  },
                  {
                    name: 'Valkey Sentinel Monitor',
                    sub: 'Cluster telemetry (3 shards)',
                    status: 'Healthy',
                    badge: '0ms jitter',
                    icon: 'dns',
                    color: 'text-indigo-600',
                    desc: 'Connection pool metrics and memory distribution monitoring.',
                  },
                  {
                    name: 'Datadog APM',
                    sub: 'Production auth pipeline',
                    status: 'Connected',
                    badge: '25.4k RPS',
                    icon: 'monitoring',
                    color: 'text-emerald-600',
                    desc: 'Latency traces and distributed APM flame-graphs.',
                  },
                ].map((src, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition flex flex-col justify-between gap-3 cursor-pointer group"
                    onClick={() => showToast(`Configuring ${src.name}...`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-50 transition">
                          <span className={`material-symbols-outlined text-[20px] ${src.color}`}>
                            {src.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            {src.name}
                          </h3>
                          <span className="text-[11px] text-slate-500">{src.sub}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                        {src.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{src.desc}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {src.status}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-indigo-600 transition">
                        settings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OVERVIEW (Full-Width 3-Column Dashboard) */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Canary Deployment Rollout</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    15% Traffic (Canary)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Errors</span>
                    <span className="font-bold text-emerald-600 text-xs">0.00%</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">p99 Latency</span>
                    <span className="font-bold text-indigo-600 text-xs">3.6ms</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">Throughput</span>
                    <span className="font-bold text-slate-800 text-xs">25.4k RPS</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>US-East-1 (Primary)</span>
                    <span className="font-mono text-emerald-600 font-semibold">Healthy (15%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>US-West-2 (Secondary)</span>
                    <span className="font-mono text-slate-400">Scheduled (Phase 3)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EU-Central-1</span>
                    <span className="font-mono text-slate-400">Scheduled (Phase 4)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
                <span className="text-sm font-bold text-slate-900">Pre-Merge Validation Matrix</span>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      title: 'Unit & Race Tests',
                      detail: '142/142 passed · zero race conditions',
                      pass: true,
                    },
                    {
                      title: 'Valkey Sentinel Failover',
                      detail: 'Staging cluster recovered in 180ms',
                      pass: true,
                    },
                    {
                      title: 'SAST Security Scan',
                      detail: '0 Critical, 0 High vulnerabilities',
                      pass: true,
                    },
                    {
                      title: 'Zero-Downtime Migration',
                      detail: 'Backward compatibility token validation',
                      pass: true,
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-emerald-600">
                          check_circle
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-900">{t.title}</span>
                          <span className="text-[10px] text-slate-500">{t.detail}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                        PASSED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
                <span className="text-sm font-bold text-slate-900">Benchmark Telemetry (vs Redis)</span>
                <div className="flex flex-col gap-2.5">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Session Revocation Latency</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold text-emerald-600">3.6ms</span>
                      <span className="text-xs font-mono text-slate-400 line-through">4.2ms baseline</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">↓ 14.2% Under 25,000 RPS</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Connection Pool Health</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold text-indigo-600">0 Exhaustions</span>
                      <span className="text-xs font-mono text-slate-500">Fixes AUTH-892</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Multiplexed across 3 Valkey shards</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation (< md only) */}
      <div className="md:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default ContextBridgePRView;
