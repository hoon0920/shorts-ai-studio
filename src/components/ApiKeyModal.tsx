import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowRight,
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSaveKey: (apiKey: string) => Promise<boolean> | boolean;
  onDeleteKey?: () => void;
  currentApiKey?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  onDeleteKey,
  currentApiKey = '',
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setErrorMsg('Gemini API 키를 입력해 주세요.');
      return;
    }

    setErrorMsg(null);
    setIsValidating(true);

    try {
      const success = await onSaveKey(apiKey.trim());
      if (!success) {
        setErrorMsg('유효하지 않은 API 키이거나 검증에 실패했습니다. 키를 다시 확인해 주세요.');
      } else {
        if (onClose) onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'API 키 검증 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-all animate-fadeIn overflow-y-auto">
      {/* Outer Glowing Card Container */}
      <div className="relative w-full max-w-lg bg-[#0b0f19] text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] overflow-hidden transition-all my-8">
        
        {/* Top Gradient Border Line Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

        {/* Close button if optional */}
        {onClose && currentApiKey && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800/60 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>서비스 이용 필수 단계</span>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-xl sm:text-2xl font-black text-center text-white mb-3 tracking-tight">
          Gemini API 키를 입력해 주세요
        </h2>

        {/* Subtitle Description */}
        <p className="text-xs sm:text-sm text-slate-300 text-center leading-relaxed mb-6 font-normal">
          본 서비스는 개인 사용 및 원활한 자동화를 위해 사용자 개별 <strong className="text-indigo-300 font-bold">Gemini API 키</strong>를 등록해야만 전체 앱 기능(숏폼 & 릴스 대본 자동 생성, Google Flow & Omni 멀티모달 프롬프트, Suno AI BGM 가이드, CapCut CSV 내보내기 등)을 이용하실 수 있습니다.
        </p>

        {/* Green Privacy Info Box */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>안전한 로컬 저장 방식 (Private Local Storage)</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mb-2.5">
            입력하신 API 키는 외부 서버나 데이터베이스에 저장되지 않으며, 오직 사용자 분의 브라우저(<code className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-mono border border-emerald-800/50">localStorage</code>)에만 안전하게 보관됩니다.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline space-x-1"
          >
            <span>Google AI Studio에서 무료 API 키 발급받기</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Unlocked Features Section */}
        <div className="mb-6 text-left">
          <h3 className="text-xs font-bold text-slate-400 mb-2.5 tracking-wider uppercase">
            API 키 등록 후 바로 해제되는 기능
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <span className="truncate">숏폼 & 릴스 대본 자동 생성</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <span className="truncate">Google Flow & Omni 프롬프트</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <span className="truncate">Suno AI 맞춤 BGM & 가사 프롬프트</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <span className="truncate">CapCut 대량 자막 CSV 내보내기</span>
            </div>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>GEMINI API KEY</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Gemini API 키 입력..."
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 pr-10 outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isValidating}
              className="w-full flex-1 py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>API 키 검증 중...</span>
                </>
              ) : (
                <>
                  <span>API 키 검증 및 저장</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {onDeleteKey && (currentApiKey || apiKey) && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('저장된 API 키를 삭제하시겠습니까?')) {
                    onDeleteKey();
                    setApiKey('');
                    setErrorMsg('API 키가 삭제되었습니다. 앱 사용을 위해 새 API 키를 등록해 주세요.');
                  }
                }}
                className="w-full sm:w-auto py-3.5 px-4 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-bold text-sm rounded-xl transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 cursor-pointer"
                title="등록된 API 키 삭제"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>키 삭제</span>
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
