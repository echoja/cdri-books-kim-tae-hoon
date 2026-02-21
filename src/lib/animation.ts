import type { JSAnimation, TargetsParam, AnimationParams } from "animejs";
import { animate } from "animejs";

export function motionDuration(value: number): number {
  if (typeof window === "undefined") {
    return value;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduce ? 0 : value;
}

export function safeAnimate(
  targets: TargetsParam,
  parameters: AnimationParams,
): JSAnimation | null {
  try {
    return animate(targets, parameters);
  } catch {
    return null;
  }
}
