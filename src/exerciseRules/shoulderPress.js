import { getElbowAngle, getShoulderAngle, getForearmAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const shoulderPressRule = {
  name: "Shoulder Press",
  requiredLandmarks: [11, 12, 13, 14, 15, 16, 23, 24],

  calculateAngles(landmarks) {
    const side = getBestVisibleSide(landmarks);
    return {
      side,
      elbowAngle: getElbowAngle(landmarks, side),
      shoulderAngle: getShoulderAngle(landmarks, side),
      forearmAngle: getForearmAngle(landmarks, side),
      torsoLean: getTorsoInclination(landmarks, side)
    };
  },

  evaluatePosture(landmarks, angles) {
    const warnings = [];
    let penalty = 0;

    // BIOMECHANIC 1: Forearm Verticality
    // Forearms should remain vertical (slanted < 20° relative to vertical).
    // Slanted forearms create horizontal force vectors, placing unnecessary shear stress on the elbow and shoulder joint.
    if (angles.forearmAngle > 20) {
      warnings.push("Keep forearms vertical to support the load safely.");
      penalty += 15;
    }

    // BIOMECHANIC 2: Spine Arching (Lower Back Cheating)
    // If torso inclination exceeds 20° backwards, it indicates hyperextension of the lumbar spine
    // to recruit upper chest fibers, which increases compression stress on the lower back vertebrae.
    if (angles.torsoLean > 20) {
      warnings.push("Keep core tight. Avoid arching your lower back.");
      penalty += 25;
    }

    const formScore = Math.max(0, 100 - penalty);
    return {
      isValid: formScore > 65,
      formScore,
      warnings
    };
  },

  countRep(landmarks, angles, state) {
    if (!state.phase) {
      state.phase = "bottom";
      state.repCount = 0;
      state.lastFeedback = "Lower weights to shoulder height (< 75° elbow) to start.";
      state.maxElbowAngle = 0;
      state.minElbowAngle = 180;
    }

    const elbow = angles.elbowAngle;
    let increment = false;
    let feedback = state.lastFeedback;

    // BIOMECHANIC STATE MACHINE:
    // 1. BOTTOM: Start at shoulders (elbow angle < 75°).
    // 2. PRESSING: Driving load overhead (concentric phase).
    // 3. LOCKOUT: Full extension at peak (> 160°).
    // 4. DESCENDING: Control lowering (eccentric phase).

    if (state.phase === "bottom") {
      state.maxElbowAngle = 0;
      if (elbow > 90) {
        state.phase = "pressing";
        feedback = "Pressing... push straight up overhead.";
      }
    } 
    else if (state.phase === "pressing") {
      if (elbow > state.maxElbowAngle) {
        state.maxElbowAngle = elbow;
      }
      
      // Lockout threshold: >160° elbow angle ensures full contraction of the deltoids.
      if (elbow > 160) {
        state.phase = "lockout";
        feedback = "Lockout achieved! Control the weight down.";
      }
    } 
    else if (state.phase === "lockout") {
      state.minElbowAngle = 180;
      if (elbow < 140) {
        state.phase = "descending";
        feedback = "Lowering bar slowly... stack joints.";
      }
    } 
    else if (state.phase === "descending") {
      if (elbow < state.minElbowAngle) {
        state.minElbowAngle = elbow;
      }
      
      // Bottom touch: elbow angle < 75° ensures full active range of motion.
      if (elbow < 75) {
        state.phase = "bottom";
        
        // Evaluate lockout / partial press:
        if (state.maxElbowAngle < 145) {
          feedback = "Partial press. Drive the weights all the way up.";
        } else {
          feedback = "Perfect shoulder press rep!";
        }
        
        increment = true;
      }
    }

    return {
      increment,
      phase: state.phase,
      feedback
    };
  }
};
