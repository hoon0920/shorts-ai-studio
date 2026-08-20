import React, { useState } from 'react';
import { GenerationRequest, Platform, Tone, Duration } from '../types';
import { PLATFORMS, TONES, DURATIONS, SAMPLE_TOPICS } from '../data/constants';
import { Sparkles, Youtube, Instagram, Video, CheckCircle2, ChevronDown, Sliders, RefreshCw, Wand2, Lightbulb } from 'lucide-react';

interface InputPanelProps {
  onGenerate: (request: GenerationRequest) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onGenerate,
  isLoading,
  loadingStep,
}) => {
  const [topic, setTopic] = useState<string>('온라인 쇼핑몰 대박 패키징 노하우');
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [tone, setTone] = useState<Tone>('information');
  const [duration, setDuration] = useState<Duration>(30);
  const [includeFlowOmni, setIncludeFlowOmni] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic: topic.trim(),
      platform,
      tone,
      duration,
      includeFlowOmni,
      customNotes: customNotes.trim() || undefined,
    });
  };

  const renderPlatformIcon = (id: Platform) => {
    switch (id) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Wand2 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            콘텐츠 조건 설정
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Gemini 3.6 Flash Engine
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <span>영상 주제 입력</span>
              <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const random = SAMPLE_TOPICS[Math.floor(Math.random() * SAMPLE_TOPICS.length)];
                setTopic(random);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>랜덤 주제 추천</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 온라인 쇼핑몰 대박 패키징 노하우, 개발자 칼퇴 팁"
              required
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Quick Preset Topics Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>빠른 주제 샘플 (클릭 시 자동 입력):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TOPICS.slice(0, 4).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(sample)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-left truncate max-w-[200px]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            게시 플랫폼 선택
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => {
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    {renderPlatformIcon(p.id)}
                    <span className="text-xs font-bold">{p.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {p.ratio}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            톤앤매너
          </label>
          <div className="relative">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full appearance-none px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pr-10 cursor-pointer font-medium"
            >
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.emoji} {t.label} ({t.description})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* Target Video Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            목표 영상 길이
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((d) => {
              const isSelected = duration === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`px-3 py-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-sm">{d.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {d.subtitle.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Option Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Google Flow & Omni 프롬프트 자동 생성
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                @Character_A 태그 및 대화형 멀티모달 지시문 생성
              </span>
            </div>
            <input
              type="checkbox"
              checked={includeFlowOmni}
              onChange={(e) => setIncludeFlowOmni(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
            />
          </label>
        </div>

        {/* Custom Notes (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>추가 연출 및 나레이션 요청사항 (선택)</span>
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="예: 빠른 호흡, 자막 강조, 병맛 밈 사운드 연출 요청"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{loadingStep || 'AI 생성 중...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>대본 및 멀티모달 프롬프트 생성</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
