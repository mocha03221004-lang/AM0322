"use client";

import { useActionState } from "react";

import { saveHeroText, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { defaultHeroText, heroFields, type HeroText } from "@/lib/hero-text";

const fieldClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50";

/** 히어로 글자 수정 입력 칸. 칸을 비우고 저장하면 site.config.ts 의 기본 글자로 돌아갑니다. */
export function HeroForm({ saved }: { saved: Partial<HeroText> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveHeroText, {});

  return (
    <form action={action} className="grid gap-5">
      {heroFields.map((field) => (
        <label key={field.name} className="grid gap-1.5 text-sm">
          <span className="font-medium">{field.label}</span>
          {field.multiline ? (
            <textarea
              name={field.name}
              rows={field.name === "title" ? 2 : 3}
              defaultValue={saved[field.name] ?? ""}
              placeholder={defaultHeroText[field.name]}
              className={`${fieldClass} py-2`}
            />
          ) : (
            <input
              name={field.name}
              defaultValue={saved[field.name] ?? ""}
              placeholder={defaultHeroText[field.name]}
              className={`${fieldClass} h-10`}
            />
          )}
        </label>
      ))}

      <p className="text-xs text-muted-foreground">
        칸을 비워 두면 흐린 글씨(기본 글자)가 사이트에 보입니다.
      </p>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장"}
        </Button>
        {state.message ? (
          <p className={state.ok ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
