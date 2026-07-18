import { verifyLandmarksVisibility } from "./landmarkUtils";

/**
 * High-level posture evaluator that coordinates with specific exercise rules
 * to calculate form score and identify warnings.
 */
export function evaluatePosePosture(landmarks, rule) {
  if (!landmarks || landmarks.length === 0) {
    return {
      isValid: false,
      formScore: 0,
      warnings: ["No user detected in frame."]
    };
  }

  // 1. Verify required landmarks visibility
  const visibilityThreshold = 0.5;
  const isVisible = verifyLandmarksVisibility(landmarks, rule.requiredLandmarks, visibilityThreshold);
  
  if (!isVisible) {
    return {
      isValid: false,
      formScore: 0,
      warnings: ["Please step back. Make sure your full body is in the frame."]
    };
  }

  // 2. Delegate to the specific exercise rules for posture evaluation
  try {
    const angles = rule.calculateAngles(landmarks);
    const evaluation = rule.evaluatePosture(landmarks, angles);
    
    return {
      isValid: evaluation.isValid,
      formScore: evaluation.formScore,
      warnings: evaluation.warnings,
      angles
    };
  } catch (error) {
    console.error("Error evaluating posture:", error);
    return {
      isValid: false,
      formScore: 0,
      warnings: ["Error calculating body alignment."]
    };
  }
}
