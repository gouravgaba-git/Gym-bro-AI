/**
 * Aggregates analysis from posture evaluation and rep tracking
 * to construct clean real-time coaching feedback and metrics.
 */
export function generateFeedback(postureResult, repResult, state) {
  // Safe extraction of values with sensible fallbacks
  const formScore = postureResult ? postureResult.formScore : 0;
  const warnings = postureResult ? postureResult.warnings : [];
  const angles = postureResult ? postureResult.angles : {};
  const phase = repResult ? repResult.phase : "start";
  const repCount = state ? state.repCount : 0;
  const feedback = repResult ? repResult.feedback : "Prepare to begin.";

  // Determine overall status indicator (e.g., 'good', 'warning', 'critical')
  let status = "good";
  if (warnings.length > 0) {
    status = formScore < 50 ? "critical" : "warning";
  }

  return {
    repCount,
    phase: phase.toUpperCase(),
    formScore,
    status,
    warnings,
    feedback,
    jointAngles: formatAnglesForDisplay(angles)
  };
}

/**
 * Formats angles object into clean user-friendly labels.
 */
function formatAnglesForDisplay(angles) {
  const displayAngles = [];
  if (!angles) return displayAngles;

  const labels = {
    elbowAngle: "Elbow Angle",
    shoulderAngle: "Shoulder Angle",
    kneeAngle: "Knee Angle",
    hipAngle: "Hip Angle",
    torsoLean: "Torso Lean",
    forearmAngle: "Forearm Angle"
  };

  for (const [key, value] of Object.entries(angles)) {
    if (labels[key] && typeof value === "number") {
      displayAngles.push({
        label: labels[key],
        value: Math.round(value)
      });
    }
  }

  return displayAngles;
}
