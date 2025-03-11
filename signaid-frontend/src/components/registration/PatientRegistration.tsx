import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { mockPatientApi } from '../../services/mockData';
import { Patient } from '../../types';
import useCnicInput from '../../hooks/useCnicInput';

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
});

type Gender = 'male' | 'female' | 'other';
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
type BloodType = typeof bloodTypes[number];

interface PatientRegistrationProps {
  initialCnic?: string;
  onRegistrationComplete: (patient: Patient) => void;
}

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

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ 
  initialCnic = '',
  onRegistrationComplete 
}) => {
  const cnicInput = useCnicInput(initialCnic);
  const [tabValue, setTabValue] = React.useState(0);
  
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
          gender: values.gender as Gender,
          bloodType: values.bloodType as BloodType,
          medicalHistory: values.medicalHistory,
          allergies: values.allergies,
          previousTreatments: values.previousTreatments,
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
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          maxWidth: 700, 
          mx: 'auto', 
          mt: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          align="center"
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 2
          }}
        >
          Patient Registration
        </Typography>
        
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

        <Box 
          component="form" 
          onSubmit={formik.handleSubmit} 
        >
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="CNIC"
                  name="cnic"
                  value={cnicInput.value}
                  onChange={cnicInput.handleChange}
                  error={cnicInput.error !== null}
                  helperText={cnicInput.error}
                  placeholder="XXXXX-XXXXXXX-X"
                  inputProps={{ pattern: "[0-9]{5}-[0-9]{7}-[0-9]" }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                  inputProps={{ min: 0, max: 150 }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formik.values.gender}
                    label="Gender"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Blood Type</InputLabel>
                  <Select
                    name="bloodType"
                    value={formik.values.bloodType}
                    label="Blood Type"
                    onChange={formik.handleChange}
                    error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}
                  >
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
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
                  required
                  label="Medical History"
                  name="medicalHistory"
                  multiline
                  rows={2}
                  value={formik.values.medicalHistory}
                  onChange={formik.handleChange}
                  error={formik.touched.medicalHistory && Boolean(formik.errors.medicalHistory)}
                  helperText={formik.touched.medicalHistory && formik.errors.medicalHistory}
                  placeholder="Enter relevant medical history"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Allergies"
                  name="allergies"
                  multiline
                  rows={2}
                  value={formik.values.allergies}
                  onChange={formik.handleChange}
                  error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                  helperText={formik.touched.allergies && formik.errors.allergies}
                  placeholder="Enter any allergies"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Previous Treatments"
                  name="previousTreatments"
                  multiline
                  rows={2}
                  value={formik.values.previousTreatments}
                  onChange={formik.handleChange}
                  error={formik.touched.previousTreatments && Boolean(formik.errors.previousTreatments)}
                  helperText={formik.touched.previousTreatments && formik.errors.previousTreatments}
                  placeholder="Enter any previous treatments"
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
                  {formik.isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Register & Start Consultation'
                  )}
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>
    </Fade>
  );
};

export default PatientRegistration; 