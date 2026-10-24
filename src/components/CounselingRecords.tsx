import React, { useState, useEffect } from 'react';
import { CounselingSessionRecord, StatsSummary } from '../types';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit3,
  Save,
  Download,
  PlusCircle,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CounselingRecordsProps {
  onStartNewCounseling: () => void;
}

export const CounselingRecords: React.FC<CounselingRecordsProps> = ({ onStartNewCounseling }) => {
  const [sessions, setSessions] = useState<CounselingSessionRecord[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [memoInput, setMemoInput] = useState('');
  const [statusInput, setStatusInput] = useState<'진행중' | '마음안정' | '지속케어필요'>('마음안정');
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const [resSessions, resStats] = await Promise.all([
        fetch('/api/counseling/sessions'),
        fetch('/api/stats')
      ]);

      const dataSessions = await resSessions.json();
      const dataStats = await resStats.json();

      if (dataSessions.success) {
        setSessions(dataSessions.sessions);
      }
      if (dataStats.success) {
        setStats(dataStats.stats);
      }
    } catch (err) {
      console.error('Failed to load counseling records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const startEdit = (session: CounselingSessionRecord) => {
    setEditingSessionId(session.id);
    setMemoInput(session.teacherMemo || '');
    setStatusInput(session.status || '마음안정');
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setMemoInput('');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/counseling/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherMemo: memoInput,
          status: statusInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.map(s => (s.id === id ? data.session : s)));
        setEditingSessionId(null);
        showToast('상담 메모와 상태가 안전하게 저장되었습니다.');
      }
    } catch {
      showToast('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('이 상담 기록을 영구 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/counseling/sessions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.filter(s => s.id !== id));
        showToast('상담 기록이 삭제되었습니다.');
      }
    } catch {
      showToast('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `todak_counseling_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('상담 데이터가 JSON 파일로 백업되었습니다.');
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherMemo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase mb-1">
              백엔드 데이터 센터 (Server Persistent DB)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2421]">
              나의 상담 일지 & 마음 기록 보관소
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
              선생님께서 마주했던 아픔의 순간들과 이를 이겨내기 위해 건넸던 처방전이 서버에 안전하게 보관됩니다.
              시간의 흐름에 따라 내 마음이 어떻게 회복되고 있는지 추적해 보세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 text-xs font-medium border border-[#EADBCE] text-[#5C4F4A] hover:bg-white rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> 데이터 백업
            </button>
            <button
              onClick={onStartNewCounseling}
              className="px-4 py-2 text-xs font-medium bg-[#3A2E2B] text-white hover:bg-[#251D1B] rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" /> 새 상담 시작
            </button>
          </div>
        </div>
      </section>

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EADBCE] rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-[#7A6B63] font-medium">총 상담 기록</div>
          <div className="mt-1 text-2xl font-bold font-serif text-[#2E2421] tabular-nums">
            {stats ? stats.totalSessions : sessions.length}회
          </div>
          <div className="mt-1 text-[11px] text-[#8C6D58]">서버 안전 보관 중</div>
        </div>

        <div className="bg-white border border-[#EADBCE] rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-[#7A6B63] font-medium">평균 스트레스 완화도</div>
          <div className="mt-1 text-2xl font-bold font-serif text-[#059669] flex items-center gap-1 tabular-nums">
            <TrendingDown className="w-5 h-5 text-[#059669]" />
            -{stats?.avgRelief || 3.8}점
          </div>
          <div className="mt-1 text-[11px] text-[#7A6B63]">상담 후 긴장 완화 효과</div>
        </div>

        <div className="bg-white border border-[#EADBCE] rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-[#7A6B63] font-medium">보관된 처방전</div>
          <div className="mt-1 text-2xl font-bold font-serif text-[#2E2421] tabular-nums">
            {stats ? stats.totalPrescriptions : 2}개
          </div>
          <div className="mt-1 text-[11px] text-[#7A6B63]">맞춤형 행동 루틴</div>
        </div>

        <div className="bg-white border border-[#EADBCE] rounded-xl p-4 shadow-2xs">
          <div className="text-xs text-[#7A6B63] font-medium">소진도 진단 횟수</div>
          <div className="mt-1 text-2xl font-bold font-serif text-[#2E2421] tabular-nums">
            {stats ? stats.burnoutTestsCount : 1}회
          </div>
          <div className="mt-1 text-[11px] text-[#7A6B63]">정기 점검 이력</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EADBCE] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#8C7A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="상담 주제, 메모, 감정 키워드 검색..."
            className="w-full text-xs sm:text-sm text-[#2E2421] placeholder:text-[#A8988E] focus:outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs text-[#7A6B63] mr-1">상태:</span>
          {['all', '마음안정', '진행중', '지속케어필요'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#3A2E2B] text-white font-medium'
                  : 'bg-[#FAF8F5] text-[#5C4F4A] border border-[#EADBCE] hover:bg-white'
              }`}
            >
              {st === 'all' ? '전체 보기' : st}
            </button>
          ))}
        </div>
      </div>

      {feedbackToast && (
        <div className="text-center text-xs font-medium text-[#059669] bg-[#ECFDF5] py-2 px-4 rounded-lg border border-[#A7F3D0]">
          {feedbackToast}
        </div>
      )}

      {/* Session Records List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs sm:text-sm text-[#7A6B63]">
            서버에서 상담 기록을 불러오고 있습니다...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#C4B2A5] mx-auto" />
            <h3 className="text-base font-bold text-[#2E2421]">일치하는 상담 기록이 없습니다</h3>
            <p className="text-xs sm:text-sm text-[#7A6B63] max-w-md mx-auto">
              새로운 마음 상담실에서 상처받은 마음을 털어놓고 맞춤 처방전을 발급받아 보세요.
            </p>
            <div className="pt-2">
              <button
                onClick={onStartNewCounseling}
                className="px-4 py-2 text-xs sm:text-sm bg-[#3A2E2B] text-white rounded-xl hover:bg-[#251D1B]"
              >
                마음 상담실로 이동
              </button>
            </div>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isEditing = editingSessionId === session.id;
            const isPrescriptionOpen = expandedPrescriptionId === session.id;

            return (
              <div
                key={session.id}
                className="bg-white border border-[#EADBCE] rounded-xl p-5 sm:p-6 shadow-xs hover:border-[#8C6D58] transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E9DF] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF5EE] text-[#8C6D58] font-semibold text-xs border border-[#EADBCE]">
                      {session.category}
                    </span>
                    <span className="text-xs text-[#8C7A70]">{session.formattedDate || new Date(session.date).toLocaleDateString('ko-KR')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      session.status === '마음안정'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : session.status === '진행중'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {session.status === '마음안정' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{session.status}</span>
                    </span>

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-1.5 text-[#A6978C] hover:text-[#DC2626] rounded-md hover:bg-red-50 transition-colors"
                      title="기록 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Session Main Body */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#2E2421]">
                    {session.topicTitle}
                  </h3>

                  {/* Stress comparison gauge */}
                  <div className="flex items-center gap-4 bg-[#FAF8F5] p-3 rounded-lg border border-[#EADBCE] text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#7A6B63]">상담 전 불안도:</span>
                      <strong className="text-[#DC2626] font-mono tabular-nums">{session.beforeStress} / 10</strong>
                    </div>
                    <span className="text-[#D1C3B7]">→</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#7A6B63]">상담 후 안정도:</span>
                      <strong className="text-[#059669] font-mono tabular-nums">{session.afterStress} / 10</strong>
                    </div>
                    <span className="text-[#059669] font-medium hidden sm:inline">
                      ({Math.max(0, session.beforeStress - session.afterStress)}점 완화)
                    </span>
                  </div>

                  {/* Selected Insights */}
                  {session.selectedOptions && session.selectedOptions.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[#78543E]">상담 당시 마주했던 감정:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {session.selectedOptions.map((opt, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 bg-[#FAF6F0] text-[#5C4F4A] rounded-md border border-[#EADBCE]">
                            • {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Personal Notes from Session */}
                  {session.userNotes && (
                    <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#EADBCE] text-xs sm:text-sm text-[#4D3F3A] leading-relaxed">
                      <div className="font-semibold text-[#78543E] text-xs mb-1">선생님의 당시 기록:</div>
                      <p className="italic">“{session.userNotes}”</p>
                    </div>
                  )}

                  {/* Editable Teacher Follow-up Memo */}
                  <div className="pt-1">
                    {isEditing ? (
                      <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#8C6D58]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#2E2421]">
                            사후 경과 메모 & 상태 업데이트
                          </label>
                          <select
                            value={statusInput}
                            onChange={(e) => setStatusInput(e.target.value as '진행중' | '마음안정' | '지속케어필요')}
                            className="text-xs px-2.5 py-1 rounded border border-[#EADBCE] bg-white"
                          >
                            <option value="마음안정">마음안정</option>
                            <option value="진행중">진행중</option>
                            <option value="지속케어필요">지속케어필요</option>
                          </select>
                        </div>
                        <textarea
                          rows={2}
                          value={memoInput}
                          onChange={(e) => setMemoInput(e.target.value)}
                          placeholder="그 후 상황이 어떻게 진행되었는지, 마음이 어떠한지 메모해보세요..."
                          className="w-full text-xs sm:text-sm p-2.5 border border-[#EADBCE] rounded-lg bg-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-xs text-[#7A6B63] hover:text-[#2E2421]"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveEdit(session.id)}
                            className="px-3 py-1 text-xs bg-[#3A2E2B] text-white rounded-lg flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> 저장하기
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-[#6B5E57] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#F0E9DF]">
                        <div>
                          <strong className="text-[#3A2E2B]">선생님 후기 메모:</strong>{' '}
                          {session.teacherMemo ? session.teacherMemo : '아직 작성된 후기 메모가 없습니다.'}
                        </div>
                        <button
                          onClick={() => startEdit(session)}
                          className="text-[#8C6D58] hover:underline flex items-center gap-1 font-medium ml-2 shrink-0"
                        >
                          <Edit3 className="w-3 h-3" /> {session.teacherMemo ? '수정' : '메모 추가'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Attached Prescription Accordion */}
                  {session.prescription && (
                    <div className="pt-1">
                      <button
                        onClick={() => setExpandedPrescriptionId(isPrescriptionOpen ? null : session.id)}
                        className="text-xs text-[#8C6D58] hover:text-[#2E2421] font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>연결된 마음 처방전 보기</span>
                        {isPrescriptionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isPrescriptionOpen && (
                        <div className="mt-2.5 p-4 rounded-xl bg-[#FAF5EE] border border-[#EADBCE] text-xs sm:text-sm space-y-2">
                          <div className="font-bold text-[#2E2421]">
                            Rx. {session.prescription.title} ({session.prescription.diagnosisName})
                          </div>
                          <p className="text-[#5C4F4A] leading-relaxed italic">
                            “{session.prescription.warmMessage}”
                          </p>
                          <div className="font-serif font-medium text-[#78543E] pt-1">
                            {session.prescription.affirmation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
