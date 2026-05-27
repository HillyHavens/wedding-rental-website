'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-emerald_deep-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl ring-1 ring-emerald_deep-700/8 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-6">
            {/* Icon */}
            <div className={[
              'mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full',
              destructive ? 'bg-terracotta-50' : 'bg-gold-50',
            ].join(' ')}>
              {destructive
                ? <Trash2 className="h-6 w-6 text-terracotta-500" />
                : <AlertTriangle className="h-6 w-6 text-gold-500" />
              }
            </div>

            {/* Text */}
            <Dialog.Title className="text-center font-display text-2xl text-emerald_deep-700">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-center text-sm text-emerald_deep-700/60 leading-relaxed">
              {description}
            </Dialog.Description>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                className={[
                  'flex-1',
                  destructive
                    ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white border-transparent'
                    : '',
                ].join(' ')}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
