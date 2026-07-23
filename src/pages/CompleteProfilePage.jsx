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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#ffa07a]" />

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4b2b]/10 border border-[#ff4b2b]/25 shadow-inner">
            <span className="text-xl">💪</span>
            <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent uppercase">The Gym Bro</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Your Athletic Profile
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Welcome, <strong className="text-white">{user?.name}</strong>! Configure your metrics so our AI can customize high-yield workout splits for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Step 1: Physical Metrics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 180"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Current Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 78"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>
          </div>

          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Step 2: Training & Goal Selection</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Primary Fitness Goal</label>
              <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all">
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="strength">Raw Strength</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Workout Experience</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff4b2b] hover:to-[#ff416c] text-white font-extrabold text-base shadow-lg shadow-[#ff4b2b]/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50" disabled={loading}>
              {loading ? "Saving Profile..." : "Save & Continue to Dashboard 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
