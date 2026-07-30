import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import WorkoutStats from "../components/profile/WorkoutStats";
import PersonalInformation from "../components/profile/PersonalInformation";
import ExercisePreferences from "../components/profile/ExercisePreferences";
import Achievements from "../components/profile/Achievements";
import EditProfileModal from "../components/profile/EditProfileModal";
import { ProfileSkeleton } from "../components/SkeletonLoader";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="profile-page-container">
      {/* 1. Hero Profile Header Section */}
      <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />

      {/* 2. Workout Statistics Grid */}
      <WorkoutStats user={user} />

      {/* 3. Personal Metrics & Exercise Preferences 2-Column Grid */}
      <div className="profile-2col-grid">
        <PersonalInformation user={user} onEdit={() => setIsEditModalOpen(true)} />
        <ExercisePreferences user={user} onEdit={() => setIsEditModalOpen(true)} />
      </div>

      {/* 4. Achievements & Milestones */}
      <Achievements user={user} />

      {/* 5. Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
