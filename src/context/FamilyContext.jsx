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
