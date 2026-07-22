import React from "react";

const PersonalInformation = ({ user, onEdit }) => {
  return (
    <div className="card info-card">
      <div className="info-card-header">
        <h3 className="section-title">
          <span className="section-icon">👤</span> Personal Information
        </h3>
        <button className="edit-section-btn" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Age</span>
          <span className="info-value">{user?.age ? `${user.age} yrs` : "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Gender</span>
          <span className="info-value">{user?.gender || "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Height</span>
          <span className="info-value">{user?.height ? `${user.height} cm` : "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Weight</span>
          <span className="info-value">{user?.weight ? `${user.weight} kg` : "Not specified"}</span>
        </div>

        <div className="info-item full-width">
          <span className="info-label">Bio / Notes</span>
          <span className="info-value bio-text">{user?.bio || "No bio added yet."}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
