import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';

interface DocumentUploadProps {
  open: boolean;
  onClose: () => void;
  appointmentId: number;
  onSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ open, onClose, appointmentId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !fileType) {
      setError('Veuillez sélectionner un fichier et un type');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('appointmentId', appointmentId.toString());
    formData.append('fileType', fileType);
    formData.append('description', description);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess();
      onClose();
      setFile(null);
      setFileType('');
      setDescription('');
    } catch (err) {
      setError('Erreur lors de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ajouter un document</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          Choisir un fichier
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        
        {file && <Alert severity="info" sx={{ mb: 2 }}>Fichier: {file.name}</Alert>}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type de document</InputLabel>
          <Select value={fileType} onChange={(e) => setFileType(e.target.value)} label="Type de document">
            <MenuItem value="prescription">Prescription</MenuItem>
            <MenuItem value="analysis">Analyse médicale</MenuItem>
            <MenuItem value="medical_report">Rapport médical</MenuItem>
            <MenuItem value="other">Autre</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Upload...' : 'Uploader'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUpload;