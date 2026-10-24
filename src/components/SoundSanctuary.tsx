import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { SoundType } from '../types';
import { CloudRain, Wind, Flame, Moon, Volume2, Square, Sparkles } from 'lucide-react';

export const SoundSanctuary: React.FC = () => {
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);

  const soundList: {
    id: SoundType;
    title: string;
    sub: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }[] = [
    {
      id: 'rain',
      title: '방과 후 교실 창가의 빗소리',
      sub: '아이들이 모두 하교한 후 고요한 교실에 쏟아지는 차분한 비',
      icon: <CloudRain className="w-5 h-5 text-[#2563EB]" />,
      color: 'bg-blue-50/70 border-blue-200',
      description: '복잡한 머릿속을 씻어내고 잡념을 지워주는 부드러운 핑크 노이즈'
    },
    {
      id: 'breeze',
      title: '가을 운동장의 잔잔한 바람',
      sub: '넓은 운동장 플라타너스 잎을 흔들며 스치는 선선한 가을바람',
      icon: <Wind className="w-5 h-5 text-[#059669]" />,
      color: 'bg-emerald-50/70 border-emerald-200',
      description: '답답하게 막혀있던 가슴을 틔워주는 부드러운 중저음 바람 소리'
    },
    {
      id: 'crackle',
      title: '따뜻한 차와 포근한 모닥불',
      sub: '퇴근 후 따뜻한 머그잔을 감싸 쥐고 바라보는 은은한 온기',
      icon: <Flame className="w-5 h-5 text-[#D97706]" />,
      color: 'bg-amber-50/70 border-amber-200',
      description: '얼어붙었던 긴장을 녹이고 안정감을 주는 은은한 온기 사운드'
    },
    {
      id: 'cricket',
      title: '고요한 밤하늘과 풀벌레 소리',
      sub: '학교의 모든 일과가 끝나고 오롯이 나에게 찾아온 깊은 밤의 평화',
      icon: <Moon className="w-5 h-5 text-[#7C3AED]" />,
      color: 'bg-purple-50/70 border-purple-200',
      description: '수면을 유도하고 불안한 과각성을 달래주는 평화로운 자연의 선율'
    }
  ];

  const toggleSound = (soundId: SoundType) => {
    if (currentSound === soundId) {
      soundEngine.stop();
      setCurrentSound(null);
    } else {
      soundEngine.play(soundId);
      setCurrentSound(soundId);
    }
  };

  const handleStopAll = () => {
    soundEngine.stop();
    setCurrentSound(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const setAutoTimer = (mins: number) => {
    setTimerMinutes(mins);
    setTimerSecondsLeft(mins * 60);
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerSecondsLeft !== null && timerSecondsLeft > 0 && currentSound !== null) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            handleStopAll();
            setTimerMinutes(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerSecondsLeft, currentSound]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase">
          교사를 위한 힐링 사운드스케이프 (Web Audio API)
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2421]">
          소음 가득했던 하루, 이제는 귀와 뇌를 쉬어줄 시간
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
          종일 울리던 학교 종소리, 교실의 웅성거림, 전화벨 소리로 지친 청각 신경계를
          차분한 자연의 소리로 감싸 안아줍니다. 외부 음원 없이 브라우저 자체에서 맑게 합성됩니다.
        </p>
      </div>

      {/* Main Sound Controls */}
      <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Master Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#EADBCE]">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#8C6D58]" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#5C4F4A]">음량</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 sm:w-32 accent-[#8C6D58] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#7A6B63] tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A6B63]">타이머:</span>
            {[10, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => setAutoTimer(m)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  timerMinutes === m
                    ? 'bg-[#3A2E2B] text-white border-[#3A2E2B]'
                    : 'bg-white text-[#5C4F4A] border-[#EADBCE] hover:bg-[#FAF7F2]'
                }`}
              >
                {m}분
              </button>
            ))}
            {timerSecondsLeft !== null && (
              <span className="text-xs font-bold text-[#8C6D58] font-mono ml-1 tabular-nums">
                ({formatTimer(timerSecondsLeft)})
              </span>
            )}
          </div>

          {currentSound && (
            <button
              onClick={handleStopAll}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#EFE8DC] text-[#3A2E2B] hover:bg-[#E2D6C5] flex items-center gap-1.5 transition-colors"
            >
              <Square className="w-3.5 h-3.5" /> 소리 멈추기
            </button>
          )}
        </div>

        {/* Sound Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soundList.map((snd) => {
            const isPlaying = currentSound === snd.id;
            return (
              <div
                key={snd.id}
                onClick={() => toggleSound(snd.id)}
                className={`cursor-pointer rounded-xl p-5 border transition-all text-left flex flex-col justify-between ${
                  isPlaying
                    ? 'border-[#8C6D58] bg-[#FAF6F0] ring-1 ring-[#8C6D58] shadow-xs'
                    : 'border-[#EADBCE] hover:border-[#C4B2A5] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-white border border-[#EADBCE] shadow-2xs">
                        {snd.icon}
                      </div>
                      <h3 className="text-base font-bold text-[#2E2421]">
                        {snd.title}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isPlaying
                        ? 'bg-[#8C6D58] text-white animate-pulse'
                        : 'bg-[#EFE8DC] text-[#7A6B63]'
                    }`}>
                      {isPlaying ? '재생 중' : '재생'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed">
                    {snd.sub}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0E9DF] text-[11px] text-[#8C7A70] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#8C6D58]" />
                  <span>{snd.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
