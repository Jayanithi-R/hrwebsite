// src/components/loginpage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const validCredentials = {
      HR: { username: "hr_user", password: "hr_pass" },
      Admin: { username: "admin_user", password: "admin_pass" },
    };

    const current = validCredentials[role];
    if (current && username === current.username && password === current.password) {
      setError("");
      setIsLoggedIn(true); // update state in App.js
      navigate(role === "HR" ? "/attendance" : "/desktop");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="login-container" style={{
        background: "#fff", padding: "2rem", borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "400px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
        {error && <div style={{ color: "#dc2626", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #e5e7eb" }}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #e5e7eb" }}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #e5e7eb" }}
          >
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              border: "none"
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
