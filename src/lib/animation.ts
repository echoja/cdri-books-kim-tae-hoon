import type { AnimationParams, JSAnimation, TargetsParam } from "animejs";
import { animate } from "animejs";

export function motionDuration(value: number): number {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduce ? 0 : value;
}

/** animate() 래퍼. 대상이 DOM에서 분리된 경우 등 예외를 무시한다. */
export function runAnimate(targets: TargetsParam, parameters: AnimationParams): JSAnimation | null {
  try {
    return animate(targets, parameters);
  } catch {
    return null;
  }
}
