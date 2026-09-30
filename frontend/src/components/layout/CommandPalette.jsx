import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/products';
import { Search, X, Star, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Close on Escape or shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Query products matching search or top products
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['products-search', query],
    queryFn: async () => {
      if (!query.trim()) {
        return productsApi.getTopRated(5);
      }
      return productsApi.getProducts({
        'name[regex]': query.trim(),
        'name[options]': 'i',
        limit: 8,
      });
    },
    enabled: isOpen,
    staleTime: 1000 * 30,
  });

  const handleSelect = (productId) => {
    navigate(`/products/${productId}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-[#12151e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#0e1118]">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by product name, category, brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-base font-medium"
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {query.trim() ? 'Matching Verdicts' : 'Trending Hardware'}
            </div>

            {searchResults && searchResults.length > 0 ? (
              searchResults.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleSelect(product._id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {product.coverImageName ? (
                        <img
                          src={product.coverImageName}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">No Img</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-amber-500 font-medium">{product.category}</span>
                        <span>•</span>
                        <span>${product.price}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {Number(product.averageRating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </button>
              ))
            ) : !isLoading ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No products found matching "{query}".
              </div>
            ) : null}
          </div>

          <div className="px-5 py-3 border-t border-white/5 bg-[#0b0d13] flex items-center justify-between text-xs text-slate-400">
            <span>Press <kbd className="font-mono bg-white/10 px-1 rounded">↵</kbd> to select</span>
            <button
              type="button"
              onClick={() => {
                navigate(`/products?search=${encodeURIComponent(query)}`);
                onClose();
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              View all results in catalog →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
