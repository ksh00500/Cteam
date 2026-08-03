import React from "react";

export default function LoadingMessage({ message = "로딩 중입니다..." }) {
  return (
    <div className="setstop-card" style={{ textAlign: "center", padding: "2rem" }}>
      <div style={{
        display: "inline-block",
        width: "32px",
        height: "32px",
        border: "4px solid #e2e8f0",
        borderTopColor: "#2563eb",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        marginBottom: "1rem"
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ fontWeight: 700, color: "#475569" }}>{message}</p>
    </div>
  );
}
