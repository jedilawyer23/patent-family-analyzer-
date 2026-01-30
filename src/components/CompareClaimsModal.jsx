import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatPatentNumber } from '../services/uspto';
import { compareClaimElements } from '../services/claude';
import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

/**
 * Extract claim number from claim text (e.g., "1. A method..." -> "1")
 */
function extractClaimNumber(claimText) {
  if (!claimText) return null;
  const match = claimText.match(/^(\d+)\./);
  return match ? match[1] : null;
}

/**
 * Format claim number for display
 */
function formatClaimLabel(claimText) {
  const num = extractClaimNumber(claimText);
  return num ? `Claim ${num}` : 'Claim # unknown';
}

/**
 * Generate word-level diff between two texts
 */
function generateRedlineHtml(textA, textB) {
  if (!textA || !textB) return '';

  const diffs = dmp.diff_main(textA, textB);
  dmp.diff_cleanupSemantic(diffs);

  const html = diffs.map(([op, text]) => {
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    switch (op) {
      case -1:
        return `<span class="diff-deleted">${escapedText}</span>`;
      case 1:
        return `<span class="diff-added">${escapedText}</span>`;
      default:
        return `<span class="diff-same">${escapedText}</span>`;
    }
  }).join('');

  return html;
}

const statusColors = {
  same: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
  modified: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
  added: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  removed: { bg: '#FFEBEE', border: '#F44336', text: '#C62828' },
};

const changeTypeLabels = {
  narrowing: { label: 'Narrowing', color: '#FF9800', description: 'More specific/limited scope' },
  broadening: { label: 'Broadening', color: '#4CAF50', description: 'Wider/less limited scope' },
  different_scope: { label: 'Different Scope', color: '#2196F3', description: 'Shifted focus area' },
  substantially_similar: { label: 'Substantially Similar', color: '#9E9E9E', description: 'Minor differences only' },
};

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ height: '100%', overflow: 'auto' }}
    >
      {value === index && children}
    </Box>
  );
}

