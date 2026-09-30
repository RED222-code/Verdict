import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/ui/RatingStars';
import { ReviewFormModal } from '../components/reviews/ReviewFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  User,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Star,
  Edit3,
  Trash2,
  ExternalLink,
  MessageSquarePlus,
} from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch reviews written by this user
  const { data: myReviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['myReviews', user?._id],
    queryFn: () => reviewsApi.getReviews({ userId: user?._id, sort: '-dateCreated' }),
    enabled: Boolean(user?._id),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });

      showToast('Verdict removed.');
      setReviewToDelete(null);
    },
    onError: (err) => {
      showToast(err.message || 'Failed to delete verdict', 'error');
    },
    onSettled: () => {
      setDeleteLoading(false);
    },
  });

  const handleDeleteConfirm = () => {
    if (reviewToDelete) {
      setDeleteLoading(true);
      deleteMutation.mutate(reviewToDelete._id);
    }
  };

  const memberSince = user?.dateCreated
    ? new Date(user.dateCreated).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent Member';

  const totalReviewsCount = myReviews?.length || 0;
  const avgRatingGiven = totalReviewsCount > 0
    ? (myReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviewsCount).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Identity Card */}
      <div className="p-8 bg-[#12151e] border border-white/10 rounded-3xl relative overflow-hidden shadow-xl card-gradient">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-3xl font-extrabold text-black font-display shadow-lg shadow-amber-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {user?.name}
                </h1>
                {user?.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-400 font-mono">
                {user?.email}
              </p>

              <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
            <div className="text-center px-4 py-3 bg-[#0d0f17] border border-white/5 rounded-2xl min-w-[100px]">
              <span className="text-2xl font-extrabold text-white font-mono block">
                {totalReviewsCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Verdicts
              </span>
            </div>

            <div className="text-center px-4 py-3 bg-[#0d0f17] border border-white/5 rounded-2xl min-w-[100px]">
              <span className="text-2xl font-extrabold text-amber-400 font-mono block">
                {avgRatingGiven}★
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                Avg Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MY REVIEWS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Editorial Contributions
            </span>
            <h2 className="text-2xl font-bold font-display text-white mt-1">
              My Published Verdicts ({totalReviewsCount})
            </h2>
          </div>

          <Link to="/products">
            <Button variant="outline" size="sm" icon={MessageSquarePlus}>
              Review Hardware
            </Button>
          </Link>
        </div>

        {loadingReviews ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-[#12151e] border border-white/5 rounded-2xl animate-pulse space-y-3">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-5 w-3/4 bg-white/10 rounded" />
                <div className="h-12 w-full bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : myReviews && myReviews.length > 0 ? (
          <div className="space-y-4">
            {myReviews.map((review) => {
              const product = review.productId || {};
              const reviewDate = review.dateCreated
                ? new Date(review.dateCreated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';

              return (
                <div
                  key={review._id}
                  className="p-6 bg-[#12151e] border border-white/10 hover:border-white/20 rounded-2xl transition-all flex flex-col gap-4"
                >
                  {/* Top Bar: Product Name link + Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-slate-400">
                        Product:
                      </span>
                      {product._id ? (
                        <Link
                          to={`/products/${product._id}`}
                          className="text-sm font-bold text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>{product.name || 'View Hardware'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-sm font-bold text-slate-300">
                          {product.name || 'Hardware'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 mr-2">
                        {reviewDate}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit3}
                        onClick={() => setReviewToEdit(review)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setReviewToDelete(review)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Rating + Title */}
                  <div className="flex flex-col gap-1">
                    <RatingStars rating={review.rating} size="sm" />
                    <h4 className="text-base font-bold font-display text-white mt-1">
                      {review.title}
                    </h4>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="You haven't reviewed anything yet"
            description="Browse our catalog to deliver your first hardware verdict and help others avoid buying blind."
            actionLabel="Discover Products"
            onAction={() => window.location.assign('/products')}
          />
        )}
      </div>

      {/* Edit Review Modal */}
      {reviewToEdit && (
        <ReviewFormModal
          isOpen={Boolean(reviewToEdit)}
          onClose={() => setReviewToEdit(null)}
          productId={reviewToEdit.productId?._id || reviewToEdit.productId}
          productName={reviewToEdit.productId?.name || 'Product'}
          existingReview={reviewToEdit}
        />
      )}

      {/* Delete Review Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this verdict?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        isLoading={deleteLoading}
      />
    </div>
  );
}
