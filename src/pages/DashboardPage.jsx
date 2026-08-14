import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useWorkout } from "../context/WorkoutContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const { generatePlan, isGenerating } = useWorkout();
  const navigate = useNavigate();
  
  // Persist fitness goal from user profile or localStorage
  const savedGoal = user?.fitnessGoal || localStorage.getItem("user_fitness_goal") || "muscle_gain";
  const [goal, setGoal] = useState(savedGoal);
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);

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

  const handleGeneratePlan = async () => {
    try {
      await generatePlan({ goal, level, days, selectedMuscles });
      navigate("/workout-plan");
    } catch (err) {
      console.error("Plan generation error:", err);
      // In case of error, if fallback succeeded in generatePlan it will still resolve and navigate
    }
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

      {/* Interactive Goal Form */}
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
      </main>
    </div>
  );
};

export default DashboardPage;
