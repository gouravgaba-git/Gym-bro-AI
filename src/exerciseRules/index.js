import { bicepCurlRule } from "./bicepCurl";
import { squatRule } from "./squat";
import { benchPressRule } from "./benchPress";
import { romanianDeadliftRule } from "./romanianDeadlift";
import { shoulderPressRule } from "./shoulderPress";
import { tricepPushdownRule } from "./tricepPushdown";
import { latPulldownRule } from "./latPulldown";
import { genericRule } from "./generic";

/**
 * Maps an exercise name to its corresponding posture rules and rep counter definition.
 * Falls back to generic tracking if the exercise name doesn't match predefined rules.
 */
export function getExerciseRule(exerciseName) {
  if (!exerciseName) return genericRule;
  
  const name = exerciseName.toLowerCase();
  
  if (name.includes("squat")) {
    return squatRule;
  }
  if (name.includes("bench press")) {
    return benchPressRule;
  }
  if (name.includes("deadlift") || name.includes("rdl") || name.includes("hinge")) {
    return romanianDeadliftRule;
  }
  if (name.includes("shoulder press") || name.includes("military press") || name.includes("push press") || name.includes("arnold press")) {
    return shoulderPressRule;
  }
  if (name.includes("curl")) {
    return bicepCurlRule;
  }
  if (name.includes("pushdown") || name.includes("tricep extension") || name.includes("kickback") || name.includes("dips")) {
    return tricepPushdownRule;
  }
  if (name.includes("pulldown") || name.includes("pull-up") || name.includes("row")) {
    return latPulldownRule;
  }
  
  return genericRule;
}
