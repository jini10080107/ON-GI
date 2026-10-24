export type ActiveTab = 'counseling' | 'records' | 'analytics' | 'emergency' | 'burnout' | 'shredder' | 'sound' | 'community';

export interface CategoryStat {
  key: string;
  label: string;
  sublabel: string;
  iconName: string;
  color: string;
  count: number;
  percentage: number;
  avgBeforeStress: number;
  avgAfterStress: number;
  avgRelief: number;
  urgency: 'critical' | 'high' | 'moderate' | 'stable';
  primaryIssue: string;
  solutionSummary: string;
}

export interface StressAnalyticsReport {
  totalSessions: number;
  topStressDomain: {
    key: string;
    label: string;
    count: number;
    percentage: number;
    avgBeforeStress: number;
    avgAfterStress: number;
    urgencyText: string;
    analysisMessage: string;
    vulnerabilities: string[];
    actionGuide: string[];
    recommendedTopicId: string;
  };
  categoryBreakdown: CategoryStat[];
  insights: {
    highestRisk: string;
    mostRelieved: string;
    chronicIssue: string;
    overallRecommendation: string;
  };
  timelineData: {
    date: string;
    category: string;
    beforeStress: number;
    afterStress: number;
  }[];
}

export interface CounselingSessionRecord {
  id: string;
  topicId: string;
  topicTitle: string;
  category: string;
  date: string;
  formattedDate: string;
  beforeStress: number; // 1-10
  afterStress: number;  // 1-10
  selectedOptions: string[];
  userNotes: string;
  teacherMemo: string;
  status: '진행중' | '마음안정' | '지속케어필요';
  prescription: Prescription | null;
}

export interface BurnoutRecord {
  id: string;
  date: string;
  formattedDate: string;
  totalScore: number;
  level: string;
  color: string;
  emotionalScore: number;
  depersonalizationScore: number;
  accomplishmentScore: number;
}

export interface StatsSummary {
  totalSessions: number;
  avgRelief: number;
  totalPrescriptions: number;
  burnoutTestsCount: number;
}

export interface CounselingTopic {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  quote: string;
  accentColor: string;
  stages: CounselingStage[];
  prescription: Prescription;
}

export interface CounselingStage {
  step: number;
  stageName: string;
  prompt: string;
  options?: {
    id: string;
    label: string;
    reaction: string;
    insight: string;
  }[];
  customInputPlaceholder?: string;
  expertCounsel: {
    title: string;
    body: string[];
    protectiveAction?: {
      title: string;
      items: string[];
    };
  };
}

export interface Prescription {
  title: string;
  diagnosisName: string;
  warmMessage: string;
  prescribedHabits: string[];
  affirmation: string;
}

export interface BurnoutQuestion {
  id: number;
  question: string;
  subtext: string;
  category: 'emotional' | 'depersonalization' | 'accomplishment';
}

export interface PeerNote {
  id: string;
  authorTag: string; // e.g. "초등 5년차", "중등 교무부장", "특수교사"
  content: string;
  date: string;
  likes: number;
  liked?: boolean;
}

export type SoundType = 'rain' | 'breeze' | 'crackle' | 'cricket';
