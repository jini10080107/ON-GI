import React, { useState } from 'react';
import { Trash2, Flame, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export const MindShredder: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processType, setProcessType] = useState<'shred' | 'burn' | null>(null);
  const [clearedCount, setClearedCount] = useState(0);
  const [afterMessage, setAfterMessage] = useState<string | null>(null);

  const quickSamples = [
    '“학부모님이 던진 비수 같은 말: 선생님 자격이 없으시네요”',
    '“‘내가 부족해서 아이들을 잘 못 이끄는 걸까’ 하는 자책감”',
    '“나 혼자만 교무실에서 뒤처지는 것 같은 극심한 불안”',
    '“내일 출근해서 마주해야 할 무거운 공문과 회의의 압박”'
  ];

  const handleStartProcess = (type: 'shred' | 'burn') => {
    if (!inputText.trim()) return;
    setProcessType(type);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setClearedCount(prev => prev + 1);
      setInputText('');
      setAfterMessage(
        type === 'shred'
          ? '날카로웠던 상처의 말들이 조각조각 부서져 사라졌습니다. 이제 선생님의 마음에 상처를 남길 수 없습니다.'
          : '마음을 짓누르던 무거운 생각들이 따뜻한 불꽃 속에서 하얀 연기가 되어 저 하늘로 흩어졌습니다.'
      );
    }, 2800);
  };

  const handleReset = () => {
    setAfterMessage(null);
    setProcessType(null);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase">
          심리적 외재화 (Emotional Externalization) & 정화
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
          마음을 찌르는 상처의 말, 여기에 털어놓고 파쇄해 버리세요
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
          머릿속에만 맴도는 독성 감정(Toxic Emotion)은 밖으로 꺼내어 눈앞에서 없애는 것만으로도
          뇌가 위협이 종결되었음을 인식합니다. 누구도 보지 못하는 안전한 종이에 털어놓으세요.
        </p>
      </div>

      <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {!afterMessage ? (
          <div className="space-y-6">
            {/* Quick Prompts */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#7A6B63]">자주 짓누르는 생각들 (클릭하여 채우기):</span>
              <div className="flex flex-wrap gap-2">
                {quickSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(sample)}
                    className="text-xs px-3 py-1.5 bg-[#FAF8F5] border border-[#EADBCE] text-[#5C4F4A] rounded-lg hover:border-[#8C6D58] hover:bg-white transition-colors text-left"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Canvas / Parchment */}
            <div className="relative">
              <div className={`p-4 sm:p-6 rounded-xl border-2 transition-all min-h-[220px] ${
                isProcessing && processType === 'shred'
                  ? 'border-dashed border-red-300 bg-red-50/40 animate-pulse'
                  : isProcessing && processType === 'burn'
                  ? 'border-orange-300 bg-orange-50/50 shadow-inner'
                  : 'border-[#D9C7B6] bg-[#FCFBF8]'
              }`}>
                {isProcessing ? (
                  <div className="h-44 flex flex-col items-center justify-center space-y-3 text-center">
                    {processType === 'shred' ? (
                      <>
                        <Trash2 className="w-10 h-10 text-[#DC2626] animate-bounce" />
                        <div className="text-sm font-bold text-[#991B1B]">
                          서걱서걱, 마음의 상처를 잘게 파쇄하고 있습니다...
                        </div>
                        <div className="text-xs text-[#7A6B63]">잠시만 숨을 깊게 들이쉬세요.</div>
                      </>
                    ) : (
                      <>
                        <Flame className="w-10 h-10 text-[#EA580C] animate-pulse" />
                        <div className="text-sm font-bold text-[#C2410C]">
                          타닥타닥, 무거운 짐을 따뜻한 불꽃으로 태우고 있습니다...
                        </div>
                        <div className="text-xs text-[#7A6B63]">연기가 되어 바람에 날아갑니다.</div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <textarea
                      rows={6}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="오늘 나를 아프게 했던 말, 학부모의 억지 민원, 자책했던 생각, 버리고 싶은 감정을 남김없이 쏟아내세요..."
                      className="w-full h-full bg-transparent text-sm sm:text-base text-[#2E2421] placeholder:text-[#A8988E] focus:outline-none resize-none leading-relaxed"
                    />
                    <div className="text-right text-[11px] text-[#A6978C] pt-2">
                      * 입력된 글은 저장되지 않으며 파쇄 즉시 영구 삭제됩니다.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-[#7A6B63]">
                오늘 비워낸 짐: <strong className="text-[#8C6D58] tabular-nums">{clearedCount}</strong>개
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartProcess('shred')}
                  disabled={!inputText.trim() || isProcessing}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                    inputText.trim() && !isProcessing
                      ? 'bg-[#3A2E2B] text-white hover:bg-[#251D1B]'
                      : 'bg-[#EFE8DC] text-[#A6978C] cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-[#FCA5A5]" />
                  <span>종이 분쇄기로 파쇄하기</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartProcess('burn')}
                  disabled={!inputText.trim() || isProcessing}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                    inputText.trim() && !isProcessing
                      ? 'bg-[#8C6D58] text-white hover:bg-[#785A46]'
                      : 'bg-[#EFE8DC] text-[#A6978C] cursor-not-allowed'
                  }`}
                >
                  <Flame className="w-4 h-4 text-[#FDBA74]" />
                  <span>모닥불에 태워 날려보내기</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Cleared State Card */
          <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center mx-auto text-[#059669]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#2E2421]">
                마음이 한결 가벼워지셨기를 바랍니다
              </h3>
              <p className="text-sm text-[#4D3F3A] leading-relaxed">
                {afterMessage}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] text-xs sm:text-sm font-serif italic text-[#78543E] leading-relaxed">
              “상처 주는 말은 그 사람의 일그러진 마음에 머물 뿐, 선생님의 진실된 영혼으로 한 발짝도 들어오지 못합니다.”
            </div>

            <div>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 text-xs sm:text-sm font-medium rounded-xl bg-[#3A2E2B] text-white hover:bg-[#251D1B] inline-flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" /> 다른 무거운 생각도 비우기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
