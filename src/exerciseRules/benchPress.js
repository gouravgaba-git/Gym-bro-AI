import { getElbowAngle, getShoulderAngle, getForearmAngle } from "../pose/angleUtils";

export const benchPressRule = {
  name: "Bench Press",
  // Requires shoulders, elbows, and wrists on both sides to evaluate symmetry and joint alignment
  requiredLandmarks: [11, 12, 13, 14, 15, 16],

  calculateAngles(landmarks) {
    const leftElbow = getElbowAngle(landmarks, "left");
    const rightElbow = getElbowAngle(landmarks, "right");
    const leftShoulder = getShoulderAngle(landmarks, "left");
    const rightShoulder = getShoulderAngle(landmarks, "right");
    const leftForearm = getForearmAngle(landmarks, "left");
    const rightForearm = getForearmAngle(landmarks, "right");

    // Alignment check: Forearm (Elbow to Wrist) should be vertical at the bottom.
    // We calculate horizontal deviation between wrist and elbow.
    const leftWrist = landmarks[15];
    const leftElbowPt = landmarks[13];
    const rightWrist = landmarks[16];
    const rightElbowPt = landmarks[14];
    
    const leftWristDev = leftWrist && leftElbowPt ? Math.abs(leftWrist.x - leftElbowPt.x) * 100 : 0;
    const rightWristDev = rightWrist && rightElbowPt ? Math.abs(rightWrist.x - rightElbowPt.x) * 100 : 0;

    return {
      leftElbow,
      rightElbow,
      leftShoulder,
      rightShoulder,
      leftForearm,
      rightForearm,
      leftWristDev,
      rightWristDev
    };
  },

  evaluatePosture(landmarks, angles) {
    const warnings = [];
    let penalty = 0;

    // BIOMECHANIC 1: Elbow Flare (Shoulder Abduction)
    // - Flare > 75° (elbows flared high towards head) puts the rotator cuff in internal rotation under load, causing subacromial impingement.
    // - Flare < 45° shifts excessive load to the triceps and anterior deltoid, reducing chest recruitment.
    const avgShoulderAngle = (angles.leftShoulder + angles.rightShoulder) / 2;
    if (avgShoulderAngle > 75) {
      warnings.push("Tuck elbows slightly (flare is >75°). Protect your shoulders!");
      penalty += 25;
    } else if (avgShoulderAngle < 40) {
      warnings.push("Elbows tucked too close. Flare out slightly (45-75°) for chest activation.");
      penalty += 10;
    }

    // BIOMECHANIC 2: Wrist Over Elbow Alignment
    // The forearm must remain vertical. If the wrist drifts inside or outside the elbow (deviation > 5% of screen width),
    // it creates a moment arm that puts shearing stress on the elbow joint and wrist.
    if (angles.leftWristDev > 8 || angles.rightWristDev > 8) {
      warnings.push("Keep wrists directly stacked over elbows.");
      penalty += 15;
    }

    // BIOMECHANIC 3: Asymmetric Pressing
    // A difference > 15° between left and right elbow angles indicates a strength imbalance or lateral instability,
    // which can lead to unequal chest loading and shoulder strain.
    const asymmetry = Math.abs(angles.leftElbow - angles.rightElbow);
    if (asymmetry > 15) {
      warnings.push(`Asymmetric press detected (${Math.round(asymmetry)}° diff). Press evenly.`);
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
      state.phase = "lockout";
      state.repCount = 0;
      state.lastFeedback = "Hold bar at lockout (elbows > 165°) to start.";
      state.minElbowAngle = 180;
      state.bottomTimestamp = 0;
      state.isBouncing = false;
      state.isPartial = false;
    }

    // Track the average elbow angle for movement tracking
    const avgElbow = (angles.leftElbow + angles.rightElbow) / 2;
    let increment = false;
    let feedback = state.lastFeedback;
    const now = performance.now();

    // BIOMECHANIC STATE MACHINE:
    // 1. LOCKOUT: Fully locked arm at the top. (> 165°)
    // 2. DESCENDING: Control lowering (eccentric phase).
    // 3. CHEST TOUCH (Bottom): Stretch under load. (< 70°).
    // 4. PRESSING: Drive up dynamically (concentric phase).

    if (state.phase === "lockout") {
      state.minElbowAngle = 180;
      state.isBouncing = false;
      state.isPartial = false;
      
      // Lockout threshold: >165° is the standard physiological lockout of the elbow joint.
      if (avgElbow < 155) {
        state.phase = "descending";
        feedback = "Descending. Control the bar down slowly.";
      }
    } 
    else if (state.phase === "descending") {
      if (avgElbow < state.minElbowAngle) {
        state.minElbowAngle = avgElbow;
      }
      
      // Bottom depth check: elbow angle < 70° ensures the bar meets the chest (full active range of motion).
      if (avgElbow < 70) {
        state.phase = "chest_touch";
        state.bottomTimestamp = now;
        feedback = "Chest touch achieved. Press up dynamically!";
      } else if (avgElbow > 155) {
        // Did not lower enough
        state.phase = "lockout";
      }
    } 
    else if (state.phase === "chest_touch") {
      if (avgElbow > 80) {
        state.phase = "pressing";
        
        // Bounce detection: transition time at the bottom < 120ms indicates a bounce off the sternum.
        // Bouncing cheats the lift using rib cage compression/elasticity instead of muscular tension.
        const bottomDuration = now - state.bottomTimestamp;
        if (bottomDuration < 120) {
          state.isBouncing = true;
        }
        feedback = "Pressing up... Keep wrists vertical.";
      }
    } 
    else if (state.phase === "pressing") {
      if (avgElbow > 165) {
        state.phase = "lockout";
        
        // Evaluate depth / partial reps:
        // A partial rep occurs if the bar is not lowered enough (minimum elbow angle reached > 75°),
        // failing to load the pectorals in their stretched position.
        if (state.minElbowAngle > 75) {
          feedback = "Rep counted, but it was a partial rep. Lower the bar all the way.";
          state.isPartial = true;
        } else if (state.isBouncing) {
          feedback = "Don't bounce the bar off your chest. Control the weight.";
        } else {
          feedback = "Perfect rep! Great chest touch and lockout.";
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
