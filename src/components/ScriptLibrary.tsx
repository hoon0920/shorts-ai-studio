import React, { useState } from 'react';
import { GeneratedContent, Platform } from '../types';
import { exportToCapCutCsv, copyToClipboard, generateFullTextSummary, exportUnifiedProductionKit } from '../utils/exporter';
import {
  Search,
  Trash2,
  Copy,
  Check,
  FileSpreadsheet,
  Star,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  Grid,
  List,
  Download
} from 'lucide-react';

interface ScriptLibraryProps {
  library: GeneratedContent[];
  onSelectScript: (content: GeneratedContent) => void;
  onDeleteScript: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onCreateNew: () => void;
}

export const ScriptLibrary: React.FC<ScriptLibraryProps> = ({
  library,
  onSelectScript,
  onDeleteScript,
  onToggleFavorite,
  onClearAll,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter library items
  const filteredLibrary = library.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.script.hashtags.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleCopyScript = (item: GeneratedContent) => {
    const text = generateFullTextSummary(item);
    copyToClipboard(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="주제 또는 해시태그 검색..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Filters and View Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto flex-wrap gap-y-2 justify-between md:justify-end">
          {/* Platform Filters */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                platformFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              전체 ({library.length})
            </button>
            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                platformFilter === 'youtube' ? 'bg-white dark:bg-slate-700 text-red-600 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              숏폼
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                platformFilter === 'instagram' ? 'bg-white dark:bg-slate-700 text-pink-600 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              릴스
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                platformFilter === 'tiktok' ? 'bg-white dark:bg-slate-700 text-cyan-600 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              틱톡
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-400'
              }`}
              title="카드형 보기"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-400'
              }`}
              title="리스트형 보기"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Library Grid / Table Content */}
      {filteredLibrary.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              저장된 대본이 없습니다
            </h3>
            <p className="text-xs text-slate-500">
              콘텐츠 생성 화면에서 대본을 만들고 "보관함 저장" 버튼을 눌러보세요.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-500 transition-all inline-flex items-center space-x-1.5 shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>새 대본 생성하러 가기</span>
          </button>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLibrary.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.platform === 'youtube' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                      item.platform === 'instagram' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' :
                      'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                    }`}>
                      {item.platform} ({item.duration}s)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.topic}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-2">
                  🗣️ "{item.script.hook}"
                </p>

                <div className="flex flex-wrap gap-1">
                  {item.script.hashtags.slice(0, 3).map((h, idx) => (
                    <span key={idx} className="text-[10px] text-indigo-500 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectScript(item)}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>상세 보기</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => exportUnifiedProductionKit(item, 'md')}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg"
                    title="올인원 통합 마스터 가이드 다운로드 (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => exportToCapCutCsv(item)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="CapCut CSV 내보내기"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyScript(item)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="대본 전체 복사"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onDeleteScript(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">플랫폼</th>
                <th className="p-3.5">영상 주제</th>
                <th className="p-3.5">후킹 멘트</th>
                <th className="p-3.5">길이/WPM</th>
                <th className="p-3.5">생성일</th>
                <th className="p-3.5 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLibrary.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 whitespace-nowrap font-bold uppercase text-[10px]">
                    {item.platform}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {item.topic}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {item.script.hook}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {item.duration}초 ({item.script.wpm} WPM)
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-right space-x-1">
                    <button
                      onClick={() => onSelectScript(item)}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 rounded font-bold"
                    >
                      열기
                    </button>
                    <button
                      onClick={() => exportUnifiedProductionKit(item, 'md')}
                      className="p-1 text-slate-400 hover:text-indigo-500"
                      title="올인원 가이드 다운로드"
                    >
                      <Download className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => exportToCapCutCsv(item)}
                      className="p-1 text-slate-400 hover:text-emerald-500"
                      title="CapCut CSV"
                    >
                      <FileSpreadsheet className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => onDeleteScript(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
