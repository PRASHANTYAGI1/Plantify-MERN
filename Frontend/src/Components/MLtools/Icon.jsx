import React from "react";
import * as Icons from "lucide-react";

/**
 * Icon wrapper — returns a lucide icon by name or a fallback.
 * Usage: <Icon name="Camera" className="w-5 h-5 text-blue-700" />
 */
export default function Icon({ name, className = "", ...rest }) {
  const Lucide = Icons[name];
  if (!Lucide) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} {...rest} />;
  }
  return <Lucide className={className} {...rest} />;
}
