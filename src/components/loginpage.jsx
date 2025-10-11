// src/components/loginpage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const validCredentials = {
      User: { username: "user1", password: "userpass" },
      HR: { username: "hr_user", password: "hr_pass" },
      Admin: { username: "admin_user", password: "admin_pass" },
    };

    const current = validCredentials[role];
    if (current && username === current.username && password === current.password) {
      setError("");
      setIsLoggedIn(true);
      navigate(role === "HR" ? "/attendance" : "/desktop");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
      }}
    >
      <div
        className="login-container"
        style={{
          background: "#fff",
          padding: "2.5rem 3rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Logo */}
        {/* <img
          src="/logo.png"
          alt="Company Logo"
          style={{ width: "120px", marginBottom: "1rem" }}
        /> */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          Welcome Back
        </h1>
        <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
          Please login to your account
        </p>

        {error && (
          <div
            style={{
              color: "#dc2626",
              marginBottom: "1rem",
              fontWeight: "500",
              fontSize: "0.95rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          >
            <option value="User">User</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Remember Me + Forgot Password */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.9rem",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <a href="/forgot-password" style={{ color: "#4f46e5" }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#4338ca")}
            onMouseLeave={(e) => (e.target.style.background = "#4f46e5")}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "#6b7280" }}>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