function CompareClaimsModal({ open, onClose, patentA, patentB, claudeApiKey }) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState('a-to-b');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Sort patents by date to determine original (parent) vs continuation
  // Earlier date = original/parent, later date = continuation
  const [originalPatent, continuationPatent] = useMemo(() => {
    if (!patentA || !patentB) return [patentA, patentB];

    const dateA = patentA.date ? new Date(patentA.date) : new Date(0);
    const dateB = patentB.date ? new Date(patentB.date) : new Date(0);

    // If A is earlier or same date, A is original
    if (dateA <= dateB) {
      return [patentA, patentB];
    }
    return [patentB, patentA];
  }, [patentA, patentB]);

  // Run AI analysis when modal opens
  useEffect(() => {
    if (open && originalPatent && continuationPatent && claudeApiKey && !aiAnalysis) {
      runAiAnalysis();
    }
  }, [open, originalPatent, continuationPatent, claudeApiKey]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setAiAnalysis(null);
      setAiError(null);
      setActiveTab(0);
    }
  }, [open]);

  const runAiAnalysis = async () => {
    if (!claudeApiKey || !originalPatent?.firstIndependentClaim || !continuationPatent?.firstIndependentClaim) {
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      // Compare original (parent) against continuation
      const result = await compareClaimElements(
        claudeApiKey,
        originalPatent.firstIndependentClaim,
        continuationPatent.firstIndependentClaim,
        formatPatentNumber(originalPatent.patentNumber),
        formatPatentNumber(continuationPatent.patentNumber)
      );
      setAiAnalysis(result);
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Swap patents based on direction for redline view
  const [leftPatent, rightPatent] = useMemo(() => {
    if (direction === 'b-to-a') {
      return [continuationPatent, originalPatent];
    }
    return [originalPatent, continuationPatent];
  }, [originalPatent, continuationPatent, direction]);

  // Generate redline HTML
  const redlineHtml = useMemo(() => {
    if (!leftPatent?.firstIndependentClaim || !rightPatent?.firstIndependentClaim) {
      return '';
    }
    return generateRedlineHtml(
      leftPatent.firstIndependentClaim,
      rightPatent.firstIndependentClaim
    );
  }, [leftPatent, rightPatent]);

  if (!patentA || !patentB) return null;

  const handleDirectionChange = (_, newDirection) => {
    if (newDirection) {
      setDirection(newDirection);
    }
  };

  const changeTypeInfo = aiAnalysis?.changeType ? changeTypeLabels[aiAnalysis.changeType] : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '85vh',
          maxHeight: '85vh',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E0E0DE',
          py: 1.5,
          px: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif' }}>
              Claim Comparison
            </Typography>
            {aiLoading && <CircularProgress size={18} sx={{ color: '#C85A54' }} />}
            {changeTypeInfo && !aiLoading && (
              <Chip
                label={changeTypeInfo.label}
                size="small"
                sx={{
                  backgroundColor: changeTypeInfo.color,
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
            {formatPatentNumber(originalPatent?.patentNumber)} (Original) vs {formatPatentNumber(continuationPatent?.patentNumber)} (Continuation)
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* AI Summary Banner */}
      {aiAnalysis?.summary && (
        <Box
          sx={{
            px: 3,
            py: 1.5,
            backgroundColor: '#F7F7F5',
            borderBottom: '1px solid #E0E0DE',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Summary of Changes
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A1A1A' }}>
            {aiAnalysis.summary}
          </Typography>
        </Box>
      )}

      <Box sx={{ borderBottom: '1px solid #E0E0DE', px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
            },
            '& .Mui-selected': {
              color: '#C85A54',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#C85A54',
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Element Matrix
                {aiLoading && <CircularProgress size={14} />}
              </Box>
            }
          />
          <Tab label="Redline View" />
          <Tab label="Side by Side" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Element Matrix View */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            {aiLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#C85A54' }} />
                <Typography sx={{ ml: 2, color: '#6B6B6B' }}>
                  Analyzing claim elements...
                </Typography>
              </Box>
            )}

            {aiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {aiError}
              </Alert>
            )}

            {!aiLoading && !aiError && !aiAnalysis && (
              <Box sx={{ textAlign: 'center', py: 8, color: '#6B6B6B' }}>
                <Typography>No AI analysis available. Check your API key.</Typography>
              </Box>
            )}

            {aiAnalysis?.elementComparison && (
              <>
                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  {Object.entries(statusColors).map(([status, colors]) => (
                    <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '2px',
                        }}
                      />
                      <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                        {status}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <TableContainer sx={{ border: '1px solid #E0E0DE', borderRadius: '8px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F7F7F5' }}>
                        <TableCell sx={{ fontWeight: 600, width: '5%' }}>Element</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '38%' }}>
                          {formatPatentNumber(originalPatent?.patentNumber)} (Original)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '38%' }}>
                          {formatPatentNumber(continuationPatent?.patentNumber)} (Continuation)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: '19%' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Preamble Row */}
                      {aiAnalysis.preambleStatus && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: '#6B6B6B' }}>Preamble</TableCell>
                          <TableCell colSpan={2} sx={{ fontStyle: 'italic', color: '#6B6B6B' }}>
                            (See claim text in Side by Side view)
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={aiAnalysis.preambleStatus}
                              size="small"
                              sx={{
                                backgroundColor: statusColors[aiAnalysis.preambleStatus]?.bg || '#F5F5F5',
                                color: statusColors[aiAnalysis.preambleStatus]?.text || '#666',
                                fontWeight: 600,
                                fontSize: '11px',
                                textTransform: 'capitalize',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Element Rows */}
                      {aiAnalysis.elementComparison.map((elem, idx) => {
                        const colors = statusColors[elem.status] || statusColors.same;
                        return (
                          <TableRow
                            key={idx}
                            sx={{
                              backgroundColor: colors.bg,
                              '&:hover': { backgroundColor: colors.bg },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: '#6B6B6B' }}>
                              ({String.fromCharCode(97 + idx)})
                            </TableCell>
                            <TableCell sx={{ fontSize: '13px', verticalAlign: 'top' }}>
                              {elem.elementA || '—'}
                            </TableCell>
                            <TableCell sx={{ fontSize: '13px', verticalAlign: 'top' }}>
                              {elem.elementB || '—'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={elem.status}
                                size="small"
                                sx={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  border: `1px solid ${colors.border}`,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  textTransform: 'capitalize',
                                }}
                              />
                              {elem.note && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#6B6B6B' }}>
                                  {elem.note}
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Redline View */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                Showing changes from:
              </Typography>
              <ToggleButtonGroup
                value={direction}
                exclusive
                onChange={handleDirectionChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 2,
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#FDF8F7 !important',
                    color: '#C85A54 !important',
                  },
                }}
              >
                <ToggleButton value="a-to-b">
                  {formatPatentNumber(originalPatent?.patentNumber)} → {formatPatentNumber(continuationPatent?.patentNumber)}
                </ToggleButton>
                <ToggleButton value="b-to-a">
                  {formatPatentNumber(continuationPatent?.patentNumber)} → {formatPatentNumber(originalPatent?.patentNumber)}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#FFECEC', border: '1px solid #C85A54', borderRadius: '2px' }} />
                <Typography variant="caption">Deleted</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#E8F5E9', border: '1px solid #4CAF50', borderRadius: '2px' }} />
                <Typography variant="caption">Added</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#F7F7F5', border: '1px solid #E0E0DE', borderRadius: '2px' }} />
                <Typography variant="caption">Unchanged</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                flex: 1,
                backgroundColor: '#FAFAFA',
                borderRadius: '8px',
                p: 3,
                overflow: 'auto',
                fontSize: '14px',
                lineHeight: 1.8,
                '& .diff-deleted': {
                  backgroundColor: '#FFECEC',
                  color: '#C85A54',
                  textDecoration: 'line-through',
                  padding: '0 2px',
                },
                '& .diff-added': {
                  backgroundColor: '#E8F5E9',
                  color: '#2E7D32',
                  textDecoration: 'underline',
                  padding: '0 2px',
                },
                '& .diff-same': {
                  color: '#1A1A1A',
                },
              }}
              dangerouslySetInnerHTML={{ __html: redlineHtml }}
            />
          </Box>
        </TabPanel>

        {/* Side by Side View */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <Box sx={{ flex: 1, p: 3, borderRight: '1px solid #E0E0DE', overflow: 'auto' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#C85A54', fontWeight: 600 }}>
                  {formatPatentNumber(originalPatent?.patentNumber)} (Original)
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                  {originalPatent?.date || 'Date unknown'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {formatClaimLabel(originalPatent?.firstIndependentClaim)}
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#F7F7F5',
                  borderRadius: '8px',
                  p: 2,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {originalPatent?.firstIndependentClaim || 'No claim text available'}
              </Box>
            </Box>

            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#C85A54', fontWeight: 600 }}>
                  {formatPatentNumber(continuationPatent?.patentNumber)} (Continuation)
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                  {continuationPatent?.date || 'Date unknown'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {formatClaimLabel(continuationPatent?.firstIndependentClaim)}
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#F7F7F5',
                  borderRadius: '8px',
                  p: 2,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {continuationPatent?.firstIndependentClaim || 'No claim text available'}
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}

export default CompareClaimsModal;
