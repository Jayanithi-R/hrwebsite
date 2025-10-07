import './App.css';
import { Box, Grid, Stack } from '@mui/material';
// import Sidebar from './components/attendance-sidebar';
import header from './components/header';
import AttendanceReport from './components/attendance';
import TasksList from './components/Tasks';
import Schedule from './components/schedule-pannel';
import LeaveRequests from './components/LeaveRequests';
// import Meetings from './components/Meetings';
import Internship from './components/internship-card';
import  Header  from './components/header';
import  StatsCard  from './components/StatsCard';


function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
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
