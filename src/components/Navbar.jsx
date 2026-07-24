import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar-container"
    >
      {/* Left: Brand Logo */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            background: "var(--primary-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            boxShadow: "0 3px 12px rgba(255, 75, 43, 0.3)"
          }}
        >
          💪
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: "900",
            fontSize: "15px",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            background: "var(--primary-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          The Gym Bro
        </span>
      </div>

      {/* Center: Desktop Navigation Links */}
      <div className="navbar-links hidden-mobile">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          My Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Settings
        </NavLink>
      </div>

      {/* Right: Auth Action / Avatar Menu & Mobile Hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="navbar-actions" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              className="google-nav-btn"
              onClick={() => navigate("/login")}
              style={{
                height: "34px",
                padding: "0 14px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: "700"
              }}
            >
              <svg className="google-icon" width="14" height="14" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login</span>
            </button>
          ) : (
            <div className="avatar-dropdown-wrapper" style={{ position: "relative" }}>
              <div
                className="avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ height: "34px", padding: "3px 10px 3px 5px", borderRadius: "100px" }}
              >
                <img
                  src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
                  alt={user?.name || "User Avatar"}
                  className="avatar-img"
                  style={{ width: "26px", height: "26px" }}
                  onError={(e) => {
                    e.target.src = "https://lh3.googleusercontent.com/a/default-user";
                  }}
                />
                <span className="avatar-name" style={{ fontSize: "12px" }}>
                  {user?.name?.split(" ")[0] || "Athlete"}
                </span>
                <span className="dropdown-arrow">▾</span>
              </div>

              {dropdownOpen && (
                <div className="avatar-dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{user?.name}</div>
                    <div className="dropdown-user-email">{user?.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    👤 My Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    ⚡ Dashboard
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                  >
                    ⚙️ Settings
                  </button>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{ width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            ⚡ Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            👤 My Profile
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            ⚙️ Settings
          </NavLink>
          {isAuthenticated ? (
            <button
              className="dropdown-item logout"
              style={{ textAlign: "left", width: "100%", marginTop: "8px" }}
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                navigate("/login");
              }}
            >
              🚪 Logout
            </button>
          ) : (
            <button
              className="google-nav-btn"
              style={{ width: "100%", marginTop: "8px", justifyContent: "center" }}
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
            >
              <span>Login with Google</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
