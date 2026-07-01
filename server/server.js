import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Exercise from "./models/Exercise.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri || mongoUri.includes("<username>")) {
  console.log("⚠️ Warning: MONGODB_URI is not set to a valid string in server/.env. Database connection skipped.");
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log("🔌 Connected to MongoDB Atlas successfully."))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// Display configurations
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

// API Routes

// 1. Get all exercises in database (Optional filtering by target muscle and goal)
app.get("/api/exercises", async (req, res) => {
  try {
    const { target, goal } = req.query;
    const filter = {};
    if (target) filter.target = target;
    if (goal) filter.goal = goal;

    const exercises = await Exercise.find(filter);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to query exercises database." });
  }
});

// 2. Get instructions, tips, and media details for a single exercise by name
app.get("/api/exercises/details/:name", async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ name: req.params.name.trim() });

    if (!exercise) {
      // Return a clean fallback structure if the database does not contain this specific entry
      const normalizedName = req.params.name;
      const fallbackSteps = [
        `Set up safely for ${normalizedName} by checking your equipment, posture, and alignment.`,
        `Initiate the movement by contracting your target muscle group under control.`,
        `Focus on a full range of motion, performing the concentric phase with explosive control.`,
        `Pause briefly at the point of maximum contraction to maximize mechanical tension.`,
        `Lower the load slowly and focus on the eccentric stretch back to the starting position.`
      ];
      const fallbackTips = [
        `Ensure your core is braced and posture remains neutral during the entire movement pattern.`,
        `Prioritize form and precision over the total amount of weight lifted.`,
        `Breathe out during the hardest part of the lift (concentric) and breathe in as you lower the weight.`
      ];
      return res.json({
        name: normalizedName,
        target: "Full Body",
        steps: fallbackSteps,
        tips: fallbackTips,
        mediaUrl: "/exercise_placeholder.png",
        mediaType: "image"
      });
    }

    res.json({
      name: exercise.name,
      target: exercise.target,
      steps: exercise.steps,
      tips: exercise.tips,
      mediaUrl: exercise.mediaUrl,
      mediaType: exercise.mediaType
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise details." });
  }
});

// 3. Post a request to generate a custom workout split
app.post("/api/workout-plan", async (req, res) => {
  try {
    const { goal, level, days, selectedMuscles } = req.body;

    // Fetch exercises from MongoDB matching this fitness goal
    const rawExercises = await Exercise.find({ goal });

    // Group exercises by target muscle group
    const exerciseDb = {};
    rawExercises.forEach(ex => {
      if (!exerciseDb[ex.target]) {
        exerciseDb[ex.target] = [];
      }
      exerciseDb[ex.target].push({
        name: ex.name,
        target: ex.target,
        setsReps: ex.setsReps,
        videoUrl: ex.videoUrl
      });
    });

    const getExercisesForMuscle = (muscle, count = 2) => {
      const list = exerciseDb[muscle] || [];
      return list.slice(0, count);
    };

    let plan = null;

    if (level === 'beginner') {
      // Beginner locked to 4-day Full Body split
      plan = {
        splitName: "4-Day Full Body Split",
        goalLabel: goalLabels[goal] || goal,
        levelLabel: levelLabels[level] || level,
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
              ...getExercisesForMuscle('Legs').slice(0, 1),
              ...getExercisesForMuscle('Chest').slice(0, 1),
              ...getExercisesForMuscle('Back').slice(0, 1),
              ...getExercisesForMuscle('Shoulders').slice(0, 1),
              ...getExercisesForMuscle('Arms').slice(0, 1),
              ...getExercisesForMuscle('Core').slice(0, 1),
            ]
          },
          {
            name: "Day 4 (Full Body B)",
            focus: "Hinge & Pull Emphasis",
            exercises: [
              ...getExercisesForMuscle('Legs').slice(1, 2),
              ...getExercisesForMuscle('Back').slice(1, 2),
              ...getExercisesForMuscle('Chest').slice(1, 2),
              ...getExercisesForMuscle('Shoulders').slice(1, 2),
              ...getExercisesForMuscle('Arms').slice(1, 2),
              ...getExercisesForMuscle('Core').slice(1, 2),
            ]
          }
        ]
      };
    } else if (level === 'intermediate') {
      if (days === '3') {
        plan = {
          splitName: "3-Day Push / Pull / Legs (PPL)",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Push Focus)",
              focus: "Chest, Shoulders & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 2),
                ...getExercisesForMuscle('Shoulders', 2),
                ...getExercisesForMuscle('Arms', 1)
              ]
            },
            {
              name: "Day 2 (Pull Focus)",
              focus: "Back, Rear Delts & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 2),
                ...getExercisesForMuscle('Shoulders').slice(2, 3),
                ...getExercisesForMuscle('Arms').slice(1, 2),
                ...getExercisesForMuscle('Core', 1)
              ]
            },
            {
              name: "Day 3 (Leg Focus)",
              focus: "Quads, Hamstrings & Calves",
              exercises: [
                ...getExercisesForMuscle('Legs', 3),
                ...getExercisesForMuscle('Core', 2)
              ]
            }
          ]
        };
      } else {
        plan = {
          splitName: "4-Day Upper / Lower Split",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Upper A)",
              focus: "Chest & Back Emphasis",
              exercises: [
                ...getExercisesForMuscle('Chest', 2),
                ...getExercisesForMuscle('Back', 2),
                ...getExercisesForMuscle('Shoulders', 1)
              ]
            },
            {
              name: "Day 2 (Lower A)",
              focus: "Squat Heavy & Core",
              exercises: [
                ...getExercisesForMuscle('Legs', 2),
                ...getExercisesForMuscle('Core', 2)
              ]
            },
            {
              name: "Day 3 (Upper B)",
              focus: "Shoulder Overhead & Arms Volume",
              exercises: [
                ...getExercisesForMuscle('Shoulders', 2),
                ...getExercisesForMuscle('Arms', 2),
                ...getExercisesForMuscle('Chest').slice(1, 2)
              ]
            },
            {
              name: "Day 4 (Lower B)",
              focus: "Hinge Emphasis & Hams",
              exercises: [
                ...getExercisesForMuscle('Legs').slice(0, 3),
                ...getExercisesForMuscle('Back').slice(0, 2),
                ...getExercisesForMuscle('Core', 2)
              ]
            }
          ]
        };
      }
    } else if (level === 'advanced') {
      const daysData = [];
      const numDays = 1;
      const distributedMuscles = Array.from({ length: numDays }, () => []);

      const musclesList = selectedMuscles || [];
      musclesList.forEach((muscle, index) => {
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
            ...getExercisesForMuscle('Chest', 1),
            ...getExercisesForMuscle('Back', 1),
            ...getExercisesForMuscle('Legs', 1)
          ]
        });
      }

      plan = {
        splitName: "Advanced Custom Target Split",
        goalLabel: goalLabels[goal] || goal,
        levelLabel: levelLabels[level] || level,
        days: daysData
      };
    }

    res.json(plan);
  } catch (error) {
    console.error("❌ Workout plan generation error:", error);
    res.status(500).json({ error: "Failed to generate custom workout plan." });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Gym Bro API Server running on http://localhost:${PORT}`);
});
