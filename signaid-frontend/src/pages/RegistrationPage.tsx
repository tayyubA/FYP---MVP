import React from 'react';
import { Container, Box } from '@mui/material';
import PatientRegistration from '../components/registration/PatientRegistration';
import { useHistory } from 'react-router-dom';
import { Patient } from '../types';
import Header from '../components/common/Header';

const RegistrationPage: React.FC = () => {
  const history = useHistory();

  const handleRegistrationComplete = (patient: Patient) => {
    history.push(`/consultation/${patient.id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PatientRegistration onRegistrationComplete={handleRegistrationComplete} />
      </Container>
    </Box>
  );
};

export default RegistrationPage; 