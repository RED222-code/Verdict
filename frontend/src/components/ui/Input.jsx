import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    id,
    className = '',
    containerClassName = '',
    required,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 text-left ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`w-full bg-[#10131b] border rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-all duration-150 ${
            Icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'
          } ${
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50'
              : 'border-white/10 hover:border-white/20 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs text-rose-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});
