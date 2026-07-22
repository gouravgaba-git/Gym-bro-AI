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

      await updateUserProfile(numericPayload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Complete profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="logo-container" style={{ margin: "0 auto 16px" }}>
            <span className="logo-icon" role="img" aria-label="Gym Bro Logo">💪</span>
            <span className="logo-text">The Gym Bro</span>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            Complete Your Athletic Profile
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Welcome, <strong>{user?.name}</strong>! Configure your metrics so our AI can customize high-yield workout splits for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section-title">Step 1: Physical Metrics</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
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
                placeholder="e.g. 180"
                required
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
                placeholder="e.g. 78"
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="form-section-title">Step 2: Training & Goal Selection</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Primary Fitness Goal</label>
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
          </div>

          <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "16px" }} disabled={loading}>
              {loading ? "Saving Profile..." : "Save & Continue to Dashboard 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
