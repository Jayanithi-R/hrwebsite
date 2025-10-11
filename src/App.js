import './App.css';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header';
import Sidebar from './components/sidebar';
import Dashboard from './components/desktop';
// import Schedule from './components/schedule';
// import Attendance from './components/attendance';
// import Departments from './components/departments';
// import Integrations from './components/integrations';
// import Reports from './components/reports';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box sx={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/schedule" element={<Schedule />} /> */}
              {/* <Route path="/attendance" element={<Attendance />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/reports" element={<Reports />} /> */}
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
