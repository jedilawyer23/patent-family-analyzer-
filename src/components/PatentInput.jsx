import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useFamily, generateId } from '../context/FamilyContext';
import { fetchPatentFromUSPTO, formatPatentNumber } from '../services/uspto';
import {
  extractFirstIndependentClaim,
  generateInventiveConcept,
  inferRelationship,
} from '../services/claude';

function PatentInput({ claudeApiKey, usptoApiKey, disabled }) {
  const [patentNumber, setPatentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [familyDialog, setFamilyDialog] = useState({ open: false, members: [] });
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);
  const [addingFamily, setAddingFamily] = useState({ active: false, current: 0, total: 0 });
  const { state, dispatch } = useFamily();

  // Helper to add a single patent
  const addSinglePatent = async (patentNum, isFirstPatent = false) => {
    // 1. Fetch from USPTO + Google Patents
    const usptoData = await fetchPatentFromUSPTO(patentNum, usptoApiKey);

    // 2. Create initial member
    const newMember = {
      id: generateId(),
      patentNumber: usptoData.patentNumber,
      title: usptoData.title,
      date: usptoData.date,
      relationship: isFirstPatent ? 'original' : 'unknown',
      allClaims: usptoData.claimsText,
      firstIndependentClaim: '',
      inventiveConcept: '',
      overlapsWith: [],
      overlapExplanation: '',
      differentiation: '',
      googlePatentsUrl: usptoData.googlePatentsUrl,
      loading: true,
      error: null,
    };

    dispatch({ type: 'ADD_MEMBER', payload: newMember });

    // 3. Extract first independent claim (Claude)
    const firstClaim = await extractFirstIndependentClaim(claudeApiKey, usptoData.claimsText);
    dispatch({
      type: 'UPDATE_MEMBER',
      payload: { id: newMember.id, firstIndependentClaim: firstClaim },
    });

    // 4. Generate inventive concept (Claude)
    const concept = await generateInventiveConcept(claudeApiKey, firstClaim, usptoData.title);
    dispatch({
      type: 'UPDATE_MEMBER',
      payload: { id: newMember.id, inventiveConcept: concept },
    });

    // 5. Infer relationship (Claude) - skip for first patent
    if (!isFirstPatent) {
      const relationship = await inferRelationship(claudeApiKey, usptoData, state.members);
      dispatch({
        type: 'UPDATE_MEMBER',
        payload: { id: newMember.id, relationship, loading: false },
      });
    } else {
      dispatch({
        type: 'UPDATE_MEMBER',
        payload: { id: newMember.id, relationship: 'original', loading: false },
      });
    }

    return usptoData;
  };

  const handleAdd = async () => {
    if (!patentNumber.trim() || !claudeApiKey || !usptoApiKey) return;

    setLoading(true);
    setError(null);

    try {
      const isFirstPatent = state.members.length === 0;
      const usptoData = await addSinglePatent(patentNumber, isFirstPatent);

      setPatentNumber('');

      // Check for family members (only prompt if this is the first patent and family found)
      if (isFirstPatent && usptoData.familyMembers && usptoData.familyMembers.length > 0) {
        // Filter out any patents already in the family
        const existingNumbers = state.members.map(m => m.patentNumber);
        const newFamilyMembers = usptoData.familyMembers.filter(
          num => !existingNumbers.includes(num) && num !== usptoData.patentNumber
        );

        if (newFamilyMembers.length > 0) {
          setFamilyDialog({ open: true, members: newFamilyMembers });
          setSelectedFamilyMembers(newFamilyMembers); // Select all by default
        }
      }
    } catch (err) {
      setError(err.message);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFamilyMembers = async () => {
    const members = selectedFamilyMembers;
    setFamilyDialog({ open: false, members: [] });
    setSelectedFamilyMembers([]);

    if (members.length === 0) return;

    setAddingFamily({ active: true, current: 0, total: members.length });

    for (let i = 0; i < members.length; i++) {
      setAddingFamily({ active: true, current: i + 1, total: members.length });

      try {
        await addSinglePatent(members[i], false);
        // Small delay between fetches to avoid rate limiting
        if (i < members.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (err) {
        console.error(`Failed to add family member ${members[i]}:`, err.message);
        // Continue with next patent even if one fails
      }
    }

    setAddingFamily({ active: false, current: 0, total: 0 });
  };

  const handleFamilyMemberToggle = (patentNum) => {
    setSelectedFamilyMembers(prev => {
      if (prev.includes(patentNum)) {
        return prev.filter(num => num !== patentNum);
      } else {
        return [...prev, patentNum];
      }
    });
  };

  const handleSelectAllFamily = () => {
    setSelectedFamilyMembers(familyDialog.members);
  };

  const handleDeselectAllFamily = () => {
    setSelectedFamilyMembers([]);
  };

  const handleCloseDialog = () => {
    setFamilyDialog({ open: false, members: [] });
    setSelectedFamilyMembers([]);
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
          disabled={disabled || loading || addingFamily.active}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={disabled || loading || addingFamily.active || !patentNumber.trim()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </Box>

      {/* Progress indicator for adding family members */}
      {addingFamily.active && (
        <Box sx={{ mt: 2, maxWidth: '400px' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Adding family member {addingFamily.current} of {addingFamily.total}...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(addingFamily.current / addingFamily.total) * 100}
          />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2, maxWidth: '500px' }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Family members dialog */}
      <Dialog open={familyDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>US Patent Family Members Found</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Found {familyDialog.members.length} related US patents. Select which ones to add:
          </Typography>

          {/* Select All / Deselect All buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleSelectAllFamily}
              disabled={selectedFamilyMembers.length === familyDialog.members.length}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleDeselectAllFamily}
              disabled={selectedFamilyMembers.length === 0}
            >
              Deselect All
            </Button>
          </Box>

          {/* Checkbox list */}
          <Box sx={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #E0E0DE', borderRadius: '4px', p: 1 }}>
            <FormGroup>
              {familyDialog.members.map((num) => (
                <FormControlLabel
                  key={num}
                  control={
                    <Checkbox
                      checked={selectedFamilyMembers.includes(num)}
                      onChange={() => handleFamilyMemberToggle(num)}
                      sx={{
                        color: '#C85A54',
                        '&.Mui-checked': {
                          color: '#C85A54',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {formatPatentNumber(num)}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#6B6B6B' }}>
            {selectedFamilyMembers.length} of {familyDialog.members.length} selected
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleAddFamilyMembers}
            disabled={selectedFamilyMembers.length === 0}
            startIcon={<GroupAddIcon />}
            sx={{
              backgroundColor: '#C85A54',
              '&:hover': { backgroundColor: '#A84A44' },
            }}
          >
            Add Selected ({selectedFamilyMembers.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatentInput;
