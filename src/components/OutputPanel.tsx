import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { copyToClipboard, exportToCapCutCsv, generateFullTextSummary, exportUnifiedProductionKit } from '../utils/exporter';
import { SafeZoneOverlay } from './SafeZoneOverlay';
import { AI_TOOL_LINKS } from '../data/constants';
import {
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  FileSpreadsheet,
  Zap,
  Clock,
  Gauge,
  AlertTriangle,
  ExternalLink,
  Volume2,
  Film,
  Sparkles,
  ShieldCheck,
  MessageSquareText,
  Music,
  Share2,
  Play,
  Download,
  Languages,
  Layers,
  FileText,
  ChevronDown,
  Info
} from 'lucide-react';

interface OutputPanelProps {
  content: GeneratedContent | null;
  onSaveToLibrary: (content: GeneratedContent) => void;
  isSaved: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  content,
  onSaveToLibrary,
  isSaved,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'script' | 'prompts' | 'audio' | 'master'>('script');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [langMode, setLangMode] = useState<'bilingual' | 'korean' | 'english'>('bilingual');
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});

  if (!content) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors text-center flex flex-col items-center justify-center min-h-[460px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900 shadow-inner">
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          대본 및 프롬프트 결과가 이곳에 표시됩니다
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          좌측 폼에서 영상 주제를 입력하고 생성 버튼을 누르면, 영상 대본, 1:1 매칭 AI 비디오 프롬프트(한/영 번역), Suno AI BGM 가이드가 한 번에 완성됩니다.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg w-full text-left">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">🎬 후킹 대본</span>
            <span className="text-[10px] text-slate-400">3초 몰입 멘트 & CTA</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">🎨 1:1 매칭 프롬프트</span>
            <span className="text-[10px] text-slate-400">한글 번역 & 영문 원본</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">💬 Flow & Omni</span>
            <span className="text-[10px] text-slate-400">멀티모달 이미지 생성</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">🎵 Suno BGM</span>
            <span className="text-[10px] text-slate-400">연계된 음원 가이드</span>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyText = (key: string, text: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = generateFullTextSummary(content);
    copyToClipboard(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const toggleTranslation = (key: string) => {
    setExpandedTranslations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const { script, flowOmniPrompts, audioPrompts } = content;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
      {/* Header Action Bar */}
      <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
            {content.platform} ({content.duration}s)
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {content.topic}
          </h2>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Safe zone toggle */}
          <button
            onClick={() => setShowSafeZone(!showSafeZone)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1 ${
              showSafeZone
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>9:16 Safe Zone</span>
          </button>

          {/* Export Unified Production Kit (Master Download) */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => exportUnifiedProductionKit(content, 'md')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-sm shadow-indigo-500/20"
              title="대본, 장면별 영상 프롬프트, BGM 가이드가 100% 연계된 통합 문서 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>📦 올인원 통합 가이드 다운로드</span>
            </button>
            <button
              onClick={() => exportUnifiedProductionKit(content, 'txt')}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700"
              title="TXT 형식으로 다운로드"
            >
              .TXT
            </button>
          </div>

          {/* Export to CapCut CSV */}
          <button
            onClick={() => exportToCapCutCsv(content)}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CapCut CSV</span>
          </button>

          {/* Copy All */}
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? '전체 복사됨!' : '전체 복사'}</span>
          </button>

          {/* Save to Library */}
          <button
            onClick={() => onSaveToLibrary(content)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs ${
              isSaved
                ? 'bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>보관됨</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>보관함 저장</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safe Zone Modal / Guidance Drawer */}
      {showSafeZone && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900/95">
          <SafeZoneOverlay platform={content.platform} onClose={() => setShowSafeZone(false)} />
        </div>
      )}

      {/* Tabs Navigation & Translation Mode Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none pt-2">
          <button
            onClick={() => setActiveSubTab('script')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex-shrink-0 ${
              activeSubTab === 'script'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>🎬 영상 대본 & 1:1 프롬프트</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prompts')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex-shrink-0 ${
              activeSubTab === 'prompts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Flow & Omni 프롬프트</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audio')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex-shrink-0 ${
              activeSubTab === 'audio'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>🎵 Suno BGM 가이드</span>
          </button>

          <button
            onClick={() => setActiveSubTab('master')}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex-shrink-0 ${
              activeSubTab === 'master'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📦 올인원 통합 마스터 뷰</span>
          </button>
        </div>

        {/* Global Translation Language Mode Selector */}
        <div className="flex items-center space-x-1.5 py-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
            <Languages className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">프롬프트 언어:</span>
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => setLangMode('bilingual')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                langMode === 'bilingual' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              한/영 병기
            </button>
            <button
              onClick={() => setLangMode('korean')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                langMode === 'korean' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              한글 번역
            </button>
            <button
              onClick={() => setLangMode('english')}
              className={`px-2 py-1 rounded-md font-bold transition-all ${
                langMode === 'english' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              영문 원본
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Video Script & 1:1 Matched Scene Prompts */}
      {activeSubTab === 'script' && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Speaking Speed & WPM Meter */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    예상 말하기 속도 (WPM):
                  </span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    약 {script.wpm} WPM
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    script.wpmStatus === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {script.wpmStatus === 'optimal' ? '적정 속도' : '속도 빠름'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  총 나레이션 단어: 약 {script.totalWordCount}글자 | 목표 영상 시간: {content.duration}초
                </p>
              </div>
            </div>

            {script.wpmWarning && (
              <div className="w-full sm:w-auto px-3 py-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-xs flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{script.wpmWarning}</span>
              </div>
            )}
          </div>

          {/* Hook Card (초반 3초 후킹) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/40 dark:to-indigo-950/40 p-5 rounded-2xl border-2 border-amber-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>초반 3초 후킹 멘트 (시선 집중 3초 공식)</span>
              </span>
              <button
                onClick={() => handleCopyText('hook', script.hook)}
                className="text-xs text-amber-700 dark:text-amber-300 hover:underline flex items-center space-x-1 font-bold"
              >
                {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'hook' ? '복사됨' : '복사'}</span>
              </button>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed my-2">
              "{script.hook}"
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 font-medium bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
              💡 연출 가이드: {script.hookDescription}
            </p>
          </div>

          {/* Scenes Timeline Breakdown with 1:1 Cohesive Prompts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>장면별 대본, 1:1 매칭 영상 프롬프트 & 오디오 큐</span>
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                총 {script.scenes.length}개 장면 완전 연계
              </span>
            </div>

            <div className="space-y-4">
              {script.scenes.map((scene, idx) => {
                const visualPromptEn = scene.matchedVisualPrompt || flowOmniPrompts?.imageFxPrompts?.[idx]?.prompt || flowOmniPrompts?.googleFlowPrompts?.[idx % flowOmniPrompts.googleFlowPrompts.length]?.prompt || 'Cinematic vertical 9:16 shot, studio lighting';
                const visualPromptKo = scene.matchedVisualPromptKo || flowOmniPrompts?.imageFxPrompts?.[idx]?.promptKo || flowOmniPrompts?.googleFlowPrompts?.[idx % flowOmniPrompts.googleFlowPrompts.length]?.promptKo || '시네마틱 세로 9:16 영상 프롬프트';
                const audioCue = scene.audioCue || `BPM ${audioPrompts.bpm} 배경 비트 유지 및 화면 전환 효과음`;

                return (
                  <div
                    key={scene.id || idx}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-3.5"
                  >
                    {/* Scene Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                          장면 {idx + 1} ({scene.time})
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                          {scene.cameraAngle}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyText(`scene-${idx}`, `${scene.narration}\n(자막: ${scene.onScreenText})`)}
                          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1 font-medium"
                        >
                          {copiedKey === `scene-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `scene-${idx}` ? '복사됨' : '대본 복사'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Narration */}
                    <div className="pl-3 border-l-2 border-indigo-500 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                        🗣️ 나레이션 (Voiceover):
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                        {scene.narration}
                      </p>
                    </div>

                    {/* Visual Cue & OnScreen Text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-indigo-500 block mb-0.5">
                          🎬 비주얼 연출 지시문:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {scene.visualCue}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-pink-500 block mb-0.5">
                          💬 화면 상단/중앙 자막 텍스트:
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">
                          {scene.onScreenText}
                        </span>
                      </div>
                    </div>

                    {/* 1:1 Matched AI Video/Image Prompt Box */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>1:1 매칭 AI 비디오/이미지 프롬프트 (Veo / Midjourney / ImageFX)</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopyText(`matched-prompt-${idx}`, visualPromptEn)}
                            className="text-[11px] text-indigo-600 dark:text-indigo-300 hover:underline font-bold flex items-center space-x-1"
                          >
                            {copiedKey === `matched-prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>영문 복사</span>
                          </button>
                        </div>
                      </div>

                      {/* Prompt Display according to langMode */}
                      {(langMode === 'bilingual' || langMode === 'english') && (
                        <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-950 leading-relaxed select-all">
                          {visualPromptEn}
                        </p>
                      )}

                      {(langMode === 'bilingual' || langMode === 'korean') && visualPromptKo && (
                        <div className="text-xs text-indigo-950 dark:text-indigo-200 bg-indigo-100/60 dark:bg-indigo-900/40 p-2.5 rounded-lg border border-indigo-200/60 dark:border-indigo-800/40 leading-relaxed flex items-start space-x-1.5">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">🇰🇷 번역:</span>
                          <span>{visualPromptKo}</span>
                        </div>
                      )}
                    </div>

                    {/* Audio Cue for this scene */}
                    <div className="bg-amber-50/50 dark:bg-amber-950/30 px-3 py-2 rounded-lg border border-amber-200/50 dark:border-amber-900/40 text-xs flex items-center space-x-2">
                      <Music className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">BGM/오디오 연출:</span>
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">{audioCue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call To Action (CTA) */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                <MessageSquareText className="w-4 h-4" />
                <span>행동 유도 멘트 (Call to Action)</span>
              </span>
              <button
                onClick={() => handleCopyText('cta', script.cta)}
                className="text-xs text-emerald-700 dark:text-emerald-300 hover:underline flex items-center space-x-1 font-bold"
              >
                {copiedKey === 'cta' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>복사</span>
              </button>
            </div>
            <p className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
              "{script.cta}"
            </p>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                추천 해시태그 (#)
              </span>
              <button
                onClick={() => handleCopyText('hashtags', script.hashtags.join(' '))}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-bold"
              >
                {copiedKey === 'hashtags' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>태그 전체 복사</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {script.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-slate-200/60 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Google Flow & Omni Prompts with Translations */}
      {activeSubTab === 'prompts' && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* External Links Bar */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Google Flow & Gemini Omni 연동 가이드</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                생성된 영문 프롬프트와 @Character_A 태그를 해당 공식 AI 생성 툴에 복사하여 붙여넣으세요.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={AI_TOOL_LINKS.googleFlow}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
              >
                <span>Google Flow 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={AI_TOOL_LINKS.geminiOmni}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
              >
                <span>Gemini Omni 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Section 1: Google Flow Tag Prompts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>1. Google Flow용 태그 기반 소재 프롬프트</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {flowOmniPrompts.googleFlowPrompts.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-xs font-extrabold rounded">
                      {item.tag} ({item.label})
                    </span>
                    <button
                      onClick={() => handleCopyText(`flow-${idx}`, item.prompt)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 font-bold"
                    >
                      {copiedKey === `flow-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `flow-${idx}` ? '복사됨' : '영문 복사'}</span>
                    </button>
                  </div>

                  {(langMode === 'bilingual' || langMode === 'english') && (
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 leading-relaxed select-all">
                      {item.prompt}
                    </p>
                  )}

                  {(langMode === 'bilingual' || langMode === 'korean') && item.promptKo && (
                    <div className="text-xs text-blue-950 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200/60 dark:border-blue-900/40 flex items-start space-x-1.5">
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">🇰🇷 한글 번역:</span>
                      <span>{item.promptKo}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Gemini Omni Conversational Prompts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>2. Gemini Omni 대화형 수정 멀티모달 프롬프트</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {flowOmniPrompts.geminiOmniPrompts.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      💬 시나리오: {item.scenario}
                    </span>
                    <button
                      onClick={() => handleCopyText(`omni-${idx}`, item.prompt)}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1 font-bold"
                    >
                      {copiedKey === `omni-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `omni-${idx}` ? '복사됨' : '영문 복사'}</span>
                    </button>
                  </div>

                  {(langMode === 'bilingual' || langMode === 'english') && (
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 leading-relaxed select-all">
                      "{item.prompt}"
                    </p>
                  )}

                  {(langMode === 'bilingual' || langMode === 'korean') && item.promptKo && (
                    <div className="text-xs text-purple-950 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-lg border border-purple-200/60 dark:border-purple-900/40 flex items-start space-x-1.5">
                      <span className="font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">🇰🇷 한글 번역:</span>
                      <span>{item.promptKo}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: ImageFX / Midjourney Visual Prompts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span>3. ImageFX & Midjourney 맞춤 비주얼 프롬프트</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flowOmniPrompts.imageFxPrompts.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      장면 {item.sceneIndex}: {item.title}
                    </span>
                    <button
                      onClick={() => handleCopyText(`imagefx-${idx}`, item.prompt)}
                      className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center space-x-1 font-bold"
                    >
                      {copiedKey === `imagefx-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>영문 복사</span>
                    </button>
                  </div>

                  {(langMode === 'bilingual' || langMode === 'english') && (
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 leading-relaxed select-all">
                      {item.prompt}
                    </p>
                  )}

                  {(langMode === 'bilingual' || langMode === 'korean') && item.promptKo && (
                    <div className="text-xs text-pink-950 dark:text-pink-200 bg-pink-50 dark:bg-pink-950/40 p-2.5 rounded-lg border border-pink-200/60 dark:border-pink-900/40 flex items-start space-x-1.5">
                      <span className="font-bold text-pink-600 dark:text-pink-400 flex-shrink-0">🇰🇷 번역:</span>
                      <span>{item.promptKo}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Suno AI & Audio Prompts */}
      {activeSubTab === 'audio' && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Suno Top Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-900 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Suno AI 전용 BGM 및 가사 프롬프트
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                무드: <span className="font-bold text-amber-600 dark:text-amber-400">{audioPrompts.mood}</span> | 템포: <span className="font-bold text-slate-900 dark:text-white">{audioPrompts.bpm} BPM</span>
              </p>
            </div>

            <a
              href={AI_TOOL_LINKS.sunoAi}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-sm shadow-amber-500/20"
            >
              <span>Suno AI에서 음악 생성</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Audio Production Guide if present */}
          {audioPrompts.audioProductionGuide && (
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-bold">
                <Info className="w-4 h-4" />
                <span>영상-BGM 연계 오디오 연출 가이드 (볼륨 더킹 및 타이밍)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                {audioPrompts.audioProductionGuide}
              </p>
            </div>
          )}

          {/* BGM Style Keywords */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                🎵 BGM 스타일 키워드 (Suno Style Prompt)
              </span>
              <button
                onClick={() => handleCopyText('bgm-style', audioPrompts.bgmStyleKeywords)}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 font-bold"
              >
                {copiedKey === 'bgm-style' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>스타일 복사</span>
              </button>
            </div>

            {(langMode === 'bilingual' || langMode === 'english') && (
              <p className="text-sm font-bold font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                {audioPrompts.bgmStyleKeywords}
              </p>
            )}

            {(langMode === 'bilingual' || langMode === 'korean') && audioPrompts.bgmStyleKeywordsKo && (
              <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 flex items-start space-x-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">🇰🇷 한글 설명:</span>
                <span>{audioPrompts.bgmStyleKeywordsKo}</span>
              </div>
            )}
          </div>

          {/* Structured Lyric Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              구조화된 가사/사운드 이펙트 프롬프트
            </h4>

            <div className="space-y-2">
              {audioPrompts.structuredLyrics.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded font-mono">
                      {item.section}
                    </span>
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {item.text}
                    </span>
                    {item.textKo && item.textKo !== item.text && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400">
                        ({item.textKo})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyText(`lyric-${idx}`, `${item.section} ${item.text}`)}
                    className="text-xs text-slate-400 hover:text-amber-600 p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Full Suno Prompt Box */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                Suno AI 원클릭 통합 마스터 프롬프트
              </span>
              <button
                onClick={() => handleCopyText('suno-full', audioPrompts.sunoPrompt)}
                className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-bold"
              >
                {copiedKey === 'suno-full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'suno-full' ? '복사됨' : '영문 복사'}</span>
              </button>
            </div>
            <p className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 select-all leading-relaxed">
              {audioPrompts.sunoPrompt}
            </p>
            {audioPrompts.sunoPromptKo && (
              <div className="text-xs text-amber-300/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/60 leading-relaxed">
                <span className="font-bold text-amber-400">🇰🇷 번역: </span>
                {audioPrompts.sunoPromptKo}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Master All-in-One Comprehensive View */}
      {activeSubTab === 'master' && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-[11px] font-bold text-indigo-200">
                Cohesive Master Production Plan
              </span>
              <h3 className="text-base font-extrabold">
                100% 완전 연계 올인원 제작 마스터 플랜
              </h3>
              <p className="text-xs text-slate-300">
                대본, 각 컷별 AI 비디오 생성 프롬프트, BGM 오디오 큐가 순서대로 1:1 결합된 최종 제작 플랜입니다.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportUnifiedProductionKit(content, 'md')}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-md whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>마스터 가이드 파일 다운로드</span>
              </button>
            </div>
          </div>

          {/* Master Timeline Flow */}
          <div className="space-y-4">
            {/* Hook Step */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  ⚡ STEP 1. 초반 3초 후킹 (00:00 - 00:03)
                </span>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                "{script.hook}"
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                💡 연출: {script.hookDescription}
              </p>
            </div>

            {/* Scenes Sequential Cards */}
            {script.scenes.map((scene, idx) => {
              const visualPromptEn = scene.matchedVisualPrompt || flowOmniPrompts?.imageFxPrompts?.[idx]?.prompt || flowOmniPrompts?.googleFlowPrompts?.[idx % flowOmniPrompts.googleFlowPrompts.length]?.prompt || 'Cinematic vertical 9:16 shot';
              const visualPromptKo = scene.matchedVisualPromptKo || flowOmniPrompts?.imageFxPrompts?.[idx]?.promptKo || flowOmniPrompts?.googleFlowPrompts?.[idx % flowOmniPrompts.googleFlowPrompts.length]?.promptKo || '시네마틱 9:16 프롬프트';
              const audioCue = scene.audioCue || `BPM ${audioPrompts.bpm} 비트 유지`;

              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      🎬 장면 {idx + 1} ({scene.time}) · {scene.cameraAngle}
                    </span>
                    <button
                      onClick={() => handleCopyText(`master-scene-${idx}`, `[장면 ${idx + 1}]\n나레이션: ${scene.narration}\n자막: ${scene.onScreenText}\nAI프롬프트: ${visualPromptEn}\nBGM큐: ${audioCue}`)}
                      className="text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
                    >
                      {copiedKey === `master-scene-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>장면 패키지 복사</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">🗣️ 나레이션 & 자막</span>
                      <p className="font-bold text-slate-900 dark:text-white">{scene.narration}</p>
                      <p className="text-slate-500 dark:text-slate-400">자막: {scene.onScreenText}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-500 block">🎨 매칭 AI 영상 프롬프트 (Veo/ImageFX)</span>
                      <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200">{visualPromptEn}</p>
                      {visualPromptKo && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400">🇰🇷 {visualPromptKo}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/40 dark:border-amber-900/30 flex items-center space-x-1.5">
                    <Music className="w-3 h-3" />
                    <span><strong>BGM / SFX 연출:</strong> {audioCue}</span>
                  </div>
                </div>
              );
            })}

            {/* Ending CTA & Suno Track */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1.5">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">🚀 행동 유도 (CTA)</span>
                <p className="font-bold text-slate-900 dark:text-white">"{script.cta}"</p>
                <p className="text-[11px] text-slate-500">{script.hashtags.join(' ')}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs space-y-1.5">
                <span className="font-bold text-purple-800 dark:text-purple-300 block">🎵 Suno AI 마스터 BGM 트랙</span>
                <p className="font-mono text-[11px] text-slate-900 dark:text-white">{audioPrompts.sunoPrompt}</p>
                {audioPrompts.sunoPromptKo && (
                  <p className="text-[11px] text-purple-600 dark:text-purple-400">🇰🇷 {audioPrompts.sunoPromptKo}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
