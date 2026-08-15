import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import WorkoutForm from "../components/WorkoutForm";
import { useAuth } from "../context/AuthContext";
import { useWorkout } from "../context/WorkoutContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const { generatePlan, isGenerating } = useWorkout();
  const navigate = useNavigate();

  // Persist fitness goal from user profile or localStorage
  const savedGoal =
    user?.fitnessGoal || localStorage.getItem("user_fitness_goal") || "muscle_gain";
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
      // Navigation happens even if fallback generator fulfilled the request
      navigate("/workout-plan");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-in fade-in duration-200">
      <PageHeader
        title="Train Smarter"
        description="Choose your primary fitness goal and experience level, then generate a split built for you."
      />

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
    </div>
  );
};

export default DashboardPage;
