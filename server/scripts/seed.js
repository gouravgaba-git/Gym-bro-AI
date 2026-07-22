import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Exercise from "../models/Exercise.js";

// Setup dotenv to read from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const exercises = [
  // === CHEST ===
  {
    name: "Incline Dumbbell Bench Press",
    target: "Chest",
    goal: "muscle_gain",
    setsReps: "4 sets x 8-10 reps",
    steps: [
      "Set an incline bench to 30-45 degrees. Sit back with a dumbbell in each hand on your thighs.",
      "Lie back on the bench, bring the dumbbells to your shoulders with elbows tucked slightly.",
      "Brace your core and press the weights straight up over your chest until arms are extended.",
      "Lower the dumbbells slowly to the sides of your upper chest, keeping your forearms vertical.",
      "Press the weights back up in a slight inward arc, contracting your upper chest at the top."
    ],
    tips: [
      "Keep your shoulder blades retracted and pressed into the bench to protect your shoulders.",
      "Do not lock your elbows fully at the top to maintain tension on the upper chest."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/sVLVLcsfWSo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video",
  },
  {
    name: "Flat Barbell Bench Press",
    target: "Chest",
    goal: "muscle_gain",
    setsReps: "3 sets x 10 reps",
    steps: [
      "Lie flat on the bench. Set your eyes directly under the bar. Pull your shoulder blades together and down.",
      "Grip the bar slightly wider than shoulder-width. Plant your feet flat on the floor to build leg drive.",
      "Unrack the barbell and hold it directly over your shoulder joints with locked elbows.",
      "Lower the bar under control to your mid-chest, tucking your elbows at a 45-degree angle.",
      "Push the bar back up in a slight diagonal arc towards your face, driving your feet into the floor.",
      "Lock out your elbows at the top while keeping your shoulder blades retracted."
    ],
    tips: [
      "Keep your wrists stacked straight over your elbows; bent wrists cause joint stress.",
      "Do not bounce the bar off your chest. Touch lightly, pause for a split second, and press."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ptpmRrzRtWQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Cable Chest Fly",
    target: "Chest",
    goal: "muscle_gain",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Set pulleys to shoulder height. Grab handles and take a step forward, bringing hands together in front of you.",
      "With a slight bend in your elbows, open your arms wide under control until you feel a stretch in your chest.",
      "Contract your chest muscles to bring your hands back together in a wide hugging motion.",
      "Squeeze your inner pecs hard at the peak contraction."
    ],
    tips: [
      "Keep the bend in your elbows constant throughout the movement; do not turn this into a press.",
      "Focus on bringing your biceps together to maximize chest contraction."
    ]
  },
  {
    name: "Dumbbell Bench Press",
    target: "Chest",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Lie flat on a bench holding dumbbells at your chest with palms facing forward.",
      "Press the weights straight up over your chest, keeping your core braced.",
      "Lower the dumbbells under control until your elbows are slightly below the bench level.",
      "Press back up dynamically to complete the rep."
    ],
    tips: [
      "Maintain a high tempo but stay in control to keep your heart rate up.",
      "Plant your feet firmly to maintain total body stability."
    ]
  },
  {
    name: "Push-ups (to Failure)",
    target: "Chest",
    goal: "fat_loss",
    setsReps: "3 sets x max reps",
    steps: [
      "Set up in a high plank position with hands slightly wider than shoulder-width, body in a straight line.",
      "Lower your chest to the floor by bending your elbows at a 45-degree angle.",
      "Push through your hands to return to the starting plank position, maintaining a tight core."
    ],
    tips: [
      "Do not let your hips sag or your lower back arch.",
      "Perform each rep through a full range of motion, touching your chest to the floor if possible."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/b6ouj88iBZs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Incline Cable Press-Fly",
    target: "Chest",
    goal: "fat_loss",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Set an incline bench in the middle of a cable station. Grab the low pulleys.",
      "Lie back and press the handles up over your chest, keeping a slight elbow bend.",
      "Lower your arms outward in a fly motion, then press and squeeze them back to the center."
    ],
    tips: [
      "Maintain constant cable tension by not letting the weight stack touch at the bottom."
    ]
  },
  {
    name: "Pec Dec",
    target: "Chest",
    goal: "fat_loss",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Sit on the pec dec machine with your back flat against the pad.",
      "Grip the handles or place your forearms on the pads, keeping elbows bent at 90 degrees.",
      "Contract your chest to pull the handles/pads together in front of you.",
      "Squeeze your chest at the center, then slowly return to the starting position."
    ],
    tips: [
      "Keep your shoulders pressed down and back to isolate the chest.",
      "Do not let the weight stack touch between reps to maintain tension."
    ]
  },
  {
    name: "Barbell Bench Press",
    target: "Chest",
    goal: "strength",
    setsReps: "5 sets x 5 reps (Heavy)",
    steps: [
      "Set up under the barbell on a flat bench. Use a moderate-to-wide grip.",
      "Unrack, brace your whole body, lower the bar to your sternum, and press up explosively with leg drive."
    ],
    tips: [
      "Build maximum tension in your legs and upper back before unracking.",
      "Rest 3-5 minutes between these heavy strength sets."
    ]
  },
  {
    name: "Incline Barbell Bench Press",
    target: "Chest",
    goal: "strength",
    setsReps: "4 sets x 6 reps",
    steps: [
      "Lie on an incline bench. Grip the bar slightly wider than shoulder-width.",
      "Unrack, lower the bar to your upper chest, and press up powerfully."
    ],
    tips: [
      "Keep your wrists straight and drive the bar in a straight line up."
    ]
  },
  {
    name: "Weighted Chest Dips",
    target: "Chest",
    goal: "strength",
    setsReps: "3 sets x 6-8 reps",
    steps: [
      "Attach a weight belt. Grip the dip bars and lift yourself up, locking your elbows.",
      "Lean your torso forward slightly and lower your body by bending your elbows until shoulders are below elbows.",
      "Press through your palms to return to the starting position."
    ],
    tips: [
      "Leaning forward targets the lower pecs; staying upright targets the triceps."
    ]
  },
  {
    name: "Pec Dec",
    target: "Chest",
    goal: "strength",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Sit on the pec dec machine with your back flat against the pad.",
      "Grip the handles or place your forearms on the pads, keeping elbows bent at 90 degrees.",
      "Contract your chest to pull the handles/pads together in front of you.",
      "Squeeze your chest at the center, then slowly return to the starting position."
    ],
    tips: [
      "Keep your shoulders pressed down and back to isolate the chest.",
      "Do not let the weight stack touch between reps to maintain tension."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/h_qLxCGaeU8?si=T3PAqElMqXosDMyQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video",
  },

  // === BACK ===
  {
    name: "Lat Pulldown (Wide Grip)",
    target: "Back",
    goal: "muscle_gain",
    setsReps: "4 sets x 10 reps",
    steps: [
      "Adjust the thigh pads so your legs are locked securely. Grip the bar wider than shoulder-width with an overhand grip.",
      "Sit down, tucking your thighs under the pad. Lean back slightly (10-15 degrees) and pull your shoulders down.",
      "Pull the bar down toward your upper chest by driving your elbows downward and backward.",
      "Squeeze your lat muscles at the bottom of the movement, bringing the bar to collarbone level.",
      "Slowly reverse the movement, controlling the weight back up to a full stretch at the top."
    ],
    tips: [
      "Use your hands as hooks. Focus on driving your elbows down rather than pulling with your forearms/biceps.",
      "Avoid using momentum or swinging your torso to pull the weight down."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/O94yEoGXtBY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Chest-Supported Row",
    target: "Back",
    goal: "muscle_gain",
    setsReps: "3 sets x 10-12 reps",
    steps: [
      "Adjust the incline bench to 30-45 degrees. Lie chest-down on the bench, holding dumbbells.",
      "Row the weights upward, pulling your elbows towards your hips and squeezing your shoulder blades."
    ],
    tips: [
      "Keep your chest glued to the pad to eliminate momentum and isolate the mid-back."
    ]
  },
  {
    name: "Single-Arm Dumbbell Row",
    target: "Back",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Place one knee and same-side hand on a flat bench. Keep your back flat and parallel to the floor.",
      "Hold a dumbbell in your free hand, pull it up to your ribcage by driving your elbow back, then lower under control."
    ],
    tips: [
      "Do not let your shoulder drop or rotate at the bottom; maintain a stable torso."
    ]
  },
  {
    name: "Lat Pulldown",
    target: "Back",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Sit at a pulldown station and pull the bar to your collarbones, focusing on high reps and constant tension."
    ],
    tips: [
      "Minimize rest times to keep your heart rate elevated."
    ]
  },
  {
    name: "Assisted Pull-ups",
    target: "Back",
    goal: "fat_loss",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Place your knees/feet on the assist pad. Pull your body up until your chin clears the bar, then lower slowly."
    ],
    tips: [
      "Control the lowering phase to maximize time under tension."
    ]
  },
  {
    name: "Kettlebell Gorilla Rows",
    target: "Back",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps (each arm)",
    steps: [
      "Stand in a wide stance, hinge forward with a flat back, and place two kettlebells on the floor.",
      "Alternately row one kettlebell to your ribs while pushing the other kettlebell into the floor."
    ],
    tips: [
      "Keep your hips low and core locked; do not twist your torso."
    ]
  },
  {
    name: "Conventional Deadlift",
    target: "Back",
    goal: "strength",
    setsReps: "5 sets x 3 reps (Heavy)",
    steps: [
      "Stand with feet hip-width apart under the barbell. Hinge down and grip the bar.",
      "Flatten your back, wedge your hips, pull the slack out of the bar, and push the floor away to stand up."
    ],
    tips: [
      "Keep the bar close to your body (dragging up shins and thighs) to protect your spine."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/VL5Ab0T07e4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Weighted Pull-ups",
    target: "Back",
    goal: "strength",
    setsReps: "4 sets x 5 reps",
    steps: [
      "Wear a dip belt with weight plates. Grab the pull-up bar, hang, and pull your chest to the bar."
    ],
    tips: [
      "Engage your lats at the bottom before pulling to avoid shoulder impingement."
    ]
  },
  {
    name: "Barbell Pendlay Row",
    target: "Back",
    goal: "strength",
    setsReps: "4 sets x 6 reps",
    steps: [
      "Hinge forward so your torso is parallel to the floor. Start with the bar on the floor.",
      "Row the bar dynamically to your lower chest, keeping your body stationary, and return it to the floor."
    ],
    tips: [
      "Every rep must start from a dead stop on the floor to build explosive pulling strength."
    ]
  },

  // === SHOULDERS ===
  {
    name: "Seated Dumbbell Shoulder Press",
    target: "Shoulders",
    goal: "muscle_gain",
    setsReps: "4 sets x 8-10 reps",
    steps: [
      "Sit on an incline bench set to 90 degrees (or slightly less to protect shoulders). Clean the dumbbells to your shoulders.",
      "Rotate your wrists so your palms face forward. Set your elbows slightly forward in the scapular plane.",
      "Brace your core, press your back into the pad, and push the weights straight up over your head.",
      "Stop just before the dumbbells touch or your elbows fully lock out to maintain tension.",
      "Lower the weights slowly and under control back to your shoulders, feeling the stretch in your anterior delts."
    ],
    tips: [
      "Avoid flaring your elbows directly out to the sides; tucking them slightly is safer for the rotator cuff.",
      "Keep your ribs down and core braced to avoid hyperextending your lower back."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/21lYP86dHW4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Standing Dumbbell Lateral Raise",
    target: "Shoulders",
    goal: "muscle_gain",
    setsReps: "4 sets x 12-15 reps",
    steps: [
      "Stand tall holding dumbbells. Raise the weights out to your sides in a wide arc until hands are shoulder-height."
    ],
    tips: [
      "Lead with your elbows and tilt the dumbbells slightly forward (like pouring water) at the top."
    ]
  },
  {
    name: "Dumbbell Rear Delt Fly",
    target: "Shoulders",
    goal: "muscle_gain",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Hinge forward at the hips, keeping a flat back. Raise dumbbells outward, squeezing your rear delts at the top."
    ],
    tips: [
      "Keep your elbows flared out wide and avoid using your traps to pull the weight."
    ]
  },
  {
    name: "Dumbbell Arnold Press",
    target: "Shoulders",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Hold dumbbells in front of shoulders, palms facing you. Press up while rotating palms forward at the top."
    ],
    tips: [
      "Maintain a smooth, continuous motion to keep muscle tension high."
    ]
  },
  {
    name: "Cable Lateral Raise",
    target: "Shoulders",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Stand next to a cable machine. Grab the lower cable and pull it across your body, raising your arm out to the side."
    ],
    tips: [
      "Cables provide constant tension which is perfect for high-rep metabolic stress."
    ]
  },
  {
    name: "Face Pulls",
    target: "Shoulders",
    goal: "fat_loss",
    setsReps: "3 sets x 20 reps",
    steps: [
      "Set cable to upper chest height. Pull the rope towards your face, flaring elbows and rotating wrists outward."
    ],
    tips: [
      "Hold the peak contraction for 1 second to build upper back posture and shoulder health."
    ]
  },
  {
    name: "Standing Military Press",
    target: "Shoulders",
    goal: "strength",
    setsReps: "5 sets x 5 reps",
    steps: [
      "Stand with feet shoulder-width. Rest the barbell on your front delts. Press the bar straight up overhead."
    ],
    tips: [
      "Squeeze your glutes and core as hard as possible to create a solid base and protect your spine."
    ]
  },
  {
    name: "Push Press",
    target: "Shoulders",
    goal: "strength",
    setsReps: "4 sets x 5 reps",
    steps: [
      "Load the barbell in front-rack position. Dip your knees slightly, then drive up powerfully to press overhead."
    ],
    tips: [
      "Use leg drive to push past the sticking point, but control the eccentric lowering phase."
    ]
  },
  {
    name: "Heavy Dumbbell Lateral Raise",
    target: "Shoulders",
    goal: "strength",
    setsReps: "3 sets x 8 reps",
    steps: [
      "Perform standing lateral raises with a heavier weight, utilizing a small amount of controlled body English."
    ],
    tips: [
      "Control the eccentric phase as much as possible; do not just drop the weight."
    ]
  },

  // === LEGS ===
  {
    name: "Barbell Back Squat",
    target: "Legs",
    goal: "muscle_gain",
    setsReps: "4 sets x 8-10 reps",
    steps: [
      "Position the barbell on your upper traps. Grip the bar firmly, pull your elbows down, and unrack the weight.",
      "Take 1-2 steps back. Set your feet shoulder-width apart, toes flared outward 15 to 30 degrees.",
      "Inhale deeply, brace your core (Valsalva maneuver), and break at the hips and knees simultaneously.",
      "Squat down under control until your thighs are parallel to the floor or slightly below.",
      "Drive hard through the mid-foot to stand back up, keeping your knees tracking inline with your toes.",
      "Exhale near the top of the movement and reset your brace for the next rep."
    ],
    tips: [
      "Maintain a proud chest throughout the movement to prevent your hips from rising too fast (good morning squat).",
      "Actively screw your feet into the floor to activate the glutes and prevent knee cave-in.",
      "If ankle mobility is a bottleneck, try elevating your heels slightly or using weightlifting shoes."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/mTaiQemkEpU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Romanian Deadlift (Dumbbell)",
    target: "Legs",
    goal: "muscle_gain",
    setsReps: "3 sets x 10-12 reps",
    steps: [
      "Stand tall holding dumbbells at your thighs. Hinge back at your hips, keeping a flat back.",
      "Lower the dumbbells along your legs until you feel a deep stretch in your hamstrings, then contract glutes to stand."
    ],
    tips: [
      "Keep the weight close to your legs; do not let the dumbbells drift forward."
    ]
  },
  {
    name: "Leg Press",
    target: "Legs",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Sit in the leg press machine. Place feet shoulder-width on the sled. Lower the sled under control, then press up."
    ],
    tips: [
      "Do not lock out your knees at the top, and do not let your lower back curl off the pad."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/fKAmwrtUxI8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Barbell Goblet Squat",
    target: "Legs",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Hold a kettlebell or dumbbell vertically against your chest. Squat down deeply and stand back up."
    ],
    tips: [
      "Focus on full range of motion and cardiorespiratory pacing."
    ]
  },
  {
    name: "Dumbbell Walking Lunges",
    target: "Legs",
    goal: "fat_loss",
    setsReps: "3 sets x 24 steps total",
    steps: [
      "Hold dumbbells in your hands. Take a large step forward and bend both knees to 90 degrees, then step forward into the next lunge."
    ],
    tips: [
      "Keep your torso upright and core engaged to balance."
    ]
  },
  {
    name: "Leg Curls",
    target: "Legs",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Lie or sit in the leg curl machine. Curl the pad towards your glutes, squeeze your hamstrings, and return."
    ],
    tips: [
      "Squeeze hard at the peak and resist the weight on the way back."
    ]
  },
  {
    name: "Low-Bar Back Squat",
    target: "Legs",
    goal: "strength",
    setsReps: "5 sets x 5 reps (Heavy)",
    steps: [
      "Place the barbell lower on your back (rear delts). Hinge and squat, pushing your hips back to load hamstrings and glutes."
    ],
    tips: [
      "Low bar positioning allows you to lift heavier loads by utilizing more posterior chain leverage."
    ]
  },
  {
    name: "Front Squat",
    target: "Legs",
    goal: "strength",
    setsReps: "4 sets x 6 reps",
    steps: [
      "Rest the bar on your collarbones/front shoulders in a clean rack. Squat while keeping your elbows pointed high."
    ],
    tips: [
      "Keeping elbows up is critical to preventing your chest from collapsing forward."
    ]
  },
  {
    name: "Barbell Romanian Deadlift",
    target: "Legs",
    goal: "strength",
    setsReps: "4 sets x 6 reps",
    steps: [
      "Hold the barbell with an overhand grip. Hinge at your hips, lowering the bar past your knees while keeping your back flat."
    ],
    tips: [
      "Focus on pushing your hips back in space rather than bending forward."
    ]
  },

  // === ARMS ===
  {
    name: "Dumbbell Bicep Incline Curl",
    target: "Arms",
    goal: "muscle_gain",
    setsReps: "3 sets x 10-12 reps",
    steps: [
      "Set an incline bench to around 45-60 degrees. Sit back with a dumbbell in each hand, arms hanging straight down.",
      "Rotate your palms so they face forward (supination). Keep your elbows pinned back in space.",
      "Curl the weights up towards your shoulders while keeping your upper arms locked in place.",
      "Squeeze your biceps hard at the peak contraction.",
      "Lower the dumbbells slowly to the starting position, getting a deep stretch in the biceps."
    ],
    tips: [
      "Do not swing your elbows forward as you curl; keeping them back isolates the long head of the biceps.",
      "Control the eccentric (lowering) phase for at least 2 seconds."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/GNO4OtYoCYk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Tricep Overhead Extension",
    target: "Arms",
    goal: "muscle_gain",
    setsReps: "3 sets x 10-12 reps",
    steps: [
      "Hold a dumbbell with both hands overhead. Lower the weight behind your head by bending your elbows, then press up."
    ],
    tips: [
      "Keep your elbows pointed forward rather than flaring out to focus tension on the triceps long head."
    ]
  },
  {
    name: "Barbell Bicep Preacher Curl",
    target: "Arms",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Sit at a preacher bench. Rest your arms on the pad and hold a barbell. Curl the bar up, then lower fully."
    ],
    tips: [
      "Avoid raising your hips off the seat; keep your arms flat against the pad."
    ]
  },
  {
    name: "Dumbbell Alternate Bicep Curl",
    target: "Arms",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Stand holding dumbbells. Alternately curl one arm up, rotating your palm upward, then repeat on the other side."
    ],
    tips: [
      "Maintain a smooth rhythm with minimal rest between curls."
    ]
  },
  {
    name: "Tricep Bench Dips",
    target: "Arms",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Place your hands on the edge of a bench behind you. Lower your hips by bending elbows, then press back up."
    ],
    tips: [
      "Keep your back close to the bench to avoid shoulder strain."
    ]
  },
  {
    name: "Hammer Curls",
    target: "Arms",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Stand holding dumbbells with palms facing each other. Curl the weights up while maintaining a neutral grip."
    ],
    tips: [
      "Hammer curls target the brachialis and brachioradialis for forearm thickness."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/8XLxfXROrTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  {
    name: "Barbell Close-Grip Bench Press",
    target: "Arms",
    goal: "strength",
    setsReps: "4 sets x 6-8 reps",
    steps: [
      "Lie on a bench. Grip the barbell with hands shoulder-width apart. Lower to your lower chest, keeping elbows tucked close, and press up."
    ],
    tips: [
      "Gripping too close places excessive strain on the wrists; shoulder-width is ideal."
    ]
  },
  {
    name: "Barbell Bicep Curl (Cheat Curls)",
    target: "Arms",
    goal: "strength",
    setsReps: "3 sets x 6-8 reps",
    steps: [
      "Hold a barbell with an underhand grip. Use a small amount of hip momentum to curl a heavy weight, then lower under control."
    ],
    tips: [
      "Only use momentum on the concentric phase; make sure to fight the weight during the lowering phase."
    ]
  },
  {
    name: "Tricep Weighted Dips",
    target: "Arms",
    goal: "strength",
    setsReps: "3 sets x 6 reps",
    steps: [
      "Add weight with a belt. Perform dips on parallel bars, keeping your torso upright to focus on the triceps."
    ],
    tips: [
      "Lock out your elbows at the top and squeeze your triceps."
    ]
  },

  // === CORE ===
  {
    name: "Hanging Leg Raise",
    target: "Core",
    goal: "muscle_gain",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Hang from a pull-up bar with a shoulder-width grip. Engage your shoulders and lats to stabilize your body.",
      "Keep your legs straight and squeeze your core.",
      "Raise your legs under control until they are parallel to the floor (or higher if flexible).",
      "Pause for a brief second at the peak of the movement.",
      "Lower your legs slowly, resisting gravity, to return to the starting dead-hang position."
    ],
    tips: [
      "Avoid swinging or using momentum. If you swing, reset and focus on core activation.",
      "If straight legs are too difficult, bend your knees and perform Hanging Knee Raises instead."
    ]
  },
  {
    name: "Ab-Wheel Rollout",
    target: "Core",
    goal: "muscle_gain",
    setsReps: "3 sets x 10 reps",
    steps: [
      "Kneel on the floor holding an ab wheel. Roll the wheel forward under control, extending your body as far as possible.",
      "Contract your abs to pull the wheel back to the starting position."
    ],
    tips: [
      "Keep your lower back slightly rounded (hollow body hold) throughout to protect your spine."
    ]
  },
  {
    name: "Plank",
    target: "Core",
    goal: "muscle_gain",
    setsReps: "3 sets x 60 seconds",
    steps: [
      "Place your forearms on the floor with elbows aligned below shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Engage your core, glutes, and quadriceps to hold the position."
    ],
    tips: [
      "Keep your neck neutral and look down at the floor.",
      "Do not let your hips sag or hike upwards."
    ]
  },
  {
    name: "Hanging Knee Raise",
    target: "Core",
    goal: "fat_loss",
    setsReps: "3 sets x 15-20 reps",
    steps: [
      "Hang from the bar and pull your knees up towards your chest, squeezing your lower abs, then lower slowly."
    ],
    tips: [
      "Keep your legs under control; do not swing."
    ]
  },
  {
    name: "Weighted Plank",
    target: "Core",
    goal: "fat_loss",
    setsReps: "3 sets x 60 seconds",
    steps: [
      "Get into a forearm plank. Place a weight plate on your back. Hold the position with a braced core."
    ],
    tips: [
      "Keep your glutes and abs squeezed tight; do not let your hips sag."
    ]
  },
  {
    name: "Bicycle Crunches",
    target: "Core",
    goal: "fat_loss",
    setsReps: "3 sets x 20 reps",
    steps: [
      "Lie flat on the floor with your lower back pressed to the ground. Place your hands lightly behind your head.",
      "Raise your shoulders and bring your knees up. Alternately rotate your elbow to the opposite knee in a pedaling motion."
    ],
    tips: [
      "Focus on the contraction of your obliques on each twist.",
      "Keep the movement slow and controlled rather than rushing through."
    ]
  },
  {
    name: "Heavy Standing Cable Crunch",
    target: "Core",
    goal: "strength",
    setsReps: "4 sets x 8-10 reps",
    steps: [
      "Stand facing away from a high pulley, holding the rope handles. Crunch down, pulling your elbows to your thighs."
    ],
    tips: [
      "Focus on flexing your spine and crunching your abs, not pulling with your arms."
    ]
  },
  {
    name: "Pallof Press (Cable)",
    target: "Core",
    goal: "strength",
    setsReps: "3 sets x 10 reps (each side)",
    steps: [
      "Stand sideways to a cable machine. Hold the cable attachment against your chest. Press it straight out and resist rotation."
    ],
    tips: [
      "This is an anti-rotation movement; keep your torso perfectly locked forward."
    ]
  },
  {
    name: "Cable Woodchopper",
    target: "Core",
    goal: "strength",
    setsReps: "3 sets x 10 reps (each side)",
    steps: [
      "Set cable pulley to high position. Stand sideways, grip handle with both hands, and pull diagonally down across your body.",
      "Control the return phase back to the high starting position."
    ],
    tips: [
      "Pivot your back foot slightly as you rotate your torso to protect your knees.",
      "Keep your arms relatively straight to engage the obliques."
    ]
  },
  // === TRICEPS ===
  {
    name: "Overhead Dumbbell Tricep Extension",
    target: "Triceps",
    goal: "muscle_gain",
    setsReps: "3 sets x 10-12 reps",
    steps: [
      "Sit or stand upright holding a dumbbell overhead with both hands cup-gripping the top plate.",
      "Keeping your upper arms vertical and close to your head, slowly lower the dumbbell behind your head.",
      "Raise the dumbbell back to the starting position by extending your elbows, squeezing the triceps at the top."
    ],
    tips: [
      "Keep your elbows pointed forward and do not let them flare out wide.",
      "Ensure your core is braced and avoid arching your lower back."
    ]
  },
  {
    name: "Cable Tricep Pushdown (Straight Bar)",
    target: "Triceps",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Attach a straight bar to a high cable pulley. Stand close to the pulley, grip the bar at shoulder-width, and tuck your elbows in.",
      "Push the bar down until your elbows are fully extended, contracting the triceps.",
      "Slowly raise the bar back up to about chest height, keeping your elbows locked in place."
    ],
    tips: [
      "Keep your body stable and avoid leaning forward too much to push with chest weight.",
      "Ensure your wrists remain neutral throughout."
    ]
  },
  {
    name: "Cable Overhead Rope Extension",
    target: "Triceps",
    goal: "muscle_gain",
    setsReps: "3 sets x 12-15 reps",
    steps: [
      "Attach a rope to a high cable pulley. Turn away from the stack, pull the rope behind your head, and step forward into a lunge stance.",
      "Extend your arms forward and up in front of you, separating the rope ends at lockout.",
      "Return slowly to the starting position behind your head under control."
    ],
    tips: [
      "Maintain a strong, stable torso; do not let the cable pull you out of position.",
      "Focus on the stretch at the bottom of the movement."
    ]
  },
  {
    name: "Bench Dips",
    target: "Triceps",
    goal: "fat_loss",
    setsReps: "3 sets x 15-20 reps",
    steps: [
      "Sit on the edge of a bench. Place your hands next to your hips and extend your legs forward.",
      "Slide your hips off the bench and bend your elbows to lower your body toward the floor.",
      "Press through your palms to return to the starting position, squeezing your triceps."
    ],
    tips: [
      "Keep your back close to the bench to avoid shoulder strain.",
      "Maintain a controlled, steady pace."
    ]
  },
  {
    name: "Dumbbell Tricep Kickback",
    target: "Triceps",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Stand holding a dumbbell in one hand, hinge forward, and place your other hand/knee on a bench for support.",
      "Tuck your elbow high so your upper arm is parallel to the floor.",
      "Extend your arm straight back, locking your elbow out and squeezing the tricep.",
      "Lower the weight back to the start position without swinging."
    ],
    tips: [
      "Only your forearm should move; keep your upper arm completely still.",
      "Keep your head and neck aligned with your back."
    ]
  },
  {
    name: "Single-Arm Cable Pushdown",
    target: "Triceps",
    goal: "fat_loss",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Grip the cable handle with one hand and stand facing the high pulley with your elbow tucked.",
      "Push the cable straight down until your arm is locked.",
      "Slowly control the weight back up to the starting position."
    ],
    tips: [
      "Keep the tempo steady and avoid using body momentum.",
      "Squeeze your tricep hard at the bottom."
    ]
  },
  {
    name: "Close-Grip Barbell Bench Press",
    target: "Triceps",
    goal: "strength",
    setsReps: "4 sets x 6 reps",
    steps: [
      "Lie on a flat bench. Grip the barbell with hands about shoulder-width apart.",
      "Unrack the bar and lower it under control to your lower chest, keeping your elbows tucked close to your torso.",
      "Press the bar back up forcefully, engaging your triceps."
    ],
    tips: [
      "Do not place your hands too close together (less than shoulder-width) as this can strain the wrists.",
      "Ensure the bar path remains vertical."
    ]
  },
  {
    name: "Weighted Chest Dips",
    target: "Triceps",
    goal: "strength",
    setsReps: "3 sets x 6-8 reps",
    steps: [
      "Attach a dip belt around your waist with weights or hold a dumbbell between your feet.",
      "Mount the dip bars, lock your arms, and lean forward slightly.",
      "Lower your body by bending your elbows until they reach a 90-degree angle.",
      "Push through your hands to return to the top lockout position."
    ],
    tips: [
      "Keep your shoulders depressed and avoid shrugging at the top.",
      "Only go as deep as is comfortable for your shoulder joints."
    ]
  },
  {
    name: "Skull Crushers (EZ-Bar)",
    target: "Triceps",
    goal: "strength",
    setsReps: "3 sets x 8 reps",
    steps: [
      "Lie flat on a bench holding an EZ-bar over your chest with a narrow grip.",
      "Bend your elbows to lower the bar towards your forehead, keeping your upper arms vertical.",
      "Extend your arms back to the starting position, squeezing your triceps."
    ],
    tips: [
      "Keep your elbows tucked and avoid letting them flare outward.",
      "Lower the bar under strict control to prevent head injury."
    ]
  },
  // === FOREARMS ===
  {
    name: "Barbell Wrist Curl",
    target: "Forearms",
    goal: "muscle_gain",
    setsReps: "3 sets x 15 reps",
    steps: [
      "Sit on a bench, resting your forearms on your thighs with your palms facing up, holding a barbell.",
      "Allow the barbell to roll down to your fingers, then curl your wrists upward to lift the bar.",
      "Slowly lower the barbell back to the starting position."
    ],
    tips: [
      "Resting your forearms on your thighs ensures the movement is isolated to the wrists.",
      "Do not use body momentum to raise the bar."
    ]
  },
  {
    name: "Reverse EZ-Bar Curl",
    target: "Forearms",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Stand holding an EZ-bar with an overhand (pronated) grip at shoulder-width.",
      "Curl the bar upward toward your shoulders, keeping your elbows tucked.",
      "Lower the bar slowly under control back to the starting position."
    ],
    tips: [
      "Keep your wrists straight and firm; do not let them bend backward.",
      "Focus on squeezing the forearm muscles at the top."
    ]
  },
  {
    name: "Dumbbell Hammer Curl",
    target: "Forearms",
    goal: "muscle_gain",
    setsReps: "3 sets x 12 reps",
    steps: [
      "Stand with dumbbells in hands, palms facing each other (neutral grip).",
      "Curl the weights upward while keeping your palms facing inward.",
      "Lower the weights slowly back to the bottom."
    ],
    tips: [
      "Keep your elbows locked to your sides; do not let them drift forward.",
      "Squeeze your forearms and biceps at the peak of the curl."
    ]
  },
  {
    name: "Dumbbell Wrist Curls (Palms Down)",
    target: "Forearms",
    goal: "fat_loss",
    setsReps: "3 sets x 15-20 reps",
    steps: [
      "Sit on a bench, resting your forearms on your thighs with palms facing down, holding dumbbells.",
      "Extend your wrists upward to lift the dumbbells, then lower them slowly back down."
    ],
    tips: [
      "Use a lighter weight to ensure strict form and high volume.",
      "Keep the tempo steady."
    ]
  },
  {
    name: "Plate Pinches",
    target: "Forearms",
    goal: "fat_loss",
    setsReps: "3 sets x 45 seconds",
    steps: [
      "Pinch two smooth weight plates together (smooth side facing out) using only your fingers and thumb.",
      "Hold the plates by your side for the designated time."
    ],
    tips: [
      "Engage your core to maintain a straight, upright posture.",
      "Keep your shoulders relaxed."
    ]
  },
  {
    name: "Dumbbell Farmer's Walk",
    target: "Forearms",
    goal: "fat_loss",
    setsReps: "3 sets x 60 seconds",
    steps: [
      "Hold a heavy dumbbell in each hand by your side.",
      "Walk in a straight line with a tall posture and braced core for the designated duration."
    ],
    tips: [
      "Do not look down; look straight ahead to maintain spinal alignment.",
      "Keep your grip firm and do not let the weights swing."
    ]
  },
  {
    name: "Heavy Farmer's Carry",
    target: "Forearms",
    goal: "strength",
    setsReps: "3 sets x 30-45 seconds",
    steps: [
      "Deadlift two very heavy dumbbells, kettlebells, or farmer's walk handles.",
      "Walk forward with short, quick steps while keeping your shoulders packed and core tight."
    ],
    tips: [
      "Squeeze your grip as hard as possible to maximize muscle recruitment.",
      "Do not lean forward; maintain an upright torso."
    ]
  },
  {
    name: "Barbell Static Hold",
    target: "Forearms",
    goal: "strength",
    setsReps: "3 sets x max hold time",
    steps: [
      "Set a barbell in a rack at about thigh height. Grab it with an overhand grip.",
      "Lift it off the pins and stand holding the bar for as long as possible before your grip fails."
    ],
    tips: [
      "Use a double overhand grip (no hook grip or mixed grip) to maximize forearm loading.",
      "Brace your core and squeeze your glutes for stability."
    ]
  },
  {
    name: "Behind-the-Back Wrist Curl",
    target: "Forearms",
    goal: "strength",
    setsReps: "3 sets x 8-10 reps",
    steps: [
      "Stand holding a barbell behind your back with an overhand grip (palms facing away from your body).",
      "Let the bar roll down into your fingers, then curl your wrists upward to lift the bar.",
      "Lower the bar slowly back to the starting position."
    ],
    tips: [
      "Keep your shoulders pulled back throughout the movement.",
      "Squeeze the forearms at the top of the curl."
    ]
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes("<username>")) {
      console.error("❌ Error: Please configure a valid MONGODB_URI in server/.env before seeding.");
      process.exit(1);
    }

    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB.");

    console.log("🧹 Clearing existing exercises and resetting collection...");
    try {
      await Exercise.collection.drop();
      console.log("✅ Cleared old database records and dropped collection.");
    } catch (err) {
      console.log("ℹ️ Collection could not be dropped (likely does not exist yet).");
    }

    console.log(`🌱 Seeding ${exercises.length} exercises into the database...`);

    // Map default properties to each entry if not present
    const seededExercises = exercises.map(ex => ({
      ...ex,
      mediaUrl: ex.mediaUrl || "/exercise_placeholder.mp4",
      mediaType: ex.mediaType || "video",
      videoUrl: ex.videoUrl || "#"
    }));

    await Exercise.insertMany(seededExercises);
    console.log("🎉 Database seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  }
}

seedDatabase();
