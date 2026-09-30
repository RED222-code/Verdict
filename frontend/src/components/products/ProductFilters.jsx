import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProductFilters({
  filters,
  categories = [],
  onChange,
  onReset,
  className = '',
}) {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.availabilityStatus) ||
    Boolean(filters['price[gte]']) ||
    Boolean(filters['price[lte]']) ||
    Boolean(filters['averageRating[gte]']);

  return (
    <div className={`flex flex-col gap-6 p-6 bg-[#12151e] border border-white/10 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-white font-bold font-display text-base">
          <Filter className="w-4 h-4 text-amber-500" />
          Filter Catalog
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => updateFilter('category', '')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              !filters.category
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => updateFilter('category', isSelected ? '' : cat.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.category}</span>
                {cat.productCount !== undefined && (
                  <span className={`text-[10px] ${isSelected ? 'text-black/70' : 'text-slate-400'}`}>
                    ({cat.productCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Status */}
      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Availability
        </label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'All Statuses', value: '' },
            { label: 'In Stock Only', value: 'available' },
            { label: 'Out of Stock', value: 'out-of-stock' },
          ].map((item) => {
            const isSelected = (filters.availabilityStatus || '') === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter('availabilityStatus', item.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-white/10 text-white font-semibold border border-white/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters['price[gte]'] || ''}
              onChange={(e) => updateFilter('price[gte]', e.target.value)}
              className="w-full bg-[#0a0d13] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters['price[lte]'] || ''}
              onChange={(e) => updateFilter('price[lte]', e.target.value)}
              className="w-full bg-[#0a0d13] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Minimum Rating
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Any', value: '' },
            { label: '4★ & Above', value: '4' },
            { label: '4.5★ & Above', value: '4.5' },
          ].map((item) => {
            const isSelected = (filters['averageRating[gte]'] || '') === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter('averageRating[gte]', isSelected ? '' : item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
