import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
    targetWeight: user?.targetWeight || "",
    dailyCalories: user?.dailyCalories || "",
    proteinGoal: user?.proteinGoal || "",
    waterGoal: user?.waterGoal || "",
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

    // Frontend Validations
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
        targetWeight: formData.targetWeight ? Number(formData.targetWeight) : null,
        dailyCalories: formData.dailyCalories ? Number(formData.dailyCalories) : null,
        proteinGoal: formData.proteinGoal ? Number(formData.proteinGoal) : null,
        waterGoal: formData.waterGoal ? Number(formData.waterGoal) : null,
        bio: formData.bio.trim()
      };

      await updateUserProfile(numericPayload);
      onClose();
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal card edit-profile-modal">
        <div className="modal-header">
          <h2 className="modal-title">✏️ Edit Personal & Fitness Metrics</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="read-only-notice">
            <span className="notice-icon">🔒</span>
            <span>
              Google Email (<strong>{user?.email}</strong>) is read-only. You can edit your display name, avatar URL, and physical metrics below.
            </span>
          </div>

          <div className="form-section-title">Identity & Profile Picture</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Display Name *</label>
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

            <div className="form-group">
              <label className="form-label">Profile Photo URL</label>
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

          <div className="form-section-title">Personal Metrics</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 24"
                min="10"
                max="120"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 178"
                min="50"
                max="280"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 75"
                min="20"
                max="300"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-section-title">Fitness & Training Targets</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="input-field">
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="strength">Raw Strength</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Experience</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                placeholder="e.g. 80"
                min="20"
                max="300"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="input-field">
                <option value="Sedentary">Sedentary (Little to no exercise)</option>
                <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                <option value="Moderate">Moderate (3-5 days/week)</option>
                <option value="Very Active">Very Active (6-7 days/week)</option>
                <option value="Extremely Active">Extremely Active (Athletes)</option>
              </select>
            </div>
          </div>

          <div className="form-section-title">Nutrition Targets</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Daily Calories (kcal)</label>
              <input
                type="number"
                name="dailyCalories"
                value={formData.dailyCalories}
                onChange={handleChange}
                placeholder="e.g. 2500"
                min="500"
                max="10000"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Protein Goal (grams)</label>
              <input
                type="number"
                name="proteinGoal"
                value={formData.proteinGoal}
                onChange={handleChange}
                placeholder="e.g. 160"
                min="10"
                max="500"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Water Goal (Liters)</label>
              <input
                type="number"
                step="0.1"
                name="waterGoal"
                value={formData.waterGoal}
                onChange={handleChange}
                placeholder="e.g. 3.5"
                min="0.5"
                max="20"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Bio / Notes</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the bro community about your goals..."
              rows="3"
              className="input-field textarea-field"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
