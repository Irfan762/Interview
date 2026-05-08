import { useState } from "react";
import { generateStudyPlan } from "../services/studyCoach";

export default function StudyPlanModal({ day, topics, onClose }) {
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generateStudyPlan(day, topics);
      setStudyPlan(plan);
    } catch (error) {
      console.error("Failed to generate study plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        borderRadius: 20,
        maxWidth: 900,
        width: "100%",
        maxHeight: "90vh",
        overflow: "hidden",
        border: "2px solid #FFD700",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 32px",
          borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))",
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: 24,
              fontWeight: "800",
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              📚 Day {day} Study Plan
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#aaa" }}>
              Your personalized SDE placement coach
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 10,
              padding: "8px 16px",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: "32px",
          overflowY: "auto",
          maxHeight: "calc(90vh - 100px)",
        }}>
          {!studyPlan ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🎯</div>
              <h3 style={{ color: "#FFD700", marginBottom: 16 }}>Ready to dominate Day {day}?</h3>
              <p style={{ color: "#aaa", marginBottom: 24, lineHeight: 1.6 }}>
                I'll generate your complete study plan including:<br/>
                DSA • Aptitude • Core CS • MERN Stack • English • HR • Revision
              </p>
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: "14px 32px",
                  fontSize: 16,
                  fontWeight: "bold",
                  background: loading ? "#555" : "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: loading ? "#999" : "#000",
                  border: "none",
                  borderRadius: 12,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(255, 215, 0, 0.4)",
                  transition: "all 0.3s",
                }}
              >
                {loading ? "⏳ Generating..." : "🚀 Generate Study Plan"}
              </button>
            </div>
          ) : (
            <div style={{ color: "#e0e0e0" }}>
              <div dangerouslySetInnerHTML={{ __html: studyPlan }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
