import React, { forwardRef } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Divider,
  Paper
} from '@mui/material';
import { Prescription, Patient } from '../../types';

interface PrescriptionPrintProps {
  prescription: Prescription;
  patient: Patient;
}

const PrescriptionPrint = forwardRef<HTMLDivElement, PrescriptionPrintProps>(
  ({ prescription, patient }, ref) => {
    const currentDate = new Date().toLocaleDateString();
    
    return (
      <Box ref={ref} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              SignAid Telemedicine
            </Typography>
            <Typography variant="body1">
              Specialized Care for Deaf Patients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Medical Plaza, Islamabad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +92-51-1234567
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              <strong>Date:</strong> {currentDate}
            </Typography>
            <Typography variant="body1">
              <strong>Prescription ID:</strong> {prescription.id}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {patient.name}
          </Typography>
          <Typography variant="body1">
            <strong>CNIC:</strong> {patient.cnic}
          </Typography>
          <Typography variant="body1">
            <strong>Age:</strong> {patient.age}
          </Typography>
          <Typography variant="body1">
            <strong>Gender:</strong> {patient.gender}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Prescribed Medicines
          </Typography>
          
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Medicine</strong></TableCell>
                <TableCell><strong>Dosage</strong></TableCell>
                <TableCell><strong>Frequency</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescription.medicines.map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>{medicine.frequency}</TableCell>
                  <TableCell>{medicine.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="body1">
              {prescription.instructions}
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1">____________________</Typography>
            <Typography variant="body2">Doctor's Signature</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 6, pt: 2, borderTop: '1px dashed #ccc' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            This is a computer-generated prescription and does not require a physical signature.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            For any questions or concerns, please contact SignAid Telemedicine at +92-51-1234567.
          </Typography>
        </Box>
      </Box>
    );
  }
);

export default PrescriptionPrint; 