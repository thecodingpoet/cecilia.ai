import type { CSSProperties } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
