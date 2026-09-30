import React from 'react';
import { Link } from 'react-router-dom';
import { RatingStars } from '../ui/RatingStars';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function ProductCard({ product, index = 0 }) {
  if (!product) return null;

  const isAvailable = product.availabilityStatus === 'available';
  const isOutOfStock = product.availabilityStatus === 'out-of-stock';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group relative flex flex-col bg-[#12151e] border border-white/8 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 card-gradient"
    >
      <Link to={`/products/${product._id}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-[#0d0f16]">
        {product.coverImageName ? (
          <img
            src={product.coverImageName}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-xs">
            No image available
          </div>
        )}

        {/* Hover overlay with Quick Inspect */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 text-black text-xs font-semibold shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Read Verdict
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-white/10 font-semibold">
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md border ${
              isAvailable
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                : isOutOfStock
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/50'
            }`}
          >
            {isAvailable ? 'In Stock' : isOutOfStock ? 'Sold Out' : product.availabilityStatus}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-base font-bold font-display text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Community Verdict
            </span>
            <div className="mt-0.5">
              <RatingStars
                rating={product.averageRating || 0}
                totalReviews={product.numberOfRatings || 0}
                showScore={true}
                size="xs"
              />
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Price
            </span>
            <div className="text-base font-extrabold text-white font-mono">
              ${Number(product.price).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
