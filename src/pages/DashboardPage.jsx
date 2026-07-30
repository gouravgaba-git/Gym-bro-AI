import React, { useState, useEffect } from "react";
import WorkoutForm from "../components/WorkoutForm";
import Spinner from "../components/Spinner";
import ResultsDashboard from "../components/ResultsDashboard";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { generateWorkoutPlan as defaultFallback } from "../utils/workoutGenerator";

const DashboardPage = ({ generateWorkoutPlanFallback = defaultFallback }) => {
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
    <div className="page-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {/* Sleek Hero Header */}
      <header className="compact-hero-header" style={{ marginBottom: "8px" }}>
        <h1 className="compact-hero-title">
          Train Smarter
        </h1>
        <p className="compact-hero-subtitle">
          Choose your primary fitness goal.
        </p>
      </header>

      {/* Interactive Goal Form & Results */}
      <main style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
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
