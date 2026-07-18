import { getBestVisibleSide, getElbowAngle, getKneeAngle } from "../pose/angleUtils";

export const genericRule = {
  name: "Generic Exercise",
  requiredLandmarks: [11, 12, 13, 14, 15, 16],

  calculateAngles(landmarks) {
    const side = getBestVisibleSide(landmarks);
    return {
      side,
      elbowAngle: getElbowAngle(landmarks, side),
      kneeAngle: getKneeAngle(landmarks, side)
    };
  },

  evaluatePosture(landmarks, angles) {
    return {
      isValid: true,
      formScore: 100,
      warnings: []
    };
  },

  countRep(landmarks, angles, state) {
    if (!state.phase) {
      state.phase = "down";
      state.repCount = 0;
      state.lastFeedback = "Start the exercise.";
    }

    const side = angles.side;
    const elbow = angles.elbowAngle;
    let increment = false;
    let feedback = state.lastFeedback;

    // Simple default tracking on elbow movements (similar to bicep curl/pushdown)
    if (state.phase === "down") {
      if (elbow < 70) {
        state.phase = "up";
        increment = true;
        feedback = "Rep counted!";
      }
    } else if (state.phase === "up") {
      if (elbow > 140) {
        state.phase = "down";
        feedback = "Perform next rep.";
      }
    }

    return {
      increment,
      phase: state.phase,
      feedback
    };
  }
};
