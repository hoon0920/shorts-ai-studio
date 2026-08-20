import { Platform, Tone, Duration } from '../types';

export const PLATFORMS: Array<{ id: Platform; label: string; iconName: string; ratio: string; color: string; badge: string }> = [
  { id: 'youtube', label: '유튜브 숏폼', iconName: 'Youtube', ratio: '9:16 (Shorts)', color: 'from-red-500 to-rose-600', badge: 'YouTube Shorts' },
  { id: 'instagram', label: '인스타그램 릴스', iconName: 'Instagram', ratio: '9:16 (Reels)', color: 'from-purple-500 via-pink-500 to-rose-400', badge: 'Instagram Reels' },
  { id: 'tiktok', label: '틱톡', iconName: 'Video', ratio: '9:16 (TikTok)', color: 'from-cyan-500 to-blue-600', badge: 'TikTok Video' },
];

export const TONES: Array<{ id: Tone; label: string; description: string; emoji: string }> = [
  { id: 'information', label: '정보 전달', description: '명확하고 유익한 꿀팁 위주', emoji: '💡' },
  { id: 'humorous', label: '유머러스', description: '재치 있고 위트 있는 밈 플레이', emoji: '😂' },
  { id: 'emotional', label: '감성적', description: '따뜻하고 공감을 자극하는 이야기', emoji: '✨' },
  { id: 'high_tension', label: '하이 텐션', description: '빠른 호흡과 강렬한 몰입감', emoji: '🔥' },
  { id: 'luxury', label: '고급스러움', description: '세련되고 브랜드 전문성이 느껴지는 톤', emoji: '💎' },
];

export const DURATIONS: Array<{ value: Duration; label: string; subtitle: string }> = [
  { value: 15, label: '15초', subtitle: '초고속 후킹 & 핵심 1가지' },
  { value: 30, label: '30초', subtitle: '가장 안정적인 바이럴 표준' },
  { value: 60, label: '60초', subtitle: '깊이 있는 정보 & 스토리가 있는 구성' },
];

export const SAMPLE_TOPICS = [
  '온라인 쇼핑몰 대박 패키징 노하우',
  '개발자 칼퇴 보장 생산성 팁 TOP 3',
  '자취생 10분 완성 초간단 가성비 저녁 메뉴',
  '인스타그램 피드 이쁘게 올리는 보정 가이드',
  '2026 AI 직장인 필수 자동화 스킬',
  '여행 갈 때 꼭 챙겨야 할 다이소 필수템'
];

export const AI_TOOL_LINKS = {
  googleFlow: 'https://labs.google/fx/tools/flow',
  geminiOmni: 'https://gemini.google.com/',
  imageFx: 'https://labs.google/fx/tools/imagefx',
  sunoAi: 'https://suno.com/',
  midjourney: 'https://www.midjourney.com/',
  capcut: 'https://www.capcut.com/'
};
