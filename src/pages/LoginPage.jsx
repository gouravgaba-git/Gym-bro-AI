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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <AuthModal />
    </div>
  );
};

export default LoginPage;
