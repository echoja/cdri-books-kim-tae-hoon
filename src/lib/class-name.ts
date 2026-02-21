/* eslint-disable no-restricted-imports */
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-title-1",
        "text-title-2",
        "text-title-3",
        "text-body-1",
        "text-body-2",
        "text-body-2-bold",
        "text-caption",
        "text-small",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { cva, type VariantProps };
