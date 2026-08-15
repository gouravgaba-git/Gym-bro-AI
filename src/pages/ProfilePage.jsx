import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/common/PageHeader";
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
    return (
      <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-in fade-in duration-200">
      <PageHeader
        title="My Profile"
        description="Your athlete details and training history."
      />

      {/* Hero Profile Card */}
      <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />

      {/* 4 Bento KPI Stats Grid */}
      <WorkoutStats user={user} />

      {/* Biometrics & Training Preferences */}
      <div className="grid gap-6 md:grid-cols-2">
        <PersonalInformation user={user} onEdit={() => setIsEditModalOpen(true)} />
        <ExercisePreferences user={user} onEdit={() => setIsEditModalOpen(true)} />
      </div>

      {/* Achievements & Milestones */}
      <Achievements user={user} />

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
