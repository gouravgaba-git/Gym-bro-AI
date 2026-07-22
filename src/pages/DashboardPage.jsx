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
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <header>
        <h1 id="app-heading-title">Create Your Ultimate Workout Split</h1>
        <p className="hero-subtitle">
          Enter your metrics below to instantly outline a high-yield athletic routine customized around your capacity.
        </p>
      </header>

      <main>
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
