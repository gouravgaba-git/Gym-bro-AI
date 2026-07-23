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
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0f1524] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">✏️ Edit Personal & Fitness Metrics</h2>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 flex items-center justify-center text-sm text-gray-400 transition-all cursor-pointer" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
            <span className="text-base shrink-0">🔒</span>
            <span>
              Google Email (<strong>{user?.email}</strong>) is read-only. You can edit your display name, avatar URL, and physical metrics below.
            </span>
          </div>

          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Identity & Profile Picture</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Display Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Profile Photo URL</label>
              <input
                type="url"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>
          </div>

          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Personal Metrics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 24"
                min="10"
                max="120"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all">
                <option value="">Select Gender</option>
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
                placeholder="e.g. 178"
                min="50"
                max="280"
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
                placeholder="e.g. 75"
                min="20"
                max="300"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>
          </div>

          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Fitness & Training Targets</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Fitness Goal</label>
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

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                placeholder="e.g. 80"
                min="20"
                max="300"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Activity Level</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all">
                <option value="Sedentary">Sedentary (Little to no exercise)</option>
                <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                <option value="Moderate">Moderate (3-5 days/week)</option>
                <option value="Very Active">Very Active (6-7 days/week)</option>
                <option value="Extremely Active">Extremely Active (Athletes)</option>
              </select>
            </div>
          </div>

          <div className="text-sm font-bold text-[#ff4b2b] uppercase tracking-wider border-b border-white/10 pb-2">Nutrition Targets</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Daily Calories (kcal)</label>
              <input
                type="number"
                name="dailyCalories"
                value={formData.dailyCalories}
                onChange={handleChange}
                placeholder="e.g. 2500"
                min="500"
                max="10000"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Daily Protein Goal (grams)</label>
              <input
                type="number"
                name="proteinGoal"
                value={formData.proteinGoal}
                onChange={handleChange}
                placeholder="e.g. 160"
                min="10"
                max="500"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Daily Water Goal (Liters)</label>
              <input
                type="number"
                step="0.1"
                name="waterGoal"
                value={formData.waterGoal}
                onChange={handleChange}
                placeholder="e.g. 3.5"
                min="0.5"
                max="20"
                className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Bio / Notes</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the bro community about your goals..."
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-[#161f33] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff4b2b] focus:ring-1 focus:ring-[#ff4b2b] transition-all resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-sm transition-all cursor-pointer" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff4b2b] hover:to-[#ff416c] text-white font-bold text-sm shadow-md shadow-[#ff4b2b]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
