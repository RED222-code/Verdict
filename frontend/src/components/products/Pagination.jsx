import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Pagination({ page = 1, limit = 9, itemCount = 0, onPageChange }) {
  const isFirstPage = page <= 1;
  const isLastPage = itemCount < limit;

  // Don't show pagination if on first page and count is less than limit
  if (isFirstPage && isLastPage && itemCount <= limit) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 py-8 border-t border-white/10 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
        icon={ChevronLeft}
      >
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400">
          Page <strong className="text-white">{page}</strong>
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
