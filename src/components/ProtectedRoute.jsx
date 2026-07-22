import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileSkeleton } from "./SkeletonLoader";

const ProtectedRoute = ({ children, requireCompleteProfile = true }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
        <ProfileSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireCompleteProfile && user && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
