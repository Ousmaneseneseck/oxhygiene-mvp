const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('oxhygiene.db');

// Données à importer
const mesures = [
  // Tensions artérielles (userId: 1 = patient, 2 = médecin)
  { userId: 1, type: 'tension', systolic: 118, diastolic: 76, unit: 'mmHg', notes: 'À jeun, repos', date: '2026-04-15 08:15:00' },
  { userId: 1, type: 'tension', systolic: 128, diastolic: 82, unit: 'mmHg', notes: 'Après dîner', date: '2026-04-14 20:00:00' },
  { userId: 1, type: 'tension', systolic: 120, diastolic: 78, unit: 'mmHg', notes: 'Matin, calme', date: '2026-04-14 07:50:00' },
  { userId: 1, type: 'tension', systolic: 135, diastolic: 85, unit: 'mmHg', notes: 'Après déjeuner', date: '2026-04-13 13:30:00' },
  { userId: 1, type: 'tension', systolic: 122, diastolic: 79, unit: 'mmHg', notes: 'Réveil', date: '2026-04-13 07:45:00' },
  { userId: 1, type: 'tension', systolic: 130, diastolic: 83, unit: 'mmHg', notes: 'Fatigue', date: '2026-04-12 19:15:00' },
  { userId: 1, type: 'tension', systolic: 116, diastolic: 75, unit: 'mmHg', notes: 'Très détendu', date: '2026-04-12 08:00:00' },
  { userId: 1, type: 'tension', systolic: 140, diastolic: 90, unit: 'mmHg', notes: 'Stress, fin de semaine', date: '2026-04-11 21:00:00' },
  { userId: 1, type: 'tension', systolic: 125, diastolic: 80, unit: 'mmHg', notes: 'Après café', date: '2026-04-11 09:30:00' },
  { userId: 1, type: 'tension', systolic: 119, diastolic: 77, unit: 'mmHg', notes: 'Nuit correcte', date: '2026-04-10 08:10:00' },
  
  // Glycémies
  { userId: 1, type: 'glycemie', value: 0.92, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-15 07:30:00' },
  { userId: 1, type: 'glycemie', value: 1.28, unit: 'mg/dL', notes: 'Après dîner', date: '2026-04-14 20:15:00' },
  { userId: 1, type: 'glycemie', value: 0.95, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-14 07:45:00' },
  { userId: 1, type: 'glycemie', value: 1.35, unit: 'mg/dL', notes: 'Après déjeuner', date: '2026-04-13 13:45:00' },
  { userId: 1, type: 'glycemie', value: 0.89, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-13 07:40:00' },
  { userId: 1, type: 'glycemie', value: 1.18, unit: 'mg/dL', notes: 'Après snack', date: '2026-04-12 21:00:00' },
  { userId: 1, type: 'glycemie', value: 0.93, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-12 08:00:00' },
  { userId: 1, type: 'glycemie', value: 1.42, unit: 'mg/dL', notes: 'Après repas copieux', date: '2026-04-11 14:00:00' },
  { userId: 1, type: 'glycemie', value: 0.97, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-11 07:50:00' },
  { userId: 1, type: 'glycemie', value: 0.91, unit: 'mg/dL', notes: 'À jeun', date: '2026-04-10 08:10:00' },
  
  // Saturations O2
  { userId: 1, type: 'oxygenation', value: 98, unit: '%', notes: 'Repos', date: '2026-04-15 08:00:00' },
  { userId: 1, type: 'oxygenation', value: 97, unit: '%', notes: 'Fin de journée', date: '2026-04-14 20:00:00' },
  { userId: 1, type: 'oxygenation', value: 99, unit: '%', notes: 'Réveil', date: '2026-04-14 07:45:00' },
  { userId: 1, type: 'oxygenation', value: 95, unit: '%', notes: 'Après effort modéré', date: '2026-04-13 16:30:00' },
  { userId: 1, type: 'oxygenation', value: 98, unit: '%', notes: 'Calme', date: '2026-04-13 08:00:00' },
  { userId: 1, type: 'oxygenation', value: 99, unit: '%', notes: 'Avant sommeil', date: '2026-04-12 22:00:00' },
  { userId: 1, type: 'oxygenation', value: 98, unit: '%', notes: 'Matin', date: '2026-04-12 07:50:00' },
  { userId: 1, type: 'oxygenation', value: 96, unit: '%', notes: 'Fatigue', date: '2026-04-11 18:00:00' },
  { userId: 1, type: 'oxygenation', value: 98, unit: '%', notes: 'Repos', date: '2026-04-11 09:00:00' },
  { userId: 1, type: 'oxygenation', value: 99, unit: '%', notes: 'Très bonne forme', date: '2026-04-10 08:10:00' },
  
  // Poids
  { userId: 1, type: 'poids', value: 71.2, unit: 'kg', notes: 'À jeun', date: '2026-04-15 07:30:00' },
  { userId: 1, type: 'poids', value: 71.5, unit: 'kg', notes: 'Après week-end', date: '2026-04-14 07:45:00' },
  { userId: 1, type: 'poids', value: 71.3, unit: 'kg', notes: '', date: '2026-04-13 07:40:00' },
  { userId: 1, type: 'poids', value: 71.4, unit: 'kg', notes: '', date: '2026-04-12 08:00:00' },
  { userId: 1, type: 'poids', value: 71.6, unit: 'kg', notes: '', date: '2026-04-11 07:50:00' },
  { userId: 1, type: 'poids', value: 71.8, unit: 'kg', notes: '', date: '2026-04-10 08:10:00' },
  { userId: 1, type: 'poids', value: 71.9, unit: 'kg', notes: '', date: '2026-04-09 07:35:00' },
  { userId: 1, type: 'poids', value: 72.1, unit: 'kg', notes: '', date: '2026-04-08 07:45:00' },
  { userId: 1, type: 'poids', value: 72.0, unit: 'kg', notes: '', date: '2026-04-07 07:50:00' },
  { userId: 1, type: 'poids', value: 72.3, unit: 'kg', notes: 'Début suivi', date: '2026-04-06 08:00:00' },
  
  // Températures
  { userId: 1, type: 'temperature', value: 36.6, unit: '°C', notes: 'Normal', date: '2026-04-15 08:00:00' },
  { userId: 1, type: 'temperature', value: 36.9, unit: '°C', notes: 'Fin journée', date: '2026-04-14 20:00:00' },
  { userId: 1, type: 'temperature', value: 36.5, unit: '°C', notes: 'Réveil', date: '2026-04-14 07:45:00' },
  { userId: 1, type: 'temperature', value: 38.1, unit: '°C', notes: 'Frissons, fatigue', date: '2026-04-13 18:30:00' },
  { userId: 1, type: 'temperature', value: 36.7, unit: '°C', notes: 'Normal', date: '2026-04-13 07:40:00' },
  { userId: 1, type: 'temperature', value: 37.2, unit: '°C', notes: 'Léger fébrile', date: '2026-04-12 21:00:00' },
  { userId: 1, type: 'temperature', value: 36.6, unit: '°C', notes: '', date: '2026-04-12 08:00:00' },
  { userId: 1, type: 'temperature', value: 36.8, unit: '°C', notes: '', date: '2026-04-11 14:00:00' },
  { userId: 1, type: 'temperature', value: 36.4, unit: '°C', notes: '', date: '2026-04-11 07:50:00' },
  { userId: 1, type: 'temperature', value: 36.7, unit: '°C', notes: '', date: '2026-04-10 08:10:00' },
  
  // Fréquences cardiaques
  { userId: 1, type: 'cardiaque', value: 68, unit: 'bpm', notes: 'Repos', date: '2026-04-15 08:00:00' },
  { userId: 1, type: 'cardiaque', value: 78, unit: 'bpm', notes: 'Après repas', date: '2026-04-14 20:00:00' },
  { userId: 1, type: 'cardiaque', value: 65, unit: 'bpm', notes: 'Réveil', date: '2026-04-14 07:45:00' },
  { userId: 1, type: 'cardiaque', value: 112, unit: 'bpm', notes: 'Marche rapide', date: '2026-04-13 16:30:00' },
  { userId: 1, type: 'cardiaque', value: 70, unit: 'bpm', notes: 'Calme', date: '2026-04-13 08:00:00' },
  { userId: 1, type: 'cardiaque', value: 58, unit: 'bpm', notes: 'Sommeil', date: '2026-04-12 22:00:00' },
  { userId: 1, type: 'cardiaque', value: 66, unit: 'bpm', notes: 'Matin', date: '2026-04-12 07:50:00' },
  { userId: 1, type: 'cardiaque', value: 85, unit: 'bpm', notes: 'Stress', date: '2026-04-11 18:00:00' },
  { userId: 1, type: 'cardiaque', value: 72, unit: 'bpm', notes: 'Repos', date: '2026-04-11 09:00:00' },
  { userId: 1, type: 'cardiaque', value: 69, unit: 'bpm', notes: '', date: '2026-04-10 08:10:00' },
];

// Supprimer les anciennes mesures
db.run('DELETE FROM health_measures', function(err) {
  if (err) {
    console.error('Erreur suppression:', err);
  } else {
    console.log(`🗑️ Anciennes mesures supprimées`);
  }
  
  // Insérer les nouvelles mesures
  let inserted = 0;
  const stmt = db.prepare(`
    INSERT INTO health_measures (userId, type, systolic, diastolic, value, unit, notes, measuredAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const m of mesures) {
    stmt.run(
      m.userId,
      m.type,
      m.systolic || null,
      m.diastolic || null,
      m.value || null,
      m.unit,
      m.notes || '',
      m.date
    );
    inserted++;
  }
  
  stmt.finalize();
  
  console.log(`✅ ${inserted} mesures importées avec succès !`);
  console.log(`📊 Types de mesures importées:`);
  console.log(`   - Tension: ${mesures.filter(m => m.type === 'tension').length}`);
  console.log(`   - Glycémie: ${mesures.filter(m => m.type === 'glycemie').length}`);
  console.log(`   - Saturation: ${mesures.filter(m => m.type === 'oxygenation').length}`);
  console.log(`   - Poids: ${mesures.filter(m => m.type === 'poids').length}`);
  console.log(`   - Température: ${mesures.filter(m => m.type === 'temperature').length}`);
  console.log(`   - Fréquence cardiaque: ${mesures.filter(m => m.type === 'cardiaque').length}`);
  
  db.close();
});