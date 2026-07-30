import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CompleteProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: user?.age || "",
    gender: user?.gender || "Male",
    height: user?.height || "",
    weight: user?.weight || "",
    fitnessGoal: user?.fitnessGoal || "muscle_gain",
    experienceLevel: user?.experienceLevel || "beginner",
    activityLevel: user?.activityLevel || "Moderate",
    targetWeight: user?.targetWeight || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const numericPayload = {
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        targetWeight: formData.targetWeight ? Number(formData.targetWeight) : null
      };

      if (formData.fitnessGoal) {
        localStorage.setItem("user_fitness_goal", formData.fitnessGoal);
      }
      await updateUserProfile(numericPayload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Complete profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-wrapper">
      <div className="profile-setup-card">
        {/* Header */}
        <div className="profile-setup-header">
          <div className="logo-container">
            <span className="logo-icon" role="img" aria-label="Gym Bro Logo">💪</span>
            <span className="logo-text">The Gym Bro</span>
          </div>
          <h1 className="profile-setup-title">Complete Your Profile</h1>
          <p className="profile-setup-subtitle">
            Help us personalize your AI workout plans, {user?.name || "Athlete"}.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="profile-setup-form">
          {/* Step 1: Physical Metrics */}
          <div>
            <div className="profile-section-heading">Step 1: Physical Metrics</div>
            <div className="profile-grid-two-col">
              <div className="input-field-group">
                <label className="input-field-label" htmlFor="age">Age (years)</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  required
                  className="profile-setup-input"
                />
              </div>

              <div className="input-field-group">
                <label className="input-field-label" htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="profile-setup-select"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="input-field-group">
                <label className="input-field-label" htmlFor="height">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 180"
                  required
                  className="profile-setup-input"
                />
              </div>

              <div className="input-field-group">
                <label className="input-field-label" htmlFor="weight">Current Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 78"
                  required
                  className="profile-setup-input"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Training & Goal Selection */}
          <div>
            <div className="profile-section-heading">Step 2: Training & Goal Selection</div>
            <div className="profile-grid-two-col">
              <div className="input-field-group">
                <label className="input-field-label" htmlFor="fitnessGoal">Primary Fitness Goal</label>
                <select
                  id="fitnessGoal"
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="profile-setup-select"
                >
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="strength">Raw Strength</option>
                </select>
              </div>

              <div className="input-field-group">
                <label className="input-field-label" htmlFor="experienceLevel">Workout Experience</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="profile-setup-select"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="profile-submit-btn"
            disabled={loading}
          >
            <span>{loading ? "Saving Profile..." : "Save & Continue →"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
