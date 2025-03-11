import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Grid
} from '@mui/material';
import { Patient } from '../../types';

interface PatientDetailsProps {
  patient: Patient;
  onStartConsultation: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onStartConsultation }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Patient Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Personal Information
            </Typography>
            <Typography variant="h6">{patient.name}</Typography>
            <Typography variant="body1">CNIC: {patient.cnic}</Typography>
            <Typography variant="body1">Age: {patient.age}</Typography>
            <Typography variant="body1">Gender: {patient.gender}</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Medical Information
            </Typography>
            <Typography variant="body1">
              <strong>Medical History:</strong> {patient.medicalHistory}
            </Typography>
            <Typography variant="body1">
              <strong>Allergies:</strong> {patient.allergies}
            </Typography>
            <Typography variant="body1">
              <strong>Previous Treatments:</strong> {patient.previousTreatments}
            </Typography>
            <Typography variant="body1">
              <strong>Past Manual Prescriptions:</strong> {patient.pastPrescriptions}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Previous Prescriptions
        </Typography>
        
        {patient.prescriptions.length > 0 ? (
          <List>
            {patient.prescriptions.map((prescription) => (
              <ListItem key={prescription.id} divider>
                <ListItemText
                  primary={`Prescription Date: ${prescription.date}`}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Medicines: {prescription.medicines.map(m => m.name).join(', ')}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        Instructions: {prescription.instructions}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">No previous prescriptions found.</Typography>
        )}
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onStartConsultation}
        sx={{ mt: 2 }}
      >
        Start New Consultation
      </Button>
    </Paper>
  );
};

export default PatientDetails; 