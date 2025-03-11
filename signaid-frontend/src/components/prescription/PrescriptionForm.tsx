import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  IconButton, 
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFormik, FieldArray, FormikProvider, getIn } from 'formik';
import * as yup from 'yup';
import { mockPrescriptionApi } from '../../services/mockData';

interface PrescriptionFormProps {
  patientId: string;
  consultationId: string;
  onPrescriptionComplete: () => void;
}

// Validation schema
const validationSchema = yup.object({
  medicines: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Medicine name is required'),
      dosage: yup.string().required('Dosage is required'),
      frequency: yup.string().required('Frequency is required'),
      duration: yup.string().required('Duration is required'),
    })
  ).min(1, 'At least one medicine is required'),
  instructions: yup.string().required('Instructions are required'),
  doctorNotes: yup.string(),
});

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  patientId, 
  consultationId,
  onPrescriptionComplete 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const formik = useFormik({
    initialValues: {
      medicines: [
        { name: '', dosage: '', frequency: '', duration: '' }
      ],
      instructions: '',
      doctorNotes: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      
      try {
        // In a real application, you would use the actual API
        // const response = await prescriptionApi.createPrescription({
        const response = await mockPrescriptionApi.createPrescription({
          patientId,
          date: new Date().toISOString().split('T')[0],
          medicines: values.medicines,
          instructions: values.instructions,
          doctorNotes: values.doctorNotes,
        });
        
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Prescription created successfully',
            severity: 'success'
          });
          
          // Complete the consultation
          // In a real application, you would use the actual API
          // await consultationApi.completeConsultation(consultationId);
          
          // Notify parent component
          setTimeout(() => {
            onPrescriptionComplete();
          }, 1500);
        } else {
          setSnackbar({
            open: true,
            message: response.error || 'Failed to create prescription',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error creating prescription:', error);
        setSnackbar({
          open: true,
          message: 'An error occurred while creating the prescription',
          severity: 'error'
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper function to get nested form errors
  const getFieldError = (fieldName: string) => {
    return getIn(formik.errors, fieldName);
  };

  const getFieldTouched = (fieldName: string) => {
    return getIn(formik.touched, fieldName);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Prescription Form
      </Typography>
      
      <FormikProvider value={formik}>
        <Box component="form" noValidate onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Medicines
          </Typography>
          
          <FieldArray
            name="medicines"
            render={arrayHelpers => (
              <div>
                {formik.values.medicines.map((medicine, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name={`medicines[${index}].name`}
                        label="Medicine Name"
                        value={medicine.name}
                        onChange={formik.handleChange}
                        error={
                          getFieldTouched(`medicines[${index}].name`) && 
                          Boolean(getFieldError(`medicines[${index}].name`))
                        }
                        helperText={
                          getFieldTouched(`medicines[${index}].name`) && 
                          getFieldError(`medicines[${index}].name`)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name={`medicines[${index}].dosage`}
                        label="Dosage"
                        value={medicine.dosage}
                        onChange={formik.handleChange}
                        error={
                          getFieldTouched(`medicines[${index}].dosage`) && 
                          Boolean(getFieldError(`medicines[${index}].dosage`))
                        }
                        helperText={
                          getFieldTouched(`medicines[${index}].dosage`) && 
                          getFieldError(`medicines[${index}].dosage`)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name={`medicines[${index}].frequency`}
                        label="Frequency"
                        value={medicine.frequency}
                        onChange={formik.handleChange}
                        error={
                          getFieldTouched(`medicines[${index}].frequency`) && 
                          Boolean(getFieldError(`medicines[${index}].frequency`))
                        }
                        helperText={
                          getFieldTouched(`medicines[${index}].frequency`) && 
                          getFieldError(`medicines[${index}].frequency`)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        name={`medicines[${index}].duration`}
                        label="Duration"
                        value={medicine.duration}
                        onChange={formik.handleChange}
                        error={
                          getFieldTouched(`medicines[${index}].duration`) && 
                          Boolean(getFieldError(`medicines[${index}].duration`))
                        }
                        helperText={
                          getFieldTouched(`medicines[${index}].duration`) && 
                          getFieldError(`medicines[${index}].duration`)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        color="error"
                        onClick={() => arrayHelpers.remove(index)}
                        disabled={formik.values.medicines.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => arrayHelpers.push({ name: '', dosage: '', frequency: '', duration: '' })}
                  sx={{ mb: 3 }}
                >
                  Add Medicine
                </Button>
              </div>
            )}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Instructions & Notes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="instructions"
                label="Patient Instructions"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                error={formik.touched.instructions && Boolean(formik.errors.instructions)}
                helperText={formik.touched.instructions && formik.errors.instructions}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="doctorNotes"
                label="Doctor's Notes (not visible to patient)"
                value={formik.values.doctorNotes}
                onChange={formik.handleChange}
                error={formik.touched.doctorNotes && Boolean(formik.errors.doctorNotes)}
                helperText={formik.touched.doctorNotes && formik.errors.doctorNotes}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Complete Consultation'}
            </Button>
          </Box>
        </Box>
      </FormikProvider>
      
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

export default PrescriptionForm; 