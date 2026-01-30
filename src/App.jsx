import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import PatentInput from './components/PatentInput';
import FamilyTable from './components/FamilyTable';
import DetailPanel from './components/DetailPanel';
import CompareClaimsModal from './components/CompareClaimsModal';
import { useFamily } from './context/FamilyContext';

function App() {
  const [claudeApiKey, setClaudeApiKey] = useState(localStorage.getItem('claude_api_key') || '');
  const [usptoApiKey, setUsptoApiKey] = useState(localStorage.getItem('uspto_api_key') || '');
  const [selectedMember, setSelectedMember] = useState(null);
  const [compareSelection, setCompareSelection] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const { state, dispatch } = useFamily();

  const apiKeysSet = claudeApiKey && usptoApiKey;

  const handleClearFamily = () => {
    dispatch({ type: 'CLEAR_FAMILY' });
    localStorage.removeItem('patent_family');
    setSelectedMember(null);
    setCompareSelection([]);
  };

  const handleCompareClick = () => {
    if (compareSelection.length === 2) {
      setCompareModalOpen(true);
    }
  };

  // Get the selected patent objects for comparison
  const getSelectedPatents = () => {
    const [idA, idB] = compareSelection;
    const patentA = state.members.find(m => m.id === idA);
    const patentB = state.members.find(m => m.id === idB);
    return { patentA, patentB };
  };

  const canCompare = compareSelection.length === 2;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header
        apiKeySet={apiKeysSet}
        onClearFamily={handleClearFamily}
        hasFamilyMembers={state.members.length > 0}
      />
      <Box sx={{ p: 4 }}>
        <ApiKeyInput
          claudeApiKey={claudeApiKey}
          usptoApiKey={usptoApiKey}
          onClaudeKeyChange={setClaudeApiKey}
          onUsptoKeyChange={setUsptoApiKey}
        />

        {apiKeysSet && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 3, flexWrap: 'wrap' }}>
            <PatentInput claudeApiKey={claudeApiKey} usptoApiKey={usptoApiKey} disabled={!apiKeysSet} />

            {state.members.length >= 2 && (
              <Button
                variant="contained"
                onClick={handleCompareClick}
                disabled={!canCompare}
                startIcon={<CompareArrowsIcon />}
                sx={{
                  backgroundColor: '#C85A54',
                  '&:hover': {
                    backgroundColor: '#A84A44',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#E0E0DE',
                  },
                }}
              >
                Compare Claims {canCompare ? '' : `(${compareSelection.length}/2)`}
              </Button>
            )}
          </Box>
        )}

        {state.members.length > 0 ? (
          <FamilyTable
            onRowClick={setSelectedMember}
            selectedIds={compareSelection}
            onSelectionChange={setCompareSelection}
          />
        ) : (
          <Box sx={{ color: '#6B6B6B', textAlign: 'center', py: 8 }}>
            {apiKeysSet ? 'Enter a patent number to get started' : 'Enter your API keys to get started'}
          </Box>
        )}
      </Box>

      <DetailPanel
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <CompareClaimsModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        patentA={getSelectedPatents().patentA}
        patentB={getSelectedPatents().patentB}
        claudeApiKey={claudeApiKey}
      />
    </Box>
  );
}

export default App;
