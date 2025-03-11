import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { mockConsultationApi } from '../../services/mockData';

interface DoctorNotesProps {
  consultationId: string;
}

const DoctorNotes: React.FC<DoctorNotesProps> = ({ consultationId }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleSaveNotes = async () => {
    if (!notes.trim()) return;

    setSaving(true);
    try {
      const response = await mockConsultationApi.updateNotes(consultationId, notes);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Notes saved successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.error || 'Failed to save notes',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while saving notes',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Doctor's Notes
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter your notes here..."
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSaveNotes}
          disabled={isSaving || !notes.trim()}
        >
          {isSaving ? 'Saving...' : 'Save Notes'}
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DoctorNotes; 