import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Collapse,
} from '@mui/material';

function ApiKeyInput({ apiKey, onApiKeyChange }) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSave = () => {
    if (inputValue.trim()) {
      localStorage.setItem('claude_api_key', inputValue.trim());
      onApiKeyChange(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('claude_api_key');
    setInputValue('');
    onApiKeyChange('');
    setIsEditing(true);
  };

  if (!isEditing && apiKey) {
    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Claude API Key configured
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsEditing(true)}
            sx={{ fontSize: '13px' }}
          >
            Change
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClear}
            sx={{ fontSize: '13px', color: '#8B3A3A', borderColor: '#C85A54' }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Alert
        severity="warning"
        sx={{
          mb: 2,
          backgroundColor: '#FFF8E7',
          border: '1px solid #D4A574',
          '& .MuiAlert-icon': { color: '#8B6B3A' }
        }}
      >
        This key is stored in your browser only and sent directly to Claude's API.
        Don't use this on shared or public computers.
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          label="Claude API Key"
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-ant-..."
          size="small"
          sx={{ width: '400px' }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!inputValue.trim()}
        >
          Save Key
        </Button>
        {apiKey && (
          <Button
            variant="outlined"
            onClick={() => {
              setInputValue(apiKey);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ApiKeyInput;
