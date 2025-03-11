import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { mockPatientApi } from '../../services/mockData';
import { Patient } from '../../types';
import useCnicInput from '../../hooks/useCnicInput';

interface SearchBoxProps {
  onPatientFound: (patient: Patient) => void;
  onPatientNotFound: (cnic: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onPatientFound, onPatientNotFound }) => {
  const cnicInput = useCnicInput();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // Validate CNIC
    if (!cnicInput.isValid()) {
      cnicInput.setError('Please enter a valid CNIC in the format: 12345-6789012-3');
      return;
    }

    setLoading(true);

    try {
      // In a real application, you would use the actual API
      // const response = await patientApi.getPatientByCNIC(cnic);
      const response = await mockPatientApi.getPatientByCNIC(cnicInput.value);

      if (response.success && response.data) {
        onPatientFound(response.data);
      } else {
        onPatientNotFound(cnicInput.value);
      }
    } catch (err) {
      cnicInput.setError('An error occurred while searching for the patient.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Patient Search
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Enter the patient's CNIC to search for their records.
      </Typography>
      
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="cnic"
          label="CNIC Number"
          name="cnic"
          placeholder="12345-6789012-3"
          value={cnicInput.value}
          onChange={cnicInput.handleChange}
          error={!!cnicInput.error}
          helperText={cnicInput.error}
          disabled={loading}
          inputProps={{
            inputMode: 'numeric',
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading || !cnicInput.value}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchBox; 