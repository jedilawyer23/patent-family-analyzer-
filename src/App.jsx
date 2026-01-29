import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import PatentInput from './components/PatentInput';
import FamilyTable from './components/FamilyTable';
import DetailPanel from './components/DetailPanel';
import { useFamily } from './context/FamilyContext';
import { analyzeFamily } from './services/claude';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');
  const [selectedMember, setSelectedMember] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { state, dispatch } = useFamily();

  const handleAnalyzeOverlap = async () => {
    if (state.members.length < 2 || !apiKey) return;

    setAnalyzing(true);
    try {
      const result = await analyzeFamily(apiKey, state.members);
      dispatch({ type: 'APPLY_ANALYSIS', payload: result.analysis });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearFamily = () => {
    dispatch({ type: 'CLEAR_FAMILY' });
    localStorage.removeItem('patent_family');
    setSelectedMember(null);
  };

  const canAnalyze = state.members.length >= 2 &&
    state.members.every(m => !m.loading) &&
    !state.analyzed;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header
        apiKeySet={!!apiKey}
        onClearFamily={handleClearFamily}
        hasFamilyMembers={state.members.length > 0}
      />
      <Box sx={{ p: 4 }}>
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

        {apiKey && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3 }}>
            <PatentInput apiKey={apiKey} disabled={!apiKey} />

            {state.members.length >= 2 && (
              <Button
                variant="outlined"
                onClick={handleAnalyzeOverlap}
                disabled={!canAnalyze || analyzing}
              >
                {analyzing ? 'Analyzing...' : state.analyzed ? 'Analysis Complete' : 'Analyze Overlap'}
              </Button>
            )}
          </Box>
        )}

        {state.members.length > 0 ? (
          <FamilyTable onRowClick={setSelectedMember} />
        ) : (
          <Box sx={{ color: '#6B6B6B', textAlign: 'center', py: 8 }}>
            {apiKey ? 'Enter a patent number to get started' : 'Enter your Claude API key to get started'}
          </Box>
        )}
      </Box>

      <DetailPanel
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </Box>
  );
}

export default App;
