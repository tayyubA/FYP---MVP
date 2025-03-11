import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Patient } from '../../types';

interface PatientInfoProps {
  patient: Patient;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Patient Information
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">{patient.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          CNIC: {patient.cnic} | Age: {patient.age} | Gender: {patient.gender}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="medical-history-content"
            id="medical-history-header"
          >
            <Typography variant="subtitle1">Medical History</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {patient.medicalHistory || 'No medical history recorded.'}
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="allergies-content"
            id="allergies-header"
          >
            <Typography variant="subtitle1">Allergies</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {patient.allergies || 'No allergies recorded.'}
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="treatments-content"
            id="treatments-header"
          >
            <Typography variant="subtitle1">Previous Treatments</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {patient.previousTreatments || 'No previous treatments recorded.'}
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="past-prescriptions-content"
            id="past-prescriptions-header"
          >
            <Typography variant="subtitle1">Past Manual Prescriptions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {patient.pastPrescriptions || 'No past manual prescriptions recorded.'}
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="prescriptions-content"
            id="prescriptions-header"
          >
            <Typography variant="subtitle1">Digital Prescriptions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {patient.prescriptions.length > 0 ? (
              <List dense disablePadding>
                {patient.prescriptions.map((prescription) => (
                  <ListItem key={prescription.id} divider>
                    <ListItemText
                      primary={`Date: ${prescription.date}`}
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
              <Typography variant="body2">No digital prescriptions found.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

export default PatientInfo; 