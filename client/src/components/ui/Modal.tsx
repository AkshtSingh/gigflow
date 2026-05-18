import type { ReactNode } from 'react';

import { Button } from './Button';

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export const Modal = ({ title, open, onClose, children, footer }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-md border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <Button variant="ghost" onClick={onClose} type="button">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-outline-variant px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};
