import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="card" style={{ gap: "24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          className="skeleton-pulse"
          style={{ width: "90px", height: "90px", borderRadius: "50%", background: "var(--bg-surface-elevated)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <div
            className="skeleton-pulse"
            style={{ width: "40%", height: "24px", borderRadius: "8px", background: "var(--bg-surface-elevated)" }}
          />
          <div
            className="skeleton-pulse"
            style={{ width: "60%", height: "16px", borderRadius: "6px", background: "var(--bg-surface-elevated)" }}
          />
        </div>
      </div>
      <div
        className="skeleton-pulse"
        style={{ width: "100%", height: "80px", borderRadius: "12px", background: "var(--bg-surface-elevated)" }}
      />
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="card skeleton-pulse"
          style={{ height: "100px", background: "var(--bg-surface-elevated)" }}
        />
      ))}
    </div>
  );
};
