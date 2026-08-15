import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ArrowRight, Loader2 } from "lucide-react";
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
    targetWeight: user?.targetWeight || "",
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
        targetWeight: formData.targetWeight ? Number(formData.targetWeight) : null,
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-in fade-in duration-200">
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl text-foreground">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background shadow-sm mb-3">
            <Dumbbell className="size-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Complete Your Profile
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Help us personalize your AI workout plans, {user?.name || "Athlete"}.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Step 1: Physical Metrics
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 180"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 78"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Step 2: Training & Goal Selection
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Primary Goal</label>
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

              <div className="flex flex-col gap-1">
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
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Save & Continue to Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
