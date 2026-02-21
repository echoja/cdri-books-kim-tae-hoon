import type { JSAnimation } from 'animejs'
import { animate } from 'animejs'

export function motionDuration(value: number): number {
  if (typeof window === 'undefined') {
    return value
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduce ? 0 : value
}

export function safeAnimate(options: Parameters<typeof animate>[0]): JSAnimation | null {
  try {
    return animate(options)
  } catch {
    return null
  }
}
