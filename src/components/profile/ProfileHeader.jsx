import React from "react";
import { User, Mail, Calendar, ShieldCheck, Edit3, Flame, Dumbbell, Target } from "lucide-react";

const ProfileHeader = ({ user, onEdit }) => {
  const formattedJoinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      })
    : "Member";

  const goalText = (user?.fitnessGoal || "muscle_gain").replace("_", " ");

  return (
    <div className="card profile-hero-card">
      {/* Left side: Avatar + Identity */}
      <div className="hero-identity-section">
        <div className="hero-avatar-wrapper">
          <img
            src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
            alt={user?.name || "User Avatar"}
            className="hero-avatar-img"
            onError={(e) => {
              e.target.src = "https://lh3.googleusercontent.com/a/default-user";
            }}
          />
          <span className="hero-verified-badge" title="Verified Google Account">
            <ShieldCheck size={14} />
          </span>
        </div>

        <div className="hero-user-info">
          <div className="hero-name-row">
            <h1 className="hero-user-name">{user?.name || "Athlete Bro"}</h1>
            <span className="hero-tier-pill">PRO ATHLETE</span>
          </div>

          <div className="hero-meta-list">
            <div className="hero-meta-item">
              <Mail size={14} className="meta-icon-muted" />
              <span className="hero-email-text">{user?.email}</span>
            </div>
            <div className="hero-meta-divider">•</div>
            <div className="hero-meta-item">
              <Calendar size={14} className="meta-icon-muted" />
              <span>Joined {formattedJoinedDate}</span>
            </div>
          </div>

          {user?.bio && <p className="hero-bio-quote">"{user.bio}"</p>}

          {onEdit && (
            <button className="hero-edit-btn" onClick={onEdit}>
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Right side: Compact Quick Stats Snapshot */}
      <div className="hero-quick-stats">
        <div className="quick-stat-box">
          <div className="qs-icon-wrapper text-orange">
            <Flame size={18} />
          </div>
          <div className="qs-content">
            <span className="qs-val">{user?.currentStreak || 0} Days</span>
            <span className="qs-lbl">Streak</span>
          </div>
        </div>

        <div className="quick-stat-box">
          <div className="qs-icon-wrapper text-blue">
            <Dumbbell size={18} />
          </div>
          <div className="qs-content">
            <span className="qs-val">{user?.workoutsCompleted || 0}</span>
            <span className="qs-lbl">Workouts</span>
          </div>
        </div>

        <div className="quick-stat-box">
          <div className="qs-icon-wrapper text-emerald">
            <Target size={18} />
          </div>
          <div className="qs-content">
            <span className="qs-val capitalize">{goalText}</span>
            <span className="qs-lbl">Current Goal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
