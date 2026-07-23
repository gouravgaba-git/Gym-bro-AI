import React, { useState } from "react";
import WorkoutForm from "../components/WorkoutForm";
import Spinner from "../components/Spinner";
import ResultsDashboard from "../components/ResultsDashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DashboardPage = ({ generateWorkoutPlanFallback }) => {
  const [goal, setGoal] = useState("muscle_gain");
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setWorkoutPlan(null);

    fetch(`${API_BASE_URL}/api/workout-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ goal, level, days, selectedMuscles })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server response error");
        return res.json();
      })
      .then((data) => {
        setWorkoutPlan(data);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.warn("Backend API fallback triggered. Error:", err.message);
        if (generateWorkoutPlanFallback) {
          const plan = generateWorkoutPlanFallback(goal, level, days, selectedMuscles);
          setWorkoutPlan(plan);
        }
        setIsGenerating(false);
      });
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14 pb-12">
      {/* Hero Header Section */}
      <section className="text-center space-y-4 pt-4 sm:pt-6 relative">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff416c]/10 via-[#ff4b2b]/15 to-[#3b82f6]/10 border border-[#ff4b2b]/30 shadow-lg shadow-[#ff4b2b]/5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#ff4b2b] animate-ping" />
          <span className="text-xs font-black tracking-widest text-[#ff4b2b] uppercase">
            AI HYPERTROPHY ENGINE V2.0
          </span>
        </div>

        <h1 id="app-heading-title" className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white">
          Architect Your <span className="bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#ffa07a] bg-clip-text text-transparent drop-shadow-md">Ultimate Workout Split</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Select your training targets and experience level to generate a high-yield, scientifically structured athletic routine customized for maximum recovery & gains.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <span>🎯</span> Targeted Overload
          </span>
          <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <span>🧬</span> Neural Adaptation
          </span>
          <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <span>⚡</span> Real-time AI Form Guide
          </span>
        </div>
      </section>

      {/* Main Interactive Form & Results Area */}
      <main className="space-y-12">
        <WorkoutForm
          goal={goal}
          setGoal={setGoal}
          level={level}
          setLevel={setLevel}
          days={days}
          setDays={setDays}
          selectedMuscles={selectedMuscles}
          setSelectedMuscles={setSelectedMuscles}
          onSubmit={handleGeneratePlan}
          isGenerating={isGenerating}
        />

        {isGenerating && <Spinner />}

        {!isGenerating && workoutPlan && <ResultsDashboard plan={workoutPlan} />}
      </main>
    </div>
  );
};

export default DashboardPage;
