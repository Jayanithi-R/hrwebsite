import './App.css';
import { Box } from '@mui/material';

// Components
import Header from './components/header';
import Dashboard from './components/desktop';
import Sidebar from './components/sidebar';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ padding: '24px' }}>
          <Dashboard />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
