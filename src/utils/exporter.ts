import { GeneratedContent } from '../types';

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return Promise.resolve(true);
    } catch (error) {
      textArea.remove();
      return Promise.resolve(false);
    }
  }
}

export function exportToCapCutCsv(content: GeneratedContent) {
  const headers = ["InPoint", "OutPoint", "Text", "Actor", "VisualNote"];
  const rows = content.script.scenes.map((scene) => {
    // Parse time like "00:00 - 00:03" or calculate default timestamps
    const timeParts = scene.time.split('-').map(s => s.trim());
    const inPoint = timeParts[0] || "00:00";
    const outPoint = timeParts[1] || "00:03";
    
    // Clean strings for CSV
    const cleanNarration = `"${(scene.narration || '').replace(/"/g, '""')}"`;
    const cleanText = `"${(scene.onScreenText || '').replace(/"/g, '""')}"`;
    const cleanNote = `"${(scene.cameraAngle || '').replace(/"/g, '""')}"`;

    return [inPoint, outPoint, cleanNarration, cleanText, cleanNote].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const fileName = `CapCut_자막_${content.topic.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${content.duration}초.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLibraryToJson(contents: GeneratedContent[]) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(contents, null, 2)
  )}`;
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `AI_Studio_Shorts_Library_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateFullTextSummary(item: GeneratedContent): string {
  const platformLabel = item.platform === 'youtube' ? '유튜브 숏폼 (Shorts)' : item.platform === 'instagram' ? '인스타그램 릴스 (Reels)' : '틱톡 (TikTok)';
  const toneLabel = item.tone === 'information' ? '정보 전달' : item.tone === 'humorous' ? '유머러스/위트' : item.tone === 'high_tension' ? '하이 텐션/폭발적' : item.tone === 'luxury' ? '고급스러움/프리미엄' : '감성적/공감';

  let text = `# 🎬 [숏폼 올인원 마스터 제작 가이드] ${item.topic}\n\n`;
  text += `> 본 문서는 **영상 대본**, **장면별 1:1 매칭 AI 비디오/이미지 프롬프트(한/영)**, **Suno AI BGM 가이드**가 완벽하게 연계된 통합 제작 기획서입니다.\n\n`;
  text += `---\n\n`;
  text += `## 📌 1. 프로젝트 기본 기획\n`;
  text += `- **주제**: ${item.topic}\n`;
  text += `- **타깃 플랫폼**: ${platformLabel}\n`;
  text += `- **목표 러닝타임**: ${item.duration}초 (실제 추정: ${item.script.estimatedDurationSec}초)\n`;
  text += `- **톤앤매너**: ${toneLabel}\n`;
  text += `- **말하기 속도(WPM)**: ${item.script.wpm} WPM (${item.script.wpmStatus === 'optimal' ? '✅ 최적' : item.script.wpmStatus === 'fast' ? '⚠️ 다소 빠름' : 'ℹ️ 여유로움'})\n`;
  text += `- **9:16 세이프존 안내**: ${item.script.safeZoneNote}\n\n`;

  text += `---\n\n`;
  text += `## ⚡ 2. 초반 3초 후킹 (Hooking)\n`;
  text += `- **후킹 나레이션**: "${item.script.hook}"\n`;
  text += `- **시선 집중 연출법**: ${item.script.hookDescription}\n\n`;

  text += `---\n\n`;
  text += `## 🎞️ 3. 장면별 1:1 완벽 연계 제작 플랜 (타임라인)\n`;
  text += `| 장면 | 타임코드 | 나레이션 & 자막 | 카메라 & 연출 지시문 | 매칭 AI 영상 프롬프트 (EN/KO) | BGM & 오디오 큐 |\n`;
  text += `|---|---|---|---|---|---|\n\n`;

  item.script.scenes.forEach((scene, index) => {
    const visualPromptEn = scene.matchedVisualPrompt || item.flowOmniPrompts?.imageFxPrompts?.[index]?.prompt || item.flowOmniPrompts?.googleFlowPrompts?.[index % item.flowOmniPrompts.googleFlowPrompts.length]?.prompt || 'Cinematic vertical 9:16 shot, high quality lighting';
    const visualPromptKo = scene.matchedVisualPromptKo || item.flowOmniPrompts?.imageFxPrompts?.[index]?.promptKo || item.flowOmniPrompts?.googleFlowPrompts?.[index % item.flowOmniPrompts.googleFlowPrompts.length]?.promptKo || '시네마틱 세로 9:16 영상 프롬프트';
    const audioCue = scene.audioCue || `BPM ${item.audioPrompts.bpm} 배경 비트 유지 및 화면 전환 효과음`;

    text += `### 🎬 장면 ${index + 1} (${scene.time} / ${scene.durationSeconds}초)\n`;
    text += `- **🗣️ 나레이션**: ${scene.narration}\n`;
    text += `- **💬 화면 자막**: ${scene.onScreenText}\n`;
    text += `- **🎥 연출 & 카메라**: ${scene.cameraAngle}\n`;
    text += `- **👁️ 비주얼 큐**: ${scene.visualCue}\n`;
    text += `- **🎨 1:1 매칭 AI 비디오 프롬프트 (영문)**:\n  \`\`\`\n  ${visualPromptEn}\n  \`\`\`\n`;
    text += `- **🇰🇷 프롬프트 한국어 번역**:\n  > ${visualPromptKo}\n`;
    text += `- **🎵 BGM / SFX 연출 큐**: ${audioCue}\n\n`;
  });

  text += `---\n\n`;
  text += `## 🎨 4. 멀티모달 AI 비주얼 프롬프트 가이드\n\n`;
  
  if (item.flowOmniPrompts?.googleFlowPrompts?.length > 0) {
    text += `### 🌟 Google Flow / FX 캐릭터 & 에셋 프롬프트\n`;
    item.flowOmniPrompts.googleFlowPrompts.forEach((p, idx) => {
      text += `**[${p.tag}] ${p.label}**\n`;
      text += `- **영문 프롬프트**: \`${p.prompt}\`\n`;
      if (p.promptKo) {
        text += `- **한글 번역**: ${p.promptKo}\n`;
      }
      text += `\n`;
    });
  }

  if (item.flowOmniPrompts?.geminiOmniPrompts?.length > 0) {
    text += `### 🔄 Gemini Omni 대화형 수정 프롬프트\n`;
    item.flowOmniPrompts.geminiOmniPrompts.forEach((p, idx) => {
      text += `**[시나리오] ${p.scenario}**\n`;
      text += `- **영문 프롬프트**: \`${p.prompt}\`\n`;
      if (p.promptKo) {
        text += `- **한글 번역**: ${p.promptKo}\n`;
      }
      text += `\n`;
    });
  }

  text += `---\n\n`;
  text += `## 🎵 5. Suno AI BGM & 사운드트랙 가이드\n\n`;
  text += `- **BGM 스타일 키워드**: ${item.audioPrompts.bgmStyleKeywords}\n`;
  if (item.audioPrompts.bgmStyleKeywordsKo) {
    text += `- **스타일 키워드 한글 설명**: ${item.audioPrompts.bgmStyleKeywordsKo}\n`;
  }
  text += `- **템포(BPM)**: ${item.audioPrompts.bpm} BPM\n`;
  text += `- **무드**: ${item.audioPrompts.mood}\n`;
  if (item.audioPrompts.audioProductionGuide) {
    text += `- **오디오 연출 가이드**: ${item.audioPrompts.audioProductionGuide}\n`;
  }
  text += `\n### 🎹 Suno AI 생성 프롬프트\n`;
  text += `\`\`\`text\n${item.audioPrompts.sunoPrompt}\n\`\`\`\n`;
  if (item.audioPrompts.sunoPromptKo) {
    text += `> **한글 번역**: ${item.audioPrompts.sunoPromptKo}\n\n`;
  }

  if (item.audioPrompts.structuredLyrics?.length > 0) {
    text += `### 📝 추천 가사 / 보컬 구조 (Lyrics)\n`;
    item.audioPrompts.structuredLyrics.forEach(l => {
      text += `- **${l.section}**: ${l.text}`;
      if (l.textKo && l.textKo !== l.text) {
        text += ` (한글: ${l.textKo})`;
      }
      text += `\n`;
    });
    text += `\n`;
  }

  text += `---\n\n`;
  text += `## 🚀 6. 엔딩 CTA & 해시태그\n`;
  text += `- **행동 유도 멘트 (CTA)**: ${item.script.cta}\n`;
  text += `- **추천 해시태그**: ${item.script.hashtags.join(' ')}\n\n`;

  text += `---\n\n`;
  text += `## 🛠️ 7. 실전 영상 제작 3분 워크플로우\n`;
  text += `1. **BGM 생성**: 위 5번의 Suno 프롬프트를 복사하여 Suno AI에 붙여넣고 30초 내외 BGM 생성.\n`;
  text += `2. **영상 컷 생성**: 위 3번의 장면별 매칭 AI 프롬프트를 Google Veo / ImageFX / Midjourney에 입력하여 각 컷 추출.\n`;
  text += `3. **CapCut 편집**: CapCut PC에서 본 앱의 [CapCut CSV 내보내기] 파일을 불러와 자막을 원클릭 배치하고 BGM 및 영상 컷을 타임라인에 맞추면 완성!\n`;

  return text;
}

export function exportUnifiedProductionKit(content: GeneratedContent, format: 'md' | 'txt' = 'md') {
  const fileContent = generateFullTextSummary(content);
  const mimeType = format === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;';
  const extension = format === 'md' ? 'md' : 'txt';

  const blob = new Blob(["\uFEFF" + fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const cleanTopic = content.topic.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  const fileName = `[올인원제작키트]_${cleanTopic}_${content.duration}초_${new Date().toISOString().slice(0,10)}.${extension}`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

