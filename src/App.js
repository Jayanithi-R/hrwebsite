import './App.css';
import { Box, useMediaQuery, useTheme } from '@mui/material';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

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
                  <Sidebar 
                    open={sidebarOpen} 
                    onClose={handleSidebarClose}
                    isMobile={isMobile}
                  />
                  <Box 
                    sx={{ 
                      flexGrow: 1, 
                      marginLeft: isMobile ? 0 : '260px',
                      transition: 'margin-left 0.3s ease',
                      display: 'flex', 
                      flexDirection: 'column',
                      width: isMobile ? '100%' : 'calc(100% - 260px)'
                    }}
                  >
                    <Header onMenuToggle={handleSidebarToggle} />
                    <Box sx={{ padding: { xs: '16px', sm: '20px', md: '24px' } }}>
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