import React, { useState, useEffect } from 'react';
import { INITIAL_PEER_NOTES, DAILY_AFFIRMATIONS } from '../data/supportMessages';
import { PeerNote } from '../types';
import { Heart, Send, Sparkles, MessageSquareHeart, RefreshCw } from 'lucide-react';

export const WarmthWall: React.FC = () => {
  const [notes, setNotes] = useState<PeerNote[]>(() => {
    const saved = localStorage.getItem('todak_peer_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PEER_NOTES;
      }
    }
    return INITIAL_PEER_NOTES;
  });

  const [authorTag, setAuthorTag] = useState('초등 교사');
  const [newContent, setNewContent] = useState('');
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    localStorage.setItem('todak_peer_notes', JSON.stringify(notes));
  }, [notes]);

  const handleLike = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextLiked = !n.liked;
          return {
            ...n,
            liked: nextLiked,
            likes: nextLiked ? n.likes + 1 : n.likes - 1
          };
        }
        return n;
      })
    );
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsPosting(true);
    const newNote: PeerNote = {
      id: `custom-${Date.now()}`,
      authorTag: authorTag || '동료 교사',
      content: newContent.trim(),
      date: '방금 전',
      likes: 1,
      liked: true
    };

    setTimeout(() => {
      setNotes([newNote, ...notes]);
      setNewContent('');
      setIsPosting(false);
    }, 400);
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % DAILY_AFFIRMATIONS.length);
  };

  return (
    <div className="space-y-8">
      {/* Daily Affirmation Highlight */}
      <div className="bg-gradient-to-r from-[#FAF5EE] via-[#F6EFE6] to-[#FAF5EE] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D58] tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 오늘의 교사 마음 확언 (Daily Affirmation)
            </span>
            <button
              onClick={nextAffirmation}
              className="text-xs text-[#7A6B63] hover:text-[#2E2421] flex items-center gap-1 underline"
            >
              <RefreshCw className="w-3 h-3" /> 다른 문장 보기
            </button>
          </div>

          <blockquote className="text-base sm:text-lg font-serif font-semibold text-[#2E2421] leading-relaxed">
            “{DAILY_AFFIRMATIONS[affirmationIndex].quote}”
          </blockquote>

          <div className="text-xs text-[#8C7A70] italic">
            — {DAILY_AFFIRMATIONS[affirmationIndex].author}
          </div>
        </div>
      </div>

      {/* Write a Warm Note Card */}
      <div className="bg-white border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#2E2421] flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-[#8C6D58]" />
          지친 다른 동료 선생님에게 건네는 따뜻한 한마디
        </h3>

        <form onSubmit={handleSubmitNote} className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-[#5C4F4A]">나의 소개 태그:</label>
            <select
              value={authorTag}
              onChange={(e) => setAuthorTag(e.target.value)}
              className="text-xs px-3 py-1.5 border border-[#EADBCE] rounded-lg bg-[#FAF8F5] text-[#2E2421] focus:outline-none focus:ring-1 focus:ring-[#8C6D58]"
            >
              <option value="초등 교사">초등 교사</option>
              <option value="중등 교사">중등 교사</option>
              <option value="고등 교사">고등 교사</option>
              <option value="특수교사">특수교사</option>
              <option value="보건·상담교사">보건·상담교사</option>
              <option value="영양·사서교사">영양·사서교사</option>
              <option value="유치원 교사">유치원 교사</option>
              <option value="동료 교사">익명의 동료 교사</option>
            </select>
          </div>

          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="선생님, 오늘 하루도 정말 수고 많으셨어요. 혼자가 아니에요..."
            className="w-full p-3.5 border border-[#EADBCE] rounded-xl text-xs sm:text-sm text-[#2E2421] placeholder:text-[#A8988E] focus:outline-none focus:ring-1 focus:ring-[#8C6D58] bg-[#FCFBF8]"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#8C7A70]">
              * 교원 서로를 지지하는 따뜻하고 다정한 표현을 남겨주세요.
            </span>
            <button
              type="submit"
              disabled={!newContent.trim() || isPosting}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                newContent.trim() && !isPosting
                  ? 'bg-[#3A2E2B] text-white hover:bg-[#251D1B]'
                  : 'bg-[#EFE8DC] text-[#A6978C] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>온기 전하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* Peer Notes Wall Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2E2421]">
            선생님들이 남겨준 온기 우체통 ({notes.length})
          </h3>
          <span className="text-xs text-[#8C7A70]">하트를 눌러 응원을 보태어 주세요</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-[#EADBCE] hover:border-[#8C6D58] rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF5EE] text-[#8C6D58] font-medium border border-[#EADBCE]">
                    {note.authorTag}
                  </span>
                  <span className="text-[#8C7A70] text-[11px]">{note.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#3A2E2B] leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0E9DF] flex items-center justify-end">
                <button
                  onClick={() => handleLike(note.id)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    note.liked
                      ? 'bg-rose-50 text-rose-600 font-semibold'
                      : 'text-[#7A6B63] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${note.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="tabular-nums">{note.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
