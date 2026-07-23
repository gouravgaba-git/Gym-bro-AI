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
    <div className="flex flex-col gap-8">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Workout Statistics Grid */}
      <WorkoutStats user={user} />

      {/* Personal & Fitness Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
