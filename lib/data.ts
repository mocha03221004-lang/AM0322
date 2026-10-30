import { sampleItems } from "@/site.config";
import { getPublicClient } from "@/lib/supabase";
import type { Item } from "@/lib/types";
import { defaultHeroText, heroFields, mergeHeroText, type HeroText } from "@/lib/hero-text";

/**
 * 특정 섹션의 카드 목록을 가져옵니다.
 * - Supabase가 연결 안 됐으면: site.config.ts 의 예시 카드를 보여줌
 * - 연결됐으면: 데이터베이스에서 '보이기'로 설정된 카드만 순서대로 가져옴
 */
export async function getItems(section: string): Promise<Item[]> {
  const supabase = getPublicClient();
  const samples = sampleItems.filter((item) => item.section === section);
  if (!supabase) return samples;

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("section", section)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getItems] Supabase 읽기 실패:", error.message);
    return samples;
  }
  return (data ?? []) as Item[];
}

/**
 * 히어로(첫 화면) 글자를 가져옵니다.
 * - Supabase가 연결 안 됐거나 읽기에 실패하면: site.config.ts 의 글자
 * - 연결됐으면: 관리자 페이지에서 저장한 글자 (비어 있는 칸은 site.config.ts 글자)
 */
export async function getHeroText(): Promise<HeroText> {
  const supabase = getPublicClient();
  if (!supabase) return defaultHeroText;

  const { data, error } = await supabase
    .from("site_texts")
    .select("key, value")
    .in(
      "key",
      heroFields.map((field) => field.key),
    );

  if (error) {
    console.error("[getHeroText] Supabase 읽기 실패:", error.message);
    return defaultHeroText;
  }
  return mergeHeroText(data ?? []);
}
