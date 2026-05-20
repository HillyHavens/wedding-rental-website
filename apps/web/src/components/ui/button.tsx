import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-emerald_deep-600 text-ivory-50 hover:bg-emerald_deep-700 shadow-lg shadow-emerald_deep-600/20 hover:shadow-xl hover:-translate-y-0.5',
        gold:
          'bg-gold-gradient text-emerald_deep-700 hover:brightness-105 shadow-lg shadow-gold-300/30 hover:shadow-xl hover:-translate-y-0.5',
        outline:
          'border border-ivory-50/40 text-ivory-50 hover:bg-ivory-50/10 backdrop-blur-sm',
        ghost: 'text-emerald_deep-600 hover:bg-ivory-100',
      },
      size: {
        default: 'h-11 px-7 py-2',
        sm: 'h-9 px-4',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
