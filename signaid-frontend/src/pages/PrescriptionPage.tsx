import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Paper,
  Dialog,
  DialogActions,
  DialogContent
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrescriptionForm from '../components/prescription/PrescriptionForm';
import PrescriptionPrint from '../components/prescription/PrescriptionPrint';
import { mockPatientApi, mockPrescriptionApi } from '../services/mockData';
import { Patient, Prescription } from '../types';

const PrescriptionPage: React.FC = () => {
  const { patientId, consultationId } = useParams<{ patientId: string; consultationId: string }>();
  const history = useHistory();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId || !consultationId) {
        setError('Patient ID or Consultation ID is missing');
        setLoading(false);
        return;
      }

      try {
        // Fetch patient data
        // In a real application, you would use the actual API
        // const patientResponse = await patientApi.getPatientById(patientId);
        const patientResponse = await mockPatientApi.getPatientByCNIC('12345-6789012-3'); // Mock for demo
        
        if (!patientResponse.success || !patientResponse.data) {
          setError('Failed to fetch patient data');
          setLoading(false);
          return;
        }

        setPatient(patientResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('An error occurred while fetching patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, consultationId]);

  const handlePrescriptionComplete = async () => {
    if (!patientId) return;
    
    try {
      // In a real application, you would fetch the newly created prescription
      // const prescriptionsResponse = await prescriptionApi.getPatientPrescriptions(patientId);
      const prescriptionsResponse = await mockPrescriptionApi.getPatientPrescriptions(patientId);
      
      if (prescriptionsResponse.success && prescriptionsResponse.data && prescriptionsResponse.data.length > 0) {
        // Get the latest prescription
        const latestPrescription = prescriptionsResponse.data[prescriptionsResponse.data.length - 1];
        setPrescription(latestPrescription);
        setShowPrintDialog(true);
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: `Prescription_${patientId}_${new Date().toISOString().split('T')[0]}`,
    onAfterPrint: () => {
      // Navigate back to home after printing
      history.push('/');
    },
    // Use a function that returns the component to print
    content: () => printRef.current,
  });

  const handleClosePrintDialog = () => {
    setShowPrintDialog(false);
    history.push('/');
  };

  const handleBackToHome = () => {
    history.push('/');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading patient data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">
            {error || 'Failed to load patient data'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBackToHome}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prescription
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Patient: {patient.name} | CNIC: {patient.cnic}
        </Typography>
      </Box>

      <PrescriptionForm 
        patientId={patientId || ''} 
        consultationId={consultationId || ''} 
        onPrescriptionComplete={handlePrescriptionComplete} 
      />

      {/* Print Dialog */}
      <Dialog 
        open={showPrintDialog} 
        onClose={handleClosePrintDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {prescription && patient && (
            <div ref={printRef}>
              <PrescriptionPrint prescription={prescription} patient={patient} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrintDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handlePrint()}
          >
            Print Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrescriptionPage; 