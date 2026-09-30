import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    className = '',
    containerClassName = '',
    required,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 text-left ${containerClassName}`}>
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        className={`w-full bg-[#10131b] border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all duration-150 resize-y ${
          error
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50'
            : 'border-white/10 hover:border-white/20 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50'
        } ${className}`}
        {...props}
      />

      {error ? (
        <span className="text-xs text-rose-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});
