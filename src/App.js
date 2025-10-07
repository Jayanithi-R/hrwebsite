import './App.css';
import { Box, Grid, Stack } from '@mui/material';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AttendanceReport from './components/AttendanceReport';
import TasksList from './components/TasksList';
import Schedule from './components/Schedule';
import LeaveRequests from './components/LeaveRequests';
import Meetings from './components/Meetings';
import Internship from './components/Internship';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Topbar />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <AttendanceReport />
              <LeaveRequests />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <TasksList />
              <Schedule />
              <Internship />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Meetings />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
