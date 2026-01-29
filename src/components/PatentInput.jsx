import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFamily, generateId } from '../context/FamilyContext';
import { fetchPatentFromUSPTO, formatPatentNumber } from '../services/uspto';
import {
  extractFirstIndependentClaim,
  generateInventiveConcept,
  inferRelationship,
} from '../services/claude';

function PatentInput({ apiKey, disabled }) {
  const [patentNumber, setPatentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state, dispatch } = useFamily();

  const handleAdd = async () => {
    if (!patentNumber.trim() || !apiKey) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch from USPTO
      const usptoData = await fetchPatentFromUSPTO(patentNumber);

      // 2. Create initial member
      const newMember = {
        id: generateId(),
        patentNumber: usptoData.patentNumber,
        title: usptoData.title,
        date: usptoData.date,
        relationship: 'unknown',
        allClaims: usptoData.claimsText,
        firstIndependentClaim: '',
        inventiveConcept: '',
        overlapsWith: [],
        overlapExplanation: '',
        differentiation: '',
        loading: true,
        error: null,
      };

      dispatch({ type: 'ADD_MEMBER', payload: newMember });

      // 3. Extract first independent claim (Claude)
      const firstClaim = await extractFirstIndependentClaim(apiKey, usptoData.claimsText);
      dispatch({
        type: 'UPDATE_MEMBER',
        payload: { id: newMember.id, firstIndependentClaim: firstClaim },
      });

      // 4. Generate inventive concept (Claude)
      const concept = await generateInventiveConcept(apiKey, firstClaim, usptoData.title);
      dispatch({
        type: 'UPDATE_MEMBER',
        payload: { id: newMember.id, inventiveConcept: concept },
      });

      // 5. Infer relationship (Claude)
      const relationship = await inferRelationship(apiKey, usptoData, state.members);
      dispatch({
        type: 'UPDATE_MEMBER',
        payload: { id: newMember.id, relationship, loading: false },
      });

      setPatentNumber('');
    } catch (err) {
      setError(err.message);
      // Remove the failed member if it was added
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && patentNumber.trim()) {
      handleAdd();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          label="Patent Number"
          value={patentNumber}
          onChange={(e) => setPatentNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., US10123456 or 10123456"
          size="small"
          disabled={disabled || loading}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={disabled || loading || !patentNumber.trim()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </Box>
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2, maxWidth: '500px' }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default PatentInput;
