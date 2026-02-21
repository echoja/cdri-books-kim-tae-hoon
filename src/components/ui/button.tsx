import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, Ref } from "react";
import { cn, cva } from "@/lib/class-name";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-4.75 whitespace-nowrap rounded-button border border-transparent text-caption text-text-title transition-colors duration-160 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-palette-primary px-7 py-4 text-palette-white hover:bg-palette-primary-hover disabled:bg-surface-disabled aria-disabled:bg-surface-disabled",
        secondary:
          "bg-surface-secondary px-5 py-4 text-text-secondary hover:bg-surface-hover disabled:bg-surface-disabled disabled:text-text-muted aria-disabled:bg-surface-disabled aria-disabled:text-text-muted [&_svg]:text-text-muted",
        outline:
          "bg-palette-white px-2.5 py-1.25 text-text-subtitle border-text-subtitle hover:bg-surface-secondary disabled:border-divider disabled:text-text-muted aria-disabled:border-divider aria-disabled:text-text-muted",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];

interface ButtonProps
  extends PropsWithChildren, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
}

interface LinkButtonProps
  extends PropsWithChildren, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  className?: string;
  disabled?: boolean;
  ref?: Ref<HTMLAnchorElement>;
  variant?: ButtonVariant;
}

export function Button({
  variant = "secondary",
  className,
  ref,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  className,
  disabled = false,
  ref,
  onClick,
  tabIndex,
  ...props
}: LinkButtonProps) {
  return (
    <a
      ref={ref}
      {...props}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(
        buttonVariants({ variant }),
        disabled && "pointer-events-none cursor-not-allowed",
        className,
      )}
      aria-disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    />
  );
}
