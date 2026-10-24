import React, { useState } from 'react';
import { Header } from './components/Header';
import { CounselingRoom } from './components/CounselingRoom';
import { EmergencyCare } from './components/EmergencyCare';
import { BurnoutTest } from './components/BurnoutTest';
import { MindShredder } from './components/MindShredder';
import { SoundSanctuary } from './components/SoundSanctuary';
import { WarmthWall } from './components/WarmthWall';
import { CounselingRecords } from './components/CounselingRecords';
import { StressAnalytics } from './components/StressAnalytics';
import { ActiveTab } from './types';
import { PhoneCall, HeartHandshake } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('counseling');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handleEmergencyClick = () => {
    setActiveTab('emergency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCustomTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('counseling');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2E2421]">
      {/* Strict 3-zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEmergencyClick={handleEmergencyClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {activeTab === 'counseling' && (
          <CounselingRoom
            onOpenBreathing={() => setActiveTab('emergency')}
            onOpenSound={() => setActiveTab('sound')}
            onViewRecords={() => setActiveTab('records')}
            initialTopicId={selectedTopicId}
          />
        )}
        {activeTab === 'records' && (
          <CounselingRecords
            onStartNewCounseling={() => {
              setSelectedTopicId(null);
              setActiveTab('counseling');
            }}
          />
        )}
        {activeTab === 'analytics' && (
          <StressAnalytics
            onStartCounselingTopic={handleStartCustomTopic}
            onViewRecords={() => setActiveTab('records')}
          />
        )}
        {activeTab === 'emergency' && <EmergencyCare />}
        {activeTab === 'burnout' && <BurnoutTest />}
        {activeTab === 'shredder' && <MindShredder />}
        {activeTab === 'sound' && <SoundSanctuary />}
        {activeTab === 'community' && <WarmthWall />}
      </main>

      {/* Warm Support Footer */}
      <footer className="border-t border-[#E8E1D5] bg-[#F4EFE6] py-8 text-xs text-[#6E6059]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#3A2E2B]">토닥샘</span>
            <span aria-hidden="true">·</span>
            <span>지친 교사를 위한 비영리 심리 회복 및 위로 라운지</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="tel:1395"
              className="flex items-center gap-1.5 font-medium text-[#78543E] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" /> 교원치유지원센터 1395
            </a>
            <span aria-hidden="true" className="text-[#D1C3B7]">|</span>
            <span className="flex items-center gap-1 text-[#6E6059]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#8C6D58]" /> 전국의 모든 선생님을 응원합니다
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
