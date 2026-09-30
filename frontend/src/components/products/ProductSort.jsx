import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export function ProductSort({ currentSort = '-dateCreated', onChange }) {
  const sortOptions = [
    { label: 'Highest Rated', value: '-averageRating,-numberOfRatings' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Newest Arrivals', value: '-dateCreated' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-mono hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        Sort:
      </span>
      <select
        value={currentSort}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#12151e] border border-white/10 hover:border-white/20 text-xs text-white rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-amber-500 font-medium cursor-pointer transition-colors"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#12151e] text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
