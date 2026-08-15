import React from "react";
import { Edit3 } from "lucide-react";

export const PersonalInformation = ({ user, onEdit }) => {
  const details = [
    { label: "Age", value: user?.age ? `${user.age} Years` : "Not specified" },
    { label: "Gender", value: user?.gender || "Not specified" },
    { label: "Height", value: user?.height ? `${user.height} cm` : "Not specified" },
    { label: "Weight", value: user?.weight ? `${user.weight} kg` : "Not specified" },
    { label: "Target Weight", value: user?.targetWeight ? `${user.targetWeight} kg` : "Not specified" },
  ];

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
        <h2 className="font-medium tracking-tight text-foreground">Physical Biometrics</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-0"
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </button>
        )}
      </div>
      <dl className="divide-y divide-border m-0 p-0">
        {details.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-between gap-4 px-5 py-3.5 md:px-6"
          >
            <dt className="text-sm text-muted-foreground">{d.label}</dt>
            <dd className="text-sm font-medium tracking-tight text-foreground m-0">
              {d.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default PersonalInformation;
