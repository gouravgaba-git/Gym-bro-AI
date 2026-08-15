import React from "react";
import { Mail, Calendar, Edit3, ShieldCheck } from "lucide-react";

function getInitials(name) {
  if (!name) return "GB";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const ProfileHeader = ({ user, onEdit }) => {
  const formattedJoinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member";

  const goalText = (user?.fitnessGoal || "muscle_gain").replace("_", " ");

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user?.name || "Athlete Avatar"}
              className="size-16 rounded-full object-cover border border-border"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <span
            style={{ display: user?.profilePhoto ? "none" : "flex" }}
            className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-semibold tracking-tight text-foreground shrink-0"
          >
            {getInitials(user?.name)}
          </span>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {user?.name || "Athlete Bro"}
              </h2>
              <ShieldCheck className="size-4 text-emerald-500" title="Verified Account" />
            </div>
            <p className="text-sm text-muted-foreground">{user?.email || "athlete@gymbro.app"}</p>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground uppercase">
                PRO ATHLETE
              </span>
              <span className="rounded-md bg-secondary/70 px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">
                {goalText}
              </span>
              <span className="text-xs text-muted-foreground hidden md:inline">
                Joined {formattedJoinedDate}
              </span>
            </div>
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-secondary cursor-pointer shrink-0"
          >
            <Edit3 className="size-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {user?.bio && (
        <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground italic">
          "{user.bio}"
        </div>
      )}
    </section>
  );
};

export default ProfileHeader;
