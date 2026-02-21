import type { ComponentProps } from "react";
import { cn, cva, type VariantProps } from "@/lib/class-name";

const buttonVariants = cva(
  "inline-flex h-12 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-button border border-transparent text-caption text-text-title transition-colors duration-160 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-primary disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-palette-primary text-palette-white hover:bg-palette-primary-hover disabled:bg-palette-light-gray-disabled aria-disabled:bg-palette-light-gray-disabled",
        secondary:
          "bg-palette-light-gray text-text-secondary hover:bg-palette-light-gray-hover disabled:bg-palette-light-gray-disabled disabled:text-icon-muted aria-disabled:bg-palette-light-gray-disabled aria-disabled:text-icon-muted [&_svg]:text-icon-muted",
        outline:
          "bg-palette-white px-2.5 py-1.25 text-text-subtitle border-text-subtitle hover:bg-palette-light-gray disabled:border-palette-divider disabled:text-icon-muted aria-disabled:border-palette-divider aria-disabled:text-icon-muted",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

interface LinkButtonProps extends ComponentProps<"a">, VariantProps<typeof buttonVariants> {
  disabled?: boolean;
}

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  disabled = false,
  onClick,
  tabIndex,
  ...props
}: LinkButtonProps) {
  return (
    <a
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
