import React, { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import Spinner from './components/Spinner';
import ResultsDashboard from './components/ResultsDashboard';

/**
 * Custom function to generate workout splits on the fly.
 * Mirrors a real backend's dynamic split generation.
 */
const generateWorkoutPlan = (goal, level, days, selectedMuscles) => {
  const goalLabels = {
    muscle_gain: "Muscle Gain",
    fat_loss: "Fat Loss",
    strength: "Strength"
  };

  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };

  // Static database mapping Muscle Group -> Goal -> Exercises
  const exerciseDb = {
    Chest: {
      muscle_gain: [
        { name: "Pec dec", target: "Chest", setsReps: "4 sets x 10-15 reps", videoUrl: "#" },
        { name: "Flat Barbell Bench Press", target: "Chest", setsReps: "3 sets x 10 reps", videoUrl: "#" },
        { name: "Cable Chest Fly", target: "Chest", setsReps: "3 sets x 12-15 reps", videoUrl: "#" },
        { name: "Incline Barbell Bench Press", target: "Chest", setsReps: "3 sets x 12-15 reps", videoUrl: "#" }

      ],
      fat_loss: [
        { name: "Dumbbell Bench Press", target: "Chest", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Push-ups (to Failure)", target: "Chest", setsReps: "3 sets x max reps", videoUrl: "#" },
        { name: "Incline Cable Press-Fly", target: "Chest", setsReps: "3 sets x 12-15 reps", videoUrl: "#" },
        { name: "Pec Dec", target: "Chest", setsReps: "3 sets x 12-15 reps", videoUrl: "#" }
      ],
      strength: [
        { name: "Barbell Bench Press", target: "Chest", setsReps: "5 sets x 5 reps (Heavy)", videoUrl: "#" },
        { name: "Incline Barbell Bench Press", target: "Chest", setsReps: "4 sets x 6 reps", videoUrl: "#" },
        { name: "Weighted Chest Dips", target: "Chest", setsReps: "3 sets x 6-8 reps", videoUrl: "#" },
        { name: "Pec Dec", target: "Chest", setsReps: "3 sets x 12-15 reps", videoUrl: "#" }
      ]
    },
    Back: {
      muscle_gain: [
        { name: "Lat Pulldown (Wide Grip)", target: "Back", setsReps: "4 sets x 10 reps", videoUrl: "#" },
        { name: "Seated Cable Row", target: "Back", setsReps: "3 sets x 10-12 reps", videoUrl: "#" },
        { name: "Single-Arm Dumbbell Row", target: "Back", setsReps: "3 sets x 12 reps", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Lat Pulldown", target: "Back", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Assisted Pull-ups", target: "Back", setsReps: "3 sets x 12 reps", videoUrl: "#" },
        { name: "Seated Cable Row", target: "Back", setsReps: "3 sets x 15 reps (each arm)", videoUrl: "#" }
      ],
      strength: [
        { name: "Conventional Deadlift", target: "Back", setsReps: "5 sets x 3 reps (Heavy)", videoUrl: "#" },
        { name: "Weighted Pull-ups", target: "Back", setsReps: "4 sets x 5 reps", videoUrl: "#" },
        { name: "Barbell Pendlay Row", target: "Back", setsReps: "4 sets x 6 reps", videoUrl: "#" }
      ]
    },
    Shoulders: {
      muscle_gain: [
        { name: "Seated Dumbbell Shoulder Press", target: "Shoulders", setsReps: "4 sets x 8-10 reps", videoUrl: "#" },
        { name: "Standing Dumbbell Lateral Raise", target: "Shoulders", setsReps: "4 sets x 12-15 reps", videoUrl: "#" },
        { name: "Dumbbell Rear Delt Fly", target: "Shoulders", setsReps: "3 sets x 15 reps", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Dumbbell Arnold Press", target: "Shoulders", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Standing Dumbbell Lateral Raise", target: "Shoulders", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Face Pulls", target: "Shoulders", setsReps: "3 sets x 20 reps", videoUrl: "#" }
      ],
      strength: [
        { name: "Standing Military Press", target: "Shoulders", setsReps: "5 sets x 5 reps", videoUrl: "#" },
        { name: "Push Press", target: "Shoulders", setsReps: "4 sets x 5 reps", videoUrl: "#" },
        { name: "Heavy Dumbbell Lateral Raise", target: "Shoulders", setsReps: "3 sets x 8 reps", videoUrl: "#" }
      ]
    },
    Legs: {
      muscle_gain: [
        { name: "Leg Extension", target: "Legs", setsReps: "3 sets x 12-15 reps", videoUrl: "/infopage.jsx" },
        { name: "Leg Press", target: "Legs", setsReps: "3 sets x 10-12 reps", videoUrl: "#" },
        { name: "Barbell Back Squat", target: "Legs", setsReps: "3 sets x 12 reps", videoUrl: "#" }

      ],
      fat_loss: [
        { name: "Barbell Goblet Squat", target: "Legs", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Dumbbell Walking Lunges", target: "Legs", setsReps: "3 sets x 24 steps total", videoUrl: "#" },
        { name: "Leg Curls", target: "Legs", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Leg Press", target: "Legs", setsReps: "3 sets x 10-12 reps", videoUrl: "#" }

      ],
      strength: [
        { name: "Leg Press", target: "Legs", setsReps: "5 sets x 5 reps (Heavy)", videoUrl: "#" },
        { name: "Front Squat", target: "Legs", setsReps: "4 sets x 6 reps", videoUrl: "#" },
        { name: "Barbell Romanian Deadlift", target: "Legs", setsReps: "4 sets x 6 reps", videoUrl: "#" }
      ]
    },
    Arms: {
      muscle_gain: [
        { name: "Dumbbell Alternate Bicep Curl", target: "Arms", setsReps: "3 sets x 10-12 reps", videoUrl: "#" },
        { name: "Hammer Curl", target: "Arms", setsReps: "3 sets x 10-12 reps", videoUrl: "#" },
        { name: "Barbell Bicep Preacher Curl", target: "Arms", setsReps: "3 sets x 12 reps", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Dumbbell Alternate Bicep Curl", target: "Arms", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Tricep Bench Dips", target: "Arms", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Hammer Curls", target: "Arms", setsReps: "3 sets x 15 reps", videoUrl: "#" }
      ],
      strength: [
        { name: "Barbell Close-Grip Bench Press", target: "Arms", setsReps: "4 sets x 6-8 reps", videoUrl: "#" },
        { name: "Barbell Bicep Curl (Cheat Curls)", target: "Arms", setsReps: "3 sets x 6-8 reps", videoUrl: "#" },
        { name: "Tricep Weighted Dips", target: "Arms", setsReps: "3 sets x 6 reps", videoUrl: "#" }
      ]
    },
    Core: {
      muscle_gain: [
        { name: "Hanging Leg Raise", target: "Core", setsReps: "3 sets x 12-15 reps", videoUrl: "#" },
        { name: "Lying Leg Raise", target: "Core", setsReps: "3 sets x 10 reps", videoUrl: "#" },
        { name: "Plank", target: "Core", setsReps: "3 sets x 60 seconds", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Hanging Knee Raise", target: "Core", setsReps: "3 sets x 15-20 reps", videoUrl: "#" },
        { name: "Plank", target: "Core", setsReps: "3 sets x 60 seconds", videoUrl: "#" },
        { name: "Bicycle Crunches", target: "Core", setsReps: "3 sets x 20 reps", videoUrl: "#" }
      ],
      strength: [
        { name: "Heavy Standing Cable Crunch", target: "Core", setsReps: "4 sets x 8-10 reps", videoUrl: "#" },
        { name: "Pallof Press (Cable)", target: "Core", setsReps: "3 sets x 10 reps (each side)", videoUrl: "#" },
        { name: "Cable Woodchopper", target: "Core", setsReps: "3 sets x 10 reps (each side)", videoUrl: "#" }
      ]
    },

    Triceps: {
      muscle_gain: [
        { name: "Overhead Dumbbell Tricep Extension", target: "Triceps", setsReps: "3 sets x 10-12 reps", videoUrl: "#" },
        { name: "Cable Tricep Pushdown (Straight Bar)", target: "Triceps", setsReps: "3 sets x 12 reps", videoUrl: "#" },
        { name: "Cable Overhead Rope Extension", target: "Triceps", setsReps: "3 sets x 12-15 reps", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Bench Dips", target: "Triceps", setsReps: "3 sets x 15-20 reps", videoUrl: "#" },
        { name: "Dumbbell Tricep Kickback", target: "Triceps", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Cable Tricep Pushdown (Straight Bar)", target: "Triceps", setsReps: "3 sets x 15 reps", videoUrl: "#" }
      ],
      strength: [
        { name: "Close-Grip Barbell Bench Press", target: "Triceps", setsReps: "4 sets x 6 reps", videoUrl: "#" },
        { name: "Weighted Chest Dips", target: "Triceps", setsReps: "3 sets x 6-8 reps", videoUrl: "#" },
        { name: "Skull Crushers (EZ-Bar)", target: "Triceps", setsReps: "3 sets x 8 reps", videoUrl: "#" }
      ]
    },
    Forearms: {
      muscle_gain: [
        { name: "Barbell Wrist Curl", target: "Forearms", setsReps: "3 sets x 15 reps", videoUrl: "#" },
        { name: "Reverse EZ-Bar Curl", target: "Forearms", setsReps: "3 sets x 12 reps", videoUrl: "#" },
        { name: "Dumbbell Hammer Curl", target: "Forearms", setsReps: "3 sets x 12 reps", videoUrl: "#" }
      ],
      fat_loss: [
        { name: "Dumbbell Wrist Curls (Palms Down)", target: "Forearms", setsReps: "3 sets x 15-20 reps", videoUrl: "#" },
        { name: "Wrist Curls (Palms Up)", target: "Forearms", setsReps: "3 sets x 45 seconds", videoUrl: "#" },
        { name: "Forearms Twist Rope Standing", target: "Forearms", setsReps: "3 sets x 60 seconds", videoUrl: "#" }
      ],
      strength: [
        { name: "Heavy Farmer's Carry", target: "Forearms", setsReps: "3 sets x 30-45 seconds", videoUrl: "#" },
        { name: "Barbell Static Hold", target: "Forearms", setsReps: "3 sets x max hold time", videoUrl: "#" },
        { name: "Behind-the-Back Wrist Curl", target: "Forearms", setsReps: "3 sets x 8-10 reps", videoUrl: "#" }
      ]
    }
  };

  const getExercisesForMuscle = (muscle, count = 2) => {
    const list = exerciseDb[muscle]?.[goal] || [];
    return list.slice(0, count);
  };

  if (level === 'beginner') {
    // Beginner locked to 3-day Full Body split
    return {
      splitName: "4-Day Full Body Split",
      goalLabel: goalLabels[goal],
      levelLabel: levelLabels[level],
      days: [
        {
          name: "Day 1 (Full Body A)",
          focus: "Squat & Push Emphasis",
          exercises: [
            ...getExercisesForMuscle('Legs', 1),
            ...getExercisesForMuscle('Chest', 1),
            ...getExercisesForMuscle('Back', 1),
            ...getExercisesForMuscle('Shoulders', 1),
            ...getExercisesForMuscle('Arms', 1),
            ...getExercisesForMuscle('Core', 1),
          ]
        },
        {
          name: "Day 2 (Full Body B)",
          focus: "Hinge & Pull Emphasis",
          exercises: [
            ...getExercisesForMuscle('Legs').slice(1, 2),
            ...getExercisesForMuscle('Back').slice(1, 2),
            ...getExercisesForMuscle('Chest').slice(1, 2),
            ...getExercisesForMuscle('Shoulders').slice(1, 2),
            ...getExercisesForMuscle('Arms').slice(1, 2),
            ...getExercisesForMuscle('Core').slice(1, 2),
          ]
        },
        {
          name: "Day 3 (Full Body C)",
          focus: "Hypertrophy & Volume Emphasis",
          exercises: [
            ...getExercisesForMuscle('Legs', 3).slice(2, 3),
            ...getExercisesForMuscle('Chest', 4).slice(3, 4),
            ...getExercisesForMuscle('Back').slice(0, 1),
            ...getExercisesForMuscle('Shoulders').slice(0, 1),
            ...getExercisesForMuscle('Arms').slice(0, 1),
            ...getExercisesForMuscle('Core', 3).slice(2, 3),
          ]
        }, {
          name: "Day 4 (Full Body D)",
          focus: "Squat & Push Emphasis",
          exercises: [
            ...getExercisesForMuscle('Legs', 1),
            ...getExercisesForMuscle('Chest', 1),
            ...getExercisesForMuscle('Back', 1),
            ...getExercisesForMuscle('Shoulders', 1),
            ...getExercisesForMuscle('Arms', 1),
            ...getExercisesForMuscle('Core', 1),
          ]
        }
      ]
    };
  }

  if (level === 'intermediate') {
    if (days === '3') {
      // 3 Day Split -> Push / Pull / Legs
      return {
        splitName: "3-Day Push / Pull / Legs (PPL)",
        goalLabel: goalLabels[goal],
        levelLabel: levelLabels[level],
        days: [
          {
            name: "Day 1 (Push Focus)",
            focus: "Chest, Shoulders & Triceps",
            exercises: [
              ...getExercisesForMuscle('Back', 3),
              ...getExercisesForMuscle('Arms', 3)
            ]
          },
          {
            name: "Day 2 (Pull Focus)",
            focus: "Back, Rear Delts & Biceps",
            exercises: [
              ...getExercisesForMuscle('Chest', 3),
              ...getExercisesForMuscle('Triceps', 3)
            ]
          },
          {
            name: "Day 3 (Leg Focus)",
            focus: "Quads, Hamstrings & Calves",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Shoulders', 3)
            ]
          }
        ]
      };
    } else if (days === '4') {
      // 4 Day Split -> Upper / Lower Split
      return {
        goalLabel: goalLabels[goal],
        levelLabel: levelLabels[level],
        days: [
          {
            splitName: "4-Day Upper / Lower Split",

            name: "Day 1 (Upper A)",
            focus: "Chest & Back Emphasis",
            exercises: [
              ...getExercisesForMuscle('Back', 3),
              ...getExercisesForMuscle('Arms', 3)
            ]
          },
          {
            name: "Day 2 (Lower A)",
            focus: "Squat Heavy & Core",
            exercises: [
              ...getExercisesForMuscle('Chest', 3),
              ...getExercisesForMuscle('Triceps', 3)
            ]
          },
          {
            name: "Day 3 (Upper B)",
            focus: "Shoulder Overhead & Arms Volume",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Shoulders', 3)
            ]
          },
          {
            name: "Day 4 (Lower B)",
            focus: "Hinge Emphasis & Hams",
            exercises: [
              ...getExercisesForMuscle('Core', 3),
              ...getExercisesForMuscle('Forearms', 3)
            ]
          }
        ]
      };
    }
    else if (days === '5') {
      // 5 Day Split -> Push / Pull / Legs / Upper / Lower
      return {
        goalLabel: goalLabels[goal],
        levelLabel: levelLabels[level],
        days: [
          {
            splitName: "5-Day Push / Pull / Legs / Upper / Lower Split",
            name: "Day 1 (Push Focus)",
            focus: "Chest, Shoulders & Triceps",
            exercises: [
              ...getExercisesForMuscle('Chest', 2),
              ...getExercisesForMuscle('Shoulders', 2),
              ...getExercisesForMuscle('Triceps', 1)
            ]
          },
          {
            name: "Day 2 (Pull Focus)",
            focus: "Back, Rear Delts & Biceps",
            exercises: [
              ...getExercisesForMuscle('Back', 2),
              ...getExercisesForMuscle('Shoulders', 1),
              ...getExercisesForMuscle('Arms', 2)
            ]
          },
          {
            name: "Day 3 (Leg Focus)",
            focus: "Quads, Hamstrings & Calves",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Core', 2)
            ]
          },
          {
            name: "Day 4 (Upper Body Volume)",
            focus: "Chest, Back, Shoulders & Arms",
            exercises: [
              ...getExercisesForMuscle('Chest', 2),
              ...getExercisesForMuscle('Back', 2),
              ...getExercisesForMuscle('Shoulders', 1),
              ...getExercisesForMuscle('Arms', 2)
            ]
          },
          {
            name: "Day 5 (Lower Body Focus)",
            focus: "Legs Heavy & Core Power",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Core', 2)
            ]
          }
        ]
      };
    }
    else {
      // 6 Day Split -> Repeat Push / Pull / Legs
      return {
        splitName: "6-Day Push / Pull / Legs Split",
        goalLabel: goalLabels[goal],
        levelLabel: levelLabels[level],
        days: [
          {
            name: "Day 1 (Push A)",
            focus: "Chest, Shoulders & Triceps Focus",
            exercises: [
              ...getExercisesForMuscle('Chest', 2),
              ...getExercisesForMuscle('Shoulders', 2),
              ...getExercisesForMuscle('Triceps', 1)
            ]
          },
          {
            name: "Day 2 (Pull A)",
            focus: "Back, Rear Delts & Biceps Focus",
            exercises: [
              ...getExercisesForMuscle('Back', 2),
              ...getExercisesForMuscle('Shoulders', 1),
              ...getExercisesForMuscle('Arms', 2)
            ]
          },
          {
            name: "Day 3 (Legs A)",
            focus: "Quads, Hamstrings & Calves",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Core', 1)
            ]
          },
          {
            name: "Day 4 (Push B)",
            focus: "Chest, Shoulders & Triceps Hypertrophy",
            exercises: [
              ...getExercisesForMuscle('Chest', 2),
              ...getExercisesForMuscle('Shoulders', 1),
              ...getExercisesForMuscle('Arms', 2)
            ]
          },
          {
            name: "Day 5 (Pull B)",
            focus: "Back, Rear Delts & Biceps Hypertrophy",
            exercises: [
              ...getExercisesForMuscle('Back', 2),
              ...getExercisesForMuscle('Shoulders', 1),
              ...getExercisesForMuscle('Arms', 2)
            ]
          },
          {
            name: "Day 6 (Legs B)",
            focus: "Quads, Hamstrings & Calves",
            exercises: [
              ...getExercisesForMuscle('Legs', 3),
              ...getExercisesForMuscle('Core', 2)
            ]
          }
        ]
      };
    }
  }

  if (level === 'advanced') {
    // Advanced: custom muscle target splits in a combined session
    const daysData = [];
    const numDays = 1;
    const distributedMuscles = Array.from({ length: numDays }, () => []);

    selectedMuscles.forEach((muscle, index) => {
      distributedMuscles[index % numDays].push(muscle);
    });

    for (let i = 0; i < numDays; i++) {
      const dayMuscles = distributedMuscles[i];
      if (dayMuscles.length > 0) {
        const exercisesList = [];
        dayMuscles.forEach(muscle => {
          exercisesList.push(...getExercisesForMuscle(muscle, 3));
        });

        daysData.push({
          name: "Workout Session",
          focus: `${dayMuscles.join(' & ')} Focus`,
          exercises: exercisesList
        });
      }
    }

    if (daysData.length === 0) {
      daysData.push({
        name: "Workout Session",
        focus: "General Hypertrophy Focus",
        exercises: [
          ...getExercisesForMuscle('Chest', 1)
          // ...getExercisesForMuscle('Back', 1),
          // ...getExercisesForMuscle('Legs', 1)
        ]
      });
    }

    return {
      splitName: "Advanced Custom Target Split",
      goalLabel: goalLabels[goal],
      levelLabel: levelLabels[level],
      days: daysData
    };
  }

  return null;
};

function App() {
  // 1. Goal state (default: Muscle Gain)
  const [goal, setGoal] = useState('muscle_gain');

  // 2. Level state (default: Beginner)
  const [level, setLevel] = useState('beginner');

  // 3. Frequency split state (for Intermediate - default: null but set on transition)
  const [days, setDays] = useState(null);

  // 4. Targeted muscles state (for Advanced)
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  // 5. App UI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setWorkoutPlan(null); // Clear old results to make loading experience prominent

    // Request the workout plan from the Express backend API
    fetch("http://localhost:5000/api/workout-plan", {
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
        console.warn("Backend API not reachable. Falling back to local generation. Details:", err.message);
        // Seamless fallback to client-side generator
        const plan = generateWorkoutPlan(goal, level, days, selectedMuscles);
        setWorkoutPlan(plan);
        setIsGenerating(false);
      });
  };

  return (
    <div className="app-container">
      {/* Brand Hero Heading */}
      <header>
        <div className="logo-container">
          <span className="logo-icon" role="img" aria-label="Gym Bro Logo">💪</span>
          <span className="logo-text">The Gym Bro</span>
        </div>
        <h1 id="app-heading-title">Create Your Ultimate Workout Split</h1>
        <p className="hero-subtitle">
          Enter your metrics below to instantly outline a high-yield athletic routine customized around your capacity.
        </p>
      </header>

      {/* Main Form Selection */}
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

        {/* Loading Spinner */}
        {isGenerating && <Spinner />}

        {/* Generated Workout Plan Results */}
        {!isGenerating && workoutPlan && (
          <ResultsDashboard plan={workoutPlan} />
        )}
      </main>

      {/* Gym Bro Footer */}
      <footer>
        <p>© 2026 <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>The Gym Bro MVP</span>. Built for premium athletes.</p>
        <p style={{ marginTop: '6px', fontSize: '11px' }}>
          Disclaimer: Consult a physician before beginning any training program.
        </p>
      </footer>
    </div>
  );
}

export default App;
