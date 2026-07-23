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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070a14]/85 border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative">
        
        {/* Mobile Left: Three-Line Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            className="w-10 h-10 rounded-2xl bg-[#0d1322] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Brand Logo (Centered on mobile, Left-aligned on desktop) */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          onClick={() => {
            setMobileMenuOpen(false);
            navigate("/dashboard");
          }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#ff416c] to-[#ff4b2b] p-0.5 shadow-lg shadow-[#ff4b2b]/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
              <span className="text-lg sm:text-xl group-hover:rotate-12 transition-transform duration-300">💪</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-base sm:text-xl tracking-wider bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent uppercase whitespace-nowrap">
                THE GYM BRO
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black tracking-widest bg-[#ff4b2b]/20 text-[#ff4b2b] border border-[#ff4b2b]/30 uppercase hidden sm:inline-block">
                PRO AI
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide hidden lg:block">
              HYPERTROPHY & SPLIT SYSTEM
            </span>
          </div>
        </div>

        {/* Desktop Nav Links (Center Segmented Pill) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0d1322]/90 border border-white/10 shadow-inner">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white shadow-md shadow-[#ff4b2b]/30 scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span>⚡</span>
            <span>Dashboard</span>
          </NavLink>

          <button
            onClick={() => handleProtectedNav("/profile", "Please sign in with Google to access your personal profile & streak metrics.")}
            className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => handleProtectedNav("/settings", "Please sign in with Google to access your account settings & preferences.")}
            className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Mobile & Desktop Right Actions: Auth Button / User Dropdown */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff4b2b] hover:to-[#ff416c] text-white text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-lg shadow-[#ff4b2b]/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
              onClick={() => openAuthModal("Sign in with Google to save custom workout splits & access AI features.")}
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hidden sm:inline">Login with Google</span>
              <span className="sm:hidden">Login</span>
            </button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 sm:gap-3 bg-[#0d1322] hover:bg-[#161f33] border border-white/10 p-1.5 pr-2.5 sm:pr-4 rounded-full cursor-pointer transition-all duration-300 shadow-md group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="relative">
                  <img
                    src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"}
                    alt={user?.name || "User Avatar"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#ff4b2b]/50 group-hover:ring-[#ff4b2b] transition-all"
                    onError={(e) => {
                      e.target.src = "https://lh3.googleusercontent.com/a/default-user";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d1322]" />
                </div>
                <span className="hidden sm:inline text-xs font-extrabold text-white group-hover:text-[#ff4b2b] transition-colors">
                  {user?.name?.split(" ")[0] || "Athlete"}
                </span>
                <span className="text-[10px] text-gray-400 group-hover:translate-y-0.5 transition-transform">▾</span>
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0d1322]/95 border border-white/10 rounded-3xl shadow-2xl p-3 backdrop-blur-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5 mb-2">
                    <div className="text-xs font-black text-white truncate">{user?.name}</div>
                    <div className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                      <span>✓</span> Verified Athlete
                    </div>
                  </div>

                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    <span>⚡</span>
                    <span>Dashboard</span>
                  </button>

                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </button>

                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-white/10 my-1.5" />

                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/dashboard");
                    }}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer (Opens when clicking left three-line button) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070a14] px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white shadow-lg shadow-[#ff4b2b]/20"
                  : "text-gray-300 bg-white/5 hover:bg-white/10"
              }`
            }
          >
            <span>⚡</span>
            <span>Dashboard</span>
          </NavLink>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleProtectedNav("/profile", "Please sign in with Google to access your personal profile.");
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 text-gray-300 bg-[#0d1322] hover:bg-white/10 cursor-pointer border border-white/5"
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleProtectedNav("/settings", "Please sign in with Google to access account settings.");
            }}
            className="w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 text-gray-300 bg-[#0d1322] hover:bg-white/10 cursor-pointer border border-white/5"
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
