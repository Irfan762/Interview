import { useState } from "react";
import { api } from "../services/api";

export default function SyncButton({ done, onSync }) {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setSyncing(true);
    setMessage("");
    
    try {
      await api.bulkUpdateProgress(done);
      setMessage("✓ Synced successfully!");
      if (onSync) onSync();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("✗ Sync failed");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <button
        onClick={handleSync}
        disabled={syncing}
        style={{
          padding: "8px 18px",
          fontSize: 12,
          borderRadius: 10,
          border: "2px solid",
          borderColor: syncing ? "#555" : "#FFD700",
          background: syncing 
            ? "rgba(51, 51, 51, 0.6)" 
            : "linear-gradient(135deg, #FFD700, #FFA500)",
          color: syncing ? "#666" : "#000",
          cursor: syncing ? "not-allowed" : "pointer",
          fontWeight: "bold",
          transition: "all 0.3s",
          boxShadow: syncing ? "none" : "0 4px 12px rgba(255, 215, 0, 0.3)",
          transform: syncing ? "scale(0.98)" : "scale(1)",
          backdropFilter: "blur(5px)",
        }}
        onMouseEnter={(e) => {
          if (!syncing) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 215, 0, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          if (!syncing) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.3)";
          }
        }}
      >
        {syncing ? "⏳ Syncing..." : "🔄 Sync to Backend"}
      </button>
      {message && (
        <span style={{
          fontSize: 12,
          color: message.includes("✓") ? "#4CAF50" : "#E65100",
          fontWeight: "bold",
          padding: "6px 12px",
          background: message.includes("✓") 
            ? "rgba(76, 175, 80, 0.1)" 
            : "rgba(230, 81, 0, 0.1)",
          borderRadius: 8,
          border: `1px solid ${message.includes("✓") ? "rgba(76, 175, 80, 0.3)" : "rgba(230, 81, 0, 0.3)"}`,
          animation: "fadeIn 0.3s ease-in-out"
        }}>
          {message}
        </span>
      )}
    </div>
  );
}
