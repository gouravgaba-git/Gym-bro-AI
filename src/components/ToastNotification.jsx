import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "../lib/utils";

const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[99999] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md text-sm font-medium animate-in slide-in-from-bottom-5 duration-300 max-w-sm",
        isSuccess
          ? "border-emerald-500/30 bg-card text-foreground"
          : isError
          ? "border-destructive/40 bg-card text-destructive"
          : "border-border bg-card text-foreground"
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0" />
      ) : isError ? (
        <AlertCircle className="size-4.5 text-destructive shrink-0" />
      ) : (
        <Info className="size-4.5 text-muted-foreground shrink-0" />
      )}
      <span className="leading-snug text-pretty">{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
