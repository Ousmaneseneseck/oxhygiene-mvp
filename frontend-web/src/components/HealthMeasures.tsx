import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../services/api';

interface Measure {
  id: number;
  type: string;
  value?: number;
  systolic?: number;
  diastolic?: number;
  unit: string;
  notes: string;
  measuredAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const HealthMeasures: React.FC = () => {
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedType, setSelectedType] = useState('tension');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    type: 'tension',
    systolic: '',
    diastolic: '',
    value: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeasures();
    fetchStats();
  }, [selectedType]);

  const fetchMeasures = async () => {
    try {
      const res = await api.get(`/health/measures?type=${selectedType}&days=30`);
      setMeasures(res.data);
    } catch (err) {
      console.error('Erreur chargement mesures:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get(`/health/stats?type=${selectedType}`);
      setStats(prev => ({ ...prev, [selectedType]: res.data }));
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      let payload: any = { type: formData.type };
      
      if (formData.type === 'tension') {
        if (!formData.systolic || !formData.diastolic) {
          setError('Veuillez entrer les valeurs systolique et diastolique');
          setLoading(false);
          return;
        }
        payload.systolic = parseInt(formData.systolic);
        payload.diastolic = parseInt(formData.diastolic);
        payload.unit = 'mmHg';
      } else {
        if (!formData.value) {
          setError('Veuillez entrer une valeur');
          setLoading(false);
          return;
        }
        payload.value = parseFloat(formData.value);
        const units: Record<string, string> = {
          glycemie: 'mg/dL',
          oxygenation: '%',
          poids: 'kg',
          temperature: '°C',
          cardiaque: 'bpm',
        };
        payload.unit = units[formData.type] || '';
      }
      
      payload.notes = formData.notes;
      
      await api.post('/health/measure', payload);
      setDialogOpen(false);
      setFormData({ type: 'tension', systolic: '', diastolic: '', value: '', notes: '' });
      fetchMeasures();
      fetchStats();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMeasureValue = (measure: Measure) => {
    if (measure.type === 'tension') {
      return `${measure.systolic}/${measure.diastolic} ${measure.unit}`;
    }
    return `${measure.value} ${measure.unit}`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tension: 'Tension artérielle',
      glycemie: 'Glycémie',
      oxygenation: 'Saturation O2',
      poids: 'Poids',
      temperature: 'Température',
      cardiaque: 'Fréquence cardiaque',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      tension: '💓',
      glycemie: '🩸',
      oxygenation: '🫁',
      poids: '⚖️',
      temperature: '🌡️',
      cardiaque: '❤️',
    };
    return icons[type] || '📊';
  };

  const measureTypes = [
    { value: 'tension', label: 'Tension artérielle', icon: '💓' },
    { value: 'glycemie', label: 'Glycémie', icon: '🩸' },
    { value: 'oxygenation', label: 'Saturation O2', icon: '🫁' },
    { value: 'poids', label: 'Poids', icon: '⚖️' },
    { value: 'temperature', label: 'Température', icon: '🌡️' },
    { value: 'cardiaque', label: 'Fréquence cardiaque', icon: '❤️' },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <FavoriteIcon color="error" />
        <Typography variant="h5">📊 Mesures de santé connectées</Typography>
      </Box>

      {/* Sélecteur de type */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type de mesure</InputLabel>
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} label="Type de mesure">
            {measureTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.icon} {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          + Ajouter une mesure
        </Button>
      </Box>

      {/* Cartes statistiques */}
      {stats[selectedType] && stats[selectedType].count > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">📅 Dernière valeur</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {selectedType === 'tension' 
                    ? `${stats[selectedType]?.lastValue?.systolic || '-'}/${stats[selectedType]?.lastValue?.diastolic || '-'}`
                    : stats[selectedType]?.lastValue || '-'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {stats[selectedType]?.lastDate ? new Date(stats[selectedType].lastDate).toLocaleDateString() : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">📊 Moyenne (90j)</Typography>
                <Typography variant="h6">{stats[selectedType]?.average || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">📈 Min / Max</Typography>
                <Typography variant="h6">{stats[selectedType]?.min || '-'} / {stats[selectedType]?.max || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#fce4ec' }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">🔢 Nombre de mesures</Typography>
                <Typography variant="h6">{stats[selectedType]?.count || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Onglets d'affichage */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="📋 Liste des mesures" />
          <Tab label="📈 Graphique d'évolution" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {measures.length === 0 ? (
          <Typography color="textSecondary">Aucune mesure enregistrée pour ce type</Typography>
        ) : (
          measures.map((measure) => (
            <Card key={measure.id} sx={{ mb: 1 }}>
              <CardContent>
                <Grid container alignItems="center">
                  <Grid size={{ xs: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(measure.measuredAt).toLocaleDateString()} à {new Date(measure.measuredAt).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <Chip 
                      icon={<span>{getTypeIcon(measure.type)}</span>}
                      label={getTypeLabel(measure.type)} 
                      size="small" 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {renderMeasureValue(measure)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    {measure.notes && (
                      <Typography variant="caption" color="textSecondary">
                        📝 {measure.notes}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 2 }}>
          📊 Le graphique d'évolution sera disponible prochainement.
        </Alert>
        <Typography variant="body2" color="textSecondary">
          Cette fonctionnalité vous permettra de visualiser l'évolution de vos constantes dans le temps.
        </Typography>
      </TabPanel>

      {/* Dialog d'ajout */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Ajouter une mesure</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Type de mesure</InputLabel>
            <Select 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
              label="Type de mesure"
            >
              {measureTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.type === 'tension' ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                fullWidth 
                label="Systolique (max)" 
                type="number" 
                value={formData.systolic} 
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })} 
                placeholder="ex: 120"
              />
              <TextField 
                fullWidth 
                label="Diastolique (min)" 
                type="number" 
                value={formData.diastolic} 
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })} 
                placeholder="ex: 80"
              />
            </Box>
          ) : (
            <TextField 
              fullWidth 
              label="Valeur" 
              type="number" 
              value={formData.value} 
              onChange={(e) => setFormData({ ...formData, value: e.target.value })} 
              sx={{ mb: 2 }}
              placeholder={
                formData.type === 'glycemie' ? 'ex: 95' :
                formData.type === 'oxygenation' ? 'ex: 98' :
                formData.type === 'poids' ? 'ex: 70.5' :
                formData.type === 'temperature' ? 'ex: 36.5' :
                formData.type === 'cardiaque' ? 'ex: 75' : ''
              }
            />
          )}

          <TextField 
            fullWidth 
            label="Notes (optionnel)" 
            multiline 
            rows={2} 
            value={formData.notes} 
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
            placeholder="Commentaires, contexte, symptômes associés..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HealthMeasures;