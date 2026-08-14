import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user && !user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="gymbro-login-container">
      <AuthModal isPage={true} />
    </div>
  );
};

export default LoginPage;
