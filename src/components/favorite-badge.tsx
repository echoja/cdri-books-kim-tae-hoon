import type { ComponentProps } from "react";
import lineHeart from "@/assets/icons/line.svg";
import fillHeart from "@/assets/icons/fill.svg";
import { cn, cva } from "@/lib/class-name";

const favoriteBadgeVariants = cva(
  "absolute inline-flex items-center justify-center rounded-full border-none bg-transparent p-0",
  {
    variants: {
      size: {
        collapsed: "right-0 top-0 h-4 w-4",
        expanded: "right-2 top-2 h-6 w-6",
      },
    },
    defaultVariants: {
      size: "collapsed",
    },
  },
);

interface FavoriteBadgeProps extends Omit<ComponentProps<"button">, "children"> {
  isFavorite: boolean;
  size?: "collapsed" | "expanded";
}

export function FavoriteBadge({
  isFavorite,
  size = "collapsed",
  className,
  ...props
}: FavoriteBadgeProps) {
  const iconSize = size === "expanded" ? 24 : 16;

  return (
    <button
      type="button"
      className={cn(favoriteBadgeVariants({ size }), className)}
      aria-label={isFavorite ? "찜 해제" : "찜 추가"}
      {...props}
    >
      <img width={iconSize} height={iconSize} src={isFavorite ? fillHeart : lineHeart} alt="" />
    </button>
  );
}
