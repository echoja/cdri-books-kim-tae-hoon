import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, Ref } from 'react'
import { cn, cva } from '@/lib/class-name'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[19px] rounded-lg border border-transparent text-base leading-4 font-medium transition-colors duration-[160ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4880ee] disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-[#4880ee] px-7 py-4 text-white hover:bg-[#3b6acd] disabled:bg-[#afc4f4] aria-disabled:bg-[#afc4f4]',
        secondary:
          'bg-[#f2f4f6] px-5 py-4 text-[#6d7582] hover:bg-[#e7ebef] [&_svg]:text-[#b1b8c0] disabled:bg-[#f3f5f7] disabled:text-[#b1b8c0] aria-disabled:bg-[#f3f5f7] aria-disabled:text-[#b1b8c0]',
        outline:
          'bg-white px-[10px] py-[5px] text-[#8d94a0] border-[#8d94a0] hover:bg-[#f2f4f6] disabled:border-[#d2d6da] disabled:text-[#b1b8c0] aria-disabled:border-[#d2d6da] aria-disabled:text-[#b1b8c0]',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
)

type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>['variant']

interface ButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: string
  ref?: Ref<HTMLButtonElement>
  variant?: ButtonVariant
}

interface LinkButtonProps
  extends PropsWithChildren,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  className?: string
  disabled?: boolean
  ref?: Ref<HTMLAnchorElement>
  variant?: ButtonVariant
}

export function Button({
  variant = 'secondary',
  className,
  ref,
  type = 'button',
  ...props
}: ButtonProps) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant }), className)} {...props} />
}

export function LinkButton({
  variant = 'primary',
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
      className={cn(buttonVariants({ variant }), disabled && 'pointer-events-none cursor-not-allowed', className)}
      aria-disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }

        onClick?.(event)
      }}
    />
  )
}
