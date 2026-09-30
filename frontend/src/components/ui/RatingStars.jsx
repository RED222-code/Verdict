import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function RatingStars({
  rating = 0,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  showScore = false,
  totalReviews,
  className = '',
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const currentVal = interactive ? (hoverRating || rating) : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      >
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = currentVal >= starNumber;
          const isHalf = !isFilled && currentVal > index && currentVal < starNumber;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange && onChange(starNumber)}
                onMouseEnter={() => setHoverRating(starNumber)}
                className="p-1 focus:outline-none focus-visible:scale-125 transition-transform cursor-pointer"
                aria-label={`Rate ${starNumber} out of ${max} stars`}
              >
                <Star
                  className={`${starSizes[size]} transition-colors duration-150 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'fill-transparent text-slate-600 hover:text-amber-400/70'
                  }`}
                />
              </button>
            );
          }

          return (
            <div key={index} className="relative">
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-transparent text-amber-400'
                    : 'fill-white/5 text-white/20'
                }`}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={`${starSizes[size]} fill-amber-400 text-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-amber-400 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500 ml-0.5">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
