export interface DiffLine {
  lineNumber: number;
  type: 'context' | 'deletion' | 'addition';
  content: string;
}

export interface DiffFile {
  id: string;
  filename: string;
  status: 'M' | 'A' | 'D';
  statusColor: string;
  language: string;
  lines: DiffLine[];
}

export interface CrossServiceReference {
  id: string;
  type: 'sentry' | 'notion' | 'pr' | 'linear' | 'adr';
  title: string;
  subtitle: string;
  badge?: string;
  url?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  badge?: string;
  badgeClass?: string;
  completed: boolean;
}

export interface BenchmarkMetric {
  label: string;
  currentValue: string;
  previousValue?: string;
  changeNote: string;
  changeType?: 'positive' | 'neutral' | 'negative';
}

export interface PRData {
  commitSha: string;
  sourceBranch: string;
  targetBranch: string;
  additions: number;
  deletions: number;
  fileCount: number;
  model: string;
  confidence: number;
  title: string;
  whyContext: string;
  metrics: BenchmarkMetric[];
  benchmarkBulletPoints: string[];
  references: CrossServiceReference[];
  checklist: ChecklistItem[];
  files: DiffFile[];
  quota: {
    used: number;
    total: number;
    status: string;
  };
}

export type NavTabId = 'semantic-chat' | 'pr-context' | 'data-sources' | 'overview';
