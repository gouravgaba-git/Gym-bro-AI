import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { generateWorkoutPlan as defaultFallback } from "../utils/workoutGenerator";

const WorkoutContext = createContext(null);

const STORAGE_KEY = "gym_bro_workout_plan";

export const WorkoutProvider = ({ children, fallbackGenerator = defaultFallback }) => {
  const [workoutPlan, setWorkoutPlanState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("Failed to load workout plan from localStorage:", e);
      return null;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const setWorkoutPlan = (plan) => {
    setWorkoutPlanState(plan);
    try {
      if (plan) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to persist workout plan to localStorage:", e);
    }
  };

  const generatePlan = async ({ goal, level, days, selectedMuscles }) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/workout-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ goal, level, days, selectedMuscles })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setWorkoutPlan(data);
      setIsGenerating(false);
      return data;
    } catch (err) {
      console.warn("Backend API call failed, falling back to local generator. Error:", err.message);
      if (fallbackGenerator) {
        const localPlan = fallbackGenerator(goal, level, days, selectedMuscles);
        setWorkoutPlan(localPlan);
        setIsGenerating(false);
        return localPlan;
      }
      setError(err.message);
      setIsGenerating(false);
      throw err;
    }
  };

  const clearWorkoutPlan = () => {
    setWorkoutPlan(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        workoutPlan,
        setWorkoutPlan,
        isGenerating,
        error,
        generatePlan,
        clearWorkoutPlan
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

export default WorkoutContext;
