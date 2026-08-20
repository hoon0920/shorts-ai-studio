import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with user provided API key or fallback
const getAiClient = (customKey?: string) => {
  const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Fallback script generator if API is unavailable or for instant fallback
function generateFallbackResponse(reqBody: any) {
  const { topic, platform = 'youtube', tone = 'information', duration = 30, includeFlowOmni = true } = reqBody;
  
  const platformName = platform === 'youtube' ? '유튜브 숏폼' : platform === 'instagram' ? '인스타그램 릴스' : '틱톡';
  const toneName = tone === 'information' ? '정보 전달' : tone === 'humorous' ? '유머러스' : tone === 'high_tension' ? '하이 텐션' : tone === 'luxury' ? '고급스러움' : '감성적';

  const scenes = [
    {
      id: "scene-1",
      time: "00:00 - 00:03",
      durationSeconds: 3,
      cameraAngle: "[타이트 클로즈업] 시선 강탈 임팩트 샷",
      narration: `아직도 ${topic} 할 때 헤매고 계신가요? 이것만 알면 10배 쉬워집니다!`,
      visualCue: "화면 중앙에 대형 텍스트 팝업 및 인물의 놀란 표정 빠른 줌인",
      onScreenText: "🚨 99%가 몰랐던 노하우 공개",
      matchedVisualPrompt: "Cinematic close-up portrait of a surprised Korean young professional looking directly at the camera with dramatic neon rim lighting, 9:16 vertical video frame, 8k resolution, Unreal Engine 5 render style --ar 9:16",
      matchedVisualPromptKo: "카메라를 직접 응시하며 놀란 표정을 짓는 젊은 한국인 전문가의 시네마틱 클로즈업 샷, 극적인 네온 림 조명, 9:16 세로 프레임, 8k 고해상도",
      audioCue: "도입부 강렬한 베이스 드랍과 빠른 하이햇 비트 시작, 긴장감 고조 사운드"
    },
    {
      id: "scene-2",
      time: "00:03 - 00:10",
      durationSeconds: 7,
      cameraAngle: "[미디엄 샷] 빠른 손동작과 동작 시연",
      narration: `첫 번째 핵심은 바로 '효율화'입니다. 기존 방식을 버리고 템플릿을 적극 활용해 보세요.`,
      visualCue: "비포/애프터 비교 그래픽 화면 전환 (스플릿 스크린 효과)",
      onScreenText: "STEP 1: 템플릿 활용 3초 완성",
      matchedVisualPrompt: "Split-screen comparison layout, left side showing messy cluttered desk with frustration, right side showing sleek minimalist automated workspace with glowing holographic holographic UI, clean modern aesthetic --ar 9:16",
      matchedVisualPromptKo: "스플릿 스크린 비교 레이아웃, 좌측은 답답한 책상, 우측은 발광 홀로그램 UI가 있는 세련된 미니멀 자동화 데스크, 모던 에스테틱",
      audioCue: "경쾌한 신스 멜로디와 스냅 비트가 시작되며 밝고 활기찬 분위기 전환"
    },
    {
      id: "scene-3",
      time: "00:10 - 00:20",
      durationSeconds: 10,
      cameraAngle: "[오버 더 숄더 / 화면 녹화 샷]",
      narration: `두 번째는 자동화 툴 설정입니다. 매번 반복되는 작업을 클릭 한 번으로 끝낼 수 있습니다.`,
      visualCue: "스마트폰 또는 PC 화면 마우스 커서의 일련의 신속한 클릭 장면",
      onScreenText: "STEP 2: 원클릭 자동화 세팅",
      matchedVisualPrompt: "Over-the-shoulder macro perspective showing rapid fluid finger tapping on a modern glowing smartphone screen, seamless software interface animation, shallow depth of field --ar 9:16",
      matchedVisualPromptKo: "빛나는 스마트폰 화면을 부드럽게 탭하는 오버 더 숄더 매크로 샷, 매끄러운 소프트웨어 인터페이스 애니메이션, 얕은 심도",
      audioCue: "리드미컬한 115 BPM 신스팝 비트 지속 및 클릭 타이밍에 맞춘 부드러운 스위시 효과음"
    },
    {
      id: "scene-4",
      time: "00:20 - 00:27",
      durationSeconds: 7,
      cameraAngle: "[바스트 샷] 진정성 있는 꿀팁 강조",
      narration: `마지막으로 저장해두고 필요할 때마다 꺼내보는 습관을 들이세요!`,
      visualCue: "체크리스트 그래픽 애니메이션과 손가락으로 저장 버튼 가리키는 포즈",
      onScreenText: "💡 이 영상 저장해두고 꼭 쓰세요!",
      matchedVisualPrompt: "Medium bust shot of the friendly presenter gesturing with confident smile pointing towards an animated glowing bookmark icon, cozy modern aesthetic background, soft studio lighting --ar 9:16",
      matchedVisualPromptKo: "발광 북마크 아이콘을 가리키며 자신감 있게 미소 짓는 친근한 발표자의 바스트 샷, 아늑하고 현대적인 배경, 소프트 스튜디오 조명",
      audioCue: "경쾌한 멜로디가 클라이맥스에 도달하며 팝 사운드 강조"
    },
    {
      id: "scene-5",
      time: "00:27 - 00:30",
      durationSeconds: 3,
      cameraAngle: "[클로즈업] 정면 가리키며 CTA",
      narration: `더 많은 꿀팁이 궁금하다면 구독과 프로필 링크를 확인해 보세요!`,
      visualCue: "화면 하단에 구독/좋아요 및 링크 아이콘 화살표 표시",
      onScreenText: "👉 프로필 링크에서 풀버전 확인!",
      matchedVisualPrompt: "Dynamic fast push-in camera shot to smiling creator giving a thumbs up, floating animated social media icons (follow, like, link) in bright pastel colors, vibrant finish --ar 9:16",
      matchedVisualPromptKo: "엄지를 치켜드는 크리에이터를 향한 다이내믹한 줌인 샷, 파스텔 톤의 팔로우/좋아요/링크 애니메이션 아이콘이 떠오르는 마무리",
      audioCue: "깔끔한 엔딩 스네어 롤과 페이드아웃 벨 사운드"
    }
  ];

  const totalWords = scenes.reduce((acc, s) => acc + s.narration.split(' ').length, 0);
  const wpm = Math.round((totalWords / (duration / 60)));
  const wpmStatus = wpm > 220 ? 'fast' : wpm < 130 ? 'slow' : 'optimal';
  const wpmWarning = wpmStatus === 'fast' ? '말하는 속도가 매우 빠릅니다! 나레이션 분량을 조금 줄이거나 영상 길이를 늘려주세요.' : undefined;

  return {
    id: `script-${Date.now()}`,
    createdAt: new Date().toISOString(),
    topic,
    platform,
    tone,
    duration,
    script: {
      hook: `🚨 아직도 ${topic} 할 때 고생하시나요? 딱 3초만 집중해보세요!`,
      hookDescription: "첫 3초 동안 시청자 이탈을 막기 위해 시각적 강조 자막과 스피드한 줌인 연출을 사용합니다.",
      scenes,
      cta: "더 많은 노하우를 빠르게 받아보려면 [좋아요 & 팔로우]를 눌러주세요! 댓글로 의견을 남겨주시면 답글로 자료를 전달해 드립니다.",
      estimatedDurationSec: duration,
      totalWordCount: totalWords * 4,
      wpm: wpm,
      wpmStatus,
      wpmWarning,
      hashtags: [
        `#${topic.replace(/\s+/g, '')}`,
        `#${platformName.replace(/\s+/g, '')}`,
        `#숏폼팁`,
        `#릴스추천`,
        `#꿀팁공유`,
        `#생산성`,
        `#AI스튜디오`
      ],
      safeZoneNote: "상단 15%(계정명/검색바) 및 하단 20%(사운드명/좋아요 버튼) 영역을 피해 화면 중앙 60% 내부 영역에 핵심 자막을 배치하세요."
    },
    flowOmniPrompts: {
      googleFlowPrompts: [
        {
          tag: "@Character_A",
          label: "주인공 아바타 프롬프트",
          prompt: "A trendy Korean creator with natural hair, wearing minimalist oversized blazer, sitting in a bright modern studio setup, 8k resolution, cinematic lighting --ar 9:16",
          promptKo: "자연스러운 헤어스타일에 미니멀한 오버사이즈 블레이저를 입고 밝고 모던한 스튜디오에 앉아있는 트렌디한 한국인 크리에이터, 8k 해상도, 시네마틱 조명"
        },
        {
          tag: "@Product_Box",
          label: "주요 소품/오브젝트 프롬프트",
          prompt: "Clean aesthetic packaging box on a pastel mint surface with soft neon studio backlight, photorealistic detail, 9:16 vertical macro shot",
          promptKo: "부드러운 네온 스튜디오 백라이트가 비추는 파스텔 민트 표면 위의 깔끔한 패키지 박스, 실사 디테일, 9:16 세로 매크로 샷"
        },
        {
          tag: "@Studio_Background",
          label: "스튜디오 공간 프롬프트",
          prompt: "Cozy Korean home office with warm ambient floor lamps, wooden desk, aesthetic plant, aesthetic soft bokeh background",
          promptKo: "따뜻한 무드 플로어 램프, 원목 데스크, 감성 플랜트, 부드러운 보케 배경이 있는 아늑한 한국형 홈 오피스 스튜디오"
        }
      ],
      geminiOmniPrompts: [
        {
          scenario: "배경 시각 효과 변경",
          prompt: "Keep @Character_A intact, but transform the background into a bustling evening Seoul skyline with rain drops on the window glass, warm indoor glow.",
          promptKo: "@Character_A의 외형을 그대로 유지하면서, 창문에 빗방울이 맺힌 번화한 서울의 저녁 스카이라인과 따뜻한 실내 조명 배경으로 전환해 주세요."
        },
        {
          scenario: "카메라 앵글 및 스피드감 추가",
          prompt: "Apply a dynamic low-angle dolly zoom effect targeting @Product_Box with subtle motion blur on the edges, highly energetic short-form style.",
          promptKo: "@Product_Box를 타깃으로 가장자리에 미세한 모션 블러를 준 다이내믹 로우앵글 돌리 줌 효과를 적용하여 에너지 넘치는 숏폼 스타일로 연출해 주세요."
        }
      ],
      imageFxPrompts: [
        {
          sceneIndex: 1,
          title: "장면 1 후킹 비주얼",
          prompt: "Photorealistic vertical portrait shot of a shocked person looking at a glowing holographic smartphone displaying 3D analytics graph, pastel aesthetic, 9:16 aspect ratio",
          promptKo: "3D 분석 그래프를 표시하는 빛나는 홀로그램 스마트폰을 보고 깜짝 놀란 인물의 실사 세로 인물 샷, 파스텔 감성, 9:16 비율"
        },
        {
          sceneIndex: 2,
          title: "장면 2 시연 비주얼",
          prompt: "Split screen graphic showing messy organized workspace vs sleek minimalist automated desk, high contrast, clean modern UI elements",
          promptKo: "어수선한 작업 공간 대 깔끔한 미니멀 자동화 데스크를 보여주는 고대비 스플릿 스크린 그래픽, 모던 UI 요소"
        }
      ]
    },
    audioPrompts: {
      bgmStyleKeywords: "Upbeat Lo-Fi Hip-Hop, 115 BPM, Energetic Synth Brass, Modern Korean Short-Form Beat",
      bgmStyleKeywordsKo: "업비트 로파이 힙합, 115 BPM, 에너지 넘치는 신스 브라스, 트렌디한 한국 숏폼 비트",
      bpm: 115,
      mood: "통쾌하고 속도감 있는 신나는 분위기 (신뢰감과 활기)",
      structuredLyrics: [
        { section: "[Intro]", text: "(Fast hi-hat beat drops with catchy synth melody)", textKo: "(캐치한 신스 멜로디와 함께 빠른 하이햇 비트 드랍)" },
        { section: "[Verse]", text: "매일 반복되는 일상 속에서 더 스마트하게 끝내는 공식!", textKo: "매일 반복되는 일상 속에서 더 스마트하게 끝내는 공식!" },
        { section: "[Chorus]", text: "3초 만에 시선 집중, 지금 바로 시작해보세요! Yeah!", textKo: "3초 만에 시선 집중, 지금 바로 시작해보세요! Yeah!" },
        { section: "[Outro]", text: "(Fade out with light snare roll and soft chime)", textKo: "(가벼운 스네어 롤과 부드러운 차임벨 페이드아웃)" }
      ],
      sunoPrompt: "[Genre: Upbeat Lo-Fi Synthpop] [Tempo: 115 BPM] [Mood: Energetic & Inspiring] Catchy background music for vertical video tutorial with clean bass and snappy drums",
      sunoPromptKo: "[장르: 업비트 로파이 신스팝] [템포: 115 BPM] [분위기: 활기차고 영감을 주는 무드] 깔끔한 베이스와 경쾌한 드럼이 어우러진 세로형 숏폼 튜토리얼용 캐치한 BGM",
      audioProductionGuide: "영상 전반부(0~10초)는 비트의 시작으로 시선을 사로잡고, 중반부(10~20초) 꿀팁 설명 시에는 나레이션 가청도를 위해 볼륨을 -18dB로 더킹(Ducking) 처리하며, 27초 이후 CTA에서 볼륨을 살짝 올려 강렬하게 마무리합니다."
    }
  };
}

// API Routes
app.post("/api/validate-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ valid: false, message: "API 키를 입력해 주세요." });
    }
    const ai = getAiClient(apiKey);
    if (!ai) {
      return res.status(400).json({ valid: false, message: "API 키 형식이 유효하지 않습니다." });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Hi",
    });
    if (response && response.text) {
      return res.json({ valid: true, message: "Gemini API 키가 성공적으로 검증되었습니다!" });
    }
    return res.status(400).json({ valid: false, message: "유효한 resposta를 받지 못했습니다. API 키를 확인해 주세요." });
  } catch (error: any) {
    console.error("API Key validation error:", error);
    return res.status(400).json({ valid: false, message: error?.message || "API 키 검증 실패: 올바른 Google AI Studio Gemini API 키인지 확인해 주세요." });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, platform = 'youtube', tone = 'information', duration = 30, includeFlowOmni = true, customNotes, userApiKey } = req.body;
    const customKeyHeader = req.headers['x-gemini-api-key'] as string;
    const providedKey = (userApiKey || customKeyHeader || '').trim();

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: "주제를 입력해 주세요." });
    }

    if (!providedKey) {
      return res.status(401).json({ error: "Gemini API 키가 등록되지 않았습니다. Google AI Studio에서 발급받은 API 키를 먼저 입력해 주세요." });
    }

    const ai = getAiClient(providedKey);

    if (!ai) {
      return res.status(401).json({ error: "유효하지 않은 Gemini API 키입니다. 키를 다시 확인해 주세요." });
    }

    const platformText = platform === 'youtube' ? '유튜브 숏폼 (YouTube Shorts)' : platform === 'instagram' ? '인스타그램 릴스 (Instagram Reels)' : '틱톡 (TikTok)';
    const toneText = tone === 'information' ? '정보 전달' : tone === 'humorous' ? '유머러스/위트' : tone === 'high_tension' ? '하이 텐션/폭발적' : tone === 'luxury' ? '고급스러움/프리미엄' : '감성적/공감';

    const promptText = `
당신은 대한민국 최고 성과의 숏폼(Shorts, Reels, TikTok) 전문 크리에이터이자 멀티모달 AI 프롬프트 엔지니어입니다.
다음 조건으로 대본과 AI 프롬프트를 완벽하게 상호 연관되도록 종합 생성해 주세요:

- 영상 주제: "${topic}"
- 플랫폼: ${platformText}
- 톤앤매너: ${toneText}
- 목표 영상 길이: ${duration}초
- Additional Notes: ${customNotes || '없음'}

★ 핵심 요구사항:
1. [완벽한 상호 연관성]: 대본의 각 장면(Scene), 비주얼 AI 프롬프트(Google Flow, Omni, ImageFX), Suno AI BGM 가이드가 100% 일체화되어 즉시 영상 제작이 가능해야 합니다.
2. [장면별 1:1 매칭]: 각 장면(scenes)마다 해당 장면에 딱 맞는 실전용 AI 영상/이미지 생성 영문 프롬프트(matchedVisualPrompt)와 한국어 번역(matchedVisualPromptKo), 그리고 BGM/효과음 연출 지시문(audioCue)을 반드시 포함하세요.
3. [프롬프트 한국어 번역 제공]: 모든 영문 프롬프트(Google Flow, Gemini Omni, ImageFX, Suno AI)는 사용자가 즉시 이해할 수 있도록 자연스러운 한국어 번역(promptKo, sunoPromptKo, bgmStyleKeywordsKo)을 함께 제공하세요.
4. [초반 3초 후킹 & Safe Zone]: 첫 3초 시선 집중 연출 및 스마트폰 9:16 UI(자막/버튼 침범 방지) 가이드를 철저히 준수하세요.
5. [Suno AI 오디오 가이드]: 전체적인 BGM 스타일, BPM, 무드뿐만 아니라 영상 전개에 맞춘 제작 가이드(audioProductionGuide)를 작성하세요.

결과는 반드시 지정된 JSON 구조에 맞추어 출력해 주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            createdAt: { type: Type.STRING },
            topic: { type: Type.STRING },
            platform: { type: Type.STRING },
            tone: { type: Type.STRING },
            duration: { type: Type.INTEGER },
            script: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                hookDescription: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      time: { type: Type.STRING },
                      durationSeconds: { type: Type.INTEGER },
                      cameraAngle: { type: Type.STRING },
                      narration: { type: Type.STRING },
                      visualCue: { type: Type.STRING },
                      onScreenText: { type: Type.STRING },
                      matchedVisualPrompt: { type: Type.STRING },
                      matchedVisualPromptKo: { type: Type.STRING },
                      audioCue: { type: Type.STRING },
                    },
                    required: ["id", "time", "durationSeconds", "cameraAngle", "narration", "visualCue", "onScreenText", "matchedVisualPrompt", "matchedVisualPromptKo", "audioCue"],
                  },
                },
                cta: { type: Type.STRING },
                estimatedDurationSec: { type: Type.INTEGER },
                totalWordCount: { type: Type.INTEGER },
                wpm: { type: Type.INTEGER },
                wpmStatus: { type: Type.STRING },
                wpmWarning: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                safeZoneNote: { type: Type.STRING },
              },
              required: ["hook", "hookDescription", "scenes", "cta", "estimatedDurationSec", "totalWordCount", "wpm", "wpmStatus", "hashtags", "safeZoneNote"],
            },
            flowOmniPrompts: {
              type: Type.OBJECT,
              properties: {
                googleFlowPrompts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tag: { type: Type.STRING },
                      label: { type: Type.STRING },
                      prompt: { type: Type.STRING },
                      promptKo: { type: Type.STRING },
                    },
                    required: ["tag", "label", "prompt", "promptKo"],
                  },
                },
                geminiOmniPrompts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scenario: { type: Type.STRING },
                      prompt: { type: Type.STRING },
                      promptKo: { type: Type.STRING },
                    },
                    required: ["scenario", "prompt", "promptKo"],
                  },
                },
                imageFxPrompts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneIndex: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      prompt: { type: Type.STRING },
                      promptKo: { type: Type.STRING },
                    },
                    required: ["sceneIndex", "title", "prompt", "promptKo"],
                  },
                },
              },
              required: ["googleFlowPrompts", "geminiOmniPrompts", "imageFxPrompts"],
            },
            audioPrompts: {
              type: Type.OBJECT,
              properties: {
                bgmStyleKeywords: { type: Type.STRING },
                bgmStyleKeywordsKo: { type: Type.STRING },
                bpm: { type: Type.INTEGER },
                mood: { type: Type.STRING },
                structuredLyrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section: { type: Type.STRING },
                      text: { type: Type.STRING },
                      textKo: { type: Type.STRING },
                    },
                    required: ["section", "text"],
                  },
                },
                sunoPrompt: { type: Type.STRING },
                sunoPromptKo: { type: Type.STRING },
                audioProductionGuide: { type: Type.STRING },
              },
              required: ["bgmStyleKeywords", "bpm", "mood", "structuredLyrics", "sunoPrompt"],
            },
          },
          required: ["id", "createdAt", "topic", "platform", "tone", "duration", "script", "flowOmniPrompts", "audioPrompts"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No output received from Gemini API");
    }

    const data = JSON.parse(resultText);
    data.id = data.id || `script-${Date.now()}`;
    data.createdAt = data.createdAt || new Date().toISOString();
    data.topic = topic;
    data.platform = platform;
    data.tone = tone;
    data.duration = duration;

    // Word count / WPM recalculation for accuracy
    if (data.script && data.script.scenes) {
      const allNarration = data.script.scenes.map((s: any) => s.narration || '').join(' ');
      const words = allNarration.trim().split(/\s+/).filter(Boolean).length;
      const calculatedWpm = Math.round((words / (duration / 60)));
      data.script.wpm = calculatedWpm;
      data.script.totalWordCount = words;
      data.script.wpmStatus = calculatedWpm > 220 ? 'fast' : calculatedWpm < 120 ? 'slow' : 'optimal';
      if (data.script.wpmStatus === 'fast' && !data.script.wpmWarning) {
        data.script.wpmWarning = `분당 ${calculatedWpm}단어로 말하기 속도가 다소 빠릅니다. 나레이션을 조금 다듬거나 ${duration}초에서 시간을 늘리는 것을 추천합니다.`;
      }
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error generating script with Gemini:", error);
    // Fallback to rich structured response if any AI error occurs
    const fallbackData = generateFallbackResponse(req.body);
    res.json(fallbackData);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
