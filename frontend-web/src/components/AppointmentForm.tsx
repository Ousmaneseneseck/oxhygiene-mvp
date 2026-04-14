import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import api from '../services/api';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Doctor {
  id: number;
  fullName: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ open, onClose, onSuccess }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: '',
    symptoms: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDoctors();
    }
  }, [open]);

  const fetchDoctors = async () => {
    // Forcer l'affichage du médecin par défaut
    setDoctors([{ id: 2, fullName: 'Dr. Amadou Diallo' }]);
  };

  const handleSubmit = async () => {
    if (!formData.doctorId || !formData.date || !formData.timeSlot) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/appointments', {
        doctorId: parseInt(formData.doctorId),
        date: formData.date,
        timeSlot: formData.timeSlot,
        reason: formData.reason,
        symptoms: formData.symptoms,
      });
      onSuccess();
      onClose();
      setFormData({ doctorId: '', date: '', timeSlot: '', reason: '', symptoms: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Prendre un rendez-vous</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>Médecin</InputLabel>
          <Select
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            label="Médecin"
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          sx={{ mb: 2 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          fullWidth
          label="Horaire"
          placeholder="10:00-11:00"
          value={formData.timeSlot}
          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Motif de la consultation"
          placeholder="Consultation générale"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Symptômes"
          multiline
          rows={3}
          placeholder="Décrivez vos symptômes..."
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Création...' : 'Prendre rendez-vous'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentForm;