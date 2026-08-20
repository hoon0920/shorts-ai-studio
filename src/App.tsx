import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ScriptLibrary } from './components/ScriptLibrary';
import { ExportCenter } from './components/ExportCenter';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GenerationRequest, GeneratedContent } from './types';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<'create' | 'library' | 'export'>('create');
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [library, setLibrary] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Load saved library, theme & api key from localStorage on init
  useEffect(() => {
    try {
      const savedLib = localStorage.getItem('shorts_ai_library');
      if (savedLib) {
        setLibrary(JSON.parse(savedLib));
      }
      const savedTheme = localStorage.getItem('shorts_ai_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
      }
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setUserApiKey(savedKey);
      } else {
        // Open modal if no key is present
        setIsApiKeyModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to load local storage:", e);
    }
  }, []);

  // Handle saving & validating API Key
  const handleSaveApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setUserApiKey(apiKey);
        localStorage.setItem('gemini_api_key', apiKey);
        showToast('🎉 Gemini API 키가 정상적으로 검증 및 저장되었습니다!');
        setIsApiKeyModalOpen(false);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error('API key validation failed:', e);
      return false;
    }
  };

  // Handle deleting API Key
  const handleDeleteApiKey = () => {
    setUserApiKey('');
    localStorage.removeItem('gemini_api_key');
    showToast('🗑️ 저장된 Gemini API 키가 삭제되었습니다.');
  };

  // Sync dark mode class on html root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shorts_ai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shorts_ai_theme', 'light');
    }
  }, [darkMode]);

  // Persist library
  const saveLibraryToStorage = (updatedLib: GeneratedContent[]) => {
    setLibrary(updatedLib);
    try {
      localStorage.setItem('shorts_ai_library', JSON.stringify(updatedLib));
    } catch (e) {
      console.error("Failed to save to local storage:", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle Generate Request
  const handleGenerate = async (request: GenerationRequest) => {
    if (!userApiKey) {
      showToast('🔑 사용을 위해 먼저 Gemini API 키를 등록해 주세요.');
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setLoadingStep('Google Gemini 3.6 Flash 모델 요청 중...');

    // Progress animation step sequence
    const steps = [
      '초반 3초 후킹 멘트 및 타임스탬프 구조화 중...',
      '9:16 자막 Safe Zone & WPM 분석 중...',
      'Google Flow & Gemini Omni 멀티모달 프롬프트 파싱 중...',
      'Suno AI BGM 무드 및 구조화 가사 생성 완료 중...'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
        stepIdx++;
      }
    }, 800);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': userApiKey,
        },
        body: JSON.stringify({
          ...request,
          userApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: GeneratedContent = await response.json();
      clearInterval(interval);
      setCurrentContent(data);
      showToast('🎉 대본 및 멀티모달 프롬프트가 생성되었습니다!');
    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(interval);
      showToast('⚠️ 생성 중 오류가 발생하여 기본 템플릿으로 표시합니다.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Save Current Content to Library
  const handleSaveToLibrary = (content: GeneratedContent) => {
    const exists = library.some((item) => item.id === content.id);
    if (exists) {
      showToast('이미 보관함에 저장되어 있습니다.');
      return;
    }
    const updated = [content, ...library];
    saveLibraryToStorage(updated);
    showToast('💾 대본 보관함에 저장되었습니다!');
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const updated = library.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveLibraryToStorage(updated);
  };

  // Delete Script
  const handleDeleteScript = (id: string) => {
    if (window.confirm('정말로 이 대본을 삭제하시겠습니까?')) {
      const updated = library.filter((item) => item.id !== id);
      saveLibraryToStorage(updated);
      showToast('🗑️ 대본이 삭제되었습니다.');
    }
  };

  // Select Script from Library
  const handleSelectScript = (content: GeneratedContent) => {
    setCurrentContent(content);
    setActiveNavTab('create');
    showToast(`'${content.topic}' 대본을 불러왔습니다.`);
  };

  const isCurrentSaved = currentContent
    ? library.some((item) => item.id === currentContent.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        savedCount={library.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        hasApiKey={!!userApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {/* Tab 1: Content Creation View */}
        {activeNavTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Controls (5 cols) */}
            <div className="lg:col-span-5">
              <InputPanel
                onGenerate={handleGenerate}
                isLoading={isLoading}
                loadingStep={loadingStep}
              />
            </div>

            {/* Right Column: Output Results Panel (7 cols) */}
            <div className="lg:col-span-7">
              <OutputPanel
                content={currentContent}
                onSaveToLibrary={handleSaveToLibrary}
                isSaved={isCurrentSaved}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Script Library View */}
        {activeNavTab === 'library' && (
          <ScriptLibrary
            library={library}
            onSelectScript={handleSelectScript}
            onDeleteScript={handleDeleteScript}
            onToggleFavorite={handleToggleFavorite}
            onClearAll={() => saveLibraryToStorage([])}
            onCreateNew={() => setActiveNavTab('create')}
          />
        )}

        {/* Tab 3: Export Center View */}
        {activeNavTab === 'export' && (
          <ExportCenter library={library} />
        )}
      </main>

      {/* Toast Notification Floating Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-800 dark:border-slate-200 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gemini API Key Modal Popup */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={userApiKey ? () => setIsApiKeyModalOpen(false) : undefined}
        onSaveKey={handleSaveApiKey}
        onDeleteKey={handleDeleteApiKey}
        currentApiKey={userApiKey}
      />
    </div>
  );
}
