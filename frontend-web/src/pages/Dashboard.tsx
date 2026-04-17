import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ScienceIcon from '@mui/icons-material/Science';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Profile, Appointment } from '../types';
import AppointmentForm from '../components/AppointmentForm';
import VideoCall from '../components/VideoCall';
import DocumentUpload from '../components/DocumentUpload';
import HealthMeasures from '../components/HealthMeasures';
import DoctorSearch from '../components/DoctorSearch';
import PatientSearch from '../components/PatientSearch';
import LaboratorySearch from '../components/LaboratorySearch';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const { logout, userRole } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [profileRes, appointmentsRes, statsRes] = await Promise.all([
        api.get('/profile'),
        api.get('/appointments'),
        api.get('/appointments/stats'),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      
      let appointmentsList = appointmentsRes.data;
      if (appointmentsRes.data && appointmentsRes.data.value) {
        appointmentsList = appointmentsRes.data.value;
      }
      if (!Array.isArray(appointmentsList)) {
        appointmentsList = [];
      }
      setAppointments(appointmentsList);
      
      if (userRole === 'doctor' && appointmentsList.length > 0) {
        const uniquePatientIds: number[] = [];
        appointmentsList.forEach((apt: Appointment) => {
          if (!uniquePatientIds.includes(apt.patientId)) {
            uniquePatientIds.push(apt.patientId);
          }
        });
        
        const patientsData = await Promise.all(
          uniquePatientIds.map(async (id) => {
            try {
              const res = await api.get(`/profile?userId=${id}`);
              return res.data;
            } catch {
              return { id, fullName: `Patient ${id}` };
            }
          })
        );
        setPatients(patientsData);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleStatusUpdate = async (appointmentId: number, status: string) => {
    setActionLoading(true);
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenNotes = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDoctorNotes(appointment.doctorNotes || '');
    setPrescription(appointment.prescription || '');
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await api.put(`/appointments/${selectedAppointment.id}/notes`, {
        notes: doctorNotes,
        prescription: prescription,
      });
      fetchData();
      setNotesDialogOpen(false);
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="En attente" color="warning" size="small" />;
      case 'confirmed':
        return <Chip label="Confirmé" color="success" size="small" />;
      case 'cancelled':
        return <Chip label="Annulé" color="error" size="small" />;
      case 'completed':
        return <Chip label="Terminé" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => p.userId === patientId || p.id === patientId);
    return patient?.fullName || `Patient ${patientId}`;
  };

  if (loading) {
    return <Typography align="center" sx={{ mt: 4 }}>Chargement...</Typography>;
  }

  const isDoctor = userRole === 'doctor';

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Oxhygiene Télémédecine - {isDoctor ? 'Espace Médecin' : 'Espace Patient'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2">Total</Typography>
                  <TrendingUpIcon />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4">{stats.pending}</Typography>
                  <Typography variant="body2">En attente</Typography>
                  <PendingIcon />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4">{stats.confirmed}</Typography>
                  <Typography variant="body2">Confirmés</Typography>
                  <CheckCircleIcon />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#d32f2f', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4">{stats.cancelled}</Typography>
                  <Typography variant="body2">Annulés</Typography>
                  <CancelIcon />
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={6} sm={2.4}>
              <Card sx={{ bgcolor: '#9c27b0', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4">{stats.completed}</Typography>
                  <Typography variant="body2">Terminés</Typography>
                  <DoneAllIcon />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab icon={<PersonIcon />} label="Mon Profil" />
            <Tab icon={<CalendarTodayIcon />} label={isDoctor ? "Consultations" : "Mes Rendez-vous"} />
            <Tab icon={<FavoriteIcon />} label="Santé Connectée" />
            <Tab icon={<StorefrontIcon />} label="Marketplace" />
            <Tab icon={<ScienceIcon />} label="Laboratoires" />
            {!isDoctor && <Tab icon={<SearchIcon />} label="Trouver un médecin" />}
            {isDoctor && <Tab icon={<PeopleIcon />} label="Mes Patients" />}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Nom complet</Typography>
                <Typography variant="body1">{profile?.fullName || 'Non renseigné'}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{profile?.email || 'Non renseigné'}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Téléphone</Typography>
                <Typography variant="body1">{profile?.user?.phone || 'Non renseigné'}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Groupe sanguin</Typography>
                <Typography variant="body1">{profile?.bloodType || 'Non renseigné'}</Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Adresse</Typography>
                <Typography variant="body1">{profile?.address || 'Non renseigné'}</Typography>
              </Grid>
            </Grid>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={async () => {
                const newName = prompt('Nouveau nom complet:', profile?.fullName || '');
                if (newName) {
                  const token = localStorage.getItem('token');
                  await fetch('http://localhost:3000/profile', { 
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ fullName: newName })
                  });
                  fetchData();
                }
              }}
            >
              Modifier mon profil
            </Button>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {isDoctor ? "Liste des consultations" : "Mes rendez-vous"}
              </Typography>
              {!isDoctor && (
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setFormOpen(true)}
                >
                  Prendre rendez-vous
                </Button>
              )}
            </Box>

            {appointments.length === 0 ? (
              <Typography color="textSecondary">Aucun rendez-vous</Typography>
            ) : (
              appointments.map((apt) => (
                <Card key={apt.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={2}>
                        <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                        <Typography variant="body1">{apt.date}</Typography>
                      </Grid>
                      <Grid xs={12} sm={2}>
                        <Typography variant="subtitle2" color="textSecondary">Horaire</Typography>
                        <Typography variant="body1">{apt.timeSlot}</Typography>
                      </Grid>
                      {isDoctor && (
                        <Grid xs={12} sm={3}>
                          <Typography variant="subtitle2" color="textSecondary">Patient</Typography>
                          <Typography variant="body1">{getPatientName(apt.patientId)}</Typography>
                        </Grid>
                      )}
                      <Grid xs={12} sm={2}>
                        <Typography variant="subtitle2" color="textSecondary">Statut</Typography>
                        {getStatusChip(apt.status)}
                      </Grid>
                      <Grid xs={12} sm={3}>
                        <Typography variant="subtitle2" color="textSecondary">Motif</Typography>
                        <Typography variant="body1">{apt.reason}</Typography>
                      </Grid>
                    </Grid>
                    
                    {isDoctor && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {apt.status === 'pending' && (
                          <>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="success"
                              onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                              disabled={actionLoading}
                            >
                              Accepter
                            </Button>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="error"
                              onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                              disabled={actionLoading}
                            >
                              Refuser
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="info"
                            onClick={() => handleStatusUpdate(apt.id, 'completed')}
                            disabled={actionLoading}
                          >
                            Terminer
                          </Button>
                        )}
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleOpenNotes(apt)}
                          disabled={actionLoading}
                        >
                          Notes médicales
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          startIcon={<VideoCallIcon />}
                          onClick={() => {
                            setCurrentRoom(`${apt.id}_${apt.date}`);
                            setVideoCallOpen(true);
                          }}
                        >
                          Appel vidéo
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<AttachFileIcon />}
                          onClick={() => {
                            setSelectedAppointmentId(apt.id);
                            setDocumentUploadOpen(true);
                          }}
                        >
                          Documents
                        </Button>
                      </Box>
                    )}
                    
                    {!isDoctor && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          startIcon={<VideoCallIcon />}
                          onClick={() => {
                            setCurrentRoom(`${apt.id}_${apt.date}`);
                            setVideoCallOpen(true);
                          }}
                        >
                          Appel vidéo
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<AttachFileIcon />}
                          onClick={() => {
                            setSelectedAppointmentId(apt.id);
                            setDocumentUploadOpen(true);
                          }}
                        >
                          Documents
                        </Button>
                      </Box>
                    )}
                    
                    {!isDoctor && apt.doctorNotes && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          📝 Notes du médecin :
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                          {apt.doctorNotes}
                        </Typography>
                        {apt.prescription && (
                          <>
                            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 1 }}>
                              💊 Prescription :
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {apt.prescription}
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                    
                    {isDoctor && apt.doctorNotes && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">Notes du médecin :</Typography>
                        <Typography variant="body2">{apt.doctorNotes}</Typography>
                        {apt.prescription && (
                          <>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>Prescription :</Typography>
                            <Typography variant="body2">{apt.prescription}</Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <HealthMeasures />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <iframe 
              src="/oxhygiene-marketplace.html" 
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title="Oxhygiene Marketplace"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <LaboratorySearch />
          </TabPanel>

          {!isDoctor && (
            <TabPanel value={tabValue} index={5}>
              <DoctorSearch onSelectDoctor={(doctorId) => {
                setFormOpen(true);
              }} />
            </TabPanel>
          )}

          {isDoctor && (
            <TabPanel value={tabValue} index={5}>
              {selectedPatientId ? (
                <Box>
                  <Button onClick={() => setSelectedPatientId(null)} sx={{ mb: 2 }}>
                    ← Retour à la liste des patients
                  </Button>
                  <HealthMeasures patientId={selectedPatientId} readOnly />
                </Box>
              ) : (
                <PatientSearch onSelectPatient={(patientId) => setSelectedPatientId(patientId)} />
              )}
            </TabPanel>
          )}
        </Paper>
      </Container>

      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Notes médicales - Consultation du {selectedAppointment?.date}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Notes du médecin"
            multiline
            rows={4}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            placeholder="Résultats de l'examen, diagnostic, recommandations..."
          />
          <TextField
            fullWidth
            label="Prescription"
            multiline
            rows={3}
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Médicaments, posologie, durée du traitement..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveNotes} variant="contained" disabled={actionLoading}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      <AppointmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          fetchData();
          setFormOpen(false);
        }}
      />

      {videoCallOpen && (
        <VideoCall 
          roomName={currentRoom} 
          onClose={() => setVideoCallOpen(false)} 
        />
      )}

      <DocumentUpload
        open={documentUploadOpen}
        onClose={() => setDocumentUploadOpen(false)}
        appointmentId={selectedAppointmentId || 0}
        onSuccess={fetchData}
      />
    </Box>
  );
};

export default Dashboard;