import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    id,
    className = '',
    containerClassName = '',
    required,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 text-left ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full bg-[#10131b] border rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-100 focus:outline-none transition-all duration-150 appearance-none cursor-pointer ${
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50'
              : 'border-white/10 hover:border-white/20 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#12151e] text-slate-100 py-1">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <span className="text-xs text-rose-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});
