// src/components/orders/StatusBadge.jsx
import React from "react";
import {
  Clock,
  PackageCheck,
  Truck,
  XCircle,
  CheckCircle,
  Hourglass,
  RefreshCw,
} from "lucide-react";

const STATUS_MAP = {
  pending: {
    icon: <Clock size={14} />,
    label: "Pending",
    classes: "bg-yellow-100 text-yellow-700",
  },
  shipped: {
    icon: <Truck size={14} />,
    label: "Shipped",
    classes: "bg-blue-100 text-blue-700",
  },
  delivered: {
    icon: <PackageCheck size={14} />,
    label: "Delivered",
    classes: "bg-green-100 text-green-700",
  },
  cancelled: {
    icon: <XCircle size={14} />,
    label: "Cancelled",
    classes: "bg-red-100 text-red-700",
  },
  "return-requested": {
    icon: <RefreshCw size={14} />,
    label: "Return Requested",
    classes: "bg-orange-100 text-orange-700",
  },
  returned: {
    icon: <CheckCircle size={14} />,
    label: "Returned",
    classes: "bg-green-100 text-green-700",
  },
  "in-use": {
    icon: <Hourglass size={14} />,
    label: "In Use",
    classes: "bg-purple-100 text-purple-700",
  },
};

export default function StatusBadge({ status = "pending", size = "md" }) {
  const data = STATUS_MAP[status] || {
    icon: <CheckCircle size={14} />,
    label: "Unknown",
    classes: "bg-gray-100 text-gray-600",
  };

  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : size === "lg"
      ? "px-4 py-1.5 text-sm"
      : "px-3 py-1 text-sm";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full shadow-sm
        transition-all duration-300 animate-fadeIn
        ${data.classes} ${sizeClass}
      `}
    >
      {data.icon}
      {data.label}
    </span>
  );
}
