import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState('+221781234567');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOtp, login } = useAuth();

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOtp(phone);
      setActiveStep(1);
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Veuillez entrer le code OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(phone, otp);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Code OTP invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Oxhygiene Télémédecine
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Connexion
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 4 }}>
            <Step><StepLabel>Téléphone</StepLabel></Step>
            <Step><StepLabel>Code OTP</StepLabel></Step>
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {activeStep === 0 ? (
            <Box>
              <TextField
                fullWidth
                label="Numéro de téléphone"
                placeholder="+221781234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <Button fullWidth variant="contained" onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </Button>
            </Box>
          ) : (
            <Box>
              <TextField
                fullWidth
                label="Code OTP"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <Button fullWidth variant="contained" onClick={handleVerifyOtp} disabled={loading} sx={{ mb: 1 }}>
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>
              <Button fullWidth variant="text" onClick={() => setActiveStep(0)} disabled={loading}>
                Retour
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;