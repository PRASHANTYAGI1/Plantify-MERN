import React from "react";

export default function Spinner({ className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-block ${className}`}
      title="loading"
    >
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
}
