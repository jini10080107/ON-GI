import React, { useState, useEffect } from 'react';
import { StressAnalyticsReport, CategoryStat, CounselingSessionRecord } from '../types';
import {
  BarChart3,
  ShieldAlert,
  FileSpreadsheet,
  GraduationCap,
  HeartCrack,
  Users,
  Moon,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingDown,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface StressAnalyticsProps {
  onStartCounselingTopic: (topicId: string) => void;
  onViewRecords: () => void;
}

export const StressAnalytics: React.FC<StressAnalyticsProps> = ({
  onStartCounselingTopic,
  onViewRecords
}) => {
  const [report, setReport] = useState<StressAnalyticsReport | null>(null);
  const [sessions, setSessions] = useState<CounselingSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resSessions] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/counseling/sessions')
      ]);
      const dataAnalytics = await resAnalytics.json();
      const dataSessions = await resSessions.json();

      if (dataAnalytics.success) {
        setReport(dataAnalytics.report);
        if (dataAnalytics.report.topStressDomain) {
          setSelectedCategoryKey(dataAnalytics.report.topStressDomain.key);
        }
      }
      if (dataSessions.success) {
        setSessions(dataSessions.sessions);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-[#B45309]" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-[#1D4ED8]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#059669]" />;
      case 'HeartCrack':
        return <HeartCrack className="w-5 h-5 text-[#7C3AED]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#0D9488]" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-[#BE185D]" />;
      default:
        return <BarChart3 className="w-5 h-5 text-[#8C6D58]" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#EADBCE] rounded-2xl p-12 text-center text-xs sm:text-sm text-[#7A6B63]">
        선생님의 상담 데이터 및 스트레스 분야를 정밀 분석하고 있습니다...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white border border-[#EADBCE] rounded-2xl p-8 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-[#D97706] mx-auto" />
        <h3 className="text-base font-bold text-[#2E2421]">분석할 데이터가 아직 충분하지 않습니다</h3>
        <p className="text-xs sm:text-sm text-[#7A6B63]">마음 상담실에서 상담을 진행하시면 스트레스 패턴이 자동 분석됩니다.</p>
      </div>
    );
  }

  const selectedCategorySessions = sessions.filter(s => {
    if (!selectedCategoryKey) return false;
    const cat = (s.category || '').toLowerCase();
    const tid = (s.topicId || '').toLowerCase();
    if (selectedCategoryKey === 'complaint') return cat.includes('민원') || tid.includes('parent');
    if (selectedCategoryKey === 'workload') return cat.includes('업무') || tid.includes('overwork');
    if (selectedCategoryKey === 'teaching') return cat.includes('학생') || cat.includes('수업') || tid.includes('student');
    if (selectedCategoryKey === 'self_worth') return cat.includes('자존') || cat.includes('자책') || tid.includes('imposter');
    if (selectedCategoryKey === 'relationship') return cat.includes('관계') || tid.includes('isolation');
    if (selectedCategoryKey === 'after_work') return cat.includes('퇴근') || tid.includes('boundary');
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#FAF5EE] via-[#F4EFE6] to-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> 교사 스트레스 분야 정밀 진단 시스템
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2421]">
              상담 데이터 기반 스트레스 분야 분석 & 맞춤 솔루션
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
              선생님께서 나누신 대화와 일지를 바탕으로 민원, 업무, 수업, 자존감 등 어떤 분야에서 가장 큰 에너지가 소진되는지 분석하고,
              더욱 정확하고 효과적인 맞춤 치유 전략을 제안합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-medium border border-[#EADBCE] text-[#5C4F4A] hover:bg-white rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" /> 분석 리포트 인쇄
            </button>
          </div>
        </div>
      </section>

      {/* Primary Highlight: Top Stress Domain Card */}
      <div className="bg-white border-2 border-[#8C6D58] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E9DF] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EADBCE] flex items-center justify-center text-[#8C6D58]">
              {getCategoryIcon(report.topStressDomain.key === 'complaint' ? 'ShieldAlert' : 'FileSpreadsheet')}
            </span>
            <div>
              <span className="text-xs font-bold text-[#8C6D58] uppercase">
                {report.topStressDomain.urgencyText}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
                선생님의 최대 스트레스 유발 분야: 「{report.topStressDomain.label}」
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#FAF8F5] px-3.5 py-1.5 rounded-lg border border-[#EADBCE]">
            <span className="text-[#7A6B63]">집중 비중:</span>
            <strong className="text-[#B45309] font-mono tabular-nums text-sm">{report.topStressDomain.percentage}%</strong>
            <span className="text-[#D1C3B7]">·</span>
            <span className="text-[#7A6B63]">평균 초기 불안:</span>
            <strong className="text-[#DC2626] font-mono tabular-nums text-sm">{report.topStressDomain.avgBeforeStress} / 10</strong>
          </div>
        </div>

        {/* Narrative Diagnosis Analysis */}
        <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#EADBCE] text-sm text-[#3A2E2B] leading-relaxed">
          <p className="font-medium">{report.topStressDomain.analysisMessage}</p>
        </div>

        {/* Two-Column Diagnostic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Vulnerability factors */}
          <div className="p-4 rounded-xl border border-[#EADBCE] bg-[#FAF8F5] space-y-2.5">
            <div className="font-bold text-[#2E2421] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>데이터로 확인된 주요 취약 요인</span>
            </div>
            <ul className="space-y-1.5 text-[#5C4F4A]">
              {report.topStressDomain.vulnerabilities.map((vuln, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B45309] font-bold">•</span>
                  <span className="leading-snug">{vuln}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable shield guide */}
          <div className="p-4 rounded-xl border border-[#EADBCE] bg-[#FAF8F5] space-y-2.5">
            <div className="font-bold text-[#2E2421] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>선생님을 위한 맞춤형 심리 방패 수칙</span>
            </div>
            <ul className="space-y-1.5 text-[#5C4F4A]">
              {report.topStressDomain.actionGuide.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#059669] font-bold">✓</span>
                  <span className="leading-snug">{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button: Start Tailored Counseling */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7A6B63]">
            * 이 분석을 반영하여 맞춤형 심층 상담을 즉시 진행할 수 있습니다.
          </div>
          <button
            onClick={() => onStartCounselingTopic(report.topStressDomain.recommendedTopicId)}
            className="px-5 py-2.5 rounded-xl bg-[#3A2E2B] text-white hover:bg-[#251D1B] font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#FDE68A]" />
            <span>「{report.topStressDomain.label}」 맞춤 심층 상담 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Domain Distribution Bar */}
      <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2E2421] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8C6D58]" />
            스트레스 분야별 비중 분포 (누적 상담 {report.totalSessions}건 기준)
          </h3>
          <span className="text-xs text-[#8C7A70]">분류별 막대를 클릭하면 해당 상담 기록을 확인합니다</span>
        </div>

        {/* Multi-segmented progress bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#EFE8DC] p-0.5">
          {report.categoryBreakdown
            .filter(cat => cat.count > 0)
            .map(cat => (
              <div
                key={cat.key}
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all cursor-pointer hover:opacity-85"
                title={`${cat.label}: ${cat.percentage}% (${cat.count}건)`}
                onClick={() => setSelectedCategoryKey(cat.key)}
              />
            ))}
        </div>

        {/* Category Legend & Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {report.categoryBreakdown.map((cat) => {
            const isSelected = selectedCategoryKey === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#8C6D58] bg-[#FAF6F0] ring-1 ring-[#8C6D58]'
                    : 'border-[#EADBCE] bg-white hover:border-[#C4B2A5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-[#2E2421] tabular-nums">{cat.percentage}%</span>
                  </div>
                  <div className="text-xs font-bold text-[#2E2421] leading-tight truncate">
                    {cat.label}
                  </div>
                  <div className="text-[11px] text-[#7A6B63] mt-0.5">
                    {cat.count}건 상담
                  </div>
                </div>

                {cat.count > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#F0E9DF] text-[11px] text-[#059669] font-medium flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>-{cat.avgRelief}점 완화</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Category Inspection & Session Logs */}
      {selectedCategoryKey && (
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {(() => {
            const selectedCat = report.categoryBreakdown.find(c => c.key === selectedCategoryKey);
            if (!selectedCat) return null;

            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E9DF] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#EADBCE]">
                      {getCategoryIcon(selectedCat.iconName)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#2E2421]">
                          {selectedCat.label}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#FAF5EE] text-[#8C6D58] font-semibold">
                          {selectedCat.count}건의 상담 기록
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6B63] mt-0.5">{selectedCat.sublabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EADBCE]">
                    <div>
                      <span className="text-[#7A6B63]">상담 전 불안: </span>
                      <strong className="text-[#DC2626] font-mono tabular-nums">{selectedCat.avgBeforeStress || '-'}점</strong>
                    </div>
                    <span className="text-[#D1C3B7]">→</span>
                    <div>
                      <span className="text-[#7A6B63]">상담 후 안정: </span>
                      <strong className="text-[#059669] font-mono tabular-nums">{selectedCat.avgAfterStress || '-'}점</strong>
                    </div>
                  </div>
                </div>

                {/* Primary Issue & Suggested Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] space-y-1">
                    <span className="font-bold text-[#78543E]">핵심 정서 문제:</span>
                    <p className="text-[#4D3F3A] leading-relaxed">{selectedCat.primaryIssue}</p>
                  </div>
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] space-y-1">
                    <span className="font-bold text-[#059669]">추천 관리 및 방어 전략:</span>
                    <p className="text-[#4D3F3A] leading-relaxed">{selectedCat.solutionSummary}</p>
                  </div>
                </div>

                {/* Filtered Sessions List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#2E2421] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#8C6D58]" />
                      이 분야의 상담 일지 히스토리 ({selectedCategorySessions.length})
                    </h4>
                    <button
                      onClick={onViewRecords}
                      className="text-xs text-[#8C6D58] hover:underline"
                    >
                      전체 상담 일지 열기 →
                    </button>
                  </div>

                  {selectedCategorySessions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#7A6B63] bg-[#FAF8F5] rounded-xl border border-[#EADBCE]">
                      이 분야에 등록된 과거 상담 일지가 아직 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCategorySessions.map((s) => (
                        <div key={s.id} className="p-4 rounded-xl border border-[#EADBCE] bg-[#FCFBF8] space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#2E2421]">{s.topicTitle}</span>
                            <span className="text-[#8C7A70]">{s.formattedDate}</span>
                          </div>
                          {s.userNotes && (
                            <p className="text-xs text-[#5C4F4A] italic bg-white p-2.5 rounded-lg border border-[#F0E9DF]">
                              “{s.userNotes}”
                            </p>
                          )}
                          <div className="flex items-center justify-between text-[11px] text-[#7A6B63] pt-1">
                            <span>스트레스 완화: {s.beforeStress}점 → {s.afterStress}점</span>
                            <span className="font-semibold text-[#8C6D58]">{s.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
