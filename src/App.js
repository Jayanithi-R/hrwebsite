import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
// Components
import Login from './components/loginpage';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Dashboard from './components/desktop';
import Schedule from './components/schedule';
import Attendance from './components/attendance';
import ProtectedRoute from './components/ProtectedRoute';


import { FavoritesProvider } from './components/favorites';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected dashboard layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FavoritesProvider>
              <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
                  <Header />
                  <Box sx={{ padding: '24px' }}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/attendance" element={<Attendance />} />
                      {/* Add more routes here */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
              </FavoritesProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
