export type Platform = 'youtube' | 'instagram' | 'tiktok';

export type Tone = 'information' | 'humorous' | 'emotional' | 'high_tension' | 'luxury';

export type Duration = 15 | 30 | 60;

export interface GenerationRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  duration: Duration;
  includeFlowOmni: boolean;
  customNotes?: string;
}

export interface Scene {
  id: string;
  time: string; // e.g. "00:00 - 00:03"
  durationSeconds: number;
  cameraAngle: string; // e.g. "[타이트 클로즈업] 자극적인 시작 문구 줌인"
  narration: string;
  visualCue: string;
  onScreenText: string;
  matchedVisualPrompt?: string; // 1:1 매칭 AI 비디오/이미지 영문 프롬프트
  matchedVisualPromptKo?: string; // 1:1 매칭 한글 번역 프롬프트
  audioCue?: string; // 해당 장면 BGM 및 효과음 연출
}

export interface VideoScript {
  hook: string; // 초반 3초 후킹 멘트
  hookDescription: string; // 시선 집중 연출법
  scenes: Scene[];
  cta: string; // 행동 유도 멘트
  estimatedDurationSec: number;
  totalWordCount: number;
  wpm: number;
  wpmStatus: 'optimal' | 'fast' | 'slow';
  wpmWarning?: string;
  hashtags: string[];
  safeZoneNote: string;
}

export interface FlowPromptItem {
  tag: string; // e.g., "@Character_A", "@Product_Box"
  label: string;
  prompt: string; // Original English prompt
  promptKo?: string; // Korean translation
}

export interface OmniPromptItem {
  scenario: string; // e.g. "배경 및 조명 변경"
  prompt: string; // Original English prompt
  promptKo?: string; // Korean translation
}

export interface ImageFxPromptItem {
  sceneIndex: number;
  title: string;
  prompt: string; // Original English prompt
  promptKo?: string; // Korean translation
}

export interface FlowOmniPrompts {
  googleFlowPrompts: FlowPromptItem[];
  geminiOmniPrompts: OmniPromptItem[];
  imageFxPrompts: ImageFxPromptItem[];
}

export interface LyricSection {
  section: string; // e.g. "[Intro]", "[Verse 1]", "[Chorus]", "[Outro]"
  text: string;
  textKo?: string;
}

export interface AudioPrompts {
  bgmStyleKeywords: string;
  bgmStyleKeywordsKo?: string;
  bpm: number;
  mood: string;
  structuredLyrics: LyricSection[];
  sunoPrompt: string;
  sunoPromptKo?: string;
  audioProductionGuide?: string;
}

export interface GeneratedContent {
  id: string;
  createdAt: string;
  topic: string;
  platform: Platform;
  tone: Tone;
  duration: Duration;
  script: VideoScript;
  flowOmniPrompts: FlowOmniPrompts;
  audioPrompts: AudioPrompts;
  isFavorite?: boolean;
}
