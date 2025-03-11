import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Grid, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { mockPatientApi } from '../../services/mockData';
import { Patient } from '../../types';
import useCnicInput from '../../hooks/useCnicInput';

interface PatientRegistrationProps {
  onRegistrationComplete: (patient: Patient) => void;
  initialCnic?: string;
}

// Validation schema
const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup
    .number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),
  gender: yup.string().required('Gender is required'),
  bloodType: yup.string().required('Blood type is required'),
  medicalHistory: yup.string().required('Medical history is required'),
  allergies: yup.string(),
  previousTreatments: yup.string(),
  pastPrescriptions: yup.string(),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`registration-tabpanel-${index}`}
      aria-labelledby={`registration-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onRegistrationComplete, initialCnic = '' }) => {
  const cnicInput = useCnicInput(initialCnic);
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const formik = useFormik({
    initialValues: {
      name: '',
      age: '',
      gender: 'male',
      bloodType: '',
      medicalHistory: '',
      allergies: '',
      previousTreatments: '',
      pastPrescriptions: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!cnicInput.isValid()) {
        cnicInput.setError('CNIC is required and must be 13 digits');
        return;
      }
      
      try {
        const response = await mockPatientApi.registerPatient({
          cnic: cnicInput.value,
          name: values.name,
          age: Number(values.age),
          gender: values.gender as 'male' | 'female' | 'other',
          bloodType: values.bloodType,
          medicalHistory: values.medicalHistory,
          allergies: values.allergies,
          previousTreatments: values.previousTreatments,
          pastPrescriptions: values.pastPrescriptions,
        });

        if (response.success && response.data) {
          onRegistrationComplete(response.data);
        }
      } catch (error) {
        console.error('Error registering patient:', error);
      }
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: 'auto', mt: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 600 }}>
        Patient Registration
      </Typography>
      
      {initialCnic && (
        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          No record found for CNIC: {initialCnic}. Please register the patient.
        </Typography>
      )}
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="Personal Info" />
        <Tab label="Medical History" />
      </Tabs>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box component="form" noValidate onSubmit={formik.handleSubmit}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="cnic"
                name="cnic"
                label="CNIC (13 digits)"
                value={cnicInput.value}
                onChange={cnicInput.handleChange}
                error={!!cnicInput.error}
                helperText={cnicInput.error}
                inputProps={{
                  inputMode: 'numeric',
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl component="fieldset" size="small">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                  <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                  <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={formik.touched.bloodType && Boolean(formik.errors.bloodType)} size="small">
                <InputLabel id="bloodType-label">Blood Type</InputLabel>
                <Select
                  labelId="bloodType-label"
                  id="bloodType"
                  name="bloodType"
                  value={formik.values.bloodType}
                  onChange={formik.handleChange}
                  label="Blood Type"
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
                {formik.touched.bloodType && formik.errors.bloodType && (
                  <FormHelperText>{formik.errors.bloodType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setTabValue(1)}
              >
                Next: Medical History
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="medicalHistory"
                name="medicalHistory"
                label="Medical History"
                multiline
                rows={2}
                value={formik.values.medicalHistory}
                onChange={formik.handleChange}
                error={formik.touched.medicalHistory && Boolean(formik.errors.medicalHistory)}
                helperText={formik.touched.medicalHistory && formik.errors.medicalHistory}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="allergies"
                name="allergies"
                label="Allergies"
                multiline
                rows={2}
                value={formik.values.allergies}
                onChange={formik.handleChange}
                error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                helperText={formik.touched.allergies && formik.errors.allergies}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="previousTreatments"
                name="previousTreatments"
                label="Previous Treatments"
                multiline
                rows={2}
                value={formik.values.previousTreatments}
                onChange={formik.handleChange}
                error={formik.touched.previousTreatments && Boolean(formik.errors.previousTreatments)}
                helperText={formik.touched.previousTreatments && formik.errors.previousTreatments}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="pastPrescriptions"
                name="pastPrescriptions"
                label="Past Manual Prescriptions"
                multiline
                rows={2}
                value={formik.values.pastPrescriptions}
                onChange={formik.handleChange}
                error={formik.touched.pastPrescriptions && Boolean(formik.errors.pastPrescriptions)}
                helperText={formik.touched.pastPrescriptions && formik.errors.pastPrescriptions}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 1, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setTabValue(0)}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{ flex: 2 }}
              >
                {formik.isSubmitting ? <CircularProgress size={24} /> : 'Register Patient'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PatientRegistration; 