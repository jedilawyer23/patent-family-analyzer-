# Patent Family Analyzer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page React app that fetches patent data from USPTO, uses Claude AI to extract insights, and displays results in an interactive table.

**Architecture:** React SPA with Context API for state, direct API calls to USPTO (no auth) and Claude (user-provided key), Material UI components styled with Harvey aesthetic, localStorage for persistence.

**Tech Stack:** React 18, Vite, Material UI, Claude API (Anthropic SDK), USPTO PatentsView API

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`
- Create: `.env.example`

**Step 1: Initialize Vite React project**

Run:
```bash
cd /Users/shrut/Documents/GitHub/Patent-claim-demo
npm create vite@latest . -- --template react
```

Select: Overwrite existing files if prompted

**Step 2: Install dependencies**

Run:
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @anthropic-ai/sdk
```

**Step 3: Create .env.example**

Create `.env.example`:
```
# Get your API key from https://console.anthropic.com/
VITE_CLAUDE_API_KEY=your-api-key-here
```

**Step 4: Update .gitignore**

Add to `.gitignore`:
```
.env
```

**Step 5: Verify setup**

Run:
```bash
npm run dev
```

Expected: Vite dev server starts at http://localhost:5173

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Vite React project with dependencies"
```

---

## Task 2: Harvey Theme Setup

**Files:**
- Create: `src/theme/harveyTheme.js`
- Modify: `src/main.jsx`
- Modify: `src/index.css`

**Step 1: Create Harvey theme file**

Create `src/theme/harveyTheme.js`:
```javascript
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
```

**Step 2: Update main.jsx with ThemeProvider**

Replace `src/main.jsx`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import harveyTheme from './theme/harveyTheme';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={harveyTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

**Step 3: Update index.css with base styles**

Replace `src/index.css`:
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #F7F7F5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --font-heading: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  --font-body: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --font-table: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --font-label: clamp(0.625rem, 0.6rem + 0.15vw, 0.75rem);
}
```

**Step 4: Verify theme applies**

Run:
```bash
npm run dev
```

Expected: Page has warm off-white background (#F7F7F5)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Harvey AI theme with responsive typography"
```

---

## Task 3: App Shell and Header

**Files:**
- Create: `src/components/Header.jsx`
- Modify: `src/App.jsx`

**Step 1: Create Header component**

Create `src/components/Header.jsx`:
```javascript
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
```

**Step 2: Update App.jsx with shell**

Replace `src/App.jsx`:
```javascript
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
      <Box sx={{ p: 4 }}>
        {/* Content will go here */}
        <Box sx={{ color: '#6B6B6B', textAlign: 'center', py: 8 }}>
          Patent Family Analyzer - Coming Soon
        </Box>
      </Box>
    </Box>
  );
}

export default App;
```

**Step 3: Verify header renders**

Run:
```bash
npm run dev
```

Expected: White header with "Patent Family Analyzer" title and "No API Key" chip

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add app shell with Header component"
```

---

## Task 4: API Key Input Component

**Files:**
- Create: `src/components/ApiKeyInput.jsx`
- Modify: `src/App.jsx`

**Step 1: Create ApiKeyInput component**

Create `src/components/ApiKeyInput.jsx`:
```javascript
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
```

**Step 2: Add ApiKeyInput to App**

Update `src/App.jsx`:
```javascript
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
```

**Step 3: Verify API key input works**

Run:
```bash
npm run dev
```

Test:
1. Should show warning alert and input field
2. Enter a test key, click Save
3. Should collapse to "configured" state
4. Refresh page - key should persist
5. Click Clear - should return to input state

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add API key input with localStorage persistence"
```

---

## Task 5: USPTO Service

**Files:**
- Create: `src/services/uspto.js`

**Step 1: Create USPTO service**

Create `src/services/uspto.js`:
```javascript
const PATENTSVIEW_API = 'https://api.patentsview.org/patents/query';

/**
 * Normalize patent number to USPTO format
 * Accepts: "US10123456", "10123456", "US 10,123,456", "10,123,456"
 * Returns: "10123456"
 */
