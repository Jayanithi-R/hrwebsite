import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    primary: { main: '#4f46e5' },
    secondary: { main: '#22c55e' },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(2,6,23,0.08)'
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
