/**
 * Reusable angle utilities for MediaPipe Pose Landmarks.
 */

/**
 * Calculates the 2D angle (in degrees) formed by three points: A, B (vertex), and C.
 * Coordinates are expected to have x and y properties.
 */
export function calculate2DAngle(A, B, C) {
  if (!A || !B || !C) return 180;
  
  let radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
}

/**
 * Calculates the angle of a segment (A to B) relative to a vertical line passing through A.
 * Vertical vector is (0, 1) or relative to the screen vertical.
 */
export function calculateSegmentAngleRelativeToVertical(A, B) {
  if (!A || !B) return 0;
  
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  
  // Angle relative to vertical axis (dy)
  let angle = Math.abs(Math.atan2(dx, dy) * 180.0 / Math.PI);
  
  return angle;
}

/**
 * Get the elbow joint angle.
 */
export function getElbowAngle(landmarks, side = "left") {
  const shoulder = side === "left" ? landmarks[11] : landmarks[12];
  const elbow = side === "left" ? landmarks[13] : landmarks[14];
  const wrist = side === "left" ? landmarks[15] : landmarks[16];
  return calculate2DAngle(shoulder, elbow, wrist);
}

/**
 * Get the shoulder joint angle (abduction/flexion angle).
 * Angle between upper arm (elbow to shoulder) and torso (hip to shoulder).
 */
export function getShoulderAngle(landmarks, side = "left") {
  const elbow = side === "left" ? landmarks[13] : landmarks[14];
  const shoulder = side === "left" ? landmarks[11] : landmarks[12];
  const hip = side === "left" ? landmarks[23] : landmarks[24];
  return calculate2DAngle(elbow, shoulder, hip);
}

/**
 * Get the hip joint angle.
 * Angle between torso (shoulder to hip) and thigh (knee to hip).
 */
export function getHipAngle(landmarks, side = "left") {
  const shoulder = side === "left" ? landmarks[11] : landmarks[12];
  const hip = side === "left" ? landmarks[23] : landmarks[24];
  const knee = side === "left" ? landmarks[25] : landmarks[26];
  return calculate2DAngle(shoulder, hip, knee);
}

/**
 * Get the knee joint angle.
 * Angle between thigh (hip to knee) and shin (ankle to knee).
 */
export function getKneeAngle(landmarks, side = "left") {
  const hip = side === "left" ? landmarks[23] : landmarks[24];
  const knee = side === "left" ? landmarks[25] : landmarks[26];
  const ankle = side === "left" ? landmarks[27] : landmarks[28];
  return calculate2DAngle(hip, knee, ankle);
}

/**
 * Get the ankle joint angle.
 */
export function getAnkleAngle(landmarks, side = "left") {
  const knee = side === "left" ? landmarks[25] : landmarks[26];
  const ankle = side === "left" ? landmarks[27] : landmarks[28];
  const heelOrToe = side === "left" ? landmarks[31] : landmarks[32]; // Heel
  return calculate2DAngle(knee, ankle, heelOrToe);
}

/**
 * Get the torso inclination angle relative to the vertical axis.
 * Angle of the shoulder-hip line.
 */
export function getTorsoInclination(landmarks, side = "left") {
  const shoulder = side === "left" ? landmarks[11] : landmarks[12];
  const hip = side === "left" ? landmarks[23] : landmarks[24];
  return calculateSegmentAngleRelativeToVertical(shoulder, hip);
}

/**
 * Get upper arm angle relative to vertical.
 */
export function getUpperArmAngle(landmarks, side = "left") {
  const shoulder = side === "left" ? landmarks[11] : landmarks[12];
  const elbow = side === "left" ? landmarks[13] : landmarks[14];
  return calculateSegmentAngleRelativeToVertical(shoulder, elbow);
}

/**
 * Get forearm angle relative to vertical.
 */
export function getForearmAngle(landmarks, side = "left") {
  const elbow = side === "left" ? landmarks[13] : landmarks[14];
  const wrist = side === "left" ? landmarks[15] : landmarks[16];
  return calculateSegmentAngleRelativeToVertical(elbow, wrist);
}

/**
 * Determines which side (left or right) is more visible / facing the camera.
 * Based on keypoint visibility/confidence.
 */
export function getBestVisibleSide(landmarks) {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  
  const leftVis = leftShoulder ? (leftShoulder.visibility || 0) : 0;
  const rightVis = rightShoulder ? (rightShoulder.visibility || 0) : 0;
  
  return leftVis >= rightVis ? "left" : "right";
}
