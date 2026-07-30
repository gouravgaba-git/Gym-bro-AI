import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, User, Ruler, Award, Lock } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, showToast } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    profilePhoto: user?.profilePhoto || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    activityLevel: user?.activityLevel || "Moderate",
    experienceLevel: user?.experienceLevel || "beginner",
    fitnessGoal: user?.fitnessGoal || "muscle_gain",
    bio: user?.bio || ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === "") {
      showToast("Name cannot be empty.", "error");
      return;
    }

    if (formData.age && (Number(formData.age) < 10 || Number(formData.age) > 120)) {
      showToast("Age must be between 10 and 120 years.", "error");
      return;
    }

    if (formData.height && (Number(formData.height) < 50 || Number(formData.height) > 280)) {
      showToast("Height must be between 50 cm and 280 cm.", "error");
      return;
    }

    if (formData.weight && (Number(formData.weight) < 20 || Number(formData.weight) > 300)) {
      showToast("Weight must be between 20 kg and 300 kg.", "error");
      return;
    }

    try {
      setLoading(true);

      const numericPayload = {
        name: formData.name.trim(),
        profilePhoto: formData.profilePhoto.trim(),
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        fitnessGoal: formData.fitnessGoal,
        experienceLevel: formData.experienceLevel,
        activityLevel: formData.activityLevel,
        bio: formData.bio.trim()
      };

      if (formData.fitnessGoal) {
        localStorage.setItem("user_fitness_goal", formData.fitnessGoal);
      }

      await updateUserProfile(numericPayload);
      onClose();
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal card edit-profile-modal-saas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-saas">
          <div className="modal-header-title-group">
            <User size={20} className="text-orange" />
            <h2 className="modal-title-text">Edit Personal & Training Profile</h2>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="read-only-notice-box">
            <Lock size={15} className="notice-lock-icon" />
            <span>
              Account email (<strong>{user?.email}</strong>) is managed via Google OAuth. You can edit your avatar, personal metrics, and exercise preferences below.
            </span>
          </div>

          <div className="form-group-section">
            <div className="form-section-header">Identity & Avatar</div>
            <div className="form-grid-2col">
              <div className="form-field-item">
                <label className="field-label-text">Display Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="input-field"
                />
              </div>

              <div className="form-field-item">
                <label className="field-label-text">Profile Photo URL</label>
                <input
                  type="url"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="form-group-section">
            <div className="form-section-header">Personal Metrics</div>
            <div className="form-grid-2col">
              <div className="form-field-item">
                <label className="field-label-text">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  min="10"
                  max="120"
                  className="input-field"
                />
              </div>

              <div className="form-field-item">
                <label className="field-label-text">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-field-item">
                <label className="field-label-text">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 176"
                  min="50"
                  max="280"
                  className="input-field"
                />
              </div>

              <div className="form-field-item">
                <label className="field-label-text">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 56"
                  min="20"
                  max="300"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="form-group-section">
            <div className="form-section-header">Exercise & Training Preferences</div>
            <div className="form-grid-2col">
              <div className="form-field-item">
                <label className="field-label-text">Primary Fitness Goal</label>
                <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="input-field">
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="strength">Raw Strength</option>
                </select>
              </div>

              <div className="form-field-item">
                <label className="field-label-text">Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="input-field">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-field-item full-span">
                <label className="field-label-text">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input-field">
                  <option value="Sedentary">Sedentary (Little to no exercise)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                  <option value="Moderate">Moderate (3-5 days/week)</option>
                  <option value="Very Active">Very Active (6-7 days/week)</option>
                  <option value="Extremely Active">Extremely Active (Athletes)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-field-item full-span">
            <label className="field-label-text">Bio / Notes</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the community about your fitness goals..."
              rows="3"
              className="input-field textarea-field"
            />
          </div>

          <div className="modal-footer-actions-saas">
            <button type="button" className="btn-cancel-saas" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save-saas" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
