import React from 'react';
import { Star } from 'lucide-react';

export function RatingDistribution({ distribution = [], totalReviews = 0, averageRating = 0 }) {
  // Aggregate count by rating (1 to 5)
  const countsByRating = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (Array.isArray(distribution)) {
    distribution.forEach((item) => {
      const star = Math.round(item.rating);
      if (countsByRating[star] !== undefined) {
        countsByRating[star] = (countsByRating[star] || 0) + item.count;
      }
    });
  }

  const calculatedTotal = totalReviews || Object.values(countsByRating).reduce((acc, c) => acc + c, 0);

  return (
    <div className="bg-[#12151e] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 font-mono">
            Community Verdict
          </span>
          <h3 className="text-xl font-bold font-display text-white mt-1">
            Overall Rating Breakdown
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-4xl font-extrabold text-white tracking-tight font-display">
            {calculatedTotal > 0 ? Number(averageRating).toFixed(1) : '—'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(averageRating) ? 'fill-amber-400' : 'fill-white/10 text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 mt-0.5">
              {calculatedTotal} {calculatedTotal === 1 ? 'review' : 'verified reviews'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = countsByRating[star] || 0;
          const percentage = calculatedTotal > 0 ? Math.round((count / calculatedTotal) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-10 font-semibold text-slate-400 flex items-center justify-end gap-1">
                {star} <Star className="w-3 h-3 fill-amber-400/80 text-amber-400/80" />
              </span>

              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="w-16 flex items-center justify-between text-slate-500">
                <span className="w-9 text-right font-medium text-slate-300">{percentage}%</span>
                <span className="text-[10px] text-slate-600">({count})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
