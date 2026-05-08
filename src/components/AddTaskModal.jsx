import { useState } from "react";

export default function AddTaskModal({ day, onAdd, onClose }) {
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("DSA");
  const [tip, setTip] = useState("");

  const tags = ["DSA", "APT", "CS", "ENG", "HR", "MOCK", "REV", "CUSTOM"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAdd({
      topic: topic.trim(),
      tag,
      tip: tip.trim() || "Custom task added by you",
    });

    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.3s ease-in-out",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        borderRadius: 20,
        maxWidth: 500,
        width: "100%",
        border: "2px solid #FFD700",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        animation: "slideIn 0.3s ease-out",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px",
          borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))",
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: "800",
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            ➕ Add Custom Task to Day {day}
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, color: "#aaa" }}>
            Add your own study topics or tasks
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
          {/* Topic Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: "600",
              color: "#FFD700",
            }}>
              📝 Task/Topic *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Practice System Design, Review React Hooks"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 14,
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                color: "#fff",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FFD700"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          {/* Tag Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: "600",
              color: "#FFD700",
            }}>
              🏷️ Category
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: "bold",
                    background: tag === t ? "linear-gradient(135deg, #FFD700, #FFA500)" : "rgba(255, 255, 255, 0.05)",
                    color: tag === t ? "#000" : "#aaa",
                    border: `2px solid ${tag === t ? "#FFD700" : "rgba(255, 255, 255, 0.1)"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (tag !== t) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tag !== t) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tip Input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: "600",
              color: "#FFD700",
            }}>
              💡 Tip/Note (Optional)
            </label>
            <textarea
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Add a reminder or study tip..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 14,
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                color: "#fff",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FFD700"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                fontSize: 14,
                fontWeight: "600",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#aaa",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#aaa";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: 14,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#000",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255, 215, 0, 0.4)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 215, 0, 0.4)";
              }}
            >
              ✓ Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
