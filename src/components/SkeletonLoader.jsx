import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-white/5 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2.5 flex-1">
          <div className="w-2/5 h-6 rounded-lg bg-white/5 animate-pulse" />
          <div className="w-3/5 h-4 rounded-md bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="w-full h-20 rounded-2xl bg-white/5 animate-pulse" />
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="h-24 bg-[#0f1524]/90 border border-white/10 rounded-2xl animate-pulse shadow-xl"
        />
      ))}
    </div>
  );
};
