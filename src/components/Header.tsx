import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEmergencyClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onEmergencyClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('counseling')}
          className="text-lg font-bold tracking-tight text-[#3A2E2B] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity flex items-center gap-2 text-left"
        >
          <span className="w-7 h-7 rounded-lg bg-[#E6DAC8] flex items-center justify-center text-[#78543E] font-serif font-bold text-sm">
            토
          </span>
          <span>토닥샘</span>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5E57]">
          <button
            onClick={() => setActiveTab('counseling')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'counseling' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            마음 상담실
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'records' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            나의 상담 일지
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'analytics' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            데이터 분석
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'emergency' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            응급 마인드케어
          </button>
          <button
            onClick={() => setActiveTab('burnout')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'burnout' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            소진도 자가진단
          </button>
          <button
            onClick={() => setActiveTab('shredder')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'shredder' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            마음 비우기
          </button>
          <button
            onClick={() => setActiveTab('sound')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'sound' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            힐링 사운드
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'community' ? 'text-[#3A2E2B] font-semibold border-b-2 border-[#8C6D58] pb-1' : 'hover:text-[#3A2E2B]'
            }`}
          >
            온기 나눔
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEmergencyClick}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#8C6D58] hover:bg-[#785A46] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            1분 호흡 & 진정
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Small Screens */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-[#EFE8DC] bg-[#FAF7F2] no-scrollbar">
        <button
          onClick={() => setActiveTab('counseling')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'counseling' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          마음 상담실
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'records' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          상담 일지
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'analytics' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          데이터 분석
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'emergency' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          응급 케어
        </button>
        <button
          onClick={() => setActiveTab('burnout')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'burnout' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          소진도 진단
        </button>
        <button
          onClick={() => setActiveTab('shredder')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'shredder' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          마음 비우기
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'sound' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          힐링 사운드
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'community' ? 'bg-[#3A2E2B] text-white' : 'bg-[#EFE8DC] text-[#6B5E57]'
          }`}
        >
          온기 나눔
        </button>
      </div>
    </header>
  );
};
