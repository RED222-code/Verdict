import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your filters or search terms to discover more verdicts.',
  icon: Icon = PackageOpen,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 bg-[#12151e]/60 border border-white/10 rounded-3xl ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold font-display text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
