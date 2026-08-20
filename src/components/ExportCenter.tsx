import React from 'react';
import { GeneratedContent } from '../types';
import { exportLibraryToJson } from '../utils/exporter';
import { AI_TOOL_LINKS } from '../data/constants';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  Copy,
  Zap,
  BookOpen
} from 'lucide-react';

interface ExportCenterProps {
  library: GeneratedContent[];
}

export const ExportCenter: React.FC<ExportCenterProps> = ({ library }) => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-xs font-bold text-indigo-200">
            Export & Integration Hub
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">
            CapCut 대량 자막 및 AI 프롬프트 내보내기 센터
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            저장된 대본을 CapCut 자막용 CSV 파일로 내보내거나, Google Flow 및 Suno AI 맞춤형 프롬프트 가이드를 확인하세요.
          </p>
        </div>
      </div>

      {/* CapCut Subtitle Workflow */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              CapCut (캡컷) 대량 자막 자동 연동 3단계 가이드
            </h3>
            <p className="text-xs text-slate-500">
              CSV 파일을 CapCut PC버전에 불러와 3초 만에 타이밍 자막을 자동 배치할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>CSV 내보내기</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              대본 상세 화면 또는 보관함에서 "CapCut CSV 내보내기" 버튼을 누릅니다.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>CapCut PC 실행</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              CapCut PC버전의 <strong>[자막 (Text)] → [로컬 자막 불러오기]</strong> 메뉴 선택
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
              <span>스타일 일괄 적용</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              다운받은 CSV 파일을 드래그하여 모든 트랙 자막 폰트와 외곽선을 일괄 적용합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Library JSON Backup Export */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              보관함 전체 데이터 백업 (JSON Export)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            현재 보관함에 저장된 총 {library.length}개의 대본 및 프롬프트 원본을 JSON 파일로 백업합니다.
          </p>
        </div>

        <button
          onClick={() => exportLibraryToJson(library)}
          disabled={library.length === 0}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>JSON 백업 파일 다운로드</span>
        </button>
      </div>

      {/* Quick Tool Links Cheat Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            AI 생태계 공식 도구 바로가기
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href={AI_TOOL_LINKS.googleFlow}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                Google Flow (FX)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              @Character_A 태그 기반 연속 영상 생성기
            </p>
          </a>

          <a
            href={AI_TOOL_LINKS.geminiOmni}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-purple-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                Gemini Omni
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              대화형 멀티모달 실시간 이미지/비디오 편집
            </p>
          </a>

          <a
            href={AI_TOOL_LINKS.imageFx}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-pink-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-600">
                ImageFX
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              Google 최신 수석 품질 비주얼 생성기
            </p>
          </a>

          <a
            href={AI_TOOL_LINKS.sunoAi}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-amber-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                Suno AI
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              쇼츠 맞춤 BGM & 보컬 트랙 자동 생성
            </p>
          </a>

          <a
            href={AI_TOOL_LINKS.midjourney}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                Midjourney
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              초고화질 영화틱 비주얼 스틸컷 프롬프팅
            </p>
          </a>

          <a
            href={AI_TOOL_LINKS.capcut}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-emerald-500 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                CapCut Web / App
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              숏폼 편집 소프트웨어 및 자막 템플릿
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
