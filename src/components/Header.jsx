import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';

function Header({ apiKeySet }) {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#FFFFFF',
        boxShadow: 'none',
        borderBottom: '1px solid #E0E0DE'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            fontSize: '24px',
            color: '#1A1A1A',
          }}
        >
          Patent Family Analyzer
        </Typography>
        <Box>
          {apiKeySet ? (
            <Chip
              label="API Key: ••••"
              size="small"
              sx={{
                backgroundColor: '#E5E5E3',
                color: '#1A1A1A',
                fontWeight: 400,
              }}
            />
          ) : (
            <Chip
              label="No API Key"
              size="small"
              sx={{
                backgroundColor: 'transparent',
                border: '1px solid #D4A574',
                color: '#8B6B3A',
                fontWeight: 400,
              }}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
