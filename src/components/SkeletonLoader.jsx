import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs flex flex-col gap-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-secondary shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-1/3 h-5 rounded-md bg-secondary" />
          <div className="w-1/2 h-3.5 rounded-md bg-secondary/70" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-20 rounded-xl bg-secondary/50" />
        ))}
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="h-20 rounded-xl border border-border bg-card animate-pulse shadow-xs"
        />
      ))}
    </div>
  );
};

export default ProfileSkeleton;
