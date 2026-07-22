import React from "react";

const ProfileHeader = ({ user }) => {
  const formattedJoinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })
    : "Recently Joined";

  return (
    <div className="card profile-header-card">
      <div className="profile-header-main">
        {/* Profile Picture from Google */}
        <div className="profile-photo-wrapper">
          <img
            src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
            alt={user?.name || "User Avatar"}
            className="profile-photo"
            onError={(e) => {
              e.target.src = "https://lh3.googleusercontent.com/a/default-user";
            }}
          />
          <span className="google-verified-badge" title="Verified via Google OAuth">
            ✓
          </span>
        </div>

        {/* User Details */}
        <div className="profile-header-details">
          <div className="profile-name-row">
            <h2 className="profile-name">{user?.name}</h2>
            <span className="account-tier-badge">PRO ATHLETE</span>
          </div>

          <div className="profile-meta-row">
            <div className="meta-item read-only-email">
              <span className="meta-icon">✉️</span>
              <span className="meta-value">{user?.email}</span>
              <span className="google-lock-tag" title="Email managed by Google">Google</span>
            </div>

            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-label">Member Since:</span>
              <span className="meta-value">{formattedJoinedDate}</span>
            </div>
          </div>

          {user?.bio && <p className="profile-bio">"{user.bio}"</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
