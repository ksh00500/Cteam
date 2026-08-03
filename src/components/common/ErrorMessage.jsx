import React from "react";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="setstop-card" style={{
      backgroundColor: "#fef2f2",
      borderColor: "#fca5a5",
      textAlign: "center",
      padding: "1.25rem"
    }}>
      <p style={{ color: "#dc2626", fontWeight: 700, marginBottom: onRetry ? "0.75rem" : 0 }}>
        ⚠️ {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            fontSize: "0.85rem",
            fontWeight: "800",
            color: "#dc2626",
            textDecoration: "underline",
            cursor: "pointer"
          }}
        >
          다시 시도하기
        </button>
      )}
    </div>
  );
}
