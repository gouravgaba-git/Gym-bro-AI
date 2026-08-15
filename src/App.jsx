import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { WorkoutProvider } from "./context/WorkoutContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardShell from "./components/layout/DashboardShell";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastNotification from "./components/ToastNotification";

import DashboardPage from "./pages/DashboardPage";
import WorkoutPlanPage from "./pages/WorkoutPlanPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";

// Standard Application Layout with Sidebar DashboardShell
function AppLayout() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}

function AppContent() {
  const { toast, isAuthModalOpen, closeAuthModal, authModalReason } = useAuth();

  return (
    <>
      <Routes>
        {/* Standalone Public Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main Application Layout for Dashboard, Workout Plan, Profile, Settings, etc. */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workout-plan" element={<WorkoutPlanPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requireCompleteProfile={false}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute requireCompleteProfile={false}>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      {/* Global Auth Modal Overlay for in-app protected prompts */}
      {isAuthModalOpen && (
        <div
          className="auth-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAuthModal();
          }}
        >
          <AuthModal onClose={closeAuthModal} reason={authModalReason} />
        </div>
      )}

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} />
    </>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <WorkoutProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </WorkoutProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
