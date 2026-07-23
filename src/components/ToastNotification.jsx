import React from "react";

const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  const bgClasses = {
    success: "bg-emerald-600/90 border-emerald-400/30",
    error: "bg-rose-600/90 border-rose-400/30",
    info: "bg-blue-600/90 border-blue-400/30"
  };

  const icons = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️"
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[99999] ${bgClasses[toast.type] || bgClasses.info} text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 font-semibold text-sm animate-in slide-in-from-right duration-300`}
    >
      <span className="text-lg">{icons[toast.type] || "💡"}</span>
      <span>{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
