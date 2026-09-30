import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { RatingStars } from '../ui/RatingStars';
import { useToast } from '../../context/ToastContext';

export function ReviewFormModal({
  isOpen,
  onClose,
  productId,
  productName = 'Product',
  existingReview = null,
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [validationError, setValidationError] = useState('');

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const isEditing = Boolean(existingReview && existingReview._id);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setTitle(existingReview.title || '');
      setComment(existingReview.comment || '');
    } else {
      setRating(5);
      setTitle('');
      setComment('');
    }
    setValidationError('');
  }, [existingReview, isOpen]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return reviewsApi.updateReview(existingReview._id, payload);
      }
      return reviewsApi.createReview(payload);
    },
    onSuccess: () => {
      // Invalidate all relevant queries to keep frontend strictly synced with backend
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });

      showToast(isEditing ? 'Verdict updated successfully.' : 'Verdict published to the community.');
      onClose();
    },
    onError: (err) => {
      setValidationError(err.message || 'Failed to submit review');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!rating || rating < 1 || rating > 5) {
      setValidationError('Please select a star rating from 1 to 5');
      return;
    }
    if (!title.trim()) {
      setValidationError('Please provide a review headline');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setValidationError('Please share a few sentences of thoughtful detail (at least 5 characters)');
      return;
    }

    mutation.mutate({
      productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Your Verdict' : 'Deliver Your Verdict'}
      subtitle={`Reviewing: ${productName}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Rating star picker */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0c0e15] border border-white/5 rounded-2xl">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
            Your Overall Rating
          </span>
          <RatingStars
            rating={rating}
            size="lg"
            interactive={true}
            onChange={(val) => setRating(val)}
          />
          <span className="text-xs text-amber-400 font-semibold mt-2">
            {rating === 5 && 'Outstanding — Reference Grade'}
            {rating === 4 && 'Great — Highly Recommended'}
            {rating === 3 && 'Solid — Good with Minor Compromises'}
            {rating === 2 && 'Mediocre — Significant Flaws'}
            {rating === 1 && 'Avoid — Unacceptable'}
          </span>
        </div>

        {/* Title */}
        <Input
          label="Verdict Headline"
          required
          placeholder="e.g. Reference clarity, worth every penny"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Comment */}
        <Textarea
          label="Detailed Experience & Insights"
          required
          rows={5}
          placeholder="What stood out in daily use? Build quality, sonic dynamics, ergonomics, quirks..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {validationError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Publish Verdict'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
