import User from "../models/User.js";

/**
 * Update user editable profile metrics with full validation.
 * PUT /api/users/profile
 */
export async function updateProfile(req, res) {
  try {
    const user = req.user;
    const body = req.body;

    const validationErrors = [];

    // 1. Name validation
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        validationErrors.push("Name cannot be empty");
      } else if (body.name.trim().length > 60) {
        validationErrors.push("Name cannot exceed 60 characters");
      } else {
        user.name = body.name.trim();
      }
    }

    // 2. Profile Photo validation
    if (body.profilePhoto !== undefined) {
      if (typeof body.profilePhoto === "string" && (body.profilePhoto.startsWith("http://") || body.profilePhoto.startsWith("https://") || body.profilePhoto === "")) {
        user.profilePhoto = body.profilePhoto.trim();
      } else {
        validationErrors.push("Profile photo must be a valid HTTP/HTTPS URL");
      }
    }

    // 3. Age validation
    if (body.age !== undefined && body.age !== null && body.age !== "") {
      const ageNum = Number(body.age);
      if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
        validationErrors.push("Age must be a number between 10 and 120 years");
      } else {
        user.age = ageNum;
      }
    }

    // 4. Height validation
    if (body.height !== undefined && body.height !== null && body.height !== "") {
      const heightNum = Number(body.height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 280) {
        validationErrors.push("Height must be a number between 50 cm and 280 cm");
      } else {
        user.height = heightNum;
      }
    }

    // 5. Weight validation
    if (body.weight !== undefined && body.weight !== null && body.weight !== "") {
      const weightNum = Number(body.weight);
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
        validationErrors.push("Weight must be a number between 20 kg and 300 kg");
      } else {
        user.weight = weightNum;
      }
    }

    // 6. Target Weight validation
    if (body.targetWeight !== undefined && body.targetWeight !== null && body.targetWeight !== "") {
      const targetWeightNum = Number(body.targetWeight);
      if (isNaN(targetWeightNum) || targetWeightNum < 20 || targetWeightNum > 300) {
        validationErrors.push("Target weight must be a number between 20 kg and 300 kg");
      } else {
        user.targetWeight = targetWeightNum;
      }
    }

    // 7. Daily Calories validation
    if (body.dailyCalories !== undefined && body.dailyCalories !== null && body.dailyCalories !== "") {
      const caloriesNum = Number(body.dailyCalories);
      if (isNaN(caloriesNum) || caloriesNum < 500 || caloriesNum > 10000) {
        validationErrors.push("Daily calories must be between 500 kcal and 10,000 kcal");
      } else {
        user.dailyCalories = caloriesNum;
      }
    }

    // 8. Protein Goal validation
    if (body.proteinGoal !== undefined && body.proteinGoal !== null && body.proteinGoal !== "") {
      const proteinNum = Number(body.proteinGoal);
      if (isNaN(proteinNum) || proteinNum < 10 || proteinNum > 500) {
        validationErrors.push("Protein goal must be between 10g and 500g");
      } else {
        user.proteinGoal = proteinNum;
      }
    }

    // 9. Water Goal validation
    if (body.waterGoal !== undefined && body.waterGoal !== null && body.waterGoal !== "") {
      const waterNum = Number(body.waterGoal);
      if (isNaN(waterNum) || waterNum < 0.5 || waterNum > 20) {
        validationErrors.push("Water goal must be between 0.5L and 20L");
      } else {
        user.waterGoal = waterNum;
      }
    }

    // 10. Enum / String fields validation
    if (body.gender !== undefined) user.gender = String(body.gender).trim();
    if (body.fitnessGoal !== undefined) user.fitnessGoal = String(body.fitnessGoal).trim();
    if (body.experienceLevel !== undefined) user.experienceLevel = String(body.experienceLevel).trim();
    if (body.activityLevel !== undefined) user.activityLevel = String(body.activityLevel).trim();
    if (body.bio !== undefined) user.bio = String(body.bio).trim().slice(0, 300);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: validationErrors.join(". ")
      });
    }

    // Mark profile as complete once user saves initial metrics
    user.isProfileComplete = true;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update user profile" });
  }
}

/**
 * Delete user account and associated workout logs.
 * DELETE /api/users/account
 */
export async function deleteAccount(req, res) {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ error: "Failed to delete user account" });
  }
}
