import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FavoritesProvider } from './components/header_sidebar/favorites';

// Components
import Login from './components/login,forgetpass/loginpage';
import ProtectedRoute from './components/login,forgetpass/ProtectedRoute';
import Layout from './components/header_sidebar/layout';
import ScheduleMng from './components/schedule/schedulemanagement';
import Attendance from './components/Attendence_components/attendence';

// Import the components that were causing errors
import CourseDashboardEnhanced from './components/schedule/ListView'; // This is correct
import GoogleCalendarReplica from './components/schedule/CalendarView'; // FIXED: Changed from 'calender' to 'CalendarView'

// Pages - Create these basic components if they don't exist
import Dashboard from './components/desktop/desktop'; // FIXED: Import actual dashboard
const Schedule = () => <div>Schedule Component - Create this file</div>;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [events, setEvents] = useState([]);

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('courseDashboardEvents');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(Array.isArray(parsedEvents) ? parsedEvents : []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error parsing events from localStorage:', error);
      setEvents([]);
    }
  }, []);

  // Save events to localStorage when events change
  useEffect(() => {
    localStorage.setItem('courseDashboardEvents', JSON.stringify(events));
  }, [events]);

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
                <Layout setCurrentView={setCurrentView}>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route
                      path="dashboard"
                      element={<CourseDashboardEnhanced events={events} setEvents={setEvents} />}
                    />
                    <Route
                      path="calendar"
                      element={<GoogleCalendarReplica events={events} />}
                    />
                    <Route path="schedule" element={<ScheduleMng events={events} setEvents={setEvents} />} />
                    <Route path="schedule-old" element={<Schedule />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              </FavoritesProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;