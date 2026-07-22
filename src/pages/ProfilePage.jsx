import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import WorkoutStats from "../components/profile/WorkoutStats";
import PersonalInformation from "../components/profile/PersonalInformation";
import FitnessInformation from "../components/profile/FitnessInformation";
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
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Profile Header (Photo, Name, Read-only Email, Member Since) */}
      <ProfileHeader user={user} />

      {/* Workout Statistics Grid (System Calculated) */}
      <WorkoutStats user={user} />

      {/* Personal & Fitness Information Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        <PersonalInformation user={user} onEdit={() => setIsEditModalOpen(true)} />
        <FitnessInformation user={user} onEdit={() => setIsEditModalOpen(true)} />
      </div>

      {/* Achievements & Badges */}
      <Achievements user={user} />

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
