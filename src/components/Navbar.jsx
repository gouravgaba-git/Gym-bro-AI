import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
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

  const handleProtectedNav = (path, reason) => {
    if (!isAuthenticated) {
      openAuthModal(reason);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/90 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative">
        
        {/* Mobile Left: Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            className="w-10 h-10 rounded-xl bg-[#0f172a] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          onClick={() => {
            setMobileMenuOpen(false);
            navigate("/dashboard");
          }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-red-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
              <span className="text-base sm:text-lg">💪</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-wider text-white uppercase whitespace-nowrap">
              GYM<span className="text-blue-500">BRO</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#0f172a]/90 border border-white/10">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span>⚡</span>
            <span>Dashboard</span>
          </NavLink>

          <button
            onClick={() => handleProtectedNav("/profile", "Please sign in to view your profile.")}
            className="px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <span>👤</span>
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleProtectedNav("/settings", "Please sign in to view settings.")}
            className="px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Auth / Profile Section */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white text-xs font-bold tracking-wide flex items-center gap-2 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
              onClick={() => openAuthModal("Sign in to save custom workout splits.")}
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 p-1.5 pr-3 rounded-full cursor-pointer transition-all duration-200 shadow-sm group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
                  alt={user?.name || "User Avatar"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition-all"
                  onError={(e) => {
                    e.target.src = "https://lh3.googleusercontent.com/a/default-user";
                  }}
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {user?.name?.split(" ")[0] || "Athlete"}
                </span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#0f172a] border border-white/10 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                  <div className="px-3 py-2 bg-slate-800/50 rounded-xl border border-white/5 mb-1">
                    <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</div>
                  </div>

                  <button
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    <span>⚡</span>
                    <span>Dashboard</span>
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-white/10 my-1" />

                  <button
                    className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/dashboard");
                    }}
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080c14] px-4 py-3 space-y-2">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-300 bg-white/5 hover:bg-white/10"
              }`
            }
          >
            <span>⚡</span>
            <span>Dashboard</span>
          </NavLink>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleProtectedNav("/profile", "Please sign in to view profile.");
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <span>👤</span>
            <span>Profile</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleProtectedNav("/settings", "Please sign in to view settings.");
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
