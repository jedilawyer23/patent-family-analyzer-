import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import PatentInput from './components/PatentInput';
import { useFamily } from './context/FamilyContext';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');
  const { state } = useFamily();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
      <Box sx={{ p: 4 }}>
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

        {apiKey && (
          <PatentInput apiKey={apiKey} disabled={!apiKey} />
        )}

        {/* Temporary: Show member count */}
        <Box sx={{ color: '#6B6B6B', py: 4 }}>
          {state.members.length === 0
            ? (apiKey ? 'Enter a patent number to get started' : 'Enter your Claude API key to get started')
            : `${state.members.length} patent(s) in family`
          }
        </Box>

        {/* Debug: Show members */}
        {state.members.map(m => (
          <Box key={m.id} sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>{m.patentNumber}</strong> - {m.title}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Relationship: {m.relationship} | Loading: {m.loading ? 'Yes' : 'No'}
            </Typography>
            {m.inventiveConcept && (
              <Typography variant="body2" sx={{ mt: 1, color: '#6B6B6B' }}>
                Concept: {m.inventiveConcept}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default App;
