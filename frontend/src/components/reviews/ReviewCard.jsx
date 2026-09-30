import React from 'react';
import { RatingStars } from '../ui/RatingStars';
import { useAuth } from '../../context/AuthContext';
import { Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export function ReviewCard({ review, onEdit, onDelete }) {
  const { user, isAdmin } = useAuth();

  if (!review) return null;

  const reviewer = review.userId || {};
  const reviewerId = reviewer._id || reviewer;
  const isOwner = Boolean(user && reviewerId && user._id === reviewerId);
  const canManage = isOwner || isAdmin;

  const formattedDate = review.dateCreated
    ? new Date(review.dateCreated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="p-6 bg-[#12151e] border border-white/8 hover:border-white/15 rounded-2xl transition-all flex flex-col gap-4">
      {/* Top Header: Stars, Date, Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <RatingStars rating={review.rating} size="sm" />
          <h4 className="text-base font-bold font-display text-white mt-1">
            {review.title}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {formattedDate}
          </span>

          {canManage && (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5 ml-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  title="Edit your review"
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                  aria-label="Edit review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(review)}
                  title="Delete review"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                  aria-label="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {review.comment}
      </p>

      {/* Reviewer signature */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500/30 to-amber-400/50 flex items-center justify-center text-[10px] font-bold text-amber-200">
            {reviewer.name ? reviewer.name[0].toUpperCase() : 'U'}
          </div>
          <span className="font-medium text-slate-300">
            {reviewer.name || 'Anonymous Reviewer'}
          </span>
          {reviewer.role === 'admin' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Staff Verdict
            </span>
          )}
          {isOwner && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300">
              You
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Experience</span>
        </div>
      </div>
    </div>
  );
}
