import { getKneeAngle, getHipAngle, getTorsoInclination, getBestVisibleSide } from "../pose/angleUtils";

export const squatRule = {
  name: "Squat",
  requiredLandmarks: [11, 12, 23, 24, 25, 26, 27, 28, 31, 32],

  calculateAngles(landmarks) {
    const side = getBestVisibleSide(landmarks);
    
    // Knee Valgus Check: Calculate horizontal distance between knees vs ankles.
    // If knees are significantly closer than ankles, they are collapsing inward.
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    
    const kneeDist = leftKnee && rightKnee ? Math.abs(leftKnee.x - rightKnee.x) : 1;
    const ankleDist = leftAnkle && rightAnkle ? Math.abs(leftAnkle.x - rightAnkle.x) : 1;
    const kneeValgusRatio = kneeDist / (ankleDist || 1);

    // Heel Lift Check: Compare vertical position of heel and toe/foot index.
    // If heel is significantly higher in Y (which is downward on screen), it means heel lift.
    const heel = side === "left" ? landmarks[29] : landmarks[30]; // 29: Left heel, 30: Right heel
    const toe = side === "left" ? landmarks[31] : landmarks[32];   // 31: Left toe, 32: Right toe
    const heelLiftDev = heel && toe ? (toe.y - heel.y) * 100 : 0;

    return {
      side,
      kneeAngle: getKneeAngle(landmarks, side),
      hipAngle: getHipAngle(landmarks, side),
      torsoLean: getTorsoInclination(landmarks, side),
      kneeValgusRatio,
      heelLiftDev
    };
  },

  evaluatePosture(landmarks, angles) {
    const warnings = [];
    let penalty = 0;

    // BIOMECHANIC 1: Torso Lean (Forward Flexion)
    // If torso lean exceeds 40° relative to vertical, the center of gravity shifts too far forward,
    // placing excessive shear stress on the lumbar spine and reducing quad engagement.
    if (angles.torsoLean > 40) {
      warnings.push("Keep chest up. Avoid excessive forward lean.");
      penalty += 15;
    }

    // BIOMECHANIC 2: Knee Valgus (Knees Collapsing Inward)
    // A valgus ratio < 0.85 indicates knees are caving inward.
    // This places strain on the anterior cruciate ligament (ACL) and causes abnormal patellofemoral tracking.
    if (angles.kneeValgusRatio < 0.85) {
      warnings.push("Push knees out. Do not let them cave inward!");
      penalty += 25;
    }

    // BIOMECHANIC 3: Heel Lift
    // If the heel rises off the floor (detected via vertical alignment),
    // load shifts entirely to the toes and knees, overloading the patella tendon and reducing balance.
    if (angles.heelLiftDev > 5) {
      warnings.push("Keep your heels planted. Drive through your midfoot.");
      penalty += 20;
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
      state.phase = "stand";
      state.repCount = 0;
      state.lastFeedback = "Stand straight (knees > 165°) to start.";
      state.maxDepthKnee = 180;
      state.concentricStart = 0;
    }

    const knee = angles.kneeAngle;
    let increment = false;
    let feedback = state.lastFeedback;
    const now = performance.now();

    // BIOMECHANIC STATE MACHINE:
    // 1. STAND: Upright position, knees extended (>165°).
    // 2. DESCENDING: Lowering hips (eccentric loading).
    // 3. BOTTOM: Hip crease below knee joint (Knee angle < 95° is parallel squat).
    // 4. ASCENDING: Driving back upright (concentric phase).

    if (state.phase === "stand") {
      state.maxDepthKnee = 180;
      if (knee < 155) {
        state.phase = "descending";
        feedback = "Descending... Keep knees pushed out.";
      }
    } 
    else if (state.phase === "descending") {
      if (knee < state.maxDepthKnee) {
        state.maxDepthKnee = knee;
      }
      
      // Depth Threshold: Knee angle < 95° ensures the femur reaches parallel or below,
      // maximizing quad, glute, and hamstring motor unit recruitment.
      if (knee < 95) {
        state.phase = "bottom";
        feedback = "Parallel depth reached! Stand up powerfully.";
      }
    } 
    else if (state.phase === "bottom") {
      if (knee > 105) {
        state.phase = "ascending";
        state.concentricStart = now;
        feedback = "Ascending... Drive hips up.";
      }
    } 
    else if (state.phase === "ascending") {
      if (knee > 165) {
        state.phase = "stand";
        
        // Evaluate depth / partial rep
        if (state.maxDepthKnee > 110) {
          feedback = "Partial rep. Squat deeper to reach parallel (femur horizontal).";
        } else {
          // Calculate concentric speed
          const concentricDuration = (now - state.concentricStart) / 1000;
          if (concentricDuration < 1.0) {
            feedback = "Control the ascent. Drive steadily.";
          } else {
            feedback = "Solid depth squat rep completed!";
          }
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
