import React from 'react';
import { Sparkles, Download, Moon, Sun, Video, Zap, Layers, Key } from 'lucide-react';

interface HeaderProps {
  activeTab: 'create' | 'library' | 'export';
  setActiveTab: (tab: 'create' | 'library' | 'export') => void;
  savedCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  darkMode,
  setDarkMode,
  hasApiKey,
  onOpenApiKeyModal,
}) => {
  return (
    <>
      {/* Top Main Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* App Title & Brand Logo */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    <span className="sm:hidden">숏폼 AI 스튜디오</span>
                    <span className="hidden sm:inline">숏폼 & 릴스 AI 스튜디오 대시보드</span>
                  </h1>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex-shrink-0">
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 text-indigo-500" />
                    <span className="xs:inline">Flow & Omni</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                  대본 · 멀티모달 프롬프트 · BGM · 태그 가이드 올인원 제작기
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'create'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>콘텐츠 생성</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === 'library'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>대본 보관함</span>
                {savedCount > 0 && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                    activeTab === 'library' ? 'bg-white text-indigo-700' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'export'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>내보내기 Center</span>
              </button>

              {/* API Key Status Button */}
              <button
                onClick={onOpenApiKeyModal}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  hasApiKey
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 animate-pulse'
                }`}
                title="API 키 설정"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{hasApiKey ? 'API 키 등록됨' : 'API 키 필요'}</span>
              </button>

              {/* Dark / Light Toggle */}
              <button
                onClick={() => setDarkMode(prev => !prev)}
                aria-label="Toggle dark mode"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </nav>

            {/* Mobile Header Dark Mode & API Key Button */}
            <div className="flex md:hidden items-center space-x-1.5">
              <button
                onClick={onOpenApiKeyModal}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  hasApiKey
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                }`}
                title="API 키 설정"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDarkMode(prev => !prev)}
                aria-label="Toggle dark mode"
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Applike UX) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around h-16 px-2 shadow-lg">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'create'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'create' ? 'bg-indigo-100 dark:bg-indigo-950/80' : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">생성기</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl text-xs font-medium transition-all relative ${
            activeTab === 'library'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full relative ${activeTab === 'library' ? 'bg-indigo-100 dark:bg-indigo-950/80' : ''}`}>
            <Layers className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">보관함</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'export'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'export' ? 'bg-indigo-100 dark:bg-indigo-950/80' : ''}`}>
            <Download className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">내보내기</span>
        </button>
      </nav>
    </>
  );
};
