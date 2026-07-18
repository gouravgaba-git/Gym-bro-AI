import { getElbowAngle, getShoulderAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const bicepCurlRule = {
  name: "Bicep Curl",
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

    // BIOMECHANIC 1: Upper Arm Stability (Elbow Drift/Shoulder Swing)
    // The elbow should remain pinned as a pivot point. If the shoulder angle exceeds 25° (elbow drifts forward),
    // it shifts loading from the biceps brachii to the anterior deltoid.
    if (angles.shoulderAngle > 25) {
      warnings.push("Keep elbows pinned at your side. Don't drift forward.");
      penalty += 20;
    }

    // BIOMECHANIC 2: Torso Lean (Swing Cheat)
    // Leaning the torso backward (> 15°) uses momentum and lumbar extension to assist the lift,
    // which unloads the target muscles and puts compression stress on the lower spine.
    if (angles.torsoLean > 15) {
      warnings.push("Stand straight. Avoid leaning back to swing the weight.");
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
      state.phase = "start";
      state.repCount = 0;
      state.lastFeedback = "Extend arms fully (>160°) to start.";
      state.minElbowAngle = 180;
      state.maxElbowAngle = 0;
      state.concentricStart = 0;
      state.eccentricStart = 0;
    }

    const elbow = angles.elbowAngle;
    let increment = false;
    let feedback = state.lastFeedback;
    const now = performance.now();

    // BIOMECHANIC STATE MACHINE:
    // 1. EXTENSION: Start of rep with arm straight (>160°).
    // 2. CONCENTRIC: Flexing elbow, lifting load.
    // 3. PEAK: Peak flexion at the top (<45°).
    // 4. ECCENTRIC: Extending elbow, lowering load.

    if (state.phase === "start") {
      if (elbow > 160) {
        state.phase = "extended";
        feedback = "Perfect extension. Begin the curl!";
      } else {
        feedback = "Straighten your arm fully to begin.";
      }
    } 
    else if (state.phase === "extended") {
      state.minElbowAngle = 180;
      state.maxElbowAngle = 0;
      
      if (elbow < 140) {
        state.phase = "concentric";
        state.concentricStart = now;
        feedback = "Curling up... squeeze the biceps.";
      }
    } 
    else if (state.phase === "concentric") {
      if (elbow < state.minElbowAngle) {
        state.minElbowAngle = elbow;
      }
      
      // Full range of motion at peak: < 45° guarantees peak contraction of the bicep.
      if (elbow < 45) {
        state.phase = "peak";
        state.eccentricStart = now;
        
        // Calculate concentric tempo
        const concentricDuration = (now - state.concentricStart) / 1000;
        if (concentricDuration < 1.0) {
          feedback = "Concentric too fast. Lift under control!";
        } else {
          feedback = "Good contraction! Now lower slowly.";
        }
      } else if (elbow > 155) {
        state.phase = "extended";
      }
    } 
    else if (state.phase === "peak") {
      if (elbow > 60) {
        state.phase = "eccentric";
      }
    } 
    else if (state.phase === "eccentric") {
      // Full extension check: rep finishes only when returning to > 155°
      if (elbow > 155) {
        state.phase = "extended";
        
        // Evaluate range of motion and tempo
        const eccentricDuration = (now - state.eccentricStart) / 1000;
        
        if (state.minElbowAngle > 65) {
          // Did not curl high enough (failed to reach peak contraction)
          feedback = "Partial rep. Curl higher to squeeze at the top.";
        } else if (eccentricDuration < 1.5) {
          // Dropped the weight instead of active eccentric loading
          feedback = "Slow down the descent. Control the eccentric phase!";
          increment = true; // count, but warn
        } else {
          feedback = "Excellent tempo and range of motion! 1 Rep.";
          increment = true;
        }
      } else if (elbow < 50) {
        state.phase = "concentric";
      }
    }

    return {
      increment,
      phase: state.phase,
      feedback
    };
  }
};
