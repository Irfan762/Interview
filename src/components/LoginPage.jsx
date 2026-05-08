import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      if (!isLogin && !formData.name) {
        throw new Error("Please enter your name");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data
      const userData = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("irfan147_user", JSON.stringify(userData));
      onLogin(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Background Decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        opacity: 0.1,
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, #FFD700, transparent)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #667eea, transparent)",
          borderRadius: "50%",
          filter: "blur(100px)",
        }} />
      </div>

      {/* Login Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95))",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: "48px 40px",
        maxWidth: 440,
        width: "100%",
        border: "2px solid rgba(255, 215, 0, 0.3)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 80,
            height: 80,
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            boxShadow: "0 8px 24px rgba(255, 215, 0, 0.4)",
          }}>
            🧠
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 32,
            fontWeight: "800",
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}>
            1-4-7 Tracker
          </h1>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: "#aaa",
          }}>
            Your SDE Placement Prep Companion
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          background: "rgba(255, 255, 255, 0.05)",
          padding: 4,
          borderRadius: 12,
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: 14,
              fontWeight: "600",
              background: isLogin ? "linear-gradient(135deg, #FFD700, #FFA500)" : "transparent",
              color: isLogin ? "#000" : "#aaa",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: 14,
              fontWeight: "600",
              background: !isLogin ? "linear-gradient(135deg, #FFD700, #FFA500)" : "transparent",
              color: !isLogin ? "#000" : "#aaa",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                fontWeight: "600",
                color: "#FFD700",
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Irfan Tamboli"
                required={!isLogin}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 14,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  outline: "none",
                  transition: "all 0.3s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#FFD700"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: "600",
              color: "#FFD700",
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="irfan@example.com"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 14,
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
                color: "#fff",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FFD700"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              fontWeight: "600",
              color: "#FFD700",
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 14,
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
                color: "#fff",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#FFD700"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: "12px 16px",
              marginBottom: 20,
              background: "rgba(244, 67, 54, 0.1)",
              border: "1px solid rgba(244, 67, 54, 0.3)",
              borderRadius: 10,
              color: "#f44336",
              fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 16,
              fontWeight: "bold",
              background: loading ? "#555" : "linear-gradient(135deg, #FFD700, #FFA500)",
              color: loading ? "#999" : "#000",
              border: "none",
              borderRadius: 12,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(255, 215, 0, 0.4)",
              transition: "all 0.3s",
              transform: loading ? "scale(0.98)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 215, 0, 0.4)";
              }
            }}
          >
            {loading ? "⏳ Please wait..." : isLogin ? "🚀 Login" : "✨ Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
        }}>
          <p style={{
            margin: 0,
            fontSize: 12,
            color: "#666",
          }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: "none",
                border: "none",
                color: "#FFD700",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: 20,
          padding: "12px 16px",
          background: "rgba(102, 126, 234, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.3)",
          borderRadius: 10,
        }}>
          <p style={{
            margin: 0,
            fontSize: 11,
            color: "#aaa",
            textAlign: "center",
          }}>
            💡 <strong style={{ color: "#667eea" }}>Demo:</strong> Use any email & password to login
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#666",
        fontSize: 12,
        zIndex: 1,
      }}>
        Built for <strong style={{ color: "#FFD700" }}>Irfan Tamboli</strong> • IIT KGP Winner 🏆
      </div>
    </div>
  );
}
