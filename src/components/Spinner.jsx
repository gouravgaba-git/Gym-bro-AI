import React from "react";
import { Loader2 } from "lucide-react";

const Spinner = ({ message = "Analyzing biometrics & generating plan..." }) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-border bg-card shadow-xs animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-foreground" />
      <p className="text-sm font-medium text-muted-foreground m-0">{message}</p>
    </div>
  );
};

export default Spinner;
