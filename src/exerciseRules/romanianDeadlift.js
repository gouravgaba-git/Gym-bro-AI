import { getKneeAngle, getHipAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const romanianDeadliftRule = {
  name: "Romanian Deadlift",
  requiredLandmarks: [11, 12, 15, 16, 23, 24, 25, 26, 27, 28],

  calculateAngles(landmarks) {
    const side = getBestVisibleSide(landmarks);
    
    // Bar Distance Check: Wrist horizontal position relative to the knee/ankle vertical line.
    // If the wrist drifts too far forward, the bar is drifting away from the body.
    const wrist = side === "left" ? landmarks[15] : landmarks[16];
    const knee = side === "left" ? landmarks[25] : landmarks[26];
    const ankle = side === "left" ? landmarks[27] : landmarks[28];
    
    // Distance of wrist from the knee-ankle line
    const legX = knee && ankle ? (knee.x + ankle.x) / 2 : 0;
    const barDrift = wrist && legX ? (wrist.x - legX) * 100 : 0;

    return {
      side,
      kneeAngle: getKneeAngle(landmarks, side),
      hipAngle: getHipAngle(landmarks, side),
      torsoLean: getTorsoInclination(landmarks, side),
      barDrift
    };
  },

  evaluatePosture(landmarks, angles) {
    const warnings = [];
    let penalty = 0;

    // BIOMECHANIC 1: Minimal Knee Bend (Soft Knee Lock)
    // Knees should remain 'soft' (slightly bent at 135-165°) to protect joints, but MUST NOT flex further.
    // If knee angle drops below 130°, they are squatting the load, shifting work from hamstrings to quadriceps.
    if (angles.kneeAngle < 125) {
      warnings.push("Don't squat the weight. Push hips back with soft, locked knees.");
      penalty += 20;
    } else if (angles.kneeAngle > 175) {
      // Hyperextending/locking knees straight strains the joint capsules and limits hip range.
      warnings.push("Avoid hyperextending knees. Keep a slight, soft bend.");
      penalty += 10;
    }

    // BIOMECHANIC 2: Bar Drift (Moment Arm on Lumbar Spine)
    // The bar must remain close to the thighs/shins. If it drifts forward (barDrift > 8),
    // it creates a large horizontal moment arm relative to the hips, increasing shear force on the lumbar spine.
    if (angles.side === "left" && angles.barDrift < -8) {
      warnings.push("Keep the bar close to your body.");
      penalty += 20;
    } else if (angles.side === "right" && angles.barDrift > 8) {
      warnings.push("Keep the bar close to your body.");
      penalty += 20;
    }

    // BIOMECHANIC 3: Spine Neutrality
    // If torso lean is too high (> 75° relative to vertical), it indicates they have run out of hamstring flexibility
    // and are rounding the spine to reach lower, placing the discs at risk of herniation.
    if (angles.torsoLean > 75) {
      warnings.push("Flat back! Don't round your lower spine to reach lower.");
      penalty += 25;
    }

    const formScore = Math.max(0, 100 - penalty);
    return {
      isValid: formScore > 60,
      formScore,
      warnings
    };
  },

  countRep(landmarks, angles, state) {
    if (!state.phase) {
      state.phase = "stand";
      state.repCount = 0;
      state.lastFeedback = "Stand fully upright to start.";
      state.maxHipAngle = 0;
      state.minHipAngle = 180;
    }

    const hip = angles.hipAngle;
    let increment = false;
    let feedback = state.lastFeedback;

    // BIOMECHANIC STATE MACHINE:
    // 1. STAND: Upright lockout (>165° of hip extension).
    // 2. HINGING: Hips driving backward (eccentric stretching of hamstrings).
    // 3. BOTTOM: Peak active hamstring stretch (Hip angle < 95°).
    // 4. ASCENDING: Hip extension driving forward (concentric squeeze).

    if (state.phase === "stand") {
      state.minHipAngle = 180;
      if (hip < 155) {
        state.phase = "hinging";
        feedback = "Hinging back... push your hips to the wall behind you.";
      }
    } 
    else if (state.phase === "hinging") {
      if (hip < state.minHipAngle) {
        state.minHipAngle = hip;
      }
      
      // Hinge depth threshold: hip angle < 95° is required to fully stretch the hamstring under load.
      if (hip < 95) {
        state.phase = "bottom";
        feedback = "Hamstrings stretched. Contract glutes to stand up.";
      }
    } 
    else if (state.phase === "bottom") {
      if (hip > 110) {
        state.phase = "ascending";
        feedback = "Extending hips... keep spine neutral.";
      }
    } 
    else if (state.phase === "ascending") {
      if (hip > 165) {
        state.phase = "stand";
        
        // Check range of motion
        if (state.minHipAngle > 110) {
          feedback = "Partial hinge. Push hips back further to load hamstrings.";
        } else {
          feedback = "Excellent hip hinge! Squeeze glutes at lockout.";
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
