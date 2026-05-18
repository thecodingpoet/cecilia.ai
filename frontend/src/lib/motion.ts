import type { CSSProperties } from "react";

const INTRO_KEY = "cecilia-intro-seen";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  return !localStorage.getItem(INTRO_KEY);
}

export function markIntroSeen(): void {
  localStorage.setItem(INTRO_KEY, "1");
}

/** Inline delay for staggered CSS animations (--stagger-index on parent optional). */
export function staggerDelay(
  index: number,
  stepMs = 55,
  baseMs = 0
): CSSProperties {
  if (prefersReducedMotion()) return {};
  return { animationDelay: `${baseMs + index * stepMs}ms` };
}
