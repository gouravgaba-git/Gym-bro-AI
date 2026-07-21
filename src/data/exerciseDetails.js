/**
 * Exercise Information Database
 * Stores high-yield details, step-by-step form guides, and safety tips for exercises.
 * Designed to support both image placeholders and future video files (e.g., mp4, YouTube/Vimeo links).
 */

export const exerciseDetailsDb = {
  "Barbell Back Squat": {
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
    mediaType: "video" // Can be changed to "video" in the future
  },
  "Incline Dumbbell Bench Press": {
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
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/IP4oeKh1Sd4?si=0ApVvt2iryzpb-gO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  "Flat Barbell Bench Press": {
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
      "Do not bounce the bar off your chest. Touch lightly, pause for a split second, and press.",
      "Maintain a natural arch in your lower back, but keep your glutes planted on the bench."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ptpmRrzRtWQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  "Lat Pulldown (Wide Grip)": {
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
  "Seated Dumbbell Shoulder Press": {
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
  "Dumbbell Bicep Incline Curl": {
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
  "Hanging Leg Raise": {
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
    ],
    mediaUrl: "/exercise_placeholder.mp4",
  },
  "Conventional Deadlift": {
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
  "Push-ups (to Failure)": {
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
  "Leg Press": {
    steps: [
      "Sit in the leg press machine. Place feet shoulder-width on the sled. Lower the sled under control, then press up."
    ],
    tips: [
      "Do not lock out your knees at the top, and do not let your lower back curl off the pad."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/fKAmwrtUxI8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  },
  "Hammer Curls": {
    steps: [
      "Stand holding dumbbells with palms facing each other. Curl the weights up while maintaining a neutral grip."
    ],
    tips: [
      "Hammer curls target the brachialis and brachioradialis for forearm thickness."
    ],
    mediaUrl: '<iframe width="560" height="315" src="https://www.youtube.com/embed/8XLxfXROrTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    mediaType: "video"
  }
};

/**
 * Helper function to retrieve detailed information for any exercise.
 * If the exercise name is not found in the custom DB, it dynamically generates
 * premium instructions based on its name and target muscle group.
 *
 * @param {string} exerciseName - Name of the exercise
 * @param {string} targetMuscle - Muscle target (e.g. Legs, Chest, Back)
 * @returns {object} The steps, tips, and media attributes.
 */
export function getExerciseDetails(exerciseName, targetMuscle = "Full Body") {
  const normalizedName = exerciseName?.trim();
  
  if (exerciseDetailsDb[normalizedName]) {
    return exerciseDetailsDb[normalizedName];
  }

  // Generative fallback for items not explicitly in the static DB
  const fallbackSteps = [
    `Set up safely for ${normalizedName} by checking your equipment, posture, and alignment.`,
    `Initiate the movement by contracting your target muscle group (${targetMuscle}) under control.`,
    `Focus on a full range of motion, performing the concentric phase with explosive control.`,
    `Pause briefly at the point of maximum contraction to maximize mechanical tension.`,
    `Lower the load slowly and focus on the eccentric stretch back to the starting position.`
  ];

  const fallbackTips = [
    `Ensure your core is braced and posture remains neutral during the entire movement pattern.`,
    `Prioritize form and precision over the total amount of weight lifted.`,
    `Breathe out during the hardest part of the lift (concentric) and breathe in as you lower the weight.`
  ];

  return {
    steps: fallbackSteps,
    tips: fallbackTips,
    mediaUrl: "/exercise_placeholder.mp4",
    mediaType: "video"
  };
}
