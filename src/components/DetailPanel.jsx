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
