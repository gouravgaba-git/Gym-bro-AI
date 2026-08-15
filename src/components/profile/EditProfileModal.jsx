import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, User, Loader2, Save } from "lucide-react";

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, showToast } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    profilePhoto: user?.profilePhoto || "",
    age: user?.age || "",
    gender: user?.gender || "Male",
    height: user?.height || "",
    weight: user?.weight || "",
    targetWeight: user?.targetWeight || "",
    activityLevel: user?.activityLevel || "Moderate",
    experienceLevel: user?.experienceLevel || "beginner",
    fitnessGoal: user?.fitnessGoal || "muscle_gain",
    bio: user?.bio || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        targetWeight: formData.targetWeight ? Number(formData.targetWeight) : null,
        fitnessGoal: formData.fitnessGoal,
        experienceLevel: formData.experienceLevel,
        activityLevel: formData.activityLevel,
        bio: formData.bio.trim(),
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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-8 flex w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-2xl text-foreground max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="size-4.5 text-foreground" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Edit Athlete Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer border-0 bg-transparent"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Profile Photo URL</label>
              <input
                type="url"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Age (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 178"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 75"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
              >
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="strength">Raw Strength</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Athlete Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your athletic goals or personal PR records..."
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-background hover:opacity-90 cursor-pointer disabled:opacity-50 border-0 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