function normalizePatentNumber(input) {
  return input
    .toUpperCase()
    .replace(/^US\s*/i, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
}

/**
 * Format patent number for display
 * Input: "10123456"
 * Output: "US10,123,456"
 */
export function formatPatentNumber(number) {
  const normalized = normalizePatentNumber(number);
  // Add commas for readability
  const formatted = normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `US${formatted}`;
}

/**
 * Fetch patent data from USPTO PatentsView API
 */
export async function fetchPatentFromUSPTO(patentNumber) {
  const normalized = normalizePatentNumber(patentNumber);

  const query = {
    q: { patent_number: normalized },
    f: [
      'patent_number',
      'patent_title',
      'patent_abstract',
      'patent_date',
      'patent_type',
      'claims'
    ],
    o: {
      include_subentity_total_counts: false
    }
  };

  const response = await fetch(PATENTSVIEW_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`USPTO API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.patents || data.patents.length === 0) {
    throw new Error(`Patent ${patentNumber} not found. Note: Only granted US patents are available.`);
  }

  const patent = data.patents[0];

  // Extract claims text
  const claimsText = patent.claims
    ?.map(c => c.claim_text)
    .join('\n\n') || '';

  return {
    patentNumber: patent.patent_number,
    title: patent.patent_title,
    abstract: patent.patent_abstract,
    date: patent.patent_date,
    type: patent.patent_type,
    claimsText: claimsText,
  };
}

/**
 * Determine relationship type from patent data
 * This is a basic heuristic - USPTO doesn't provide direct parent/child info in PatentsView
 */
export function inferRelationship(patentData, existingPatents) {
  // If this is the first patent, it's the original
  if (existingPatents.length === 0) {
    return 'original';
  }

  // PatentsView doesn't give us continuation data directly
  // We'll mark as 'unknown' and let Claude analyze later
  return 'unknown';
}
```

**Step 2: Test USPTO service manually**

Open browser console at http://localhost:5173 and run:
```javascript
import('/src/services/uspto.js').then(m => {
  m.fetchPatentFromUSPTO('10000000').then(console.log).catch(console.error)
})
```

Expected: Returns patent data object with title, claims, etc.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add USPTO PatentsView API service"
```

---

## Task 6: Claude Service

**Files:**
- Create: `src/services/claude.js`

**Step 1: Create Claude service**

Create `src/services/claude.js`:
```javascript
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Call Claude API
 */
async function callClaude(apiKey, systemPrompt, userPrompt) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Extract the first independent claim from claims text
 */
export async function extractFirstIndependentClaim(apiKey, claimsText) {
  const systemPrompt = `You are a patent claim analyzer. Extract the first independent claim from the provided claims text.
An independent claim is one that stands alone and does not reference another claim (no "according to claim X" or "The method of claim X").
Return ONLY the claim text, nothing else. Do not include the claim number.`;

  const userPrompt = `Extract the first independent claim from this patent claims text:\n\n${claimsText}`;

  return callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Generate inventive concept summary from a claim
 */
export async function generateInventiveConcept(apiKey, claimText, patentTitle) {
  const systemPrompt = `You are a patent analyst. Summarize the core inventive concept of a patent claim in 1-2 sentences.
Focus on what makes this invention novel - strip away boilerplate language and get to the essence.
Be concise and technical. Do not start with "This claim" or "The invention".`;

  const userPrompt = `Patent title: ${patentTitle}\n\nFirst independent claim:\n${claimText}\n\nSummarize the inventive concept:`;

  return callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Analyze overlap and differentiation across patent family
 */
export async function analyzeFamily(apiKey, patents) {
  const systemPrompt = `You are a patent family analyst. Analyze the overlap and differentiation between patent claims in a family.

For each patent, determine:
1. Which other patents in the family it overlaps with (similar inventive concepts)
2. What differentiates it from other family members

Return JSON in this exact format:
{
  "analysis": [
    {
      "patentNumber": "string",
      "overlapsWith": ["patent numbers"],
      "overlapExplanation": "Brief explanation of what concepts overlap",
      "differentiation": "What makes this patent unique in the family"
    }
  ]
}`;

  const patentSummaries = patents.map(p =>
    `Patent ${p.patentNumber} (${p.relationship}):\nTitle: ${p.title}\nInventive Concept: ${p.inventiveConcept}`
  ).join('\n\n---\n\n');

  const userPrompt = `Analyze this patent family:\n\n${patentSummaries}`;

  const response = await callClaude(apiKey, systemPrompt, userPrompt);

  // Parse JSON from response
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (e) {
    throw new Error(`Failed to parse Claude response: ${e.message}`);
  }
}

/**
 * Infer relationship between patents
 */
export async function inferRelationship(apiKey, newPatent, existingPatents) {
  if (existingPatents.length === 0) {
    return 'original';
  }

  const systemPrompt = `You are a patent analyst. Determine the relationship of a new patent to an existing patent family.
Based on the titles and dates, infer if this is likely:
- continuation: Similar subject matter, later date, extends the original
- divisional: Split from original due to restriction requirement, narrower scope
- cip: Continuation-in-part, adds new matter to original disclosure

Return ONLY one of: continuation, divisional, cip, unknown`;

  const existingSummary = existingPatents.map(p =>
    `${p.patentNumber}: ${p.title} (${p.date})`
  ).join('\n');

  const userPrompt = `Existing patents:\n${existingSummary}\n\nNew patent:\n${newPatent.patentNumber}: ${newPatent.title} (${newPatent.date})\n\nRelationship:`;

  const response = await callClaude(apiKey, systemPrompt, userPrompt);
  const relationship = response.toLowerCase().trim();

  if (['continuation', 'divisional', 'cip'].includes(relationship)) {
    return relationship;
  }
  return 'unknown';
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Claude API service for patent analysis"
```

---

## Task 7: Family Context (State Management)

**Files:**
- Create: `src/context/FamilyContext.jsx`

**Step 1: Create FamilyContext**

Create `src/context/FamilyContext.jsx`:
```javascript
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FamilyContext = createContext(null);

const initialState = {
  members: [],
  analyzed: false,
  loading: false,
  error: null,
};

function familyReducer(state, action) {
  switch (action.type) {
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload],
        analyzed: false,
      };

    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      };

    case 'REMOVE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload),
        analyzed: false,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_ANALYZED':
      return { ...state, analyzed: action.payload };

    case 'APPLY_ANALYSIS':
      return {
        ...state,
        members: state.members.map(m => {
          const analysis = action.payload.find(a => a.patentNumber === m.patentNumber);
          if (analysis) {
            return {
              ...m,
              overlapsWith: analysis.overlapsWith,
              overlapExplanation: analysis.overlapExplanation,
              differentiation: analysis.differentiation,
            };
          }
          return m;
        }),
        analyzed: true,
      };

    case 'CLEAR_FAMILY':
      return initialState;

    case 'LOAD_FROM_STORAGE':
      return {
        ...initialState,
        ...action.payload,
      };

    default:
      return state;
  }
}

export function FamilyProvider({ children }) {
  const [state, dispatch] = useReducer(familyReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('patent_family');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved family:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (state.members.length > 0) {
      localStorage.setItem('patent_family', JSON.stringify({
        members: state.members,
        analyzed: state.analyzed,
      }));
    }
  }, [state.members, state.analyzed]);

  return (
    <FamilyContext.Provider value={{ state, dispatch }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}

// Helper to generate unique IDs
export function generateId() {
  return `patent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Step 2: Add FamilyProvider to App**

Update `src/main.jsx`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import harveyTheme from './theme/harveyTheme';
import { FamilyProvider } from './context/FamilyContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={harveyTheme}>
      <CssBaseline />
      <FamilyProvider>
        <App />
      </FamilyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add FamilyContext for state management"
```

---

## Task 8: Patent Input Component

**Files:**
- Create: `src/components/PatentInput.jsx`
- Modify: `src/App.jsx`

**Step 1: Create PatentInput component**

Create `src/components/PatentInput.jsx`:
```javascript
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
```

**Step 2: Update App.jsx**

Update `src/App.jsx`:
```javascript
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
```

**Step 3: Test patent input**

Run:
```bash
npm run dev
```

Test with real API key and patent number (e.g., "10000000")

Expected: Patent fetches, Claude extracts claim and concept, displays in debug view

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add PatentInput component with USPTO and Claude integration"
```

---

## Task 9: Family Table Component

**Files:**
- Create: `src/components/FamilyTable.jsx`
- Modify: `src/App.jsx`

**Step 1: Create FamilyTable component**

Create `src/components/FamilyTable.jsx`:
```javascript
import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFamily } from '../context/FamilyContext';
import { formatPatentNumber } from '../services/uspto';

const relationshipLabels = {
  original: 'Original',
  continuation: 'Contin.',
  divisional: 'Div.',
  cip: 'CIP',
  unknown: 'Unknown',
};

function FamilyTable({ onRowClick }) {
  const { state, dispatch } = useFamily();

  if (state.members.length === 0) {
    return null;
  }

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_MEMBER', payload: id });
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E0E0DE',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F7F7F5' }}>
            <TableCell sx={{ fontWeight: 600, width: '10%' }}>Patent #</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '15%' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '8%' }}>Relation</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '30%' }}>First Indep. Claim</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '27%' }}>Inventive Concept</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '8%' }}>Overlap</TableCell>
            <TableCell sx={{ width: '2%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.members.map((member) => (
            <TableRow
              key={member.id}
              onClick={() => onRowClick(member)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#FAFAF8',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatPatentNumber(member.patentNumber)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {member.title}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {relationshipLabels[member.relationship] || member.relationship}
                </Typography>
              </TableCell>
              <TableCell>
                {member.loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      fontSize: 'var(--font-table)',
                    }}
                  >
                    {member.firstIndependentClaim}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {member.loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {member.inventiveConcept}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {state.analyzed && member.overlapsWith?.length > 0 ? (
                  <Typography variant="body2">
                    {member.overlapsWith.map(p => `US'${p.slice(-3)}`).join(', ')}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#9B9B9B' }}>
                    —
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Tooltip title="Remove patent">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDelete(e, member.id)}
                    sx={{
                      color: '#9B9B9B',
                      '&:hover': { color: '#C85A54' }
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ p: 2, borderTop: '1px solid #E0E0DE' }}>
        <Typography variant="caption">
          {state.members.length} patent{state.members.length !== 1 ? 's' : ''} in family
          {state.analyzed && ' • Analysis complete'}
        </Typography>
      </Box>
    </TableContainer>
  );
}

export default FamilyTable;
```

**Step 2: Update App.jsx with table**

Update `src/App.jsx`:
```javascript
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import PatentInput from './components/PatentInput';
import FamilyTable from './components/FamilyTable';
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

  const canAnalyze = state.members.length >= 2 &&
    state.members.every(m => !m.loading) &&
    !state.analyzed;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
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
    </Box>
  );
}

export default App;
```

**Step 3: Test table display**

Run:
```bash
npm run dev
```

Test:
1. Add 2+ patents
2. Verify table displays with all columns
3. Click "Analyze Overlap" - verify analysis populates

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add FamilyTable component with overlap analysis"
```

---

## Task 10: Detail Panel Component

**Files:**
- Create: `src/components/DetailPanel.jsx`
- Modify: `src/App.jsx`

**Step 1: Create DetailPanel component**

Create `src/components/DetailPanel.jsx`:
```javascript
import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFamily } from '../context/FamilyContext';
import { formatPatentNumber } from '../services/uspto';

const relationshipLabels = {
  original: 'Original',
  continuation: 'Continuation',
  divisional: 'Divisional',
  cip: 'Continuation-in-Part',
  unknown: 'Unknown',
};

function DetailPanel({ member, onClose }) {
  const { dispatch } = useFamily();

  if (!member) return null;

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_MEMBER', payload: member.id });
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={!!member}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #E0E0DE',
        }}
      >
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleDelete}
          sx={{
            borderColor: '#C85A54',
            color: '#8B3A3A',
            '&:hover': {
              borderColor: '#A84A44',
              backgroundColor: 'transparent',
            },
          }}
        >
          Delete
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, overflowY: 'auto' }}>
        {/* Patent Number */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: 400,
            color: '#1A1A1A',
            mb: 3,
          }}
        >
          {formatPatentNumber(member.patentNumber)}
        </Typography>

        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            TITLE
          </Typography>
          <Typography variant="body1">{member.title}</Typography>
        </Box>

        {/* Relationship */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            RELATIONSHIP
          </Typography>
          <Typography variant="body1">
            {relationshipLabels[member.relationship] || member.relationship}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* First Independent Claim */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            FIRST INDEPENDENT CLAIM
          </Typography>
          <Box
            sx={{
              backgroundColor: '#F7F7F5',
              borderRadius: '8px',
              p: 2,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'pre-wrap', fontSize: '13px' }}
            >
              {member.firstIndependentClaim || 'Loading...'}
            </Typography>
          </Box>
        </Box>

        {/* Inventive Concept */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            INVENTIVE CONCEPT
          </Typography>
          <Typography variant="body1">
            {member.inventiveConcept || 'Loading...'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Overlap */}
        {member.overlapsWith?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              OVERLAPS WITH
            </Typography>
            <Box sx={{ mb: 1 }}>
              {member.overlapsWith.map((pNum) => (
                <Typography
                  key={pNum}
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                >
                  • {formatPatentNumber(pNum)}
                </Typography>
              ))}
            </Box>
            {member.overlapExplanation && (
              <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                {member.overlapExplanation}
              </Typography>
            )}
          </Box>
        )}

        {/* Differentiation */}
        {member.differentiation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              DIFFERENTIATION
            </Typography>
            <Typography variant="body1">{member.differentiation}</Typography>
          </Box>
        )}

        {/* No analysis yet */}
        {!member.overlapsWith?.length && !member.differentiation && (
          <Box sx={{ color: '#9B9B9B', textAlign: 'center', py: 2 }}>
            <Typography variant="body2">
              Add more patents and click "Analyze Overlap" to see relationships
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default DetailPanel;
```

**Step 2: Add DetailPanel to App**

Update `src/App.jsx`:
```javascript
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
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

  const canAnalyze = state.members.length >= 2 &&
    state.members.every(m => !m.loading) &&
    !state.analyzed;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7F7F5' }}>
      <Header apiKeySet={!!apiKey} />
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
```

**Step 3: Test side panel**

Run:
```bash
npm run dev
```

Test:
1. Add a patent
2. Click on the table row
3. Verify side panel slides in with full details
4. Click outside or X to close

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add DetailPanel component for patent details"
```

---

## Task 11: Clear Family & Polish

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Header.jsx`

**Step 1: Add clear family button to Header**

Update `src/components/Header.jsx`:
```javascript
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, Button } from '@mui/material';

function Header({ apiKeySet, onClearFamily, hasFamilyMembers }) {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {hasFamilyMembers && (
            <Button
              variant="outlined"
              size="small"
              onClick={onClearFamily}
              sx={{
                fontSize: '13px',
                color: '#6B6B6B',
                borderColor: '#D8D8D6',
              }}
            >
              Clear Family
            </Button>
          )}
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
```

**Step 2: Update App.jsx with clear functionality**

Update `src/App.jsx`:
```javascript
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
```

**Step 3: Test complete flow**

Run:
```bash
npm run dev
```

Full test:
1. Enter API key
2. Add 2-3 patents (try: 10000000, 10000001, 10000002)
3. Wait for Claude analysis to complete
4. Click "Analyze Overlap"
5. Click rows to see detail panel
6. Click "Clear Family" to reset
7. Refresh page - verify API key persists, family clears

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add clear family functionality and polish"
```

---

## Task 12: Update Build Log and Final Commit

**Files:**
- Modify: `BUILD_LOG.md`
- Modify: `TECHNIQUES_SUMMARY.md`

**Step 1: Update BUILD_LOG.md**

Append to `BUILD_LOG.md`:
```markdown

---

## Entry 5 - 2026-01-29

### What I Asked Claude
"Create implementation plan first"

### What Claude Did
Generated a detailed, task-by-task implementation plan with exact file paths, complete code snippets, test commands, and commit messages for each step.

### Key Technique Used
**Detailed implementation planning** - Breaking the project into bite-sized tasks (2-5 minutes each) with complete code, not just descriptions.

### Why This Worked
Having complete code in the plan means implementation is mostly copy-paste. No ambiguity about what to build. Each task is independently testable and commitable.

### What I'd Tell a Beginner
Ask Claude to create implementation plans with ACTUAL CODE, not just task descriptions. "Add authentication" is vague. "Create this file with this exact code" is actionable.

### Mistakes Avoided or Caught
- Plan includes verification steps ("Run npm run dev, expected: X")
- Each task has a commit message ready
- Dependencies are installed in correct order

---
```

**Step 2: Update TECHNIQUES_SUMMARY.md**

Append to `TECHNIQUES_SUMMARY.md`:
```markdown

---

## 8. Detailed Implementation Planning
**When to use:** Before any multi-file implementation

Generate plans with complete code, not task descriptions. Each task should include:
- Exact file paths
- Complete code to copy-paste
- Test/verification commands
- Expected output
- Commit message

**Example prompt:**
```
"Create an implementation plan with actual code for each task, not descriptions"
```

---

## 9. Bite-Sized Tasks (2-5 minutes each)
**When to use:** Always in implementation plans

Break work into atomic tasks that can be completed and verified independently. Good granularity:
- Create one file
- Add one component
- Test one thing
- Commit one change

Bad granularity:
- "Build the frontend" (too big)
- "Add semicolon" (too small)

---
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "docs: update BUILD_LOG and TECHNIQUES_SUMMARY with planning techniques"
```

---

## Summary

**Total tasks:** 12
**Estimated implementation time:** 60-90 minutes following the plan

**Key files created:**
- `src/theme/harveyTheme.js` - Harvey AI design system
- `src/services/uspto.js` - USPTO PatentsView API
- `src/services/claude.js` - Claude AI analysis
- `src/context/FamilyContext.jsx` - State management
- `src/components/Header.jsx` - App header
- `src/components/ApiKeyInput.jsx` - API key management
- `src/components/PatentInput.jsx` - Patent entry
- `src/components/FamilyTable.jsx` - Main table view
- `src/components/DetailPanel.jsx` - Side panel details

**Commits:** 12 (one per task)
