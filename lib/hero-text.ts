import { siteConfig } from "@/site.config";

/* 관리자 페이지에서 바꿀 수 있는 히어로 글자 목록.
   - key: 데이터베이스(site_texts 표)에 저장되는 이름
   - 비어 있으면 site.config.ts 의 hero 글자가 기본값으로 보입니다. */

export type HeroText = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export const heroFields: {
  name: keyof HeroText;
  key: string;
  label: string;
  multiline?: boolean;
}[] = [
  { name: "eyebrow", key: "hero.eyebrow", label: "제목 위 작은 글씨" },
  { name: "title", key: "hero.title", label: "큰 제목 (엔터로 줄바꿈)", multiline: true },
  { name: "description", key: "hero.description", label: "소개 문장", multiline: true },
  { name: "primaryLabel", key: "hero.primaryLabel", label: "첫 번째 버튼 글자" },
  { name: "secondaryLabel", key: "hero.secondaryLabel", label: "두 번째 버튼 글자" },
];

/** site.config.ts 에 적힌 기본 히어로 글자 */
export const defaultHeroText: HeroText = {
  eyebrow: siteConfig.hero.eyebrow,
  title: siteConfig.hero.title,
  description: siteConfig.hero.description,
  primaryLabel: siteConfig.hero.primaryCta.label,
  secondaryLabel: siteConfig.hero.secondaryCta.label,
};

/** 데이터베이스에서 읽은 { key, value } 목록을 기본 글자 위에 덮어씀 */
export function mergeHeroText(rows: { key: string; value: string }[]): HeroText {
  const result = { ...defaultHeroText };
  for (const field of heroFields) {
    const value = rows.find((row) => row.key === field.key)?.value;
    if (value) result[field.name] = value;
  }
  return result;
}
