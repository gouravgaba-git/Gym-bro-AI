import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import ToastNotification from './components/ToastNotification';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

function AppContent() {
  const { toast, isAuthModalOpen, closeAuthModal, authModalReason } = useAuth();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
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
        </Routes>
      </main>

      {/* Global Auth Modal Overlay */}
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

      <footer className="app-footer">
        <p>© 2026 <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>The Gym Bro MVP</span>. Built for premium athletes.</p>
        <p style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          Disclaimer: Consult a physician before beginning any training program.
        </p>
      </footer>
    </div>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
