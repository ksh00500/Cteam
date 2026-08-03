import React from "react";

export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`setstop-container ${className}`}>
      {children}
    </div>
  );
}
