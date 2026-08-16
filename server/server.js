import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Exercise from "./models/Exercise.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Health check endpoints for Render
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);



function formatMediaUrl(url) {
  if (!url || url === "#" || url.startsWith("/exercise")) return url;
  if (url.trim().startsWith("<iframe")) return url.trim();

  let embedUrl = url.trim();
  if (embedUrl.includes("youtube.com/watch?v=")) {
    const videoId = embedUrl.split("v=")[1]?.split("&")[0];
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (embedUrl.includes("youtu.be/")) {
    const videoId = embedUrl.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  if (embedUrl.startsWith("http")) {
    return `<iframe width="100%" height="100%" style="width:100%;height:100%;border:0;" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  }
  return embedUrl;
}

function getLiveExerciseLink(exerciseName) {
  try {
    const linksPath = path.join(__dirname, "../exercises_links.txt");
    if (fs.existsSync(linksPath)) {
      const content = fs.readFileSync(linksPath, "utf-8");
      const query = (exerciseName || "").trim().toLowerCase();
      if (!query) return null;

      let exactMatch = null;
      let partialMatch = null;

      for (const line of content.split("\n")) {
        const parts = line.split(" - ");
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const link = parts.slice(1).join(" - ").trim();
          const nameLower = name.toLowerCase();
          if (name && link && (link.startsWith("http") || link.startsWith("<iframe"))) {
            if (nameLower === query) {
              exactMatch = formatMediaUrl(link);
              break;
            }
            if (!partialMatch && (nameLower.includes(query) || query.includes(nameLower))) {
              partialMatch = formatMediaUrl(link);
            }
          }
        }
      }
      return exactMatch || partialMatch;
    }
  } catch (e) {}
  return null;
}

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
    const nameParam = req.params.name.trim();
    const liveLink = getLiveExerciseLink(nameParam);
    let exercise = null;

    if (mongoose.connection.readyState === 1) {
      try {
        exercise = await Exercise.findOne({ name: nameParam });
      } catch (e) {
        console.warn("MongoDB exercise query error:", e.message);
      }
    }

    if (!exercise) {
      const normalizedName = nameParam;
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

      const finalMedia = liveLink || formatMediaUrl("https://www.youtube.com/embed/aOzrA4FgnM0");

      return res.json({
        name: normalizedName,
        target: "Full Body",
        steps: fallbackSteps,
        tips: fallbackTips,
        mediaUrl: finalMedia,
        mediaType: "video"
      });
    }

    const finalMediaUrl = liveLink || exercise.mediaUrl;
    const isIframe = finalMediaUrl && (finalMediaUrl.startsWith("<iframe") || finalMediaUrl.includes("<iframe"));

    res.json({
      name: exercise.name,
      target: exercise.target,
      steps: exercise.steps,
      tips: exercise.tips,
      mediaUrl: finalMediaUrl,
      mediaType: isIframe ? "video" : (exercise.mediaType || "video")
    });
  } catch (error) {
    console.error("Exercise details fetch error:", error);
    res.status(500).json({ error: "Failed to fetch exercise details." });
  }
});

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

// 3. Post a request to generate a custom workout split
app.post("/api/workout-plan", async (req, res) => {
  try {
    const { goal = "muscle_gain", level = "beginner", days = "4", selectedMuscles = [] } = req.body;

    const getExercisesForMuscle = (muscle, count = 2) => {
      const list = exerciseDb[muscle]?.[goal] || [];
      return list.slice(0, count);
    };

    let plan = null;

    if (level === 'beginner') {
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
              ...getExercisesForMuscle('Legs', 3).slice(2, 3),
              ...getExercisesForMuscle('Chest', 4).slice(3, 4),
              ...getExercisesForMuscle('Back').slice(0, 1),
              ...getExercisesForMuscle('Shoulders').slice(0, 1),
              ...getExercisesForMuscle('Arms').slice(0, 1),
              ...getExercisesForMuscle('Core', 3).slice(2, 3),
            ]
          },
          {
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
    } else if (level === 'intermediate') {
      if (days === '3') {
        plan = {
          splitName: "3-Day Intermediate Split",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Back + Biceps)",
              focus: "Back & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 3),
                ...getExercisesForMuscle('Arms', 3)
              ]
            },
            {
              name: "Day 2 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            },
            {
              name: "Day 3 (Legs + Shoulders)",
              focus: "Legs & Shoulders",
              exercises: [
                ...getExercisesForMuscle('Legs', 3),
                ...getExercisesForMuscle('Shoulders', 3)
              ]
            }
          ]
        };
      } else if (days === '4') {
        plan = {
          splitName: "4-Day Intermediate Split",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Back + Biceps)",
              focus: "Back & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 3),
                ...getExercisesForMuscle('Arms', 3)
              ]
            },
            {
              name: "Day 2 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            },
            {
              name: "Day 3 (Legs + Shoulders)",
              focus: "Legs & Shoulders",
              exercises: [
                ...getExercisesForMuscle('Legs', 3),
                ...getExercisesForMuscle('Shoulders', 3)
              ]
            },
            {
              name: "Day 4 (Core + Forearms)",
              focus: "Core & Forearms",
              exercises: [
                ...getExercisesForMuscle('Core', 3),
                ...getExercisesForMuscle('Forearms', 3)
              ]
            }
          ]
        };
      } else if (days === '5') {
        plan = {
          splitName: "5-Day Intermediate Split",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Back + Biceps)",
              focus: "Back & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 3),
                ...getExercisesForMuscle('Arms', 3)
              ]
            },
            {
              name: "Day 2 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            },
            {
              name: "Day 3 (Legs + Shoulders)",
              focus: "Legs & Shoulders",
              exercises: [
                ...getExercisesForMuscle('Legs', 3),
                ...getExercisesForMuscle('Shoulders', 3)
              ]
            },
            {
              name: "Day 4 (Core + Forearms)",
              focus: "Core & Forearms",
              exercises: [
                ...getExercisesForMuscle('Core', 3),
                ...getExercisesForMuscle('Forearms', 3)
              ]
            },
            {
              name: "Day 5 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            }
          ]
        };
      } else {
        plan = {
          splitName: "6-Day Intermediate Split",
          goalLabel: goalLabels[goal] || goal,
          levelLabel: levelLabels[level] || level,
          days: [
            {
              name: "Day 1 (Back + Biceps)",
              focus: "Back & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 3),
                ...getExercisesForMuscle('Arms', 3)
              ]
            },
            {
              name: "Day 2 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            },
            {
              name: "Day 3 (Legs + Shoulders)",
              focus: "Legs & Shoulders",
              exercises: [
                ...getExercisesForMuscle('Legs', 3),
                ...getExercisesForMuscle('Shoulders', 3)
              ]
            },
            {
              name: "Day 4 (Back + Biceps)",
              focus: "Back & Biceps",
              exercises: [
                ...getExercisesForMuscle('Back', 3),
                ...getExercisesForMuscle('Arms', 3)
              ]
            },
            {
              name: "Day 5 (Chest + Triceps)",
              focus: "Chest & Triceps",
              exercises: [
                ...getExercisesForMuscle('Chest', 3),
                ...getExercisesForMuscle('Triceps', 3)
              ]
            },
            {
              name: "Day 6 (Core + Forearms)",
              focus: "Core & Forearms",
              exercises: [
                ...getExercisesForMuscle('Core', 3),
                ...getExercisesForMuscle('Forearms', 3)
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
            ...getExercisesForMuscle('Chest', 1)
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
