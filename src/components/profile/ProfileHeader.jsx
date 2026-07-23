import React from "react";

const ProfileHeader = ({ user }) => {
  const formattedJoinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })
    : "Recently Joined";

  return (
    <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Picture from Google */}
        <div className="relative shrink-0">
          <img
            src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
            alt={user?.name || "User Avatar"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#ff4b2b]/40 shadow-xl"
            onError={(e) => {
              e.target.src = "https://lh3.googleusercontent.com/a/default-user";
            }}
          />
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#0f1524]" title="Verified via Google OAuth">
            ✓
          </span>
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h2>
            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white shadow-sm uppercase">PRO ATHLETE</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span>✉️</span>
              <span className="text-gray-200 truncate">{user?.email}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30" title="Email managed by Google">Google</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <span>📅</span>
              <span className="text-gray-400">Member Since:</span>
              <span className="text-gray-200 font-medium">{formattedJoinedDate}</span>
            </div>
          </div>

          {user?.bio && <p className="text-sm italic text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">"{user.bio}"</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
