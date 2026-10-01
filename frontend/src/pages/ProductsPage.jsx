import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductSort } from '../components/products/ProductSort';
import { Pagination } from '../components/products/Pagination';
import { Button } from '../components/ui/Button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Parse filters from URL
  const filters = useMemo(() => {
    return {
      category: searchParams.get('category') || '',
      availabilityStatus: searchParams.get('availabilityStatus') || '',
      'price[gte]': searchParams.get('price[gte]') || '',
      'price[lte]': searchParams.get('price[lte]') || '',
      'averageRating[gte]': searchParams.get('averageRating[gte]') || '',
      sort: searchParams.get('sort') || '-dateCreated',
      page: Number(searchParams.get('page')) || 1,
      limit: 9,
      search: searchParams.get('search') || '',
    };
  }, [searchParams]);

  // Categories list query for filters
  const { data: categoryStats } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: productsApi.getCategoryStats,
  });

  // Prepare API params
  const apiParams = useMemo(() => {
    const params = {
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.category) params.category = filters.category;
    if (filters.availabilityStatus) params.availabilityStatus = filters.availabilityStatus;
    if (filters['price[gte]']) params['price[gte]'] = filters['price[gte]'];
    if (filters['price[lte]']) params['price[lte]'] = filters['price[lte]'];
    if (filters['averageRating[gte]']) params['averageRating[gte]'] = filters['averageRating[gte]'];
    if (filters.search) {
      params['name[regex]'] = filters.search;
      params['name[options]'] = 'i';
    }

    return params;
  }, [filters]);

  // Main products query
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products', apiParams],
    queryFn: () => productsApi.getProducts(apiParams),
  });

  const updateFilters = (newFilters) => {
    const next = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) {
        next.set(k, v);
      }
    });
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchInput.trim(), page: 1 });
  };

  const clearSearch = () => {
    setSearchInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    next.set('page', '1');
    setSearchParams(next);
  };

  const activeFiltersCount = [
    filters.category,
    filters.availabilityStatus,
    filters['price[gte]'],
    filters['price[lte]'],
    filters['averageRating[gte]'],
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header Bar */}
      <div className="flex flex-col gap-6 mb-8 border-b border-white/5 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Hardware Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
              Product Catalog
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12151e] border border-white/10 text-xs font-medium text-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <ProductSort
              currentSort={filters.sort}
              onChange={(newSort) => updateFilters({ ...filters, sort: newSort, page: 1 })}
            />
          </div>
        </div>

        {/* Search input bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-xl">
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            placeholder="Search within catalog by product name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#12151e] border border-white/10 hover:border-white/20 focus:border-amber-500 focus:outline-none rounded-xl pl-10 pr-20 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Go
          </button>
        </form>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-mono">Active:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                Keyword: "{filters.search}"
                <button type="button" onClick={clearSearch}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {filters.category && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                Category: {filters.category}
                <button type="button" onClick={() => updateFilters({ ...filters, category: '', page: 1 })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {filters.availabilityStatus && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                Status: {filters.availabilityStatus}
                <button type="button" onClick={() => updateFilters({ ...filters, availabilityStatus: '', page: 1 })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {filters['price[gte]'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                Min: ${filters['price[gte]']}
                <button type="button" onClick={() => updateFilters({ ...filters, 'price[gte]': '', page: 1 })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {filters['price[lte]'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                Max: ${filters['price[lte]']}
                <button type="button" onClick={() => updateFilters({ ...filters, 'price[lte]': '', page: 1 })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {filters['averageRating[gte]'] && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium">
                Min {filters['averageRating[gte]']}★
                <button type="button" onClick={() => updateFilters({ ...filters, 'averageRating[gte]': '', page: 1 })}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium ml-2 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <ProductFilters
              filters={filters}
              categories={categoryStats || []}
              onChange={updateFilters}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Products Grid Content */}
        <div className="lg:col-span-3 flex flex-col">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            emptyTitle="No products match criteria"
            emptyDescription="We couldn't find any products matching your specific combination of filters. Try clearing or relaxing some criteria."
            onResetFilters={handleResetFilters}
          />

          {/* Pagination */}
          {!isLoading && products && products.length > 0 && (
            <Pagination
              page={filters.page}
              limit={filters.limit}
              itemCount={products.length}
              onPageChange={(newPage) => updateFilters({ ...filters, page: newPage })}
            />
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-xs h-full bg-[#12151e] border-l border-white/10 p-6 overflow-y-auto z-10 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-bold font-display text-white text-lg">Filters</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                categories={categoryStats || []}
                onChange={(f) => {
                  updateFilters(f);
                }}
                onReset={handleResetFilters}
                className="p-0 bg-transparent border-0"
              />

              <div className="mt-auto pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
