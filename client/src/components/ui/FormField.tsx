import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonProps = {
  label: string;
  error?: string;
};

type InputProps = CommonProps & InputHTMLAttributes<HTMLInputElement>;
type SelectProps = CommonProps & SelectHTMLAttributes<HTMLSelectElement>;
type TextareaProps = CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const fieldClassName =
  'w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm text-on-surface outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20';

export const FormField = ({ label, error, ...props }: InputProps) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface-variant">
    <span>{label}</span>
    <input className={fieldClassName} {...props} />
    {error ? <span className="text-xs text-error">{error}</span> : null}
  </label>
);

export const FormSelect = ({ label, error, children, ...props }: SelectProps) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface-variant">
    <span>{label}</span>
    <select className={fieldClassName} {...props}>
      {children}
    </select>
    {error ? <span className="text-xs text-error">{error}</span> : null}
  </label>
);

export const FormTextarea = ({ label, error, ...props }: TextareaProps) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-on-surface-variant">
    <span>{label}</span>
    <textarea className={fieldClassName} {...props} />
    {error ? <span className="text-xs text-error">{error}</span> : null}
  </label>
);
