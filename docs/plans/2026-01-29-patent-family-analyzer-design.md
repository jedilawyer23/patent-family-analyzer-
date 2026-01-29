# Patent Family Analyzer - Design Document

**Date:** 2026-01-29
**Status:** Approved

## Overview

A single-page web app that analyzes patent families. Users input patent numbers, and the tool auto-fetches data from USPTO, uses Claude AI to extract insights, and displays a structured table showing claim coverage and relationships.

## User Flow

1. User enters Claude API key (stored in localStorage with security warning)
2. User enters a patent number (e.g., "US10123456")
3. Clicks "+ Add"
4. System fetches from USPTO PatentsView API → gets title, claims, app_type, parent refs
5. Claude extracts first independent claim from full claims text
6. Claude generates inventive concept summary
7. Relationship auto-detected from USPTO app_type field
8. Row populates in table
9. Repeat for additional family members
10. User clicks "Analyze Overlap"
11. Claude compares all inventive concepts → generates overlap + differentiation for each
12. User clicks any row → side panel shows full details

## MVP Scope

**Included:**
- Patent number input only (no manual paste)
- USPTO auto-fetch (granted US patents only)
- Auto-detect relationship from USPTO data
- Claude extracts first independent claim
- Claude generates inventive concept summary
- Claude detects overlap between family members
- Claude generates differentiation analysis
- Side panel for full details
- Responsive typography

**Excluded (for later):**
- Spec text analysis (USPTO doesn't provide)
- Unclaimed concepts feature (needs spec)
- Export to CSV/PDF
- Color-coded overlap visualization
- Pending application support

## Technical Architecture

### Stack
- **React** with functional components + hooks
- **Vite** as build tool
- **Material UI** for components
- **Context API** for state management
- **localStorage** for persistence (API key + family data)

### Project Structure
```
/patent-family-analyzer
  /src
    /components
      Header.jsx
      ApiKeyInput.jsx
      PatentInput.jsx
      FamilyTable.jsx
      DetailPanel.jsx
    /services
      uspto.js           # PatentsView API calls
      claude.js          # Claude API calls
    /context
      FamilyContext.jsx  # State management
    /theme
      harveyTheme.js     # Harvey AI design tokens
    App.jsx
    main.jsx
    index.css
  BUILD_LOG.md
  TECHNIQUES_SUMMARY.md
  README.md
  .env.example
  index.html
  package.json
  vite.config.js
```

### Data Flow
```
User enters patent number
         ↓
    USPTO API fetch
         ↓
    Get: title, all claims, app_type, parent references
         ↓
    Claude API call #1
         ↓
    Extract: first independent claim from claims text
         ↓
    Claude API call #2
         ↓
    Generate: inventive concept summary
         ↓
    Auto-populate table row
         ↓
    (After all patents added)
         ↓
    User clicks "Analyze Overlap"
         ↓
    Claude API call #3
         ↓
    Compare all inventive concepts → overlap + differentiation
```

### API Integration

**USPTO PatentsView API:**
- Endpoint: `https://api.patentsview.org/patents/query`
- No API key required
- Returns: title, claims, application type, parent references
- Limitation: Granted US patents only

**Claude API:**
- Direct browser calls (CORS-enabled)
- API key stored in localStorage
- Three prompt types:
  1. Extract first independent claim
  2. Summarize inventive concept
  3. Analyze overlap + differentiation across family

## UI Design

### Harvey AI Aesthetic

**Colors:**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `#F7F7F5` | Page background |
| `--bg-card` | `#FFFFFF` | Cards, panels |
| `--border` | `#E0E0DE` | Subtle borders |
| `--border-hover` | `#D8D8D6` | Hover state |
| `--text-primary` | `#1A1A1A` | Headings, body |
| `--text-secondary` | `#6B6B6B` | Secondary text |
| `--text-muted` | `#9B9B9B` | Labels, captions |

**Typography:**
- Headings: Georgia, serif, weight 400
- Body: System font stack
- Responsive scaling with CSS clamp()

**Components:**
- Cards: No shadows, 8px radius, subtle borders
- Hover: `translateY(-1px)` + border darken
- Buttons: Outlined style, transparent hover
- Transitions: 150ms ease-in-out

### Responsive Typography
```css
:root {
  --font-heading: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  --font-body: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --font-table: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --font-label: clamp(0.625rem, 0.6rem + 0.15vw, 0.75rem);
}
```

### Table Layout

| Column | Width | Content |
|--------|-------|---------|
| Patent # | 10% | Formatted (US10,123,456) |
| Title | 15% | Truncated with ellipsis |
| Relationship | 8% | Abbreviated |
| First Indep. Claim | 30% | 3-4 lines, truncated |
| Inventive Concept | 27% | 2-3 line summary |
| Overlap | 10% | Patent #s or "—" |

### Side Panel

- Width: 400px fixed
- Slides from right, 150ms ease
- Sections:
  1. Header (patent #, back, delete)
  2. Title (full)
  3. Relationship
  4. First Independent Claim (scrollable)
  5. Inventive Concept
  6. Overlaps With (links + explanation)
  7. Differentiation

## Data Model

```typescript
interface PatentFamily {
  id: string;
  name: string;
  members: FamilyMember[];
  analyzed: boolean;
}

interface FamilyMember {
  id: string;
  patentNumber: string;
  title: string;
  relationship: 'original' | 'continuation' | 'divisional' | 'cip' | 'unknown';
  allClaims: string;           // Raw from USPTO
  firstIndependentClaim: string; // Claude-extracted
  inventiveConcept: string;    // Claude-generated
  overlapsWith: string[];      // IDs of overlapping members
  overlapExplanation: string;  // Claude-generated
  differentiation: string;     // Claude-generated
  loading: boolean;
  error: string | null;
}
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Patent not found in USPTO | Toast error, don't add row |
| Invalid patent number format | Inline validation error |
| Claude API error | Toast error, retry button |
| Claude API key missing | Prompt to enter key |
| Rate limiting | Queue requests, show progress |

## Security Considerations

- API key stored in localStorage (browser only)
- Warning displayed: "This key is stored in your browser only"
- No backend = key visible in network requests
- Acceptable for demo/personal use, not production

## Future Enhancements (Phase 2)

1. Bulk import from CSV
2. Support for pending applications (different API)
3. Family tree visualization
4. "Suggest continuation claims" feature
5. Export to CSV/PDF
6. Color-coded overlap visualization
7. Spec text analysis (if source found)
