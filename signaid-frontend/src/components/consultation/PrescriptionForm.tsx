import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Medicine {
  name: string;
  dosage: string;
  instructions: string;
}

interface PrescriptionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (medicines: Medicine[], notes: string) => void;
  existingNotes?: string;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  open,
  onClose,
  onSave,
  existingNotes = '',
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', instructions: '' },
  ]);
  const [notes, setNotes] = useState(existingNotes);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const handleSave = () => {
    onSave(medicines, notes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Prescription & Notes</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Prescribed Medicines
          </Typography>
          {medicines.map((medicine, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Medicine Name"
                    value={medicine.name}
                    onChange={(e) =>
                      handleMedicineChange(index, 'name', e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleMedicineChange(index, 'dosage', e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Instructions"
                    value={medicine.instructions}
                    onChange={(e) =>
                      handleMedicineChange(index, 'instructions', e.target.value)
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => handleRemoveMedicine(index)}
                    disabled={medicines.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddMedicine}
            variant="outlined"
            size="small"
          >
            Add Medicine
          </Button>
        </Box>
        
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Consultation Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter consultation notes..."
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionForm; 