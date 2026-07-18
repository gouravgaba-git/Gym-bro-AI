/**
 * Orchestrates movement state tracking and rep counting
 * by coordinating with the current exercise's rules.
 */
export function updateRepCounter(landmarks, angles, state, rule) {
  if (!landmarks || !angles || !rule) {
    return {
      increment: false,
      phase: state.phase || "inactive",
      feedback: "Adjusting position..."
    };
  }

  try {
    const result = rule.countRep(landmarks, angles, state);
    
    // Update local state properties
    state.phase = result.phase;
    state.lastFeedback = result.feedback;
    
    if (result.increment) {
      state.repCount += 1;
    }

    return {
      increment: result.increment,
      phase: result.phase,
      feedback: result.feedback,
      repCount: state.repCount
    };
  } catch (error) {
    console.error("Error updating rep counter:", error);
    return {
      increment: false,
      phase: "error",
      feedback: "Tracking error."
    };
  }
}
