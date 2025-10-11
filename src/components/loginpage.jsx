import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
// import Header from "../components/header";
import Attendance from "../components/atttendance"; // Fixed typo: atttendance -> attendance
import Desktop from "../components/desktop";

// function Sidebar() {
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <div style={{ width: "200px", background: "#2d2d2d", color: "#fff", padding: "1rem", height: "100vh" }}>
//       <h3 style={{ marginBottom: "1rem" }}>Menu</h3>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         <li style={{ marginBottom: "0.5rem" }}>
//           <button onClick={() => handleNavigation("/attendance")} style={{ width: "100%", padding: "0.5rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>
//             HR Dashboard
//           </button>
//         </li>
//         <li>
//           <button onClick={() => handleNavigation("/desktop")} style={{ width: "100%", padding: "0.5rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>
//             Admin Dashboard
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// }

// function DashboardLayout() {
//   return (
//     <div style={{ minHeight: "100vh" }}>
//       {/* <Header /> Added Header to show after login */}
//       <div style={{ display: "flex" }}>
//         {/* <Sidebar /> */}
//         <div style={{ flex: 1, padding: "2rem", background: "#f9fafb" }}>
//           <Routes>
//             <Route path="/attendance" element={<Attendance />} />
//             <Route path="/desktop" element={<Desktop />} />
//             <Route path="/" element={<Navigate to="/desktop" />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    const validCredentials = {
      HR: { username: "hr_user", password: "hr_pass" },
      Admin: { username: "admin_user", password: "admin_pass" },
    };

    const currentCredentials = validCredentials[role];
    if (currentCredentials && username === currentCredentials.username && password === currentCredentials.password) {
      setError("");
      setIsLoggedIn(true);
      // Navigate to the respective dashboard based on role
      navigate(role === "HR" ? "/attendance" : "/desktop");
    } else {
      setError("Invalid username or password");
    }
  };

  if (isLoggedIn) {
    // return <DashboardLayout />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <style>
        {`
          .login-container { background: #fff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 400px; }
          .login-title { font-size: 1.5rem; font-weight: 600; text-align: center; margin-bottom: 1rem; }
          .login-form { display: flex; flex-direction: column; gap: 1rem; }
          .login-input { padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; }
          .login-select { padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.25rem; }
          .login-button { background: #4f46e5; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; border: none; }
          .login-error { color: #dc2626; text-align: center; font-size: 0.875rem; }
        `}
      </style>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="login-select" required>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);
export default Login;