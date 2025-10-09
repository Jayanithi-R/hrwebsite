import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Desktop from "./components/desktop";
// import Attendance from "./components/attendance";
// import Sidebar from "./components/Sidebar";
import Schedule from "./components/schedule";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "260px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<h1 style={{ padding: "2rem" }}>Dashboard</h1>} />
            <Route path="/schedule" element={<Schedule />} />
            {/* <Route path="/attendance" element={<Attendance />} /> */}
            <Route path="/desktop" element={<Desktop />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
