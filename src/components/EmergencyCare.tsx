import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldAlert, PhoneCall, Sparkles, Check, ChevronRight } from 'lucide-react';

export const EmergencyCare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'hotline'>('breathing');

  // Breathing state: 4-7-8
  // 4s Inhale, 7s Hold, 8s Exhale -> Total 19s per cycle
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = [
    {
      count: 5,
      sense: '시각 (눈으로 보이는 것)',
      prompt: '교실이나 방 안에서 눈에 보이는 5가지 사물을 천천히 찾아보세요.',
      examples: ['나무 책상의 나뭇결', '창문 밖 흔들리는 나뭇가지', '컵에 맺힌 물방울', '달력의 숫자', '벽의 시계 바늘']
    },
    {
      count: 4,
      sense: '촉각 (몸으로 느껴지는 것)',
      prompt: '지금 손이나 몸에 닿아 있는 4가지 감각을 느껴보세요.',
      examples: ['의자 등받이가 등을 받쳐주는 느낌', '양말 안의 발가락', '손끝에 닿는 옷감의 촉감', '볼펜의 매끄러운 플라스틱']
    },
    {
      count: 3,
      sense: '청각 (귀로 들리는 것)',
      prompt: '주변에서 들려오는 3가지 사소한 소리에 귀를 기울여보세요.',
      examples: ['시계의 째깍거리는 소리', '창밖의 먼 자동차 지나가는 소리', '나의 조용한 숨소리']
    },
    {
      count: 2,
      sense: '후각 (코로 느껴지는 냄새)',
      prompt: '공기 중에서 맡을 수 있는 2가지 냄새를 의식해보세요.',
      examples: ['따뜻한 차나 커피 냄새', '종이나 책의 은은한 향기 (없다면 깊게 숨을 들이쉬어 봅니다)']
    },
    {
      count: 1,
      sense: '마음의 닻 (나에게 건네는 말)',
      prompt: '손을 가슴 위에 얹고, 나 자신에게 조용히 한마디를 건네보세요.',
      examples: ['“나는 지금 여기에 있고, 안전하다.”', '“어떤 위협도 지금 당장 나를 해칠 수 없다.”']
    }
  ];

  // Breathing timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 8;
            } else {
              setBreathingPhase('inhale');
              setCompletedCycles((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase]);

  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('inhale');
    setPhaseSecondsLeft(4);
    setCompletedCycles(0);
  };

  // Circle animation style based on phase
  const getCircleScaleClass = () => {
    if (!isBreathingActive) return 'scale-95 bg-[#EFE8DC]';
    if (breathingPhase === 'inhale') return 'scale-125 bg-[#D8E6DB] transition-all duration-[4000ms] ease-out';
    if (breathingPhase === 'hold') return 'scale-125 bg-[#EADBCE] transition-none';
    if (breathingPhase === 'exhale') return 'scale-90 bg-[#F4EFE6] transition-all duration-[8000ms] ease-in';
    return 'scale-100';
  };

  const getPhaseInstruction = () => {
    if (!isBreathingActive) return '시작 버튼을 누르고 호흡을 따라오세요';
    if (breathingPhase === 'inhale') return '코로 천천히 숨을 깊게 들이마십니다 (4초)';
    if (breathingPhase === 'hold') return '숨을 부드럽게 멈추고 고요를 느낍니다 (7초)';
    if (breathingPhase === 'exhale') return '입으로 후- 하고 가늘고 길게 내쉽니다 (8초)';
    return '';
  };

  return (
    <div className="space-y-7">
      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'breathing' ? 'bg-[#3A2E2B] text-white shadow-xs' : 'text-[#6B5E57] hover:bg-[#EFE8DC]'
          }`}
        >
          4-7-8 안정화 호흡 (교감신경 진정)
        </button>
        <button
          onClick={() => setActiveTab('grounding')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'grounding' ? 'bg-[#3A2E2B] text-white shadow-xs' : 'text-[#6B5E57] hover:bg-[#EFE8DC]'
          }`}
        >
          5-4-3-2-1 감각 그라운딩 (착지 훈련)
        </button>
        <button
          onClick={() => setActiveTab('hotline')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'hotline' ? 'bg-[#3A2E2B] text-white shadow-xs' : 'text-[#6B5E57] hover:bg-[#EFE8DC]'
          }`}
        >
          교원 긴급 안전망 (1395)
        </button>
      </div>

      {/* Tab 1: Breathing */}
      {activeTab === 'breathing' && (
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-10 shadow-xs text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
              4-7-8 긴급 이완 호흡
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
              갑작스러운 민원 전화나 격한 갈등 후 뇌의 편도체가 과열되어 있을 때,
              부교감 신경을 활성화하여 심장박동을 떨어뜨리는 신경학적 이완법입니다.
            </p>
          </div>

          {/* Interactive Breathing Visualizer */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-64 h-64">
              {/* Outer Glow Ring */}
              <div
                className={`absolute w-56 h-56 rounded-full border-2 border-[#C9B7A6] ${getCircleScaleClass()}`}
              />
              {/* Center Counter */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl font-serif font-bold text-[#2E2421] tabular-nums">
                  {isBreathingActive ? phaseSecondsLeft : '준비'}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78543E] mt-1">
                  {isBreathingActive
                    ? breathingPhase === 'inhale' ? '들이쉬기' : breathingPhase === 'hold' ? '멈추기' : '내쉬기'
                    : '호흡 대기'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm sm:text-base font-medium text-[#3A2E2B]">
              {getPhaseInstruction()}
            </div>
            <div className="mt-1 text-xs text-[#8C7A70]">
              완료한 사이클: <span className="font-bold text-[#78543E] tabular-nums">{completedCycles}</span> 회 (권장: 4회)
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleBreathing}
              className="px-6 py-3 rounded-xl bg-[#3A2E2B] text-white hover:bg-[#251D1B] font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4" /> 일시 정지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> {completedCycles > 0 ? '계속하기' : '호흡 시작하기'}
                </>
              )}
            </button>
            <button
              onClick={resetBreathing}
              className="px-4 py-3 rounded-xl border border-[#EADBCE] text-[#5C4F4A] hover:bg-[#FAF7F2] text-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 초기화
            </button>
          </div>

          <div className="text-left bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] max-w-lg mx-auto text-xs text-[#6B5E57] space-y-1.5">
            <div className="font-bold text-[#3A2E2B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D58]" /> 호흡 팁
            </div>
            <p>1. 어깨의 힘을 툭 빼고 등을 편안하게 폅니다.</p>
            <p>2. 내쉴 때는 입술을 둥글게 모아 촛불을 천천히 끄듯 길게 내쉽니다.</p>
            <p>3. 잡생각이 떠오르면 "그렇구나" 하고 다시 호흡의 숫자에 주의를 둡니다.</p>
          </div>
        </div>
      )}

      {/* Tab 2: Grounding */}
      {activeTab === 'grounding' && (
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
              5-4-3-2-1 감각 그라운딩 (Mindfulness Grounding)
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
              머릿속이 패닉 상태이거나 끝없는 불안의 소용돌이에 휘말릴 때, 오감(五感)을 통해
              현재의 물리적 시공간으로 안전하게 의식을 되돌려 놓는 기법입니다.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 pt-2">
            {groundingSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setGroundingStep(idx)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  groundingStep === idx
                    ? 'bg-[#8C6D58]'
                    : groundingStep > idx
                    ? 'bg-[#3A2E2B]'
                    : 'bg-[#EADBCE]'
                }`}
                title={`${step.count}단계: ${step.sense}`}
              />
            ))}
          </div>

          {/* Step Card */}
          <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-[#8C6D58] text-white text-xs font-bold rounded-md">
                {groundingSteps[groundingStep].count}가지 감각
              </span>
              <span className="text-xs text-[#8C7A70]">
                {groundingStep + 1} / {groundingSteps.length} 단계
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#2E2421]">
              {groundingSteps[groundingStep].sense}
            </h3>

            <p className="text-sm sm:text-base text-[#4D3F3A] leading-relaxed font-medium">
              {groundingSteps[groundingStep].prompt}
            </p>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs text-[#78543E] font-semibold">예시 참고:</div>
              <ul className="space-y-1 text-xs text-[#5C4F4A]">
                {groundingSteps[groundingStep].examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setGroundingStep(prev => Math.max(0, prev - 1))}
              disabled={groundingStep === 0}
              className={`px-4 py-2 text-xs font-medium rounded-lg border border-[#EADBCE] ${
                groundingStep === 0 ? 'text-[#C4B2A5] cursor-not-allowed' : 'text-[#3A2E2B] hover:bg-[#FAF7F2]'
              }`}
            >
              이전 감각
            </button>

            {groundingStep < groundingSteps.length - 1 ? (
              <button
                onClick={() => setGroundingStep(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#3A2E2B] text-white hover:bg-[#251D1B] text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-xs"
              >
                <span>다음 감각 확인</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setGroundingStep(0)}
                className="px-5 py-2.5 rounded-xl bg-[#059669] text-white hover:bg-[#047857] text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-xs"
              >
                <span>그라운딩 완료 (다시하기)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Emergency Hotlines */}
      {activeTab === 'hotline' && (
        <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421] flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#DC2626]" />
              교원 긴급 보호 및 법률·심리 상담망
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
              선생님, 혼자서 감당하기 벅찬 악성 민원이나 아동학대 신고 위협, 극심한 심리적 위기 상황에서는
              지체 없이 국가 및 교육청의 공식 지원 체계를 가동해야 합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1395 Card */}
            <div className="p-5 rounded-xl border-2 border-[#8C6D58] bg-[#FAF6F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C6D58] uppercase">교육부 공식 교원전용</span>
                <span className="text-xs text-[#5C4F4A]">평일 09:00~18:00</span>
              </div>
              <div className="text-2xl font-bold font-serif text-[#2E2421] flex items-center gap-2">
                <PhoneCall className="w-6 h-6 text-[#8C6D58]" />
                국번없이 1395
              </div>
              <p className="text-xs sm:text-sm text-[#4D3F3A] leading-relaxed">
                교육활동 침해 사안 신고, 피해 교원 심리상담 지원, 법률 지원 연계가 원스톱으로 이루어지는 전용 콜센터입니다.
              </p>
              <div className="text-[11px] text-[#7A6B63] bg-white p-2.5 rounded-lg border border-[#EADBCE]">
                ✓ 상담 내용 및 신원은 철저히 비밀 보장됩니다.
              </div>
            </div>

            {/* Mental Health Crisis */}
            <div className="p-5 rounded-xl border border-[#EADBCE] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#DC2626] uppercase">24시간 위기 대응</span>
                <span className="text-xs text-[#5C4F4A]">연중무휴 24시간</span>
              </div>
              <div className="text-2xl font-bold font-serif text-[#2E2421] flex items-center gap-2">
                <PhoneCall className="w-6 h-6 text-[#DC2626]" />
                1577-0199
              </div>
              <p className="text-xs sm:text-sm text-[#4D3F3A] leading-relaxed">
                보건복지부 정신건강 위기상담전화. 야간이나 주말에 극심한 불안, 공황, 우울로 호흡이 어려울 때 언제든 연결됩니다.
              </p>
              <div className="text-[11px] text-[#7A6B63] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EADBCE]">
                ✓ 전문 정신건강 전문요원이 즉시 상담합니다.
              </div>
            </div>
          </div>

          {/* Quick Legal Boundary Checklist */}
          <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
            <h4 className="text-sm font-bold text-[#2E2421]">
              ⚠️ 악성 민원 대면/통화 시 즉각적인 3대 방어 수칙
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C4F4A]">
              <div className="bg-white p-3 rounded-lg border border-[#EADBCE] space-y-1">
                <div className="font-bold text-[#78543E]">1. 통화 중단 고지</div>
                <p>폭언이나 비하 발언 시 "폭언이 지속되면 상담을 중단하겠습니다"라고 1회 경고 후 녹음 또는 즉시 종료하세요.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#EADBCE] space-y-1">
                <div className="font-bold text-[#78543E]">2. 단독 대면 금지</div>
                <p>격앙된 학부모 방문 시 절대 교실에서 혼자 만나지 마시고, 교무실 또는 상담실에서 교감/부장 동석 하에 진행하세요.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#EADBCE] space-y-1">
                <div className="font-bold text-[#78543E]">3. 객관적 사실 일지화</div>
                <p>퇴근 전 통화 일시, 상대의 발언 요지, 나의 답변을 감정 배제하고 6하 원칙에 따라 교원일지에 즉시 기록해 두세요.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
