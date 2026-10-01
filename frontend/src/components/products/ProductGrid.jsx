import React from 'react';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from '../ui/SkeletonCard';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';

export function ProductGrid({
  products = [],
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle = 'No products found',
  emptyDescription = 'No products match your current filters or query.',
  onResetFilters,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="Unable to load products" message="Products are temporarily unavailable. Please try again." onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear all filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}
