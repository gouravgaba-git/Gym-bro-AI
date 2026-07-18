import { getElbowAngle, getShoulderAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const latPulldownRule = {
  name: "Lat Pulldown",
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

    // BIOMECHANIC 1: Torso Lean / Layback
    // A moderate lean (10-20°) is normal to clear the face path. Leaning > 30° backwards
    // indicates using weight/momentum or lumbar extension, converting the pulldown into a row.
    if (angles.torsoLean > 30) {
      warnings.push("Reduce layback. Pull with your lats, not momentum.");
      penalty += 20;
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
      state.lastFeedback = "Hold bar high (> 155° elbow) to stretch lats.";
      state.minElbowAngle = 180;
    }

    const elbow = angles.elbowAngle;
    let increment = false;
    let feedback = state.lastFeedback;

    // BIOMECHANIC STATE MACHINE:
    // 1. STRETCH: Arms fully extended at top (> 155°).
    // 2. CONCENTRIC (Pulling): Driving elbows down/back.
    // 3. CONTRACTION: Bar pulled to upper chest (elbow angle < 85°).
    // 4. RETURNING: Resisting weight upward (eccentric).

    if (state.phase === "stretch") {
      state.minElbowAngle = 180;
      if (elbow < 145) {
        state.phase = "pulling";
        feedback = "Pulling... drive elbows down towards your back pockets.";
      }
    } 
    else if (state.phase === "pulling") {
      if (elbow < state.minElbowAngle) {
        state.minElbowAngle = elbow;
      }
      
      // Contraction threshold: <85° ensures the bar meets the collarbone,
      // creating full scapular depression and humeral adduction.
      if (elbow < 85) {
        state.phase = "contraction";
        feedback = "Peak lat contraction! Squeeze shoulder blades together.";
      }
    } 
    else if (state.phase === "contraction") {
      if (elbow > 95) {
        state.phase = "returning";
        feedback = "Control the bar as it ascends. Resisting stretch.";
      }
    } 
    else if (state.phase === "returning") {
      if (elbow > 155) {
        state.phase = "stretch";
        
        // Evaluate depth/ROM
        if (state.minElbowAngle > 95) {
          feedback = "Partial rep. Pull lower to touch your upper chest.";
        } else {
          feedback = "Excellent lat pulldown rep completed!";
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
