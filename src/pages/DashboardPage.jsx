import React, { useState } from "react";
import WorkoutForm from "../components/WorkoutForm";
import Spinner from "../components/Spinner";
import ResultsDashboard from "../components/ResultsDashboard";
import { API_BASE_URL } from "../config/api";

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
    <div className="flex flex-col gap-8 sm:gap-12 pb-12">
      {/* Hero Header Section */}
      <section className="text-center space-y-3 pt-4 sm:pt-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
            Custom Training System
          </span>
        </div>

        <h1 id="app-heading-title" className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Build Your Personal <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-red-500 bg-clip-text text-transparent">Workout Split</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto font-normal leading-relaxed px-2">
          Select your training targets and experience level to generate a balanced athletic routine tailored to your goals.
        </p>

        {/* Minimal Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="px-3 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
            <span className="text-blue-400">🎯</span> Custom Splits
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
            <span className="text-red-400">⚡</span> Balanced Recovery
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
            <span className="text-blue-400">📹</span> Form Guidance
          </span>
        </div>
      </section>

      {/* Main Interactive Form & Results Area */}
      <main className="space-y-10">
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
