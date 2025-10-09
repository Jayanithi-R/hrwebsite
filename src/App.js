import './App.css';
import { Box } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header';
import Dashboard from './components/desktop';
import Sidebar from './components/sidebar';
import Schedule from './components/schedule'; // ✅ correct import

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: '260px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <Box sx={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
