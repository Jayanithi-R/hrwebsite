import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Header from './header';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
        isMobile={isMobile}
      />

      {/* Main Section */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isMobile ? 0 : '260px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : 'calc(100% - 260px)',
        }}
      >
        {/* Header */}
        <Header onMenuToggle={handleSidebarToggle} />

        {/* Page Display Area */}
        <Box sx={{ padding: { xs: '16px', sm: '20px', md: '24px' }, flexGrow: 1 }}>
          <Outlet /> {/* Displays current route page */}
        </Box>
      </Box>
    </Box>
  );
}
