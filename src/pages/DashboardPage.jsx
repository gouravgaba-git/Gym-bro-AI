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

  return (
    <div className="page-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Sleek Hero Header */}
      <header className="compact-hero-header" style={{ marginBottom: "4px" }}>
        <h1 className="compact-hero-title" style={{ fontSize: "32px" }}>
          Train Smarter
        </h1>
        <p className="compact-hero-subtitle" style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Choose your primary fitness goal.
        </p>
      </header>

      {/* User Quick Streak Stats Badge */}
      {user && (
        <div className="card" style={{ padding: "12px 16px", borderRadius: "18px", background: "rgba(15, 21, 36, 0.5)" }}>
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <div className="stat-card" style={{ padding: "6px 10px" }}>
              <div className="stat-card-top" style={{ gap: "6px" }}>
                <span className="stat-icon" style={{ width: "24px", height: "24px", fontSize: "11px", background: "rgba(255, 75, 43, 0.15)", color: "#ff4b2b" }}>🔥</span>
                <span className="stat-value" style={{ fontSize: "13px" }}>{user?.currentStreak || 0}d</span>
              </div>
              <div className="stat-card-bottom" style={{ marginTop: "2px" }}>
                <span className="stat-title" style={{ fontSize: "10px" }}>Streak</span>
              </div>
            </div>

            <div className="stat-card" style={{ padding: "6px 10px" }}>
              <div className="stat-card-top" style={{ gap: "6px" }}>
                <span className="stat-icon" style={{ width: "24px", height: "24px", fontSize: "11px", background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>🏋️</span>
                <span className="stat-value" style={{ fontSize: "13px" }}>{user?.workoutsCompleted || 0}</span>
              </div>
              <div className="stat-card-bottom" style={{ marginTop: "2px" }}>
                <span className="stat-title" style={{ fontSize: "10px" }}>Workouts</span>
              </div>
            </div>

            <div className="stat-card" style={{ padding: "6px 10px" }}>
              <div className="stat-card-top" style={{ gap: "6px" }}>
                <span className="stat-icon" style={{ width: "24px", height: "24px", fontSize: "11px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>🎯</span>
                <span className="stat-value" style={{ fontSize: "12px", textTransform: "capitalize" }}>
                  {(goal || "muscle_gain").replace("_", " ")}
                </span>
              </div>
              <div className="stat-card-bottom" style={{ marginTop: "2px" }}>
                <span className="stat-title" style={{ fontSize: "10px" }}>Target</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Goal Form & Results */}
      <main style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
