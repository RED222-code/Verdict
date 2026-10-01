import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content from the server.',
  onRetry,
  className = '',
}) {
  return (
    <div role="alert" className={`flex flex-col items-center justify-center text-center p-12 bg-rose-500/5 border border-rose-500/20 rounded-3xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold font-display text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
