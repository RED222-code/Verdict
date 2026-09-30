import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { reviewsApi } from '../api/reviews';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Layers,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DiscoverPage() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // Queries
  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ['products', 'top-rated'],
    queryFn: () => productsApi.getTopRated(6),
  });

  const { data: availableProducts, isLoading: loadingAvailable } = useQuery({
    queryKey: ['products', 'available'],
    queryFn: () => productsApi.getAvailable(6),
  });

  const { data: categoryStats } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: productsApi.getCategoryStats,
  });

  const { data: productStats } = useQuery({
    queryKey: ['productStats'],
    queryFn: productsApi.getProductStats,
  });

  const { data: reviewStats } = useQuery({
    queryKey: ['reviewStats'],
    queryFn: reviewsApi.getReviewStats,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const totalReviewsCount = reviewStats?.summary?.reviewCount || productStats?.totalRatings || 0;
  const avgRatingScore = reviewStats?.summary?.averageRating || productStats?.averageRating || 0;

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full hero-radial">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Unfiltered Hardware Truth
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08] mb-6"
          >
            DON'T BUY BLIND.
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              See what people actually think.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            A high-performance catalog for design, audio, displays, and compute.
            Read verified community verdicts before spending hard-earned capital.
          </motion.p>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="w-full max-w-xl flex items-center bg-[#12151e] border border-white/15 focus-within:border-amber-500/70 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-2xl p-2 shadow-2xl transition-all"
          >
            <div className="pl-4 text-slate-500">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              placeholder="Search headphones, curved OLEDs, cameras, mechanical keyboards..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </motion.form>

          {/* Platform Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/5 w-full max-w-3xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {productStats?.productCount || '12+'}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 mt-1">
                Products Indexed
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {totalReviewsCount || '10+'}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 mt-1">
                Verified Reviews
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {avgRatingScore ? Number(avgRatingScore).toFixed(1) : '4.7'}★
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 mt-1">
                Average Score
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                100%
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 mt-1">
                Authentic Data
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOP RATED HARDWARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              Editorial Spotlight
            </div>
            <h2 className="text-3xl font-bold font-display text-white">
              Top Rated Hardware
            </h2>
          </div>

          <Link to="/products?sort=-averageRating,-numberOfRatings">
            <Button variant="outline" size="sm">
              <span>View All Rated</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={topRated}
          isLoading={loadingTopRated}
        />
      </section>

      {/* CATEGORIES SHOWCASE */}
      {categoryStats && categoryStats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <Layers className="w-4 h-4" />
              Taxonomy
            </div>
            <h2 className="text-3xl font-bold font-display text-white">
              Explore by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryStats.map((cat, idx) => (
              <Link
                key={cat.category}
                to={`/products?category=${encodeURIComponent(cat.category)}`}
                className="group relative p-6 bg-[#12151e] border border-white/8 hover:border-amber-500/40 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 card-gradient flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Collection {idx + 1}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-2 group-hover:text-amber-400 transition-colors">
                    {cat.category}
                  </h3>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    <strong className="text-white font-mono">{cat.productCount}</strong> {cat.productCount === 1 ? 'Product' : 'Products'}
                  </span>
                  <span className="text-amber-400 font-mono flex items-center gap-1">
                    Avg {Number(cat.averageRating || 0).toFixed(1)}★
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY ADDED & AVAILABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              Ready to Ship
            </div>
            <h2 className="text-3xl font-bold font-display text-white">
              In Stock & Verified
            </h2>
          </div>

          <Link to="/products?availabilityStatus=available">
            <Button variant="outline" size="sm">
              <span>Browse In Stock</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={availableProducts}
          isLoading={loadingAvailable}
        />
      </section>

      {/* COMMUNITY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181d2a] via-[#12151e] to-[#0d0f17] border border-amber-500/20 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Community Driven Platform
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Own extraordinary hardware? Share your verdict.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Help engineers, creators, and audiophiles cut through sponsored marketing hype with firsthand experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                Create Free Account
              </Button>
            </Link>
            <Link to="/products" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                Explore Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
