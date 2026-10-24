import React, { useState } from 'react';
import { BURNOUT_QUESTIONS, getBurnoutDiagnosis } from '../data/burnoutQuestions';
import { CheckCircle2, RotateCcw, AlertTriangle, Activity, ArrowRight } from 'lucide-react';

export const BurnoutTest: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSavedToBackend, setIsSavedToBackend] = useState(false);

  const options = [
    { value: 0, label: '전혀 그렇지 않다' },
    { value: 1, label: '드물게 그렇다 (월 1~2회)' },
    { value: 2, label: '종종 그렇다 (주 1회)' },
    { value: 3, label: '자주 그렇다 (주 2~3회)' },
    { value: 4, label: '항상 그렇다 (매일)' }
  ];

  const handleSelectOption = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === BURNOUT_QUESTIONS.length;

  const calculateResult = async () => {
    if (!isAllAnswered) return;
    setIsCalculated(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });

    // Calculate subscales
    const emotionalQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'emotional');
    const depersonalizationQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'depersonalization');
    const accomplishmentQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'accomplishment');

    const total = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    const emo = emotionalQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const dep = depersonalizationQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const acc = accomplishmentQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const diag = getBurnoutDiagnosis(total);

    try {
      await fetch('/api/burnout/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalScore: total,
          level: diag.level,
          color: diag.color,
          emotionalScore: emo,
          depersonalizationScore: dep,
          accomplishmentScore: acc
        })
      });
      setIsSavedToBackend(true);
    } catch (err) {
      console.error('Failed to save burnout result to backend:', err);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setIsCalculated(false);
    setIsSavedToBackend(false);
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const diagnosis = getBurnoutDiagnosis(totalScore);

  // Subscale breakdown
  const emotionalQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'emotional');
  const depersonalizationQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'depersonalization');
  const accomplishmentQuestions = BURNOUT_QUESTIONS.filter(q => q.category === 'accomplishment');

  const emotionalScore = emotionalQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
  const depersonalizationScore = depersonalizationQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
  const accomplishmentScore = accomplishmentQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase">
          교사 소진 척도 자가진단 (MBI-ES 기반)
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
          선생님의 마음 배터리는 지금 몇 % 남아있을까요?
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
          교사의 번아웃은 열정이 부족해서가 아니라, 너무 오랜 시간 혼자 감당해 온 책임감 때문입니다.
          10가지 문항을 통해 현재 나의 정서적 피로도와 탈진 상태를 객관적으로 점검해 보세요.
        </p>
      </div>

      {!isCalculated ? (
        /* Questionnaire Form */
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0E9DF]">
            <span className="text-xs font-semibold text-[#8C6D58]">
              진행 상황: <span className="text-[#2E2421] font-bold">{answeredCount}</span> / {BURNOUT_QUESTIONS.length} 문항 완료
            </span>
            <div className="w-36 sm:w-48 bg-[#EFE8DC] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#8C6D58] h-full transition-all duration-300"
                style={{ width: `${(answeredCount / BURNOUT_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-7">
            {BURNOUT_QUESTIONS.map((q, idx) => {
              const currentVal = answers[q.id];
              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-xl border border-[#F0E9DF] bg-[#FAF8F5] space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-[#8C6D58]">문항 {idx + 1}</div>
                    <div className="text-sm sm:text-base font-bold text-[#2E2421] leading-snug">
                      {q.question}
                    </div>
                    <div className="text-xs text-[#7A6B63]">
                      {q.subtext}
                    </div>
                  </div>

                  {/* 5-scale buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                    {options.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.value)}
                          className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                            isSelected
                              ? 'bg-[#3A2E2B] text-white border-[#3A2E2B] shadow-xs'
                              : 'bg-white text-[#5C4F4A] border-[#EADBCE] hover:border-[#8C6D58]'
                          }`}
                        >
                          <div className="font-bold text-[13px]">{opt.value}점</div>
                          <div className="text-[11px] mt-0.5 opacity-90">{opt.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-[#7A6B63]">
              {!isAllAnswered ? `남은 ${BURNOUT_QUESTIONS.length - answeredCount}개 문항을 체크해 주세요.` : '모든 문항이 체크되었습니다.'}
            </span>
            <button
              onClick={calculateResult}
              disabled={!isAllAnswered}
              className={`px-6 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs ${
                isAllAnswered
                  ? 'bg-[#3A2E2B] text-white hover:bg-[#251D1B]'
                  : 'bg-[#EFE8DC] text-[#A6978C] cursor-not-allowed'
              }`}
            >
              <span>진단 결과 분석 보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Top Score Summary */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="px-3.5 py-1 text-xs font-bold rounded-full text-white" style={{ backgroundColor: diagnosis.color }}>
                {diagnosis.badge}
              </span>
              {isSavedToBackend && (
                <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  서버 저장 완료
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2421]">
              선생님의 소진 점수는 <span style={{ color: diagnosis.color }}>{totalScore}점</span> / 40점 입니다
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed">
              {diagnosis.description}
            </p>
          </div>

          {/* Subscale Meters */}
          <div className="bg-[#FAF7F2] p-6 rounded-xl border border-[#EADBCE] space-y-4">
            <h3 className="text-sm font-bold text-[#2E2421] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8C6D58]" /> 영역별 세부 소진도 분석
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Emotional */}
              <div>
                <div className="flex justify-between font-medium text-[#4D3F3A] mb-1">
                  <span>정서적 고갈 (피로 및 만성 소진)</span>
                  <span className="font-bold text-[#78543E]">{emotionalScore} / 20점</span>
                </div>
                <div className="w-full bg-[#EADBCE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8C6D58] rounded-full"
                    style={{ width: `${(emotionalScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Depersonalization */}
              <div>
                <div className="flex justify-between font-medium text-[#4D3F3A] mb-1">
                  <span>탈인격화 (아이들 및 관계에 대한 냉담·방어기제)</span>
                  <span className="font-bold text-[#78543E]">{depersonalizationScore} / 8점</span>
                </div>
                <div className="w-full bg-[#EADBCE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D97706] rounded-full"
                    style={{ width: `${(depersonalizationScore / 8) * 100}%` }}
                  />
                </div>
              </div>

              {/* Accomplishment */}
              <div>
                <div className="flex justify-between font-medium text-[#4D3F3A] mb-1">
                  <span>교육적 효능감 저하 (자책감 및 무력감)</span>
                  <span className="font-bold text-[#78543E]">{accomplishmentScore} / 12점</span>
                </div>
                <div className="w-full bg-[#EADBCE] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669] rounded-full"
                    style={{ width: `${(accomplishmentScore / 12) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2E2421] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" /> 지금 선생님을 위한 단계별 처방 행동
            </h3>
            <div className="space-y-2">
              {diagnosis.advice.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#FAF8F5] border border-[#EADBCE] rounded-xl flex items-start gap-3 text-xs sm:text-sm text-[#4D3F3A]">
                  <span className="w-5 h-5 rounded-full bg-[#8C6D58] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {totalScore > 24 && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-xs sm:text-sm text-[#991B1B]">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC2626]" />
              <p className="leading-relaxed">
                현재 고도 번아웃 상태입니다. 혼자 끙끙 앓지 마시고, 교원치유지원센터(1395)나 교육청 연계 전문 상담 기관에서 익명 심리 상담 바우처를 신청해 적극적인 도움을 받으시길 권해드립니다.
              </p>
            </div>
          )}

          {/* Reset or Retest */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium border border-[#EADBCE] rounded-xl text-[#5C4F4A] hover:bg-[#FAF7F2] flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 진단 다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
