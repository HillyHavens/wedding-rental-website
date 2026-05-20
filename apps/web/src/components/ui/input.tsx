import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-emerald_deep-700/15 bg-white px-4 py-2 text-base placeholder:text-emerald_deep-700/40 focus:outline-none focus:ring-2 focus:ring-gold-300/60 focus:border-gold-400 disabled:cursor-not-allowed disabled:opacity-50 transition',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'block text-sm font-medium text-emerald_deep-700 mb-1.5',
      className,
    )}
    {...props}
  />
));
Label.displayName = 'Label';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[100px] w-full rounded-xl border border-emerald_deep-700/15 bg-white px-4 py-3 text-base placeholder:text-emerald_deep-700/40 focus:outline-none focus:ring-2 focus:ring-gold-300/60 focus:border-gold-400 disabled:cursor-not-allowed disabled:opacity-50 transition resize-y',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-emerald_deep-700/15 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gold-300/60 focus:border-gold-400 disabled:cursor-not-allowed disabled:opacity-50 transition',
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export { Input, Label, Textarea, Select };
