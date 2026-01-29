import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
      <Box sx={{ p: 4 }}>
        {/* Content will go here */}
        <Box sx={{ color: '#6B6B6B', textAlign: 'center', py: 8 }}>
          Patent Family Analyzer - Coming Soon
        </Box>
      </Box>
    </Box>
  );
}

export default App;
