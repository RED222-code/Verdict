import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
        <Compass className="w-10 h-10" />
      </div>

      <span className="text-sm font-mono text-amber-500 font-bold tracking-widest uppercase mb-2">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white mb-4">
        No verdict here.
      </h1>

      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The hardware or page you are looking for does not exist, has moved, or was removed from the index.
      </p>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Back to Discover
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" size="md">
            Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
