import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { FavoritesProvider } from './components/header_sidebar/favorites';

// Components
import Login from './components/login,forgetpass/loginpage';
import ProtectedRoute from './components/login,forgetpass/ProtectedRoute';
import Layout from './components/header_sidebar/layout';
import ScheduleMng from './components/schedule/schedulemanagement';
// Pages
import Dashboard from './components/desktop/desktop';
import Schedule from './components/schedule/schedule';
import Attendance from './components/Attendence_components/attendence';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected layout with header + sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FavoritesProvider>
                <Layout />
              </FavoritesProvider>
            </ProtectedRoute>
          }
        >
          {/* Child routes */}
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<ScheduleMng />} />
          {/* <Route path="schedule" element={<Schedule />} /> */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
