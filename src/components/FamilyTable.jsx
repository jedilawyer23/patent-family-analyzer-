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
  Link,
  Checkbox,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useFamily } from '../context/FamilyContext';
import { formatPatentNumber } from '../services/uspto';

const relationshipLabels = {
  original: 'Original',
  continuation: 'Contin.',
  divisional: 'Div.',
  cip: 'CIP',
  unknown: 'Unknown',
};

/**
 * Extract claim number from claim text (e.g., "1. A method..." -> "Claim 1")
 */
function formatClaimLabel(claimText) {
  if (!claimText) return '';
  const match = claimText.match(/^(\d+)\./);
  return match ? `Claim ${match[1]}` : 'Claim # unknown';
}

function FamilyTable({ onRowClick, selectedIds = [], onSelectionChange }) {
  const { state, dispatch } = useFamily();

  if (state.members.length === 0) {
    return null;
  }

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_MEMBER', payload: id });
    // Also remove from selection if selected
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleCheckboxChange = (e, memberId) => {
    e.stopPropagation();
    if (!onSelectionChange) return;

    if (selectedIds.includes(memberId)) {
      // Deselect
      onSelectionChange(selectedIds.filter(id => id !== memberId));
    } else {
      // Select (max 2)
      if (selectedIds.length < 2) {
        onSelectionChange([...selectedIds, memberId]);
      } else {
        // Replace the first selection with the new one
        onSelectionChange([selectedIds[1], memberId]);
      }
    }
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
            <TableCell sx={{ width: '3%', p: 1 }}>
              <Tooltip title="Select patents to compare">
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#9B9B9B' }}>
                  ✓
                </Typography>
              </Tooltip>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, width: '12%' }}>Patent #</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '16%' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '8%' }}>Relation</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '31%' }}>Independent Claim</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '28%' }}>Inventive Concept</TableCell>
            <TableCell sx={{ width: '2%' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.members.map((member) => {
            const isSelected = selectedIds.includes(member.id);
            return (
              <TableRow
                key={member.id}
                onClick={() => onRowClick(member)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#FDF8F7' : 'inherit',
                  '&:hover': {
                    backgroundColor: isSelected ? '#FCF3F1' : '#FAFAF8',
                  },
                }}
              >
                <TableCell sx={{ p: 1 }}>
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={(e) => handleCheckboxChange(e, member.id)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: '#C85A54',
                      '&.Mui-checked': {
                        color: '#C85A54',
                      },
                      p: 0,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPatentNumber(member.patentNumber)}
                    </Typography>
                    {member.googlePatentsUrl && (
                      <Tooltip title="View on Google Patents">
                        <Link
                          href={member.googlePatentsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: '#C85A54',
                            '&:hover': { color: '#A84A44' },
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <OpenInNewIcon sx={{ fontSize: 16 }} />
                        </Link>
                      </Tooltip>
                    )}
                  </Box>
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
                    <Box>
                      {member.firstIndependentClaim && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#C85A54',
                            fontWeight: 600,
                            display: 'block',
                            mb: 0.25,
                          }}
                        >
                          {formatClaimLabel(member.firstIndependentClaim)}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: 'var(--font-table)',
                        }}
                      >
                        {member.firstIndependentClaim}
                      </Typography>
                    </Box>
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
            );
          })}
        </TableBody>
      </Table>
      <Box sx={{ p: 2, borderTop: '1px solid #E0E0DE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption">
          {state.members.length} patent{state.members.length !== 1 ? 's' : ''} in family
        </Typography>
        {selectedIds.length > 0 && (
          <Typography variant="caption" sx={{ color: '#C85A54' }}>
            {selectedIds.length} selected for comparison
          </Typography>
        )}
      </Box>
    </TableContainer>
  );
}

export default FamilyTable;
