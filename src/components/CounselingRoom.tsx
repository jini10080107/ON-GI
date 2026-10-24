import React, { useState, useEffect } from 'react';
import { COUNSELING_TOPICS } from '../data/counselingData';
import { CounselingTopic } from '../types';
import { Heart, ShieldCheck, ArrowRight, RotateCcw, Sparkles, CheckCircle2, Bookmark, Share2 } from 'lucide-react';

interface CounselingRoomProps {
  onOpenBreathing: () => void;
  onOpenSound: () => void;
  onViewRecords?: () => void;
  initialTopicId?: string | null;
}

export const CounselingRoom: React.FC<CounselingRoomProps> = ({
  onOpenBreathing,
  onOpenSound,
  onViewRecords,
  initialTopicId
}) => {
  const [selectedTopic, setSelectedTopic] = useState<CounselingTopic | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [accumulatedOptions, setAccumulatedOptions] = useState<string[]>([]);
  const [customInputText, setCustomInputText] = useState('');
  const [accumulatedNotes, setAccumulatedNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedPrescription, setSavedPrescription] = useState(false);
  const [savedToBackend, setSavedToBackend] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [beforeStress, setBeforeStress] = useState(8);
  const [afterStress, setAfterStress] = useState(4);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    if (initialTopicId) {
      const found = COUNSELING_TOPICS.find(t => t.id === initialTopicId);
      if (found) {
        startTopic(found);
      }
    }
  }, [initialTopicId]);

  const startTopic = (topic: CounselingTopic) => {
    setSelectedTopic(topic);
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setAccumulatedOptions([]);
    setCustomInputText('');
    setAccumulatedNotes('');
    setIsCompleted(false);
    setSavedPrescription(false);
    setSavedToBackend(false);
    setBeforeStress(8);
    setAfterStress(4);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNextStep = () => {
    if (!selectedTopic) return;

    // Collect chosen option label
    if (selectedOptionId) {
      const stageOpt = selectedTopic.stages[currentStepIndex]?.options?.find(o => o.id === selectedOptionId);
      if (stageOpt) {
        setAccumulatedOptions(prev => [...prev, stageOpt.label]);
      }
    }
    if (customInputText.trim()) {
      setAccumulatedNotes(prev => (prev ? `${prev}\n${customInputText.trim()}` : customInputText.trim()));
    }

    if (currentStepIndex + 1 < selectedTopic.stages.length) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setCustomInputText('');
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setCustomInputText('');
    setAccumulatedOptions([]);
    setAccumulatedNotes('');
    setIsCompleted(false);
    setSavedToBackend(false);
  };

  const handleSaveToJournal = () => {
    setSavedPrescription(true);
    setTimeout(() => setSavedPrescription(false), 3000);
  };

  const handleSaveToBackend = async () => {
    if (!selectedTopic) return;
    setSavingLoading(true);
    try {
      const res = await fetch('/api/counseling/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          category: selectedTopic.category,
          beforeStress,
          afterStress,
          selectedOptions: accumulatedOptions,
          userNotes: accumulatedNotes,
          teacherMemo: '',
          status: '마음안정',
          prescription: selectedTopic.prescription
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedToBackend(true);
      }
    } catch (err) {
      console.error('Backend save failed:', err);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleCopyAffirmation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Message */}
      <section className="bg-gradient-to-b from-[#F4EFE6] to-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase mb-2">
            교사 심리 치유 & 마음 보호 라운지
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2421] leading-snug">
            선생님, 오늘 하루도 참 무겁고 외로운 짐을 지셨지요.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5C4F4A] leading-relaxed">
            학부모의 날 선 한마디, 교실 안의 갈등, 끝없는 행정 공문 속에서 상처받은 마음을 있는 그대로 인정받는 곳입니다.
            비난이나 섣부른 조언 대신, 선생님의 편에서 온전히 귀 기울이고 스스로를 지킬 수 있는 마음의 방패를 건네드립니다.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#7A6B63]">
            <span className="flex items-center gap-1.5 font-medium text-[#4D3F3A]">
              <ShieldCheck className="w-4 h-4 text-[#8C6D58]" /> 100% 익명 및 안전한 개인 공간
            </span>
            <span aria-hidden="true">·</span>
            <span>심리학 기반의 정서 수용 & 인지 재구조화</span>
            <span aria-hidden="true">·</span>
            <span>교원치유지원센터 매뉴얼 반영</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Topic Selection or Active Session */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2E2421] font-serif">
              어떤 마음의 상처를 먼저 어루만져 드릴까요?
            </h2>
            <span className="text-xs text-[#8C7A70]">주제를 선택하시면 맞춤 상담이 시작됩니다</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNSELING_TOPICS.map((topic) => (
              <div
                key={topic.id}
                onClick={() => startTopic(topic)}
                className="group cursor-pointer bg-white border border-[#EADBCE] hover:border-[#8C6D58] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8C6D58] font-medium mb-2.5">
                    <span>{topic.category}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <h3 className="text-base font-bold text-[#2E2421] leading-snug group-hover:text-[#8C6D58] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E6059] leading-relaxed">
                    {topic.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F4EFE6] text-[11px] italic text-[#8F7D74] line-clamp-2">
                  {topic.quote}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Counseling Chamber */
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-7">
          {/* Top Session Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0E9DF]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-xs text-[#7A6B63] hover:text-[#2E2421] underline flex items-center gap-1"
              >
                ← 다른 고민 선택
              </button>
              <span className="text-xs text-[#D1C3B7]">|</span>
              <span className="text-xs font-semibold text-[#8C6D58]">{selectedTopic.category}</span>
            </div>
            <div className="text-xs text-[#7A6B63]">
              {!isCompleted ? `단계 ${currentStepIndex + 1} / ${selectedTopic.stages.length}` : '처방전 완료'}
            </div>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
              {selectedTopic.title}
            </h2>
            <div className="mt-2 text-sm italic text-[#8C6D58] bg-[#FAF7F2] px-4 py-2.5 rounded-lg border border-[#EADBCE]">
              {selectedTopic.quote}
            </div>
          </div>

          {!isCompleted ? (
            /* Ongoing Steps */
            <div className="space-y-6 pt-2">
              {/* Current Prompt */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#2E2421] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C6D58] text-white text-xs flex items-center justify-center font-bold">
                    {currentStepIndex + 1}
                  </span>
                  <span>{selectedTopic.stages[currentStepIndex].prompt}</span>
                </h3>
              </div>

              {/* Options */}
              {selectedTopic.stages[currentStepIndex].options && (
                <div className="space-y-3">
                  {selectedTopic.stages[currentStepIndex].options!.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        className={`cursor-pointer border rounded-xl p-4 transition-all text-left ${
                          isSelected
                            ? 'border-[#8C6D58] bg-[#FAF6F0] ring-1 ring-[#8C6D58]'
                            : 'border-[#EADBCE] hover:border-[#C4B2A5] bg-white'
                        }`}
                      >
                        <div className="text-sm sm:text-base font-medium text-[#2E2421] flex items-start gap-2.5">
                          <span className={`w-4 h-4 rounded-full border mt-1 shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-[#8C6D58] bg-[#8C6D58]' : 'border-[#C4B2A5]'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span>{opt.label}</span>
                        </div>

                        {isSelected && (
                          <div className="mt-3.5 pl-6.5 pt-3 border-t border-[#EADBCE]/60 space-y-2 text-xs sm:text-sm">
                            <p className="text-[#8C6D58] font-medium leading-relaxed">
                              {opt.reaction}
                            </p>
                            <p className="text-[#5C4F4A] leading-relaxed">
                              {opt.insight}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Free Writing Reflection Box */}
              {selectedTopic.stages[currentStepIndex].customInputPlaceholder && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-[#5C4F4A]">
                    내 마음의 소리를 직접 적어보기 (비밀 보장 / 브라우저 내부 보관)
                  </label>
                  <textarea
                    rows={3}
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    placeholder={selectedTopic.stages[currentStepIndex].customInputPlaceholder}
                    className="w-full text-sm p-3.5 border border-[#EADBCE] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8C6D58] bg-[#FCFBF8] text-[#2E2421] placeholder:text-[#A8988E]"
                  />
                </div>
              )}

              {/* Psychological Counseling & Shield Panel */}
              <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#8C6D58]">
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedTopic.stages[currentStepIndex].expertCounsel.title}</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-[#4D3F3A] leading-relaxed">
                  {selectedTopic.stages[currentStepIndex].expertCounsel.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {selectedTopic.stages[currentStepIndex].expertCounsel.protectiveAction && (
                  <div className="mt-3 pt-3 border-t border-[#E8DFD3] space-y-2">
                    <div className="text-xs font-bold text-[#78543E]">
                      🛡️ {selectedTopic.stages[currentStepIndex].expertCounsel.protectiveAction!.title}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#5C4F4A]">
                      {selectedTopic.stages[currentStepIndex].expertCounsel.protectiveAction!.items.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onOpenBreathing}
                  className="text-xs font-medium text-[#7A6B63] hover:text-[#2E2421] underline flex items-center gap-1.5"
                >
                  💨 지금 가슴이 답답하다면? (1분 진정 호흡)
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={!selectedOptionId && !customInputText.trim()}
                  className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
                    selectedOptionId || customInputText.trim()
                      ? 'bg-[#3A2E2B] text-white hover:bg-[#251D1B]'
                      : 'bg-[#EFE8DC] text-[#A6978C] cursor-not-allowed'
                  }`}
                >
                  <span>{currentStepIndex + 1 < selectedTopic.stages.length ? '다음 단계로' : '마음 처방전 받기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Completed Prescription Card */
            <div className="space-y-6 pt-2">
              <div className="bg-gradient-to-br from-[#FAF5EE] to-[#F3ECE2] border-2 border-[#D8C6B5] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#E3D3C3] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#8C6D58] text-white flex items-center justify-center font-serif font-bold text-sm">
                      Rx
                    </span>
                    <div>
                      <div className="text-xs text-[#8C6D58] font-semibold tracking-wide">선생님 전용 마음 처방전</div>
                      <h3 className="text-base sm:text-lg font-bold text-[#2E2421]">
                        {selectedTopic.prescription.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#7A6B63]">
                    <span className="font-semibold text-[#8C6D58]">{selectedTopic.prescription.diagnosisName}</span>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-[#3A2E2B] leading-relaxed font-serif bg-white/70 p-4 rounded-xl border border-[#EADBCE]">
                  “{selectedTopic.prescription.warmMessage}”
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E2421] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" /> 오늘 저녁 실천할 작은 회복 행동
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#5C4F4A]">
                    {selectedTopic.prescription.prescribedHabits.map((habit, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/60 p-2.5 rounded-lg border border-[#EADBCE]/80">
                        <span className="w-5 h-5 rounded-full bg-[#EADBCE] text-[#78543E] text-xs flex items-center justify-center shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{habit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Affirmation Banner */}
                <div className="p-4 rounded-xl bg-[#3A2E2B] text-[#FAF7F2] space-y-2">
                  <div className="text-[11px] text-[#C4B2A5] tracking-wide uppercase font-semibold">
                    오늘 밤 나에게 건네는 한마디
                  </div>
                  <div className="text-sm sm:text-base font-serif font-medium leading-relaxed">
                    {selectedTopic.prescription.affirmation}
                  </div>
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => handleCopyAffirmation(selectedTopic.prescription.affirmation)}
                      className="text-xs text-[#E8DFD3] hover:text-white underline flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" /> 문구 복사하기
                    </button>
                  </div>
                </div>
                {/* Stress Level Self-Check before saving to server */}
                <div className="p-4 rounded-xl bg-white border border-[#EADBCE] space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E2421]">
                    📊 상담 전후 마음 상태 기록 (서버 일지 저장용)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#5C4F4A]">
                        <span>상담 전 답답함/불안:</span>
                        <strong className="text-[#DC2626] font-mono tabular-nums">{beforeStress} / 10</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={beforeStress}
                        onChange={(e) => setBeforeStress(Number(e.target.value))}
                        className="w-full accent-[#DC2626] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[#5C4F4A]">
                        <span>상담 후 마음 안정도:</span>
                        <strong className="text-[#059669] font-mono tabular-nums">{afterStress} / 10</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={afterStress}
                        onChange={(e) => setAfterStress(Number(e.target.value))}
                        className="w-full accent-[#059669] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Server Save Callout */}
                <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#8C6D58] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#3A2E2B]">
                      {savedToBackend ? '✓ 서버 상담 일지에 안전하게 저장되었습니다.' : '이 상담 내용을 나의 서버 일지에 기록해 둘까요?'}
                    </div>
                    <div className="text-[11px] text-[#7A6B63] mt-0.5">
                      상담 내용, 선택했던 감정, 마음 처방전이 서버 데이터베이스에 영구 보관됩니다.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {savedToBackend ? (
                      onViewRecords && (
                        <button
                          onClick={onViewRecords}
                          className="px-3.5 py-1.5 text-xs font-semibold bg-[#8C6D58] text-white rounded-lg hover:bg-[#78543E] transition-colors"
                        >
                          나의 상담 일지에서 확인하기 →
                        </button>
                      )
                    ) : (
                      <button
                        onClick={handleSaveToBackend}
                        disabled={savingLoading}
                        className="px-4 py-2 text-xs font-medium bg-[#3A2E2B] text-white rounded-lg hover:bg-[#251D1B] transition-colors shadow-xs"
                      >
                        {savingLoading ? '저장 중...' : '서버 일지에 영구 보관'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {copyToast && (
                <div className="text-center text-xs font-medium text-[#059669] bg-[#ECFDF5] py-2 px-3 rounded-lg border border-[#A7F3D0]">
                  위로의 문구가 클립보드에 복사되었습니다. 소중한 나에게 저장해 두세요.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 text-xs text-[#5C4F4A] hover:text-[#2E2421] border border-[#EADBCE] rounded-lg flex items-center gap-1.5 hover:bg-[#FAF7F2] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 이 상담 다시 진행하기
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveToJournal}
                    className="px-4 py-2.5 text-xs font-medium text-[#3A2E2B] border border-[#8C6D58] rounded-xl hover:bg-[#FAF6F0] flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#8C6D58]" />
                    <span>{savedPrescription ? '처방전 보관 완료!' : '내 마음에 보관하기'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#3A2E2B] rounded-xl hover:bg-[#251D1B] flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>다른 고민 둘러보기</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
