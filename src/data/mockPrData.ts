import { PRData } from '../types';

export const initialPRData: PRData = {
  commitSha: '8f2a1c9',
  sourceBranch: 'feat/jwt-session-revocation',
  targetBranch: 'main',
  additions: 48,
  deletions: 12,
  fileCount: 2,
  model: 'Sonnet 3.5',
  confidence: 99.4,
  title: 'feat(auth): migrate session store to Valkey cluster with zero-downtime pipeline',
  whyContext:
    'In alignment with ADR-009 and approved architectural direction in Notion RFC-088, this change completes Phase 2 of our telemetry and credential store separation. It directly addresses the Redis pool exhaustion incident documented in Sentry AUTH-892. Legacy single-instance Redis keys (session:*) are deprecated in favor of partitioned pipelines across the new Valkey cluster.',
  metrics: [
    {
      label: 'p99 Latency',
      currentValue: '3.6ms',
      previousValue: '4.2ms',
      changeNote: '↓ 14.2% Under 25k RPS',
      changeType: 'positive',
    },
    {
      label: 'API Compatibility',
      currentValue: 'Zero Breaking',
      changeNote: 'Full SDK backwards-compat',
      changeType: 'neutral',
    },
  ],
  benchmarkBulletPoints: [
    'Stress tested against 25k rps artificial payload: zero dropped connections.',
    'Client session validation overhead curtailed to sub-millisecond ranges.',
  ],
  references: [
    {
      id: 'ref-1',
      type: 'sentry',
      title: 'Sentry #AUTH-892',
      subtitle: 'Connection Pool Leak (P1 Critical)',
      badge: 'Fixes 4.2k crashes',
      url: '#',
    },
    {
      id: 'ref-2',
      type: 'notion',
      title: 'Notion RFC-088',
      subtitle: 'Valkey Migration RFC & Benchmarks',
      badge: 'Design Spec',
      url: '#',
    },
    {
      id: 'ref-3',
      type: 'pr',
      title: 'PR #142',
      subtitle: 'auth/session.go',
      url: '#',
    },
    {
      id: 'ref-4',
      type: 'linear',
      title: 'Linear ENG-489',
      subtitle: 'Auth session cluster rollout',
      url: '#',
    },
  ],
  checklist: [
    {
      id: 'chk-1',
      label: 'Validated Valkey failover in staging environment',
      completed: true,
    },
    {
      id: 'chk-2',
      label: 'Verified backwards compatibility with legacy session tokens',
      completed: true,
    },
    {
      id: 'chk-3',
      label: 'Update Helm deployment env variables',
      badge: 'VALKEY_SENTINEL_ADDR',
      badgeClass: 'text-emerald-700 bg-white border border-slate-200 px-1 rounded font-code',
      completed: false,
    },
    {
      id: 'chk-4',
      label: 'Run canary release on US-East-1 cluster',
      completed: false,
    },
    {
      id: 'chk-5',
      label: 'Resolve Sentry issue #AUTH-892 & verify zero Redis pool exceptions',
      completed: false,
    },
    {
      id: 'chk-6',
      label: 'Sync benchmark results to Notion Engineering Wiki (RFC-088)',
      completed: false,
    },
  ],
  files: [
    {
      id: 'file-1',
      filename: 'pkg/auth/session.go',
      status: 'M',
      statusColor: 'bg-emerald-500',
      language: 'Go 1.22',
      lines: [
        {
          lineNumber: 104,
          type: 'context',
          content: 'func (s *Store) Revoke(ctx context.Context, uid string) error {',
        },
        {
          lineNumber: 105,
          type: 'deletion',
          content: '    err := rdb.Del(ctx, "session:"+uid).Err()',
        },
        {
          lineNumber: 105,
          type: 'addition',
          content: '    err := valkey.RevokeSessionPipeline(ctx, s.cluster, uid)',
        },
        {
          lineNumber: 106,
          type: 'context',
          content: '    if err != nil {',
        },
        {
          lineNumber: 107,
          type: 'context',
          content: '        return fmt.Errorf("session store: %w", err)',
        },
      ],
    },
    {
      id: 'file-2',
      filename: 'config/valkey.yaml',
      status: 'A',
      statusColor: 'bg-indigo-500',
      language: 'YAML',
      lines: [
        {
          lineNumber: 1,
          type: 'addition',
          content: 'cluster:',
        },
        {
          lineNumber: 2,
          type: 'addition',
          content: '  enabled: true',
        },
        {
          lineNumber: 3,
          type: 'addition',
          content: '  nodes:',
        },
        {
          lineNumber: 4,
          type: 'addition',
          content: '    - host: valkey-sentinel-0.internal',
        },
        {
          lineNumber: 5,
          type: 'addition',
          content: '      port: 26379',
        },
      ],
    },
  ],
  quota: {
    used: 14280,
    total: 50000,
    status: 'Synced',
  },
};
