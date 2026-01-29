import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import harveyTheme from './theme/harveyTheme';
import { FamilyProvider } from './context/FamilyContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={harveyTheme}>
      <CssBaseline />
      <FamilyProvider>
        <App />
      </FamilyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
