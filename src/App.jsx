import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
      <Box sx={{ p: 4 }}>
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

        {/* Content will go here */}
        <Box sx={{ color: '#6B6B6B', textAlign: 'center', py: 8 }}>
          {apiKey ? 'Ready to add patents' : 'Enter your Claude API key to get started'}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
