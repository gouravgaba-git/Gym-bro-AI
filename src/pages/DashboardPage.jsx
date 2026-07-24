import React, { useState, useEffect } from "react";
import WorkoutForm from "../components/WorkoutForm";
import Spinner from "../components/Spinner";
import ResultsDashboard from "../components/ResultsDashboard";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const DashboardPage = ({ generateWorkoutPlanFallback }) => {
  const { user } = useAuth();
  
  // Persist fitness goal from user profile or localStorage
  const savedGoal = user?.fitnessGoal || localStorage.getItem("user_fitness_goal") || "muscle_gain";
  const [goal, setGoal] = useState(savedGoal);
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  // Sync goal state when user profile updates
  useEffect(() => {
    if (user?.fitnessGoal) {
      setGoal(user.fitnessGoal);
      localStorage.setItem("user_fitness_goal", user.fitnessGoal);
    }
  }, [user?.fitnessGoal]);

  const handleGoalChange = (newGoal) => {
    setGoal(newGoal);
    localStorage.setItem("user_fitness_goal", newGoal);
  };

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

  const athleteName = user?.name ? user.name.split(" ")[0] : "Athlete";

  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-12">
      {/* Top Greeting & Fitness Stats Hero Bar */}
      <section className="bg-[#141c27] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bbf246]/10 border border-[#bbf246]/30">
              <span className="w-2 h-2 rounded-full bg-[#bbf246] animate-pulse" />
              <span className="text-xs font-bold text-[#bbf246] uppercase tracking-wider">
                Fitness Dashboard
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hello, <span className="text-[#bbf246]">{athleteName}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Generate tailored workout routines based on your saved fitness profile & primary goal.
            </p>
          </div>

          {/* Activity Quick Stats Widgets */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-[#0b1017] border border-white/10 p-3 sm:p-4 rounded-2xl text-center space-y-1">
              <div className="text-base sm:text-xl">🔥</div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {user?.currentStreak || 0} Days
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Streak</div>
            </div>

            <div className="bg-[#0b1017] border border-white/10 p-3 sm:p-4 rounded-2xl text-center space-y-1">
              <div className="text-base sm:text-xl">⚡</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#bbf246]">
                450 kcal
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Est. Burn</div>
            </div>

            <div className="bg-[#0b1017] border border-white/10 p-3 sm:p-4 rounded-2xl text-center space-y-1">
              <div className="text-base sm:text-xl">🎯</div>
              <div className="text-xs sm:text-sm font-extrabold text-cyan-400">
                {user?.workoutsCompleted || 0} Done
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sessions</div>
            </div>
          </div>
        </div>

        {/* Quick Challenge Tags Bar */}
        <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Quick Challenges:
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-[#bbf246] transition-colors cursor-pointer">
              🏆 Push-Up Challenge
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-[#bbf246] transition-colors cursor-pointer">
              ⚡ Squat Overload
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-200 hover:border-[#bbf246] transition-colors cursor-pointer">
              ⏱️ 60s Plank Hold
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Form & Results Area */}
      <main className="space-y-10">
        <WorkoutForm
          goal={goal}
          setGoal={handleGoalChange}
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
