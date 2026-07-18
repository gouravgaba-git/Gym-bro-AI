import { getElbowAngle, getShoulderAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const tricepPushdownRule = {
  name: "Tricep Pushdown",
  requiredLandmarks: [11, 12, 13, 14, 15, 16, 23, 24],

  calculateAngles(landmarks) {
    const side = getBestVisibleSide(landmarks);
    return {
      side,
      elbowAngle: getElbowAngle(landmarks, side),
      shoulderAngle: getShoulderAngle(landmarks, side),
      torsoLean: getTorsoInclination(landmarks, side)
    };
  },

  evaluatePosture(landmarks, angles) {
    const warnings = [];
    let penalty = 0;

    // BIOMECHANIC 1: Pinned Elbows (Shoulder Flexion check)
    // The shoulder angle represents upper arm deviation relative to the torso.
    // If it exceeds 30°, elbows have drifted forward, which recruits the latissimus dorsi and chest to push down.
    if (angles.shoulderAngle > 30) {
      warnings.push("Pin elbows to ribs. Don't let them drift forward.");
      penalty += 20;
    }

    // BIOMECHANIC 2: Torso Lean (Lumbar extension cheat)
    // A slight lean (<15°) is normal to allow cable path clearance. Leaning forward > 20°
    // indicates using bodyweight/momentum to force the stack down, reducing tricep isolation.
    if (angles.torsoLean > 20) {
      warnings.push("Stand tall. Keep your chest up and isolate the arms.");
      penalty += 15;
    }

    const formScore = Math.max(0, 100 - penalty);
    return {
      isValid: formScore > 70,
      formScore,
      warnings
    };
  },

  countRep(landmarks, angles, state) {
    if (!state.phase) {
      state.phase = "stretch";
      state.repCount = 0;
      state.lastFeedback = "Hold bar high (< 75° elbow) to stretch triceps.";
      state.maxExtension = 0;
      state.minExtension = 180;
    }

    const elbow = angles.elbowAngle;
    let increment = false;
    let feedback = state.lastFeedback;

    // BIOMECHANIC STATE MACHINE:
    // 1. STRETCH: Elbow fully flexed at top (< 75°).
    // 2. CONCENTRIC (Pushing): Driving cable down.
    // 3. LOCKOUT: Full elbow extension at bottom (> 155°).
    // 4. RETURNING: Resisting cable path on release (eccentric).

    if (state.phase === "stretch") {
      state.maxExtension = 0;
      if (elbow > 90) {
        state.phase = "pushing";
        feedback = "Pushing down... squeeze your triceps.";
      }
    } 
    else if (state.phase === "pushing") {
      if (elbow > state.maxExtension) {
        state.maxExtension = elbow;
      }
      
      // Lockout threshold: >155° is required to fully contract the lateral and medial heads of the triceps.
      if (elbow > 155) {
        state.phase = "lockout";
        feedback = "Lockout! Squeeze and hold.";
      }
    } 
    else if (state.phase === "lockout") {
      state.minExtension = 180;
      if (elbow < 140) {
        state.phase = "returning";
        feedback = "Returning slowly... resist the weight stack.";
      }
    } 
    else if (state.phase === "returning") {
      if (elbow < state.minExtension) {
        state.minExtension = elbow;
      }
      
      // Full stretch threshold: return to < 75° for maximal eccentric stretch of the long head.
      if (elbow < 75) {
        state.phase = "stretch";
        
        // Evaluate lockout quality
        if (state.maxExtension < 145) {
          feedback = "Partial extension. Push the bar fully to lock out elbows.";
        } else {
          feedback = "Solid tricep pushdown rep!";
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
