import React from "react";

const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  const bgColors = {
    success: "linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)",
    error: "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)",
    info: "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)"
  };

  const icons = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️"
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        background: bgColors[toast.type] || bgColors.info,
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 99999,
        fontWeight: "600",
        fontSize: "14px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <span style={{ fontSize: "18px" }}>{icons[toast.type] || "💡"}</span>
      <span>{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
