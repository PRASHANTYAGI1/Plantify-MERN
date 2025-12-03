// src/components/global/AlertMessage.jsx
import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function AlertMessage({
  type = "info",
  message = "Important notification",
  duration = 5000, // auto-hide after 5 sec
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const styles = {
    info: {
      icon: <Info size={20} className="text-blue-600" />,
      border: "border-blue-300",
      bg: "bg-white",
    },
    warning: {
      icon: <AlertTriangle size={20} className="text-yellow-700" />,
      border: "border-yellow-300",
      bg: "bg-white",
    },
    danger: {
      icon: <XCircle size={20} className="text-red-600" />,
      border: "border-red-300",
      bg: "bg-white",
    },
    success: {
      icon: <CheckCircle size={20} className="text-emerald-600" />,
      border: "border-emerald-300",
      bg: "bg-white",
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className="
        fixed right-6 top-20 z-[9999]
        animate-toastSlideIn
      "
    >
      <div
        className={`
          min-w-[260px] max-w-sm shadow-lg rounded-xl px-4 py-3 
          flex items-start gap-3 border ${style.border} ${style.bg}
          backdrop-blur-sm
        `}
      >
        {/* Icon */}
        <div className="mt-0.5">{style.icon}</div>

        {/* Message */}
        <p className="text-sm text-gray-800 leading-tight flex-1">
          {message}
        </p>

        {/* Close */}
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
