import React from 'react';

export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-[#12151e] border border-white/5 rounded-2xl overflow-hidden animate-pulse flex flex-col"
        >
          {/* Image placeholder */}
          <div className="w-full aspect-[4/3] bg-white/5" />

          {/* Body */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-3 w-12 bg-white/5 rounded" />
            </div>

            <div className="h-5 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-2/3 bg-white/5 rounded" />

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="h-5 w-20 bg-white/10 rounded" />
              <div className="h-4 w-14 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonDetail() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
      <div className="lg:col-span-7 aspect-[4/3] bg-white/5 rounded-3xl border border-white/10" />
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="h-4 w-24 bg-white/10 rounded" />
        <div className="h-10 w-3/4 bg-white/10 rounded" />
        <div className="h-6 w-32 bg-white/5 rounded" />
        <div className="h-8 w-28 bg-white/10 rounded" />
        <div className="h-24 w-full bg-white/5 rounded-xl" />
        <div className="h-12 w-full bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
