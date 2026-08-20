import React from 'react';
import { ShieldCheck, Eye, X } from 'lucide-react';

interface SafeZoneOverlayProps {
  platform: string;
  onClose?: () => void;
}

export const SafeZoneOverlay: React.FC<SafeZoneOverlayProps> = ({ platform, onClose }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl relative overflow-hidden">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center space-x-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-white">
          9:16 자막 Safe Zone (시선 가독 영역) 가이드
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Phone UI Mockup Diagram */}
        <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-2xl border-2 border-slate-700 bg-black p-2 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Top UI Overlay (Search / Profile / Live) */}
          <div className="w-full bg-red-500/30 border border-red-500/50 rounded-lg p-1.5 text-[9px] text-red-200 text-center font-mono">
            ⚠️ 상단 가림 영역 (15%)<br />(상단검색 / 프로필 / 시계)
          </div>

          {/* Safe Zone Area */}
          <div className="w-full my-2 flex-1 bg-emerald-500/20 border-2 border-dashed border-emerald-400 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-emerald-300">
              ✅ 자막 Safe Zone
            </span>
            <span className="text-[8px] text-emerald-200/80 mt-0.5">
              화면 중앙 60% 영역에 핵심 자막 배치
            </span>
          </div>

          {/* Right Action Icons Overlay */}
          <div className="absolute right-2 top-1/3 space-y-2 text-[8px] text-pink-300 bg-pink-500/20 p-1 rounded border border-pink-500/40">
            <div>❤️</div>
            <div>💬</div>
            <div>↗️</div>
          </div>

          {/* Bottom UI Overlay (Audio Title / Description) */}
          <div className="w-full bg-red-500/30 border border-red-500/50 rounded-lg p-1.5 text-[9px] text-red-200 text-center font-mono">
            ⚠️ 하단 가림 영역 (20%)<br />(계정명 / 사운드 제목 / 시계)
          </div>
        </div>

        {/* Text Guidelines */}
        <div className="space-y-2.5 text-xs text-slate-300">
          <p className="leading-relaxed">
            <strong className="text-emerald-400">9:16 세로형 쇼츠/릴스 자막 핵심 가이드:</strong>
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400">
            <li>
              <span className="text-slate-200 font-medium">상단 15%:</span> 상단 헤더, 검색창, 프로필 사진이 자막을 가립니다.
            </li>
            <li>
              <span className="text-slate-200 font-medium">하단 20%:</span> 오디오 제목, 계정 아이디, 설명글 및 하단 탭바에 자막이 가립니다.
            </li>
            <li>
              <span className="text-slate-200 font-medium">우측 15%:</span> 좋아요, 댓글, 공유 아이콘 열이 배치됩니다.
            </li>
            <li>
              <span className="text-emerald-400 font-bold">권장 자막 위치:</span> 화면 하단 기준 약 25%~35% 지점에 폰트 크기 28pt 이상, 두꺼운 외곽선(Stroke) 적용!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
