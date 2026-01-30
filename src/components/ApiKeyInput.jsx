import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from '@mui/material';

function ApiKeyInput({ claudeApiKey, usptoApiKey, onClaudeKeyChange, onUsptoKeyChange }) {
  const [claudeInput, setClaudeInput] = useState(claudeApiKey);
  const [usptoInput, setUsptoInput] = useState(usptoApiKey);
  const [isEditing, setIsEditing] = useState(!claudeApiKey || !usptoApiKey);

  const handleSave = () => {
    if (claudeInput.trim() && usptoInput.trim()) {
      localStorage.setItem('claude_api_key', claudeInput.trim());
      localStorage.setItem('uspto_api_key', usptoInput.trim());
      onClaudeKeyChange(claudeInput.trim());
      onUsptoKeyChange(usptoInput.trim());
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('claude_api_key');
    localStorage.removeItem('uspto_api_key');
    setClaudeInput('');
    setUsptoInput('');
    onClaudeKeyChange('');
    onUsptoKeyChange('');
    setIsEditing(true);
  };

  const bothKeysSet = claudeApiKey && usptoApiKey;

  if (!isEditing && bothKeysSet) {
    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            API Keys configured (Claude + USPTO)
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
        Keys are stored in your browser only. Don't use this on shared or public computers.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Claude API Key"
            type="password"
            value={claudeInput}
            onChange={(e) => setClaudeInput(e.target.value)}
            placeholder="sk-ant-..."
            size="small"
            sx={{ width: '400px' }}
          />
          <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
            From{' '}
            <Link href="https://console.anthropic.com/" target="_blank" rel="noopener">
              console.anthropic.com
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="USPTO PatentsView API Key"
            type="password"
            value={usptoInput}
            onChange={(e) => setUsptoInput(e.target.value)}
            placeholder="Your USPTO API key"
            size="small"
            sx={{ width: '400px' }}
          />
          <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
            Free from{' '}
            <Link href="https://patentsview.org/apis/keyrequest" target="_blank" rel="noopener">
              patentsview.org
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!claudeInput.trim() || !usptoInput.trim()}
          >
            Save Keys
          </Button>
          {bothKeysSet && (
            <Button
              variant="outlined"
              onClick={() => {
                setClaudeInput(claudeApiKey);
                setUsptoInput(usptoApiKey);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ApiKeyInput;
