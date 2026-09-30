import React from 'react';
import { ReviewCard } from './ReviewCard';
import { EmptyState } from '../ui/EmptyState';
import { MessageSquarePlus } from 'lucide-react';

export function ReviewList({
  reviews = [],
  isLoading = false,
  onEditReview,
  onDeleteReview,
  onWriteReview,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-[#12151e] border border-white/5 rounded-2xl animate-pulse space-y-3">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-5 w-1/2 bg-white/10 rounded" />
            <div className="h-14 w-full bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquarePlus}
        title="No verdicts recorded yet"
        description="Be the first to share your honest verdict and help the community make an informed choice."
        actionLabel={onWriteReview ? 'Write the first review' : undefined}
        onAction={onWriteReview}
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onEdit={onEditReview}
          onDelete={onDeleteReview}
        />
      ))}
    </div>
  );
}
