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
