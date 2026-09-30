import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { reviewsApi } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/ui/RatingStars';
import { RatingDistribution } from '../components/ui/RatingDistribution';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewFormModal } from '../components/reviews/ReviewFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { SkeletonDetail } from '../components/ui/SkeletonCard';
import { ErrorState } from '../components/ui/ErrorState';
import {
  ArrowLeft,
  MessageSquarePlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Package,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [selectedImage, setSelectedImage] = useState(null);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Queries
  const {
    data: product,
    isLoading: loadingProduct,
    isError: productError,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
  });

  const {
    data: reviews,
    isLoading: loadingReviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getReviews({ productId: id, sort: '-dateCreated' }),
    enabled: Boolean(id),
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });

      showToast('Verdict deleted successfully.');
      setReviewToDelete(null);
    },
    onError: (err) => {
      showToast(err.message || 'Failed to delete review', 'error');
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

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to share your verdict.', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }
    setReviewToEdit(null);
    setWriteModalOpen(true);
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setWriteModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Verdict',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.');
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonDetail />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <ErrorState
          title="Hardware not found"
          message="The requested hardware entry does not exist or may have been archived."
          onRetry={refetchProduct}
        />
        <div className="text-center mt-6">
          <Link to="/products">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate local distribution from actual product reviews
  const reviewDistribution = [
    { rating: 5, count: reviews?.filter((r) => Math.round(r.rating) === 5).length || 0 },
    { rating: 4, count: reviews?.filter((r) => Math.round(r.rating) === 4).length || 0 },
    { rating: 3, count: reviews?.filter((r) => Math.round(r.rating) === 3).length || 0 },
    { rating: 2, count: reviews?.filter((r) => Math.round(r.rating) === 2).length || 0 },
    { rating: 1, count: reviews?.filter((r) => Math.round(r.rating) === 1).length || 0 },
  ];

  const allImages = [
    product.coverImageName,
    ...(Array.isArray(product.otherImageNames) ? product.otherImageNames : []),
  ].filter(Boolean);

  const displayImage = selectedImage || product.coverImageName || allImages[0];
  const isAvailable = product.availabilityStatus === 'available';
  const isOutOfStock = product.availabilityStatus === 'out-of-stock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* TOP SECTION: 2-COLUMN PRODUCT PRESENTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-16 border-b border-white/10">
        {/* Left Col: Image & Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#12151e] border border-white/10 card-gradient shadow-2xl">
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-sm">
                No image available
              </div>
            )}

            {/* Category tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest bg-black/80 backdrop-blur-md text-amber-300 border border-white/10 font-bold">
                {product.category}
              </span>
            </div>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Share hardware entry"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image Thumbnails if multiple images exist */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    displayImage === imgUrl
                      ? 'border-amber-500 ring-2 ring-amber-500/20'
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Details & Meta */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Status & Category */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  isAvailable
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                    : isOutOfStock
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/50'
                }`}
              >
                {isAvailable ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>
                  {isAvailable ? 'In Stock & Ready' : isOutOfStock ? 'Currently Out of Stock' : product.availabilityStatus}
                </span>
              </span>

              {product.quantityAvailable !== undefined && (
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  {product.quantityAvailable} units
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating badge */}
            <div className="flex items-center gap-3 pt-1">
              <RatingStars
                rating={product.averageRating || 0}
                size="md"
                showScore={true}
              />
              <span className="text-xs text-slate-400">
                based on <strong className="text-white font-mono">{product.numberOfRatings || 0}</strong> verified verdicts
              </span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                Direct Pricing
              </span>
              <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                ${Number(product.price).toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-white/5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Hardware Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* CTA actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:flex-1"
              icon={MessageSquarePlus}
              onClick={handleWriteReviewClick}
            >
              Write a Review
            </Button>
          </div>
        </div>
      </div>

      {/* COMMUNITY VERDICT & RATING BREAKDOWN SECTION */}
      <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-white/10">
        <div className="lg:col-span-5">
          <RatingDistribution
            distribution={reviewDistribution}
            totalReviews={product.numberOfRatings || reviews?.length || 0}
            averageRating={product.averageRating || 0}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center gap-4 bg-[#12151e]/50 border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            Integrity Guarantee
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            How Verdict ratings are calculated
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every score represents a real community user review aggregated via atomic database updates.
            We eliminate sponsored bias, allowing genuine verified feedback to dictate the score.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWriteReviewClick}
              icon={MessageSquarePlus}
            >
              Contribute your experience
            </Button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold">
              Feedback Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Community Verdicts ({reviews?.length || 0})
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={MessageSquarePlus}
            onClick={handleWriteReviewClick}
          >
            Submit Verdict
          </Button>
        </div>

        <ReviewList
          reviews={reviews}
          isLoading={loadingReviews}
          onEditReview={handleEditReview}
          onDeleteReview={(rev) => setReviewToDelete(rev)}
          onWriteReview={handleWriteReviewClick}
        />
      </div>

      {/* Write/Edit Review Modal */}
      <ReviewFormModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        productId={product._id}
        productName={product.name}
        existingReview={reviewToEdit}
      />

      {/* Delete Review Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this verdict?"
        message="Are you sure you want to delete this review? This action cannot be undone and will recalculate product statistics."
        confirmText="Delete Review"
        isLoading={deleteLoading}
      />
    </div>
  );
}
