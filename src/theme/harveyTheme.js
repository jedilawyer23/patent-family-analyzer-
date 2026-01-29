import { createTheme } from '@mui/material/styles';

const harveyTheme = createTheme({
  palette: {
    background: {
      default: '#F7F7F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B6B6B',
      disabled: '#9B9B9B',
    },
    divider: '#E0E0DE',
    primary: {
      main: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
      fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2rem)',
      color: '#1A1A1A',
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
      fontSize: 'clamp(1.25rem, 1rem + 0.8vw, 1.5rem)',
      color: '#1A1A1A',
    },
    body1: {
      fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
      color: '#1A1A1A',
    },
    body2: {
      fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)',
      color: '#6B6B6B',
    },
    caption: {
      fontSize: 'clamp(0.625rem, 0.6rem + 0.15vw, 0.75rem)',
      color: '#9B9B9B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #E0E0DE',
          borderRadius: '8px',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            borderColor: '#D8D8D6',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: '#D8D8D6',
          color: '#1A1A1A',
          textTransform: 'none',
          fontWeight: 400,
          borderRadius: '8px',
          '&:hover': {
            borderColor: '#1A1A1A',
            backgroundColor: 'transparent',
          },
        },
        contained: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          textTransform: 'none',
          fontWeight: 400,
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#333333',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#E0E0DE',
            },
            '&:hover fieldset': {
              borderColor: '#D8D8D6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1A1A1A',
              borderWidth: '1px',
            },
          },
        },
      },
    },
  },
});

export default harveyTheme;
