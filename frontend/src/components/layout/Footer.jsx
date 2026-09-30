import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, MessageSquareQuote } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080c] mt-24 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg shadow-md shadow-amber-500/20">
                V
              </div>
              <span className="text-xl font-bold font-display text-white tracking-wider">
                VERDICT
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Don't buy blind. See what people actually think. Verified community ratings and editorial reviews on the finest technology and hardware.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Authors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                <span>Direct Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Live Aggregations</span>
              </div>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?availabilityStatus=available" className="hover:text-amber-400 transition-colors">
                  In Stock Now
                </Link>
              </li>
              <li>
                <Link to="/products?sort=-averageRating" className="hover:text-amber-400 transition-colors">
                  Top Rated Hardware
                </Link>
              </li>
              <li>
                <Link to="/products?sort=price" className="hover:text-amber-400 transition-colors">
                  Entry Tier Selections
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-amber-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-amber-400 transition-colors">
                  Submit a Verdict
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VERDICT. All rights reserved. Precision reviews for modern creators.</p>
          <p className="font-mono text-slate-400">REST API / JWT / Mongoose / React 19</p>
        </div>
      </div>
    </footer>
  );
}
