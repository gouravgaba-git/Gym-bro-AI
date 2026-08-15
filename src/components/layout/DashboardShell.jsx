import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronsUpDown,
  LogOut,
  LogIn,
  Menu,
  X,
  Dumbbell,
  LayoutDashboard,
  Settings,
  User,
  LifeBuoy,
  BookOpen,
  CalendarDays
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../../lib/utils";

const navigationGroups = [
  {
    label: "General",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Workout Plan", href: "/workout-plan", icon: CalendarDays },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "My Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Exercise Guide", href: "#guide", icon: BookOpen },
      { name: "Help Center", href: "#help", icon: LifeBuoy },
    ],
  },
];

const allNavItems = navigationGroups.flatMap((g) => g.items);

function isActive(pathname, href) {
  if (href === "/dashboard" || href === "/") {
    return pathname === "/" || pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name) {
  if (!name) return "GB";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function SidebarContent({ onNavigate, onOpenGuide, onOpenHelp }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, showToast } = useAuth();

  const handleItemClick = (item, e) => {
    if (item.href === "#guide") {
      e.preventDefault();
      if (onOpenGuide) onOpenGuide();
      else showToast("Click on any exercise in your Workout Plan to launch the 3D Movement Guide & AI Coach!", "info");
      if (onNavigate) onNavigate();
      return;
    }
    if (item.href === "#help") {
      e.preventDefault();
      if (onOpenHelp) onOpenHelp();
      else showToast("The Gym Bro AI: Form tracking powered by MediaPipe vision. Need help? Consult docs in settings.", "info");
      if (onNavigate) onNavigate();
      return;
    }
    if (onNavigate) onNavigate();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-2 px-5 pt-6 pb-2">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 text-decoration-none"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Dumbbell className="size-4.5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            GYM BRO
          </span>
        </Link>
        <span className="rounded-md bg-sidebar-badge px-2 py-1 text-[10px] font-semibold tracking-wider text-sidebar-foreground/70 uppercase">
          Athlete Portal
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto px-4 no-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-sidebar-muted uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {group.items.map((item) => {
                const active = isActive(location.pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href.startsWith("#") ? "#" : item.href}
                      onClick={(e) => handleItemClick(item, e)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium tracking-tight transition-colors text-decoration-none",
                        active
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "text-sidebar-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="size-4.5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / User Session Box */}
      <div className="flex flex-col gap-1 px-4 pb-6 border-t border-sidebar-border/40 pt-3">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
                if (onNavigate) onNavigate();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium tracking-tight text-sidebar-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer bg-transparent border-0 text-left w-full"
            >
              <LogOut className="size-4.5 -rotate-90" />
              <span>Log out</span>
            </button>
            <div
              onClick={() => {
                navigate("/profile");
                if (onNavigate) onNavigate();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-sidebar-accent/40 transition-colors"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name || "User Avatar"}
                  className="size-8 rounded-full object-cover border border-sidebar-border"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <span
                style={{ display: user?.profilePhoto ? "none" : "flex" }}
                className="size-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground shrink-0"
              >
                {getInitials(user?.name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium tracking-tight text-sidebar-foreground m-0">
                  {user?.name || "Athlete Bro"}
                </p>
                <p className="truncate text-xs text-sidebar-muted-foreground m-0">
                  {user?.fitnessGoal ? user.fitnessGoal.replace("_", " ") : "Pro Athlete"}
                </p>
              </div>
              <ChevronsUpDown className="size-4 text-sidebar-foreground/40 shrink-0" />
            </div>
          </>
        ) : (
          <Link
            to="/login"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 rounded-lg bg-sidebar-primary px-3 py-2 text-sm font-semibold text-sidebar-primary-foreground transition-opacity hover:opacity-90 text-decoration-none"
          >
            <LogIn className="size-4.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function Topbar({ onOpenMenu }) {
  const location = useLocation();
  const current =
    allNavItems.find((item) => isActive(location.pathname, item.href)) ?? {
      name: location.pathname === "/workout-plan" ? "Workout Plan" : "Dashboard",
    };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 md:h-16 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden cursor-pointer border-0 bg-transparent"
        >
          <Menu className="size-5" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline font-medium">Gym Bro</span>
          <span className="hidden text-border sm:inline">/</span>
          <span className="font-semibold text-foreground">{current.name}</span>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}

export function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-sidebar text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-[17rem] shrink-0 md:block border-r border-sidebar-border/50">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] bg-sidebar shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-6 right-3 flex size-8 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer border-0 bg-transparent"
            >
              <X className="size-4.5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content card */}
      <main className="flex-1 overflow-hidden p-0 md:py-2 md:pr-2">
        <div className="flex h-full flex-col overflow-hidden bg-background md:rounded-xl md:border md:border-border/60 shadow-xs">
          <Topbar onOpenMenu={() => setMobileOpen(true)} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
